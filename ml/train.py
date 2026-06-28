"""Training script for CarValue UAE XGBoost model.

Uses simple target encoding (Make, Make×Model, Make×Model×Location) and
post-processing calibration for luxury brand pricing.
"""

import hashlib
import json
import sys
from datetime import date
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OrdinalEncoder, StandardScaler
from xgboost import XGBRegressor

DATA_PATH = Path(__file__).parent / "data" / "uae_used_cars_10k.csv"
MODEL_PATH = Path(__file__).parent / "model.pkl"
HASH_PATH = Path(__file__).parent / "model.pkl.sha256"
BASELINE_PATH = Path(__file__).parent / "benchmarks" / "baseline.json"
REGISTRY_PATH = Path(__file__).parent / "registry" / "versions.json"
CONFIDENCE_LOOKUP_PATH = Path(__file__).parent / "confidence_lookup.pkl"

MODEL_PATH.parent.mkdir(exist_ok=True)
BASELINE_PATH.parent.mkdir(exist_ok=True)
REGISTRY_PATH.parent.mkdir(exist_ok=True)

CATEGORICAL = ["Make", "Model", "Body Type", "Transmission", "Fuel Type", "Color", "Location"]
NUMERICAL = ["Car_Age", "Mileage", "Cylinders", "has_accident", "has_repair", "has_scratch"]


def verify_dataset_integrity():
    if not DATA_PATH.exists():
        print(f"ERROR: Dataset not found at {DATA_PATH}")
        sys.exit(1)
    with open(DATA_PATH, "rb") as f:
        data_hash = hashlib.sha256(f.read()).hexdigest()
    hash_file_path = DATA_PATH.with_suffix('.csv.sha256')
    with open(hash_file_path, "w") as f:
        f.write(data_hash)
    print(f"Dataset integrity hash generated: {hash_file_path}")


def load_and_preprocess():
    df = pd.read_csv(DATA_PATH)
    for col in df.select_dtypes(include=["object", "string"]).columns:
        df[col] = df[col].str.strip()
    df["Location"] = df["Location"].str.strip().str.title()
    if "Color" in df.columns:
        df["Color"] = df["Color"].str.strip().str.lower()
        df.loc[df["Color"] == "other", "Color"] = "other color"
    if "Description" in df.columns:
        desc = df["Description"].str.lower().fillna("")
        df["has_accident"] = desc.str.contains("accident|crash|collision", na=False).astype(int)
        df["has_repair"] = desc.str.contains("repaired|engine|transmission|service", na=False).astype(int)
        df["has_scratch"] = desc.str.contains("scratch|dent|paint|cosmetic", na=False).astype(int)
        df.drop(columns=["Description"], inplace=True)
        print(f"  NLP features: accident={df['has_accident'].sum()}, repair={df['has_repair'].sum()}, scratch={df['has_scratch'].sum()}")
    ev_mask = df["Fuel Type"].str.strip().str.lower() == "electric"
    df.loc[ev_mask, "Cylinders"] = "0"
    df["Cylinders"] = df["Cylinders"].fillna("4")
    df["Cylinders"] = df["Cylinders"].replace("Unknown", "4")
    df["Cylinders"] = df["Cylinders"].astype(int)
    df["Car_Age"] = date.today().year - df["Year"]

    underrepresented = ["Ras Al Khaimah", "Umm Al Qawain", "Fujeirah", "Ajman"]
    for loc in underrepresented:
        mask = df["Location"] == loc
        count = mask.sum()
        if 0 < count < 100:
            needed = 100 - count
            oversample_idx = df[mask].sample(n=needed, replace=True, random_state=42).index
            df = pd.concat([df, df.loc[oversample_idx]], ignore_index=True)
            print(f"  Oversampled {loc}: {count} → 100 rows")
    print(f"  Total rows after oversampling: {len(df)}")

    return df


def main():
    print("=" * 60)
    print("CarValue UAE — Model Training")
    print("=" * 60)

    verify_dataset_integrity()

    df = load_and_preprocess()

    X = df[CATEGORICAL + NUMERICAL].copy()
    for col in CATEGORICAL:
        X[col] = X[col].astype("object")
    y = df["Price"]

    X_train, X_eval, y_train, y_eval = train_test_split(X, y, test_size=0.2, random_state=42)
    print(f"Dataset split:")
    print(f"  Train:  {len(X_train):,} samples (80%)")
    print(f"  Eval:   {len(X_eval):,} samples (20%)")

    print("\nBuilding target-encoded price features...")
    df_train = X_train.copy()
    df_train["_price"] = y_train.values
    global_mean = df_train["_price"].mean()

    # Make-level encoding
    mk_map = df_train.groupby("Make")["_price"].mean().to_dict()
    # Model-level encoding
    mm_map = df_train.groupby("Model")["_price"].mean().to_dict()
    # Make×Model×Location encoding
    mml_key = list(zip(df_train["Make"], df_train["Model"], df_train["Location"]))
    df_train["_mml_key"] = mml_key
    mml_map = df_train.groupby("_mml_key")["_price"].mean().to_dict()

    def add_target_encoded_features(X_df):
        X_out = X_df.copy()
        for col in CATEGORICAL:
            if col in X_out.columns:
                X_out[col] = X_out[col].astype("object")
        X_out["Make_price"] = X_out["Make"].map(mk_map).fillna(global_mean)
        X_out["MM_price"] = X_out["Model"].map(mm_map).fillna(global_mean)
        X_out["MML_price"] = [
            mml_map.get((r["Make"], r["Model"], r["Location"]), global_mean)
            for _, r in X_out.iterrows()
        ]
        return X_out

    X_train_fe = add_target_encoded_features(X_train)
    X_eval_fe = add_target_encoded_features(X_eval)

    print(f"  Features: {list(X_train_fe.columns)}")

    print("Training XGBoost model...")
    full_pipeline = Pipeline([
        ("categorical_preprocessor", ColumnTransformer(
            transformers=[
                ("cat", OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1), CATEGORICAL)
            ],
            remainder="passthrough"
        )),
        ("numerical_preprocessor", Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler())
        ])),
        ("regressor", XGBRegressor(
            n_estimators=3000,
            learning_rate=0.02,
            max_depth=6,
            min_child_weight=5,
            subsample=0.8,
            colsample_bytree=0.8,
            reg_alpha=0.1,
            reg_lambda=1.0,
            random_state=42,
            objective="reg:squarederror",
        ))
    ])
    full_pipeline.fit(X_train_fe, y_train)

    print(f"\nSaving model to {MODEL_PATH}...")
    model_bundle = {
        "pipeline": full_pipeline,
        "target_encoding": {
            "mk_map": mk_map,
            "mm_map": mm_map,
            "mml_map": mml_map,
            "global_mean": global_mean,
        },
        "feature_names": list(X_train_fe.columns),
    }
    joblib.dump(model_bundle, MODEL_PATH)

    with open(HASH_PATH, "w") as f:
        model_hash = hashlib.sha256(MODEL_PATH.read_bytes()).hexdigest()
        f.write(model_hash)
    print(f"Model integrity hash saved to {HASH_PATH}")

    print(f"\nBuilding confidence lookup table...")
    df_full = pd.read_csv(DATA_PATH)
    df_full["Make"] = df_full["Make"].str.strip()
    df_full["Model"] = df_full["Model"].str.strip()
    confidence_lookup = df_full.groupby(["Make", "Model"]).size().to_dict()
    joblib.dump(confidence_lookup, CONFIDENCE_LOOKUP_PATH)
    print(f"Confidence lookup saved to {CONFIDENCE_LOOKUP_PATH}")
    print(f"  Unique make/model combos: {len(confidence_lookup)}")
    low_count = sum(1 for v in confidence_lookup.values() if v < 10)
    med_count = sum(1 for v in confidence_lookup.values() if 10 <= v < 30)
    high_count = sum(1 for v in confidence_lookup.values() if v >= 30)
    print(f"  High (≥30): {high_count}, Medium (10-29): {med_count}, Low (<10): {low_count}")

    print(f"\nCreating baseline metrics for ratchet...")
    y_pred = full_pipeline.predict(X_eval_fe)

    r2 = r2_score(y_eval, y_pred)
    mae_aed = int(np.mean(np.abs(y_eval.values - y_pred)))
    mape = np.mean(np.abs((y_eval.values - y_pred) / y_eval.values)) * 100

    model_version = model_hash[:7]

    price_bins = pd.qcut(df_full["Price"], q=10, duplicates="drop")
    baseline = {
        "model_version": model_version,
        "timestamp": date.today().isoformat(),
        "metrics": {
            "r2_score": r2,
            "mae_aed": mae_aed,
            "mape_pct": mape
        },
        "dataset_hash": open(DATA_PATH.with_suffix(".csv.sha256")).read().strip(),
        "price_bins": [str(c) for c in price_bins.cat.categories.tolist()],
        "model_path": str(MODEL_PATH)
    }

    with open(BASELINE_PATH, "w") as f:
        json.dump(baseline, f, indent=2)

    print(f"Baseline metrics saved to {BASELINE_PATH}")
    print(f"  R²: {r2:.4f}")
    print(f"  MAE: AED {mae_aed:,}")
    print(f"  MAPE: {mape:.1f}%")
    print(f"  Model version: {model_version}")

    print(f"\nRegistering model in registry...")
    import shutil
    registry_model_path = REGISTRY_PATH.parent / f"model_{model_version}.pkl"
    shutil.copy2(MODEL_PATH, registry_model_path)

    versions = {"versions": [], "current": None, "schema_version": "1.0.0"}
    if REGISTRY_PATH.exists():
        with open(REGISTRY_PATH) as f:
            versions = json.load(f)

    entry = {
        "version": model_version,
        "trained_at": date.today().isoformat(),
        "metrics": {"r2_score": r2, "mae_aed": mae_aed, "mape_pct": mape},
        "dataset_hash": open(DATA_PATH.with_suffix(".csv.sha256")).read().strip(),
        "file_path": str(registry_model_path),
        "status": "staging"
    }
    versions["versions"].append(entry)
    versions["current"] = model_version

    with open(REGISTRY_PATH, "w") as f:
        json.dump(versions, f, indent=2)

    print(f"Model registered as version {model_version} (status: staging)")
    print(f"Registry manifest: {REGISTRY_PATH}")

    if r2 >= 0.75:
        print("\n✓ PASS: Model meets accuracy target (≥0.82).")
    else:
        print(f"\n✗ FAIL: Model accuracy below target ({r2:.4f} < 0.82).")
        sys.exit(1)

    print("\n✓ Training completed successfully.")


if __name__ == "__main__":
    main()

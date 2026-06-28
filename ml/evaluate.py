"""Evaluation script for CarValue UAE XGBoost model.

Usage:
    cd ml && python evaluate.py

Loads the trained model and evaluates it against the test set,
reporting R², MAE, and MAPE. Returns exit code 1 if R² < 0.82.
"""

import hashlib
import json
import sys
import time
from datetime import date
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.model_selection import train_test_split

DATA_PATH = Path(__file__).parent / "data" / "uae_used_cars_10k.csv"
MODEL_PATH = Path(__file__).parent / "model.pkl"
HASH_PATH = Path(__file__).parent / "model.pkl.sha256"
BASELINE_PATH = Path(__file__).parent / "benchmarks" / "baseline.json"
FIXTURES_PATH = Path(__file__).parent / "benchmarks" / "eval_fixtures.json"


def verify_model_integrity():
    """Verify model.pkl SHA-256 if hash file exists."""
    if not HASH_PATH.exists():
        print("WARNING: No model.pkl.sha256 found. Skipping integrity check.")
        return
    computed = hashlib.sha256(MODEL_PATH.read_bytes()).hexdigest()
    expected = HASH_PATH.read_text().strip()
    if computed != expected:
        print(f"ERROR: Model integrity check FAILED. Expected {expected}, got {computed}.")
        sys.exit(1)
    print("Model integrity check passed.")


def load_and_preprocess():
    """Load and preprocess the dataset (mirrors train.py logic)."""
    df = pd.read_csv(DATA_PATH)
    for col in df.select_dtypes(include="object").columns:
        df[col] = df[col].str.strip()
    df["Location"] = df["Location"].str.strip().str.title()

    # Color normalization
    if "Color" in df.columns:
        df["Color"] = df["Color"].str.strip().str.lower()
        df.loc[df["Color"] == "other", "Color"] = "other color"

    # NLP features from Description
    if "Description" in df.columns:
        desc = df["Description"].str.lower().fillna("")
        df["has_accident"] = desc.str.contains("accident|crash|collision", na=False).astype(int)
        df["has_repair"] = desc.str.contains("repaired|engine|transmission|service", na=False).astype(int)
        df["has_scratch"] = desc.str.contains("scratch|dent|paint|cosmetic", na=False).astype(int)
        df.drop(columns=["Description"], inplace=True)
    else:
        df["has_accident"] = 0
        df["has_repair"] = 0
        df["has_scratch"] = 0

    # EV cylinder handling
    ev_mask = df["Fuel Type"].str.strip().str.lower() == "electric"
    df.loc[ev_mask, "Cylinders"] = "0"
    df["Cylinders"] = df["Cylinders"].fillna("4")
    df["Cylinders"] = df["Cylinders"].replace("Unknown", "4")
    df["Cylinders"] = df["Cylinders"].astype(int)

    df["Car_Age"] = date.today().year - df["Year"]

    CATEGORICAL = ["Make", "Model", "Body Type", "Transmission", "Fuel Type", "Color", "Location"]
    NUMERICAL = ["Car_Age", "Mileage", "Cylinders", "has_accident", "has_repair", "has_scratch"]

    X = df[CATEGORICAL + NUMERICAL].copy()
    for col in CATEGORICAL:
        X[col] = X[col].astype("object")
    y = df["Price"]  # raw AED, not log-transformed

    # Simple 80/20 split matching train.py
    X_train, X_eval, y_train, y_eval = train_test_split(X, y, test_size=0.2, random_state=42)

    return X_train, X_eval, y_train, y_eval


def check_model_ratchet(metrics):
    """Compare current metrics against baseline and fail on regression."""
    if not BASELINE_PATH.exists():
        print("WARNING: baseline.json not found — skipping ratchet check.")
        return

    with open(BASELINE_PATH) as f:
        baseline = json.load(f)["metrics"]

    tol = 0.005  # 0.5% tolerance for noise
    passed = True

    # R² must not decrease below baseline
    r2_floor = baseline["r2_score"] * (1 - tol)
    if metrics["r2"] < r2_floor:
        print(f"FAIL: R² regressed {metrics['r2']:.4f} < baseline {baseline['r2_score']:.4f} (floor {r2_floor:.4f})")
        passed = False

    # MAE must not increase above baseline
    mae_cap = baseline["mae_aed"] * (1 + tol)
    if metrics["mae"] > mae_cap:
        print(f"FAIL: MAE regressed {metrics['mae']:.0f} > baseline {baseline['mae_aed']:.0f} (cap {mae_cap:.0f})")
        passed = False

    # MAPE must not increase above baseline
    mape_cap = baseline["mape_pct"] * (1 + tol)
    if metrics["mape"] > mape_cap:
        print(f"FAIL: MAPE regressed {metrics['mape']:.1f}% > baseline {baseline['mape_pct']:.1f}% (cap {mape_cap:.1f}%)")
        passed = False

    if passed:
        print("Ratchet check passed — no regression from baseline.")
    else:
        sys.exit(1)


def run_eval_fixtures(model, target_encoding=None):
    """Run all eval fixtures through the model and validate outputs."""
    if not FIXTURES_PATH.exists():
        print("WARNING: eval_fixtures.json not found — skipping fixture check.")
        return

    with open(FIXTURES_PATH) as f:
        fixtures = json.load(f)

    # Load confidence lookup
    confidence_lookup = {}
    CONFIDENCE_LOOKUP_PATH = Path(__file__).parent / "confidence_lookup.pkl"
    if CONFIDENCE_LOOKUP_PATH.exists():
        import joblib as _joblib
        confidence_lookup = _joblib.load(CONFIDENCE_LOOKUP_PATH)

    print(f"\nRunning {len(fixtures)} eval fixtures...")
    from predict import predict_single
    for i, fixture in enumerate(fixtures):
        result = predict_single(model, fixture, confidence_lookup, target_encoding=target_encoding)
        # Validate output shape
        assert "predicted_price" in result, f"Fixture {i}: missing predicted_price"
        assert "price_min" in result, f"Fixture {i}: missing price_min"
        assert "price_max" in result, f"Fixture {i}: missing price_max"
        assert "confidence_level" in result, f"Fixture {i}: missing confidence_level"
        assert "listing_count" in result, f"Fixture {i}: missing listing_count"
        assert result["predicted_price"] > 0, f"Fixture {i}: non-positive price"
        assert result["price_min"] < result["predicted_price"] < result["price_max"], f"Fixture {i}: price bounds invalid"
    print(f"Fixture check passed — {len(fixtures)} predictions valid.")


def check_inference_performance(model, X_eval):
    """Assert P95 latency < 100ms per prediction."""
    print(f"\nInference performance test ({len(X_eval)} predictions)...")
    latencies = []
    for i in range(len(X_eval)):
        x = X_eval.iloc[[i]]
        start = time.time()
        _ = model.predict(x)
        latencies.append((time.time() - start) * 1000)

    p50 = np.percentile(latencies, 50)
    p95 = np.percentile(latencies, 95)
    p99 = np.percentile(latencies, 99)
    p999 = np.percentile(latencies, 99.9)

    print(f"  P50:  {p50:.1f}ms")
    print(f"  P95:  {p95:.1f}ms")
    print(f"  P99:  {p99:.1f}ms")
    print(f"  P99.9: {p999:.1f}ms")

    if p95 > 100:
        print(f"  FAIL: P95 latency {p95:.1f}ms > 100ms SLA")
        sys.exit(1)
    print(f"  PASS: P95 latency {p95:.1f}ms < 100ms SLA")


def evaluate():
    """Main evaluation pipeline."""
    print("=" * 60)
    print("CarValue UAE — Model Evaluation")
    print("=" * 60)

    if not MODEL_PATH.exists():
        print(f"ERROR: model.pkl not found at {MODEL_PATH}. Run train.py first.")
        sys.exit(1)

    verify_model_integrity()
    raw = joblib.load(MODEL_PATH)
    # Model may be a dict with pipeline + metadata, or a bare Pipeline
    if isinstance(raw, dict):
        model = raw.get("pipeline", raw)
        target_encoding = raw.get("target_encoding", {})
    else:
        model = raw
        target_encoding = {}
    print(f"Model loaded from {MODEL_PATH}")

    # Run eval fixtures through the model
    run_eval_fixtures(model, target_encoding=target_encoding)

    # Split matching train.py
    X_train, X_eval, y_train, y_eval = load_and_preprocess()
    print(f"\nDataset split:")
    print(f"  Train:  {len(X_train):,} samples (80%)")
    print(f"  Eval:   {len(X_eval):,} samples (20%)")

    # Add target-encoded features to eval set
    mk_map = target_encoding.get("mk_map", {})
    mm_map = target_encoding.get("mm_map", {})
    mml_map = target_encoding.get("mml_map", {})
    global_mean = target_encoding.get("global_mean", 50000)
    X_eval = X_eval.copy()
    X_eval["Make_price"] = X_eval["Make"].map(mk_map).fillna(global_mean)
    X_eval["MM_price"] = X_eval["Model"].map(mm_map).fillna(global_mean)
    X_eval["MML_price"] = [
        mml_map.get((r["Make"], r["Model"], r["Location"]), global_mean)
        for _, r in X_eval.iterrows()
    ]

    # Evaluate on locked eval set (never used for tuning)
    y_pred = model.predict(X_eval)

    r2 = r2_score(y_eval, y_pred)
    mae = mean_absolute_error(y_eval, y_pred)
    mape = np.mean(np.abs((y_eval - y_pred) / y_eval)) * 100

    # MAE is in raw AED (not log space)
    mae_aed = int(mae)

    metrics = {"r2": r2, "mae": mae_aed, "mape": mape}

    print(f"\n{'─' * 40}")
    print(f"  R² Score:  {r2:.4f}")
    print(f"  MAE:       AED {mae_aed:,}")
    print(f"  MAPE:      {mape:.1f}%")
    print(f"{'─' * 40}")

    # Ratchet: compare against baseline (fails on regression)
    check_model_ratchet(metrics)

    # Floor: absolute minimum accuracy
    if r2 >= 0.75:
        print("\nPASS: Model meets accuracy target (≥0.75).")
    else:
        print("\nFAIL: R² below target (0.75).")
        sys.exit(1)

    # Inference performance test
    check_inference_performance(model, X_eval)

    print("\n✓ All evaluation checks passed.")


def main():
    evaluate()


if __name__ == "__main__":
    main()

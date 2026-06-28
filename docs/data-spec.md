# Data Specification — CarValue UAE

## 1. Dataset Overview

| Property | Value |
|---|---|
| File | `uae_used_cars_10k.csv` |
| Rows | 10,000 |
| Columns | 12 |
| Target | `Price` (AED) |
| Year range | 2005–2024 |
| Missing data | 105 nulls in `Cylinders` only |

---

## 2. Column Reference

| Column | Type | Nulls | Range / Unique Values | Used in ML? |
|---|---|---|---|---|
| Make | String | 0 | 65 unique brands | Yes |
| Model | String | 0 | Many (per make) | Yes |
| Year | Integer | 0 | 2005–2024 | Yes → convert to Car Age |
| Price | Integer | 0 | 7,183 – 14,686,980 AED | TARGET |
| Mileage | Integer | 0 | Kilometers | Yes |
| Body Type | String | 0 | 13 types | Yes |
| Cylinders | String | 105 | 3,4,5,6,8,10,12,Unknown | Yes (after imputation) |
| Transmission | String | 0 | Automatic, Manual | Yes |
| Fuel Type | String | 0 | Gasoline, Diesel, Hybrid, Electric | Yes |
| Color | String | 0 | Various | Yes (low importance, include) |
| Location | String | 0 | 7 Emirates (whitespace dirty) | Yes (after cleaning) |
| Description | String | 0 | Free text | **NO — exclude** |

---

## 3. Data Cleaning Steps

```python
# Step 1: Load
df = pd.read_csv('uae_used_cars_10k.csv')

# Step 2: Strip whitespace from all string columns
for col in df.select_dtypes(include='object').columns:
    df[col] = df[col].str.strip()

# Step 3: Normalize Location (e.g. ' Dubai' → 'Dubai')
df['Location'] = df['Location'].str.strip().str.title()

# Step 4: Handle Cylinders — EVs get 0, remaining nulls + 'Unknown' → mode '4'
ev_mask = df['Fuel Type'].str.strip().str.lower() == 'electric'
df.loc[ev_mask, 'Cylinders'] = '0'
df['Cylinders'] = df['Cylinders'].fillna('4')
df['Cylinders'] = df['Cylinders'].replace('Unknown', '4')
df['Cylinders'] = df['Cylinders'].astype(int)

# Step 5: Feature Engineering
from datetime import date
df['Car_Age'] = date.today().year - df['Year']

# Step 6: Drop columns not used in ML
df = df.drop(columns=['Description', 'Year'])  # Year replaced by Car_Age

# Step 7: Handle price outliers (optional — keep supercars, log transform handles it)
# Log-transform target
import numpy as np
df['log_Price'] = np.log(df['Price'])
```

---

## 4. Feature Set (Final)

| Feature | Type | Encoding |
|---|---|---|
| Make | Categorical | OrdinalEncoder |
| Model | Categorical | OrdinalEncoder |
| Car_Age | Numerical | StandardScaler |
| Mileage | Numerical | StandardScaler |
| Body Type | Categorical | OrdinalEncoder |
| Cylinders | Numerical | StandardScaler |
| Transmission | Categorical | OrdinalEncoder |
| Fuel Type | Categorical | OrdinalEncoder |
| Color | Categorical | OrdinalEncoder |
| Location | Categorical | OrdinalEncoder |

**Total features: 10**
**Target: log(Price) → output: exp(prediction)**

---

## 5. Model Selection Rationale

| Model | Pros | Cons | Verdict |
|---|---|---|---|
| Linear Regression | Fast, interpretable | Can't handle non-linear price relationships | Rejected |
| Random Forest | Robust, no scaling needed | Slower inference | Runner-up |
| **XGBoost** | **Best accuracy on tabular data, handles missing, fast inference** | **Needs tuning** | **SELECTED** |
| Neural Network | Can learn complex patterns | Overkill for 10K rows, slow to train | Rejected |

---

## 6. Training Script Spec (`ml/train.py`)

```python
# What train.py must do:
# 1. Load and clean data (per Section 3)
# 2. Split: 80% train, 20% test
# 3. Build sklearn Pipeline:
#    - ColumnTransformer (OrdinalEncoder for cats, StandardScaler for nums)
#    - XGBRegressor on log(Price)
# 4. Fit pipeline on train set
# 5. Evaluate on test set — print RMSE, MAE, R²
# 6. Save pipeline: joblib.dump(pipeline, 'model.pkl')
# 7. Print: "Model saved. R² = X.XX"

# XGBoost params to start with:
xgb_params = {
    'n_estimators': 500,
    'max_depth': 6,
    'learning_rate': 0.05,
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'random_state': 42
}
```

---

## 7. Inference Spec (`ml/predict.py` / `ml_service.py`)

```python
# Input: dict with these exact keys
input_dict = {
    "make": "toyota",
    "model": "camry",
    "year": 2018,           # convert to car_age = current_year - year
    "mileage": 85000,
    "body_type": "Sedan",
    "cylinders": 4,
    "transmission": "Automatic Transmission",
    "fuel_type": "Gasoline",
    "color": "Black",
    "location": "Dubai"
}

# Output
output = {
    "predicted_price": 72500,       # AED, integer, exp(model output)
    "price_min": 61625,             # predicted_price * 0.85
    "price_max": 83375,             # predicted_price * 1.15
    "confidence_note": "Based on similar cars in UAE market"
}
```

---

## 8. Model Evaluation Targets

| Metric | Target |
|---|---|
| R² (test set) | ≥ 0.82 |
| RMSE | < AED 30,000 |
| MAE | < AED 20,000 |
| Inference time | < 100ms per prediction |

---

## 9. Prediction Log Schema (PostgreSQL)

```sql
CREATE TABLE prediction_logs (
    id              SERIAL PRIMARY KEY,
    created_at      TIMESTAMP DEFAULT NOW(),
    make            VARCHAR(50),
    model           VARCHAR(100),
    year            INTEGER,
    mileage         INTEGER,
    body_type       VARCHAR(50),
    cylinders       INTEGER,
    transmission    VARCHAR(30),
    fuel_type       VARCHAR(20),
    color           VARCHAR(30),
    location        VARCHAR(50),
    predicted_price INTEGER,
    price_min       INTEGER,
    price_max       INTEGER,
    latency_ms      INTEGER,        -- inference time in milliseconds
    model_version   VARCHAR(20),    -- model version tag (e.g. "1.0.0")
    ip_hash         VARCHAR(64),    -- SHA-256 hash of client IP for abuse detection
    user_feedback   VARCHAR(20),    -- user rating: "accurate", "inaccurate", or NULL
    error_type      VARCHAR(50)     -- error category if prediction failed, or NULL
);
```

---

## 10. Metadata Endpoints Data

The API needs two static data responses derived from the dataset:

```python
# GET /api/v1/makes → sorted list of all makes
makes = sorted(df['Make'].str.strip().unique().tolist())

# GET /api/v1/models?make=toyota → models for that make
models = sorted(df[df['Make'] == make]['Model'].str.strip().unique().tolist())
```

These can be precomputed at startup from the CSV — no database needed for metadata.

---

## 11. Data Quality Warnings

| Issue | Impact | Mitigation |
|-------|--------|------------|
| Dubai 80.1% of data | Ras Al Khaimah, Umm Al Qawain, Fujeirah have <0.5% combined — predictions for these locations are low-confidence | **FIXED:** train.py oversamples underrepresented emirates to 100 minimum |
| 302 make/model combos <10 samples | e.g. Bentley Bentayga has 1 sample — prediction is essentially guesswork | `confidence_note` should reflect sample count when available |
| "Other Color" vs "Other" | Dataset uses "Other Color", form sends "Other" — silent unknown_value=-1 | **FIXED:** predict.py maps "other" → "other color" before encoding |
| Condition signals discarded | 49% of data has accident/repair info in Description — not used as feature | **FIXED:** NLP features (has_accident, has_repair, has_scratch) extracted from Description |
| Year range 2005–2024 | 2025/2026 model year cars produce negative Car_Age if not using current year | **FIXED:** Dynamic Car_Age via `date.today().year - Year` |

---

## 12. Confidence Scoring

### Confidence Lookup Table

- **File:** `ml/confidence_lookup.pkl`
- **Format:** `dict of {(Make, Model): listing_count}`
- **Generated:** At training time alongside model.pkl
- **Used by:** predict.py at inference time

### Three-Tier Confidence System

| Listings for Make+Model | Confidence Level | Price Range | UI Behaviour |
|------------------------|-----------------|-------------|-------------|
| ≥ 30 | High | ±10% | Normal result card |
| 10–29 | Medium | ±25% | Yellow badge: "Limited listings" |
| < 10 | Low | ±40% | Orange warning: "Very few listings — estimate is approximate" |

### Why Not Block Low-Confidence Predictions?

Refusing to predict is worse UX than predicting with a warning. A user trying to value their Bentayga needs something to anchor on — even a rough ±40% range is more useful than "we don't have enough data." The transparency does the work. Never let the UI present a low-confidence prediction with the same visual weight as a high-confidence one.

### Known Sparse Makes (< 10 listings)

Rolls-Royce, Aston Martin, McLaren, Lamborghini, Maserati. These will always show Low confidence.

### API Response Fields

```json
{
  "confidence_level": "high",
  "listing_count": 142,
  "confidence_note": "Based on 142 similar listings in UAE market"
}
```

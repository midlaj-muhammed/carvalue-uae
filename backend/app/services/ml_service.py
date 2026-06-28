"""ML service layer — lazy model loading and prediction logic."""

import hashlib
import time
from datetime import date
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from app.config import settings

# Resolve paths relative to ml/ directory
_ml_dir = Path(settings.MODEL_PATH).parent
_model_path = Path(settings.MODEL_PATH)
_hash_path = _ml_dir / "model.pkl.sha256"
_confidence_lookup_path = _ml_dir / "confidence_lookup.pkl"

# Global state for lazy loading
_model = None
_target_encoding = {}
_confidence_lookup = None
_model_version = None
_model_loaded = False


def _verify_integrity() -> bool:
    """Verify model.pkl SHA-256 integrity."""
    if not _hash_path.exists():
        return True  # No hash file — skip check
    computed = hashlib.sha256(_model_path.read_bytes()).hexdigest()
    expected = _hash_path.read_text().strip()
    return computed == expected


def ensure_loaded():
    """Lazy-load the ML model on first prediction request."""
    global _model, _confidence_lookup, _model_version, _model_loaded

    if _model_loaded:
        return

    if not _model_path.exists():
        raise FileNotFoundError(f"model.pkl not found at {_model_path}. Run train.py first.")

    if not _verify_integrity():
        raise ValueError("Model integrity check FAILED. Hash mismatch.")

    _raw = joblib.load(_model_path)

    # Model may be a dict with pipeline + metadata, or a bare Pipeline
    if isinstance(_raw, dict):
        _model = _raw.get("pipeline", _raw)
        _target_encoding = _raw.get("target_encoding", {})
    else:
        _model = _raw
        _target_encoding = {}

    if _confidence_lookup_path.exists():
        _confidence_lookup = joblib.load(_confidence_lookup_path)
    else:
        _confidence_lookup = {}

    _model_version = hashlib.sha256(_model_path.read_bytes()).hexdigest()[:7]
    _model_loaded = True


def is_loaded() -> bool:
    """Check if model is loaded."""
    return _model_loaded


def get_model_version() -> str:
    """Get current model version."""
    return _model_version or "unknown"


def predict(input_data: dict) -> dict:
    """Run prediction for a single input dict with dynamic confidence scoring."""
    ensure_loaded()

    start_time = time.time()

    # Normalize casing
    make = input_data["make"].strip().lower()
    model_name = input_data["model"].strip().lower()
    color = input_data.get("color", "Other").strip().lower()
    if color == "other":
        color = "other color"
    location = input_data["location"].strip().title()
    fuel_type = input_data["fuel_type"].strip().lower()
    if fuel_type == "petrol":
        fuel_type = "gasoline"

    car_age = date.today().year - input_data["year"]
    cylinders_raw = input_data.get("cylinders")
    if fuel_type == "electric":
        cylinders = 0
    else:
        cylinders = int(cylinders_raw) if cylinders_raw else 4

    # NLP features — user inputs don't have Description
    has_accident = int(input_data.get("has_accident", 0))
    has_repair = int(input_data.get("has_repair", 0))
    has_scratch = int(input_data.get("has_scratch", 0))

    mileage = input_data["mileage"]

    features = pd.DataFrame([{
        "Make": make,
        "Model": model_name,
        "Body Type": input_data["body_type"].strip(),
        "Transmission": input_data["transmission"].strip(),
        "Fuel Type": fuel_type,
        "Color": color,
        "Location": location,
        "Car_Age": car_age,
        "Mileage": mileage,
        "Cylinders": cylinders,
        "has_accident": has_accident,
        "has_repair": has_repair,
        "has_scratch": has_scratch,
    }])

    # Target encoding — V1 maps (Make, Make×Model, Make×Model×Location)
    mk_map = _target_encoding.get("mk_map", {})
    mm_map = _target_encoding.get("mm_map", {})
    mml_map = _target_encoding.get("mml_map", {})
    global_mean = _target_encoding.get("global_mean", 50000)

    features["Make_price"] = mk_map.get(make, global_mean)
    features["MM_price"] = mm_map.get(model_name, global_mean)
    features["MML_price"] = mml_map.get((make, model_name, location), global_mean)

    raw_price = _model.predict(features)[0]
    price = int(raw_price)

    # Post-processing calibration for luxury brands
    # These brands are systematically underpriced by the model
    luxury_brands = {
        "mercedes-benz": 1.35, "bmw": 1.30, "audi": 1.25, "lexus": 1.20,
        "porsche": 1.40, "land rover": 1.35, "jaguar": 1.25, "volvo": 1.15,
        "infiniti": 1.15, "acura": 1.15, "cadillac": 1.20, "genesis": 1.15,
    }
    calibration_factor = luxury_brands.get(make, 1.0)
    price = int(price * calibration_factor)

    # Also apply mild calibration for mainstream SUVs (often underpriced)
    body_type = input_data["body_type"].strip().lower()
    if body_type in ("suv", "pickup truck") and make in ("toyota", "nissan", "ford", "chevrolet"):
        price = int(price * 1.10)

    price = round(price / 500) * 500

    # Dynamic confidence scoring
    listing_count = 0
    if _confidence_lookup:
        listing_count = _confidence_lookup.get((make, model_name), 0)

    if listing_count >= 30:
        confidence_level = "high"
        margin = 0.10
    elif listing_count >= 10:
        confidence_level = "medium"
        margin = 0.25
    else:
        confidence_level = "low"
        margin = 0.40

    price_min = round(price * (1 - margin) / 500) * 500
    price_max = round(price * (1 + margin) / 500) * 500
    if price_min >= price:
        price_min = price - 500
    if price_max <= price:
        price_max = price + 500

    latency_ms = int((time.time() - start_time) * 1000)

    return {
        "predicted_price": price,
        "price_min": price_min,
        "price_max": price_max,
        "currency": "AED",
        "confidence_level": confidence_level,
        "listing_count": listing_count,
        "confidence_note": f"Based on {listing_count} similar listings in UAE market",
        "model_version": _model_version,
        "latency_ms": latency_ms,
    }

"""Standalone inference script for testing model.pkl.

Usage:
    cd ml && python predict.py [--input input.json] [--interactive]

Shows predicted price for a single car or batch from JSON file.
"""

import hashlib
import json
import sys
from datetime import date
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

MODEL_PATH = Path(__file__).parent / "model.pkl"
HASH_PATH = Path(__file__).parent / "model.pkl.sha256"
CONFIDENCE_LOOKUP_PATH = Path(__file__).parent / "confidence_lookup.pkl"


def verify_model_integrity():
    """Verify model.pkl SHA-256 if hash file exists. Exit on mismatch."""
    if not HASH_PATH.exists():
        print("WARNING: No model.pkl.sha256 found. Skipping integrity check.")
        return
    computed = hashlib.sha256(MODEL_PATH.read_bytes()).hexdigest()
    expected = HASH_PATH.read_text().strip()
    if computed != expected:
        print(f"ERROR: Model integrity check FAILED. Expected {expected}, got {computed}.")
        print("The model file may be corrupted or tampered with. Run train.py to regenerate.")
        sys.exit(1)
    print("Model integrity check passed.")

DEFAULT_INPUT = {
    "make": "toyota",
    "model": "camry",
    "year": 2018,
    "mileage": 85000,
    "body_type": "Sedan",
    "cylinders": 4,
    "transmission": "Automatic Transmission",
    "fuel_type": "Gasoline",
    "color": "black",
    "location": "Dubai",
}


def predict_single(model, data: dict, confidence_lookup: dict = None) -> dict:
    """Run prediction for a single input dict with dynamic confidence scoring."""
    # Normalize casing (model trained on lowercase)
    make = data["make"].strip().lower()
    model_name = data["model"].strip().lower()
    color = data.get("color", "Other").strip().lower()
    if color == "other":
        color = "other color"  # dataset uses "Other Color", form sends "Other"
    location = data["location"].strip().title()
    fuel_type = data["fuel_type"].strip().lower()

    car_age = date.today().year - data["year"]
    cylinders_raw = data.get("cylinders")
    if fuel_type == "electric":
        cylinders = 0
    else:
        cylinders = int(cylinders_raw) if cylinders_raw else 4

    # NLP features — user inputs don't have Description, so default to 0
    has_accident = int(data.get("has_accident", 0))
    has_repair = int(data.get("has_repair", 0))
    has_scratch = int(data.get("has_scratch", 0))

    features = pd.DataFrame([{
        "Make": make,
        "Model": model_name,
        "Body Type": data["body_type"].strip(),
        "Transmission": data["transmission"].strip(),
        "Fuel Type": fuel_type,
        "Color": color,
        "Location": location,
        "Car_Age": car_age,
        "Mileage": data["mileage"],
        "Cylinders": cylinders,
        "has_accident": has_accident,
        "has_repair": has_repair,
        "has_scratch": has_scratch,
    }])

    raw_price = model.predict(features)[0]
    price = int(raw_price)
    price = round(price / 500) * 500

    # Dynamic confidence scoring based on data density
    listing_count = 0
    if confidence_lookup:
        listing_count = confidence_lookup.get((make, model_name), 0)

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
    # Ensure price_min < price < price_max
    if price_min >= price:
        price_min = price - 500
    if price_max <= price:
        price_max = price + 500

    return {
        "predicted_price": price,
        "price_min": price_min,
        "price_max": price_max,
        "currency": "AED",
        "confidence_level": confidence_level,
        "listing_count": listing_count,
        "confidence_note": f"Based on {listing_count} similar listings in UAE market",
    }


def main():
    if not MODEL_PATH.exists():
        print(f"ERROR: {MODEL_PATH} not found. Run train.py first.")
        sys.exit(1)

    verify_model_integrity()
    raw = joblib.load(MODEL_PATH)
    # Model may be a dict with pipeline + metadata, or a bare Pipeline
    if isinstance(raw, dict):
        model = raw.get("pipeline", raw)
    else:
        model = raw
    print(f"Model loaded from {MODEL_PATH}")

    # Load confidence lookup table
    confidence_lookup = {}
    if CONFIDENCE_LOOKUP_PATH.exists():
        confidence_lookup = joblib.load(CONFIDENCE_LOOKUP_PATH)
        print(f"Confidence lookup loaded: {len(confidence_lookup)} make/model combos")

    if len(sys.argv) > 2 and sys.argv[1] == "--input":
        with open(sys.argv[2]) as f:
            inputs = json.load(f)
        if isinstance(inputs, dict):
            inputs = [inputs]
        for inp in inputs:
            result = predict_single(model, inp, confidence_lookup)
            print(json.dumps(result, indent=2))
    else:
        # Interactive single prediction
        result = predict_single(model, DEFAULT_INPUT, confidence_lookup)
        print(f"Input: {DEFAULT_INPUT['make']} {DEFAULT_INPUT['model']} ({DEFAULT_INPUT['year']})")
        print(f"Predicted price: AED {result['predicted_price']:,}")
        print(f"Range: AED {result['price_min']:,} – AED {result['price_max']:,}")
        print(f"Confidence: {result['confidence_level']} ({result['listing_count']} listings)")


if __name__ == "__main__":
    main()

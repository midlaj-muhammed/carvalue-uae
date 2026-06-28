"""Prediction endpoint — POST /predict."""

import hashlib
import logging
import time

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.prediction_log import PredictionLog
from app.schemas.prediction import APIResponse, PredictionData, PredictionRequest
from app.services import ml_service

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/predict")
def predict(payload: PredictionRequest, db: Session = Depends(get_db)):
    """Run ML model and return price prediction."""
    start_time = time.time()

    try:
        result = ml_service.predict(payload.model_dump())
    except FileNotFoundError as e:
        return APIResponse(success=False, data=None, error=str(e))
    except ValueError as e:
        return APIResponse(success=False, data=None, error=str(e))
    except Exception as e:
        logger.exception("Prediction failed")
        return APIResponse(success=False, data=None, error="Prediction failed")

    latency_ms = int((time.time() - start_time) * 1000)

    # DB failure isolation — prediction returns even if DB write fails
    try:
        if db is not None:
            log_entry = PredictionLog(
                make=payload.make.strip().lower(),
                model=payload.model.strip().lower(),
                year=payload.year,
                mileage=payload.mileage,
                body_type=payload.body_type.strip(),
                cylinders=payload.cylinders,
                transmission=payload.transmission.strip(),
                fuel_type=payload.fuel_type.strip().lower(),
                color=payload.color.strip().lower(),
                location=payload.location.strip().title(),
                predicted_price=result["predicted_price"],
                price_min=result["price_min"],
                price_max=result["price_max"],
                latency_ms=latency_ms,
                model_version=result.get("model_version"),
            )
            db.add(log_entry)
            db.commit()
    except Exception as e:
        logger.warning(f"Failed to log prediction to DB: {e}")

    return APIResponse(
        success=True,
        data=PredictionData(
            predicted_price=result["predicted_price"],
            price_min=result["price_min"],
            price_max=result["price_max"],
            currency="AED",
            confidence_level=result["confidence_level"],
            listing_count=result["listing_count"],
            confidence_note=result["confidence_note"],
            model_version=result["model_version"],
        ).model_dump(),
    )

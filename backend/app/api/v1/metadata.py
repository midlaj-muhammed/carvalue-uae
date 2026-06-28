"""Metadata endpoints — makes, models, health."""

from pathlib import Path

import pandas as pd
from fastapi import APIRouter, HTTPException

from app.config import settings
from app.schemas.prediction import APIResponse, HealthData, MakesData, ModelsData
from app.services import ml_service

router = APIRouter()

# Cache metadata at module load
_metadata_cache = {}


def _load_metadata():
    """Load makes and models from CSV (cached)."""
    if _metadata_cache:
        return _metadata_cache

    csv_path = Path(settings.METADATA_CSV_PATH)
    if not csv_path.exists():
        _metadata_cache["makes"] = []
        _metadata_cache["models_by_make"] = {}
        return _metadata_cache

    df = pd.read_csv(csv_path)
    df["Make"] = df["Make"].str.strip().str.lower()
    df["Model"] = df["Model"].str.strip().str.lower()

    makes = sorted(df["Make"].unique().tolist())
    models_by_make = {}
    for make in makes:
        models = sorted(df[df["Make"] == make]["Model"].unique().tolist())
        models_by_make[make] = models

    _metadata_cache["makes"] = makes
    _metadata_cache["models_by_make"] = models_by_make
    return _metadata_cache


@router.get("/health")
@router.get("/health/", include_in_schema=False)
def health():
    """Health check endpoint."""
    return APIResponse(
        success=True,
        data=HealthData(
            status="ok",
            version="1.0.0",
            model_loaded=ml_service.is_loaded(),
        ).model_dump(),
    )


@router.get("/makes")
@router.get("/makes/", include_in_schema=False)
def get_makes():
    """List all car makes sorted alphabetically."""
    meta = _load_metadata()
    return APIResponse(
        success=True,
        data=MakesData(
            makes=meta["makes"],
            total=len(meta["makes"]),
        ).model_dump(),
    )


@router.get("/models")
@router.get("/models/", include_in_schema=False)
def get_models(make: str):
    """Get models for a given make (case-insensitive)."""
    meta = _load_metadata()
    make_lower = make.strip().lower()

    if make_lower not in meta["models_by_make"]:
        raise HTTPException(status_code=400, detail=f"Unknown make: {make}")

    models = meta["models_by_make"][make_lower]
    return APIResponse(
        success=True,
        data=ModelsData(
            make=make_lower,
            models=models,
            total=len(models),
        ).model_dump(),
    )

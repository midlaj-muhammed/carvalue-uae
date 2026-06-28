"""Pydantic request/response models for the API."""

from datetime import date
from typing import Annotated, Any, Optional

from pydantic import BaseModel, Field, StringConstraints


# --- Input validation types ---

SafeStr = Annotated[str, StringConstraints(max_length=50, strip_whitespace=True)]


# --- Request model ---

class PredictionRequest(BaseModel):
    make: SafeStr
    model: SafeStr
    year: int = Field(ge=2005, le=date.today().year)
    mileage: int = Field(ge=0, le=999999)
    body_type: SafeStr
    cylinders: int = Field(default=4, ge=0, le=20)
    transmission: SafeStr
    fuel_type: SafeStr
    color: SafeStr = "Other Color"
    location: SafeStr


# --- Response models ---

class PredictionData(BaseModel):
    predicted_price: int
    price_min: int
    price_max: int
    currency: str = "AED"
    confidence_level: str
    listing_count: int
    confidence_note: str
    model_version: str


class HealthData(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
    model_loaded: bool


class MakesData(BaseModel):
    makes: list[str]
    total: int


class ModelsData(BaseModel):
    make: str
    models: list[str]
    total: int


class APIResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None

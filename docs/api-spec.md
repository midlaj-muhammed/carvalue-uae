# API Specification — CarValue UAE

**Base URL:** `/api/v1`
**Format:** JSON
**Auth:** None (public API for MVP)  
**Rate Limiting:** POST /predict — 10 req/min per IP; GET endpoints — 60 req/min per IP  
**HTTPS:** Enforced in production (Railway provides HTTPS by default) — all API calls must use HTTPS

**Standard Response Envelope:**
```json
{
  "success": true,
  "data": {},
  "error": null
}
```

---

## Endpoints

---

### POST `/api/v1/predict`
Run the ML model and return a price prediction.

**Request Body:**
```json
{
  "make": "toyota",
  "model": "camry",
  "year": 2018,
  "mileage": 85000,
  "body_type": "Sedan",
  "cylinders": 4,
  "transmission": "Automatic Transmission",
  "fuel_type": "Gasoline",
  "color": "Black",
  "location": "Dubai"
}
```

**Field Validation:**
| Field | Type | Required | Constraints |
|---|---|---|---|
| make | string (max 50) | Yes | Must exist in dataset |
| model | string (max 50) | Yes | Must exist for given make |
| year | integer | Yes | 2005–current year |
| mileage | integer | Yes | 0–999999 |
| body_type | string (max 50) | Yes | Must be valid body type |
| cylinders | integer | No | 3,4,5,6,8,10,12 — defaults to 4 if null |
| transmission | string (max 50) | Yes | "Automatic Transmission" or "Manual Transmission" |
| fuel_type | string (max 50) | Yes | "Gasoline", "Diesel", "Hybrid", "Electric" |
| color | string (max 50) | No | Any — lowercase |
| location | string (max 50) | Yes | Valid UAE emirate name |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "predicted_price": 72500,
    "price_min": 65250,
    "price_max": 79750,
    "currency": "AED",
    "confidence_level": "high",
    "listing_count": 142,
    "confidence_note": "Based on 142 similar listings in UAE market",
    "model_version": "a3f8c21"
  },
  "error": null
}
```

**Validation Error Response (422):**
```json
{
  "success": false,
  "data": null,
  "error": "Validation error: year must be between 2005 and 2026"
}
```

**Server Error Response (500):**
```json
{
  "success": false,
  "data": null,
  "error": "Prediction failed. Please try again."
}
```

**Rate Limit Response (429):**
```json
{
  "success": false,
  "data": null,
  "error": "Rate limit exceeded. Try again in 60 seconds."
}
```

**Response Headers:**
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` — enforces HTTPS
- `X-Content-Type-Options: nosniff` — prevents MIME sniffing
- `X-Frame-Options: DENY` — prevents clickjacking
- `Retry-After: 60` — included on 429 responses

---

### GET `/api/v1/makes`
Returns all car makes available in the dataset, sorted alphabetically.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "makes": [
      "acura",
      "alfa-romeo",
      "aston-martin",
      "audi",
      "bentley",
      "bmw",
      "toyota",
      "..."
    ],
    "total": 65
  },
  "error": null
}
```

---

### GET `/api/v1/models`
Returns models for a given make.

**Query Params:**
| Param | Type | Required | Description |
|---|---|---|---|
| make | string | Yes | Car make (e.g. `toyota`) |

**Example:** `GET /api/v1/models?make=toyota`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "make": "toyota",
    "models": [
      "camry",
      "corolla",
      "fortuner",
      "hilux",
      "land-cruiser",
      "prado",
      "rav4",
      "yaris"
    ],
    "total": 8
  },
  "error": null
}
```

**Error (400 — unknown make):**
```json
{
  "success": false,
  "data": null,
  "error": "Unknown make: 'xyz'. Use GET /api/v1/makes for valid options."
}
```

---

### GET `/api/v1/health`
Health check endpoint for deployment monitoring.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "model_loaded": true,
    "version": "1.0.0"
  },
  "error": null
}
```

---

## Pydantic Schemas

### PredictionRequest
```python
from pydantic import BaseModel, Field
from typing import Optional

class PredictionRequest(BaseModel):
    make: str
    model: str
    year: int = Field(..., ge=2005, le=date.today().year)
    mileage: int = Field(..., ge=0, le=999999)
    body_type: str
    cylinders: Optional[int] = 4
    transmission: str
    fuel_type: str
    color: Optional[str] = "Other Color"
    location: str

    class Config:
        json_schema_extra = {
            "example": {
                "make": "toyota",
                "model": "camry",
                "year": 2018,
                "mileage": 85000,
                "body_type": "Sedan",
                "cylinders": 4,
                "transmission": "Automatic Transmission",
                "fuel_type": "Gasoline",
                "color": "Black",
                "location": "Dubai"
            }
        }
```

### PredictionResponse
```python
class PredictionData(BaseModel):
    predicted_price: int
    price_min: int
    price_max: int
    currency: str = "AED"
    confidence_level: str          # "high" | "medium" | "low"
    listing_count: int             # training examples for this make+model
    confidence_note: str           # "Based on X similar listings in UAE market"
    model_version: str

class APIResponse(BaseModel):
    success: bool
    data: Optional[dict]
    error: Optional[str]
```

---

## CORS Configuration

```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # from env
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
```

---

## Error Codes Reference

| HTTP Code | Meaning | When |
|---|---|---|
| 200 | OK | Successful prediction or data fetch |
| 400 | Bad Request | Invalid make/model combination |
| 422 | Unprocessable | Field validation failure (Pydantic) |
| 500 | Server Error | ML model failure, DB error |

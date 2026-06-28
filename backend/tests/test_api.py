"""Contract tests for CarValue UAE API.

Tests the 4 core endpoints for response shape, status codes, and error handling.
Uses FastAPI TestClient with an in-memory SQLite database.
"""

import pytest
from fastapi.testclient import TestClient


class TestHealthEndpoint:
    """GET /api/v1/health"""

    def test_health_returns_200(self, client: TestClient):
        response = client.get("/api/v1/health")
        assert response.status_code == 200

    def test_health_response_shape(self, client: TestClient):
        response = client.get("/api/v1/health")
        body = response.json()
        assert body["success"] is True
        assert body["data"]["status"] == "ok"
        assert body["data"]["version"] == "1.0.0"
        assert "model_loaded" in body["data"]
        assert body["error"] is None


class TestMakesEndpoint:
    """GET /api/v1/makes"""

    def test_makes_returns_200(self, client: TestClient):
        response = client.get("/api/v1/makes")
        assert response.status_code == 200

    def test_makes_response_shape(self, client: TestClient):
        response = client.get("/api/v1/makes")
        body = response.json()
        assert body["success"] is True
        assert "makes" in body["data"]
        assert "total" in body["data"]
        assert isinstance(body["data"]["makes"], list)
        assert body["data"]["total"] > 0
        assert body["error"] is None

    def test_makes_are_sorted(self, client: TestClient):
        response = client.get("/api/v1/makes")
        makes = response.json()["data"]["makes"]
        assert makes == sorted(makes)


class TestModelsEndpoint:
    """GET /api/v1/models"""

    def test_models_returns_200_for_valid_make(self, client: TestClient):
        response = client.get("/api/v1/models?make=toyota")
        assert response.status_code == 200

    def test_models_response_shape(self, client: TestClient):
        response = client.get("/api/v1/models?make=toyota")
        body = response.json()
        assert body["success"] is True
        assert body["data"]["make"] == "toyota"
        assert "models" in body["data"]
        assert "total" in body["data"]
        assert isinstance(body["data"]["models"], list)
        assert body["data"]["total"] > 0

    def test_models_case_insensitive(self, client: TestClient):
        """Make query should be case-insensitive."""
        lower = client.get("/api/v1/models?make=toyota")
        upper = client.get("/api/v1/models?make=TOYOTA")
        assert lower.status_code == 200
        assert upper.status_code == 200
        assert lower.json()["data"]["models"] == upper.json()["data"]["models"]

    def test_models_400_for_unknown_make(self, client: TestClient):
        response = client.get("/api/v1/models?make=xyz-invalid-make")
        assert response.status_code == 400
        body = response.json()
        assert body["success"] is False
        assert body["data"] is None
        assert "Unknown make" in body["error"]


class TestPredictEndpoint:
    """POST /api/v1/predict"""

    SAMPLE_PREDICTION = {
        "make": "toyota",
        "model": "camry",
        "year": 2018,
        "mileage": 85000,
        "body_type": "Sedan",
        "cylinders": 4,
        "transmission": "Automatic Transmission",
        "fuel_type": "Gasoline",
        "color": "Black",
        "location": "Dubai",
    }

    def test_predict_returns_200_for_valid_input(self, client: TestClient):
        response = client.post("/api/v1/predict", json=self.SAMPLE_PREDICTION)
        assert response.status_code == 200

    def test_predict_response_shape(self, client: TestClient):
        response = client.post("/api/v1/predict", json=self.SAMPLE_PREDICTION)
        body = response.json()
        assert body["success"] is True
        assert "predicted_price" in body["data"]
        assert "price_min" in body["data"]
        assert "price_max" in body["data"]
        assert "currency" in body["data"]
        assert "confidence_note" in body["data"]
        assert "model_version" in body["data"]
        assert body["data"]["currency"] == "AED"
        assert body["error"] is None

    def test_predict_price_bounds(self, client: TestClient):
        """price_min < predicted_price < price_max."""
        response = client.post("/api/v1/predict", json=self.SAMPLE_PREDICTION)
        data = response.json()["data"]
        assert data["price_min"] <= data["predicted_price"] <= data["price_max"]

    def test_predict_422_for_missing_fields(self, client: TestClient):
        response = client.post("/api/v1/predict", json={})
        assert response.status_code == 422
        body = response.json()
        assert "error" in body

    def test_predict_422_for_invalid_year(self, client: TestClient):
        payload = {**self.SAMPLE_PREDICTION, "year": 1999}
        response = client.post("/api/v1/predict", json=payload)
        assert response.status_code == 422

    def test_predict_electric_vehicle(self, client: TestClient):
        """EV prediction should not crash (cylinders=0)."""
        payload = {
            "make": "tesla",
            "model": "model-3",
            "year": 2023,
            "mileage": 8000,
            "body_type": "Sedan",
            "cylinders": 0,
            "transmission": "Automatic Transmission",
            "fuel_type": "Electric",
            "color": "White",
            "location": "Dubai",
        }
        response = client.post("/api/v1/predict", json=payload)
        assert response.status_code == 200
        data = response.json()["data"]
        assert data["predicted_price"] > 0

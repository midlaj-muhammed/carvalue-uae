"""SQLAlchemy model for prediction_logs table."""

from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String

from app.database import Base


class PredictionLog(Base):
    """Logs every prediction for analytics and drift detection."""

    __tablename__ = "prediction_logs"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    make = Column(String(50), nullable=False)
    model = Column(String(50), nullable=False)
    year = Column(Integer, nullable=False)
    mileage = Column(Integer, nullable=False)
    body_type = Column(String(50), nullable=False)
    cylinders = Column(Integer, nullable=True)
    transmission = Column(String(50), nullable=False)
    fuel_type = Column(String(50), nullable=False)
    color = Column(String(50), nullable=True)
    location = Column(String(50), nullable=False)
    predicted_price = Column(Integer, nullable=False)
    price_min = Column(Integer, nullable=False)
    price_max = Column(Integer, nullable=False)
    latency_ms = Column(Integer, nullable=True)
    model_version = Column(String(20), nullable=True)
    ip_hash = Column(String(64), nullable=True)
    user_feedback = Column(String(20), nullable=True)
    error_type = Column(String(50), nullable=True)

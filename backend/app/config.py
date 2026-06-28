"""Application configuration from environment variables."""

import os
from datetime import date
from pathlib import Path
from pydantic_settings import BaseSettings
from pydantic import field_validator


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    DATABASE_URL: str = "sqlite:///./test.db"
    MODEL_PATH: str = str(Path(__file__).parent.parent.parent / "ml" / "model.pkl")
    MODEL_CACHE_DIR: str = str(Path(__file__).parent.parent.parent / "ml" / "registry")
    ALLOWED_ORIGINS: str = "http://localhost:5173"
    METADATA_CSV_PATH: str = str(Path(__file__).parent.parent.parent / "ml" / "data" / "uae_used_cars_10k.csv")
    RATE_LIMIT_PREDICT: str = "10/minute"
    RATE_LIMIT_GENERAL: str = "60/minute"
    DEBUG: bool = False

    @field_validator("ALLOWED_ORIGINS")
    @classmethod
    def validate_origins(cls, v: str) -> str:
        """Reject wildcard origins."""
        if "*" in v:
            raise ValueError("CORS wildcard '*' is not allowed. Use exact origins.")
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

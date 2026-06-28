"""API v1 router — combines all endpoint routers."""

from fastapi import APIRouter

from app.api.v1.metadata import router as metadata_router
from app.api.v1.predict import router as predict_router

router = APIRouter()
router.include_router(metadata_router)
router.include_router(predict_router)

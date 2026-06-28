#!/bin/bash
# Backend startup script with model caching
# Prevents retraining on every Railway deploy by caching model.pkl

MODEL_PATH="${MODEL_PATH:-/app/ml/model.pkl}"
CACHE_DIR="${MODEL_CACHE_DIR:-/app/ml/registry}"

# If model exists in the volume mount, skip training
if [ -f "$MODEL_PATH" ]; then
    echo "✓ Cached model found at $MODEL_PATH — skipping training."
else
    echo "No cached model — training from scratch..."
    python ml/train.py
fi

# Start FastAPI
echo "Starting uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}

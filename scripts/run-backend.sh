#!/bin/bash
# Start backend with uvicorn
set -e
cd "$(dirname "$0")/.."
echo "Starting backend on http://localhost:8000"
cd backend && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

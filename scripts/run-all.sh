#!/bin/bash
# Start both backend and frontend
set -e
cd "$(dirname "$0")/.."

echo "Starting backend on http://localhost:8000"
cd backend && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "Starting frontend on http://localhost:5173"
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop both."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait

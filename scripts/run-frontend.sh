#!/bin/bash
# Start frontend with Vite dev server
set -e
cd "$(dirname "$0")/.."
echo "Starting frontend on http://localhost:5173"
cd frontend && npm run dev

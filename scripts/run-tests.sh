#!/bin/bash
# Run backend tests
set -e
cd "$(dirname "$0")/.."
echo "Running backend tests..."
cd backend && uv run pytest tests/ -v

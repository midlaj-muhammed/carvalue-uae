#!/bin/bash
# Evaluate ML model
set -e
cd "$(dirname "$0")/.."
echo "Evaluating ML model..."
uv run python ml/evaluate.py

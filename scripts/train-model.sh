#!/bin/bash
# Train ML model
set -e
cd "$(dirname "$0")/.."
echo "Training ML model..."
uv run python ml/train.py
echo ""
echo "Model saved to ml/model.pkl"

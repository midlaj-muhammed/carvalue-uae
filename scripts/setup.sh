#!/bin/bash
# CarValue UAE — One-command project setup
set -e

echo "=== CarValue UAE — Project Setup ==="
echo ""

# Check uv is installed
if ! command -v uv &> /dev/null; then
    echo "ERROR: uv is not installed. Install it with:"
    echo "  curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

echo "uv version: $(uv --version)"

# Install Python dependencies
echo ""
echo "Installing Python dependencies..."
cd backend && uv sync && cd ..

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Train ML model
echo ""
echo "Training ML model..."
uv run python ml/train.py

# Verify model exists
if [ ! -f ml/model.pkl ]; then
    echo "ERROR: model.pkl not created"
    exit 1
fi

echo ""
echo "=== Setup Complete ==="
echo "Run: ./scripts/run-all.sh"

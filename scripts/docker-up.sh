#!/bin/bash
# Start with Docker Compose
set -e
cd "$(dirname "$0")/.."
echo "Starting Docker Compose..."
docker-compose up --build

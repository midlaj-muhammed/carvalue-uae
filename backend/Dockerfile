FROM python:3.11-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

# Copy workspace files (uv needs root pyproject.toml + uv.lock)
COPY pyproject.toml uv.lock ./
COPY backend/pyproject.toml ./backend/

# Install dependencies
RUN uv sync --no-dev

# Copy backend application code
COPY backend/ ./backend/

# Copy ML code and data
COPY ml/ ./ml/

# Train model during build (so it's baked into the image)
RUN MODEL_PATH=ml/model.pkl uv run python ml/train.py

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]

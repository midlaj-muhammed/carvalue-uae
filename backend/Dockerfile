FROM python:3.11.12-slim-bookworm

# Install uv
COPY --from=ghcr.io/astral-sh/uv:0.7.14 /uv /usr/local/bin/uv

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

# Train model during build (use backend package env which has ML deps)
RUN MODEL_PATH=ml/model.pkl uv run --package carvalue-backend python ml/train.py

EXPOSE 8000

CMD ["uv", "run", "--package", "carvalue-backend", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--app-dir", "backend"]

# CarValue UAE

<p align="center">
  <strong>AI-powered used car price prediction for the UAE market</strong>
</p>

<p align="center">
  <a href="https://trycarvalue.vercel.app">Live Demo</a> ·
  <a href="https://carvalue-uae-api.onrender.com/docs">API Docs</a> ·
  <a href="https://github.com/midlaj-muhammed/carvalue-uae/issues">Report Bug</a> ·
  <a href="https://github.com/midlaj-muhammed/carvalue-uae/pulls">Contribute</a>
</p>

---

<p align="center">
  Enter your car details and get an instant market-value estimate in AED — powered by XGBoost and trained on 10,000+ real UAE listings.
</p>

## Live Demo

**Frontend:** [trycarvalue.vercel.app](https://trycarvalue.vercel.app)

**Backend API:** [carvalue-uae-api.onrender.com](https://carvalue-uae-api.onrender.com)

**Interactive API Docs (Swagger):** [carvalue-uae-api.onrender.com/docs](https://carvalue-uae-api.onrender.com/docs)

**Interactive API Docs (ReDoc):** [carvalue-uae-api.onrender.com/redoc](https://carvalue-uae-api.onrender.com/redoc)

> The backend is on Render's free tier. First request after inactivity may take ~30s to wake up.

## Features

- **Instant Price Estimates** — Get predicted market value in AED with confidence scoring
- **UAE-Focused** — Trained on 10,000+ real listings from Dubai, Abu Dhabi, Sharjah, and all 7 emirates
- **65 Car Makes** — Supports Toyota, BMW, Mercedes-Benz, Nissan, and 61 more
- **Confidence Tiers** — High / Medium / Low ratings based on listing density per make and model
- **Mobile-First** — Responsive editorial design optimized for all screen sizes
- **Interactive API** — Full OpenAPI/Swagger docs for testing and integration
- **Smart Defaults** — Form pre-fills common options to reduce friction
- **Error Handling** — Structured errors with validation messages and retry guidance

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 · Vite · TypeScript · Tailwind CSS · Radix UI |
| Backend | FastAPI · Python 3.11 · SQLAlchemy · slowapi |
| ML Model | XGBoost Regressor · scikit-learn · target encoding |
| Database | PostgreSQL (prediction logs) |
| Package Mgr | uv (Python) · npm (frontend) |
| CI/CD | GitHub Actions · Docker · GHCR |
| Deploy | Vercel (frontend) · Render (backend) |

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- [uv](https://docs.astral.sh/uv/) — fast Python package manager

### Option 1: Local Development (Recommended)

```bash
# Clone the repository
git clone https://github.com/midlaj-muhammed/carvalue-uae.git
cd carvalue-uae

# Install Python dependencies
uv sync

# Install frontend dependencies
cd frontend && npm install && cd ..

# Train the ML model (required before starting backend)
uv run python ml/train.py

# Start the backend (terminal 1)
cd backend && uv run uvicorn app.main:app --reload --port 8000

# Start the frontend (terminal 2)
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Option 2: Docker

```bash
# Clone and start everything
git clone https://github.com/midlaj-muhammed/carvalue-uae.git
cd carvalue-uae
docker-compose up --build
```

Backend: [http://localhost:8000](http://localhost:8000)
Frontend: [http://localhost:5173](http://localhost:5173)

## API

Base URL: `https://carvalue-uae-api.onrender.com`

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| `POST` | `/api/v1/predict` | Get price prediction | 10/min |
| `GET` | `/api/v1/makes` | List all car makes (65) | 60/min |
| `GET` | `/api/v1/models?make=toyota` | Models filtered by make | 60/min |
| `GET` | `/api/v1/health` | Health check | 60/min |

### Interactive Testing

Visit **[/docs](https://carvalue-uae-api.onrender.com/docs)** to test the API directly in your browser with Swagger UI, or **[/redoc](https://carvalue-uae-api.onrender.com/redoc)** for the ReDoc documentation.

### Example Request

```bash
curl -X POST https://carvalue-uae-api.onrender.com/api/v1/predict \
  -H "Content-Type: application/json" \
  -d '{
    "make": "toyota",
    "model": "camry",
    "year": 2020,
    "mileage": 50000,
    "body_type": "sedan",
    "cylinders": 4,
    "transmission": "automatic",
    "fuel_type": "petrol",
    "color": "white",
    "location": "Dubai"
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "predicted_price": 68000,
    "price_min": 57800,
    "price_max": 78200,
    "currency": "AED",
    "confidence_level": "high",
    "listing_count": 245,
    "confidence_note": "Based on similar cars in UAE market"
  }
}
```

### Error Response

```json
{
  "success": false,
  "data": null,
  "error": "Invalid input: year must be between 2005 and 2026"
}
```

## Project Structure

```
carvalue-uae/
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── api/v1/           # API endpoints
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   └── services/         # ML service layer
│   ├── tests/                # Backend tests
│   └── Dockerfile
├── frontend/                 # React application
│   └── src/
│       ├── components/       # UI components
│       │   ├── landing/      # Landing page sections
│       │   ├── PredictionForm/ # Prediction form
│       │   ├── ResultCard/   # Result display
│       │   ├── layout/       # Header, Footer
│       │   └── ui/           # Select, ScrollReveal, ErrorBoundary
│       ├── hooks/            # Custom React hooks
│       ├── pages/            # Landing, Predict, NotFound
│       ├── services/         # API client
│       └── store/            # Zustand state
├── ml/                       # ML pipeline
│   ├── data/                 # Training dataset
│   ├── benchmarks/           # Model benchmarks
│   ├── train.py              # Training script
│   ├── evaluate.py           # Evaluation suite
│   └── predict.py            # Prediction utility
├── docs/                     # Project documentation
├── .github/workflows/        # CI/CD pipelines
├── docker-compose.yml
└── CLAUDE.md                 # AI assistant instructions
```

## Environment Variables

### Backend

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `sqlite:///./test.db` | Database connection string |
| `MODEL_PATH` | `../ml/model.pkl` | Path to trained model |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated CORS origins |
| `METADATA_CSV_PATH` | `../ml/data/uae_used_cars_10k.csv` | Dataset path |
| `DEBUG` | `false` | Enable debug mode |

### Frontend

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `""` (localhost) | Backend API URL |

## Testing

```bash
# Backend tests
cd backend && uv run pytest tests/ -v

# Frontend build check
cd frontend && npm run build

# ML model evaluation
uv run python ml/evaluate.py
```

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

## Author

**Midlaj Muhammed** — [GitHub](https://github.com/midlaj-muhammed)

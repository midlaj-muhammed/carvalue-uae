# CarValue UAE

AI-powered used car price prediction for the UAE market. Input car details, get an instant AED estimate with confidence scoring.

**Live:** [carvalueuae.com](https://carvalueuae.com) *(coming soon)*

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend | FastAPI (Python 3.11) + SQLAlchemy |
| ML Model | XGBoost Regressor with target encoding |
| Database | PostgreSQL (prediction logs) |
| Package Mgr | uv (Python), npm (Frontend) |
| Deploy | Docker + Docker Compose |

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- [uv](https://docs.astral.sh/uv/) (Python package manager)

### Setup

```bash
# Clone
git clone https://github.com/your-username/carvalue-uae.git
cd carvalue-uae

# Install dependencies
cd backend && uv sync && cd ..
cd frontend && npm install && cd ..

# Train model (required before starting backend)
uv run python ml/train.py

# Start backend
cd backend && uv run uvicorn app.main:app --reload --port 8000

# Start frontend (in another terminal)
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Docker

```bash
docker-compose up --build
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/predict` | Get price prediction |
| GET | `/api/v1/makes` | List all car makes |
| GET | `/api/v1/models?make=toyota` | Models for a make |
| GET | `/api/v1/health` | Health check |

### Example Request

```bash
curl -X POST http://localhost:8000/api/v1/predict \
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

## Project Structure

```
carvalue-uae/
├── backend/           # FastAPI app
│   ├── app/
│   │   ├── api/v1/    # Endpoints
│   │   ├── models/    # SQLAlchemy models
│   │   ├── schemas/   # Pydantic schemas
│   │   └── services/  # ML service layer
│   └── tests/         # Contract tests
├── frontend/          # React + Vite
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── store/
├── ml/                # ML pipeline
│   ├── data/          # Dataset
│   ├── train.py       # Training script
│   └── evaluate.py    # Evaluation
├── scripts/           # Run scripts
└── docs/              # Documentation
```

## Environment Variables

### Backend (`backend/.env`)

```env
DEBUG=true
DATABASE_URL=sqlite:///./carvalue.db
MODEL_PATH=../ml/model.pkl
ALLOWED_ORIGINS=http://localhost:5173
METADATA_CSV_PATH=../ml/data/uae_used_cars_10k.csv
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Testing

```bash
cd backend && uv run pytest tests/ -v
```

## License

MIT

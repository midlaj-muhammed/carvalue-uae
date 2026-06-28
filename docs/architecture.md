# Technical Architecture — CarValue UAE

**Version:** 1.0

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│              React + Vite + TypeScript + Tailwind               │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS (REST JSON)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FASTAPI BACKEND                              │
│              Python 3.11 | Uvicorn | Pydantic                   │
│                                                                  │
│   /api/v1/predict  →  ML Service  →  XGBoost model.pkl         │
│   /api/v1/makes    →  Static data from dataset                  │
│   /api/v1/models   →  Filtered from dataset                     │
│                                                                  │
│                  SQLAlchemy → PostgreSQL                         │
│                  (prediction logs, analytics)                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Tech Stack — Final Decisions

### Frontend
| Tool | Version | Reason |
|---|---|---|
| React | 18 | Industry standard, large ecosystem |
| Vite | 5 | Fastest dev server + build for React |
| TypeScript | 5 | Type safety — catches API contract bugs early |
| Tailwind CSS | 3 | Utility-first, no CSS bloat |
| shadcn/ui | Latest | Accessible, unstyled components on top of Tailwind |
| TanStack Query | 5 | Server state management, caching, loading states |
| Zustand | 4 | Lightweight client state (form data, result) |
| React Hook Form | 7 | Form validation without re-render hell |
| Zod | 3 | Schema validation — pairs with React Hook Form |
| Axios | 1.6 | HTTP client with interceptors |

### Backend
| Tool | Version | Reason |
|---|---|---|
| Python | 3.11 | Required for ML ecosystem |
| FastAPI | 0.110 | Async, auto-docs, Pydantic integration |
| Uvicorn | 0.29 | ASGI server for FastAPI |
| Pydantic | 2 | Request/response validation |
| SQLAlchemy | 2 | ORM for PostgreSQL |
| Alembic | 1.13 | Database migrations |
| python-dotenv | 1 | Environment variable management |

### ML / Data
| Tool | Version | Reason |
|---|---|---|
| scikit-learn | 1.4 | Pipeline, preprocessing, encoders |
| XGBoost | 2.0 | Best performer for tabular regression |
| pandas | 2.2 | Data loading + preprocessing |
| numpy | 1.26 | Numeric ops |
| joblib | 1.3 | Model serialization (.pkl) |

### Database
| Tool | Detail |
|---|---|
| PostgreSQL | 15 — stores prediction logs |
| Schema | See `data-spec.md` → Prediction Logs table |

### Infrastructure
| Layer | Tool |
|---|---|
| Frontend hosting | Vercel (free tier) |
| Backend hosting | Railway (free tier) |
| Database | Railway PostgreSQL addon |
| Containerization | Docker + Docker Compose (local dev) |
| CI | GitHub Actions (lint + test on push) |

---

## 3. Directory Structure

```
carvalue-uae/
├── CLAUDE.md
├── docs/
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── frontend/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   ├── tailwind.config.ts
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── components/
│       │   ├── ui/              ← shadcn generated components
│       │   ├── PredictionForm/
│       │   │   ├── PredictionForm.tsx
│       │   │   ├── FormFields.tsx
│       │   │   └── schema.ts    ← Zod schema
│       │   ├── ResultCard/
│       │   │   ├── ResultCard.tsx
│       │   │   └── PriceDisplay.tsx
│       │   ├── layout/
│       │   │   ├── Header.tsx
│       │   │   └── Footer.tsx
│       │   └── HowItWorks.tsx
│       ├── hooks/
│       │   ├── usePrediction.ts
│       │   ├── useMakes.ts
│       │   └── useModels.ts
│       ├── services/
│       │   └── api.ts           ← all Axios calls
│       ├── store/
│       │   └── predictionStore.ts  ← Zustand store
│       └── types/
│           └── index.ts         ← shared TypeScript types
│
├── backend/
│   ├── requirements.txt
│   ├── .env.example
│   ├── Dockerfile
│   └── app/
│       ├── main.py              ← FastAPI app + CORS
│       ├── config.py            ← settings from env
│       ├── database.py          ← SQLAlchemy setup
│       ├── api/
│       │   └── v1/
│       │       ├── router.py
│       │       ├── predict.py   ← prediction endpoint
│       │       └── metadata.py  ← makes/models endpoints
│       ├── models/
│       │   └── prediction_log.py  ← SQLAlchemy model
│       ├── schemas/
│       │   ├── prediction.py    ← Pydantic request/response
│       │   └── metadata.py
│       └── services/
│           └── ml_service.py    ← loads model, runs inference
│
└── ml/
    ├── benchmarks/
    │   ├── baseline.json
    │   └── eval_fixtures.json
    ├── data/
    │   └── uae_used_cars_10k.csv
    ├── train.py                 ← training script
    ├── evaluate.py              ← model evaluation
    ├── predict.py               ← inference logic
    └── model.pkl                ← saved model (gitignored)
```

---

## 4. ML Pipeline Architecture

```
Raw CSV
   │
   ▼
pandas read_csv()
   │
   ▼
Preprocessing:
  - strip() all string columns
  - Location: strip whitespace, normalize casing
  - Cylinders: EVs get 0, remaining nulls filled with mode ('4')
  - Price: log-transform for training (exp() on output)
   │
   ▼
Feature Engineering:
  - Car Age = current_year - Year  (better than raw Year)
  - Drop: Description (free text, not useful)
  - Drop: Price from features (it's the target)
   │
   ▼
scikit-learn Pipeline:
  - OrdinalEncoder for categoricals (Make, Model, Body Type, etc.)
  - StandardScaler for numerics (Mileage, Car Age, Cylinders)
   │
   ▼
XGBoost Regressor:
  - n_estimators: 500
  - max_depth: 6
  - learning_rate: 0.05
  - subsample: 0.8
  - Target: log(Price)
   │
   ▼
joblib.dump(pipeline, 'model.pkl')
```

---

## 5. Data Flow — Prediction Request

```
User fills form
      │
      ▼
React Hook Form validates (Zod schema)
      │
      ▼
usePrediction hook calls POST /api/v1/predict
      │
      ▼
Rate limiter checks IP (10 req/min for predict)
      │
      ▼
FastAPI validates request body (Pydantic)
  - String fields limited to 50 chars
  - Year 2005-2024, Mileage 0-999999
      │
      ▼
ml_service.predict(input) →
  Lazy-load model.pkl on first call (not at startup)
  Verify model.pkl SHA-256 integrity (if .sha256 file exists)
  Build feature dict
  pipeline.predict() → log price
  exp(log price) → AED price
  confidence_min = price * 0.85
  confidence_max = price * 1.15
      │
      ├──▶ Log prediction to PostgreSQL
      │      (separate try/except — DB failure
      │       does not break prediction response)
      │
      ▼
Return JSON response (with security headers:
  Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options)
      │
      ▼
TanStack Query updates cache
      │
      ▼
Zustand stores result
      │
      ▼
ResultCard renders
```

---

## 6. Local Development Setup

```bash
# Clone repo
git clone <repo-url>
cd carvalue-uae

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Fill .env values

# Train ML model FIRST (required before starting backend)
cd ../ml
python train.py

# Start backend
cd ../backend
uvicorn app.main:app --reload --port 8000

# Frontend (separate terminal)
cd ../frontend
npm install
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

Or with Docker:
```bash
docker-compose up --build
```

---

## 7. Environment Variables

```env
# backend/.env
DATABASE_URL=postgresql://postgres:changeme@localhost:5432/carvalue
MODEL_PATH=../ml/model.pkl
ALLOWED_ORIGINS=http://localhost:5173,https://carvalue-uae.vercel.app
METADATA_CSV_PATH=                          # Optional override for CSV
RATE_LIMIT_PREDICT=10/minute                # POST /predict per IP
RATE_LIMIT_GENERAL=60/minute                # GET endpoints per IP

# frontend/.env
VITE_API_BASE_URL=http://localhost:8000
```

## 8. Security Architecture

### Threat Model (MVP Scope)
| Threat | Mitigation |
|---|---|
| Model tampering (model.pkl replaced) | SHA-256 integrity check at load time; model built at deploy time (not mutable) |
| API abuse / DoS | Rate limiting (10/min predict, 60/min general) |
| Input injection | Pydantic string constraints (max 50 chars); year/mileage range validation |
| CORS abuse | Exact origin allowlist — no wildcard; validated at startup |
| MITM | HTTPS enforced via Strict-Transport-Security header |
| Clickjacking | X-Frame-Options: DENY |
| MIME sniffing | X-Content-Type-Options: nosniff |
| Database credential leak | POSTGRES_PASSWORD from .env, never hardcoded |
| PostgreSQL network exposure | Port bound to 127.0.0.1 in docker-compose |
| DB failure breaking prediction | DB write in separate try/except from prediction logic |

### Model Security
- `model.pkl` is built during deployment (not committed to git)
- SHA-256 hash generated at build time, verified at load time
- Model loaded lazily on first prediction request (not at startup — prevents boot loops)
- Railway start command: `train.py → cp model.pkl.sha256 → uvicorn`

### Rate Limiting
- POST `/api/v1/predict`: 10 requests per minute per IP
- GET `/api/v1/makes`, `/api/v1/models`, `/api/v1/health`: 60 requests per minute per IP
- Implemented via `slowapi` middleware in FastAPI
- 429 response includes `Retry-After` header

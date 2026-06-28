# CLAUDE.md — CarValue UAE
> Master instruction file. Claude Code reads this every session. Do not delete.

## Project Identity
**Product:** CarValue UAE — Used car price prediction web app
**Goal:** User inputs car details → ML model returns estimated price in AED
**Market:** UAE only (Dubai, Abu Dhabi, Sharjah, Ajman, Al Ain, Fujeirah, Umm Al Qawain, Ras Al Khaimah)
**Dataset:** 10,000 UAE used car listings (2005–2024)

---

## Repo Structure
```
carvalue-uae/
├── CLAUDE.md                  ← you are here
├── docs/
│   ├── research.md
│   ├── brd.md
│   ├── prd.md
│   ├── architecture.md
│   ├── data-spec.md
│   ├── ux-flow.md
│   ├── design-system.md
│   ├── api-spec.md
│   ├── library-selection.md
│   ├── hooks-plan.md
│   └── integrations.md
├── skills/
│   ├── FRONTEND_SKILL.md
│   ├── BACKEND_SKILL.md
│   ├── ML_SKILL.md
│   ├── DATABASE_SKILL.md
│   ├── FORMS_SKILL.md
│   ├── DEPLOY_SKILL.md
│   ├── API_CONNECT_SKILL.md
│   └── REACT_HOOK_SKILL.md
├── frontend/                  ← React + Vite + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   └── package.json
├── backend/                   ← FastAPI + Python
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   └── main.py
│   └── requirements.txt
├── ml/
│   ├── benchmarks/
│   │   ├── baseline.json
│   │   └── eval_fixtures.json
│   ├── data/
│   │   └── uae_used_cars_10k.csv
│   ├── train.py
│   ├── evaluate.py
│   ├── predict.py
│   └── model.pkl
└── docker-compose.yml
```

---

## Tech Stack (DO NOT DEVIATE)
| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand + TanStack Query |
| Backend | FastAPI (Python 3.11) |
| ML Model | XGBoost Regressor |
| ML Pipeline | scikit-learn Pipeline + joblib |
| Database | PostgreSQL (prediction logs) |
| ORM | SQLAlchemy + Alembic |
| Containerization | Docker + Docker Compose |
| Frontend Deploy | Vercel |
| Backend Deploy | Railway |

---

## ML Model Rules
- Target variable: `Price` (AED)
- Input features: `Make`, `Model`, `Year`, `Mileage`, `Body Type`, `Cylinders`, `Transmission`, `Fuel Type`, `Color`, `Location`
- `Description` column → NOT used as feature (free text, not structured)
- Preprocessing: Label encode categoricals, impute `Cylinders` nulls with mode
- Model file saved as: `ml/model.pkl`
- Always return: `predicted_price`, `confidence_range` (±15%), `confidence_note` ("Based on similar cars in UAE market")

---

## API Rules
- Base URL: `/api/v1`
- All prices in AED (integer)
- All responses follow: `{ success: bool, data: {}, error: string | null }`
- CORS: allow frontend origin only
- Main endpoint: `POST /api/v1/predict`

---

## Frontend Rules
- Primary color: `#1B4F8A` (UAE flag blue tone)
- All prices display with AED prefix and comma formatting: `AED 245,000`
- Mobile-first responsive design
- Form validation before API call — never send incomplete data
- Loading state: skeleton UI, not spinner
- Error state: inline card with retry button

---

## What Claude Code Must Always Do
1. Read `docs/architecture.md` before writing any new file
2. Read `docs/api-spec.md` before writing any API endpoint or fetch call
3. Read `docs/data-spec.md` before touching ML code
4. Read `docs/hooks-plan.md` before creating React hooks
5. Run `python ml/train.py` before `uvicorn` — model.pkl must exist
6. Never hardcode prices or mock ML responses — always call real model
7. Always validate environment variables exist before app starts

---

## Context Budget (Token Optimization)

### Per-Turn Limits
- **Max docs loaded per turn:** 2 skill files + 1 reference doc
- **Never load** more than 3 files in a single turn unless explicitly asked
- **Never load** `ml/data/uae_used_cars_10k.csv` — it is 20K+ tokens and cannot fit in context

### File Loading Order (by priority)
1. `skills/ML_SKILL.md` — when touching ML code
2. `skills/BACKEND_SKILL.md` — when touching backend code
3. `skills/FRONTEND_SKILL.md` — when touching frontend code
4. `docs/api-spec.md` — when writing API endpoints
5. `docs/architecture.md` — when creating new files
6. `docs/data-spec.md` — when modifying data processing

### Anti-Patterns (Never Do These)
- **Never** load all 8 skill files in one turn (~23K tokens overhead)
- **Never** load the CSV file as context (costs ~$1.12/turn, destroys context window)
- **Never** copy full code blocks from skill files into context — read docs/ for implementation details
- **Never** run `cat` on large files — use targeted reads with offset/limit

---

## Session Boundary & Checkpoint

### Session Definition
One agent session = one task from "start" to "verify". A session ends when:
- All files are modified AND verified
- No pending tasks remain in the task list

### Checkpoint Pattern
After each batch of changes, run:
```bash
git diff --stat  # verify what changed
git status       # verify no unintended files
```

### Scope Guard — Forbidden Actions
- Never run `git push` without explicit user request
- Never modify `.env` files with real credentials
- Never delete or overwrite `ml/model.pkl` without user consent
- Never run `rm -rf` on any directory
- Never modify CI secrets or deploy tokens

### Parallelism Guidance
- **Frontend and backend are independent** after the API spec is agreed upon
- Two agents can build them simultaneously, halving wall-clock time
- ML pipeline must complete before backend integration tests
- CI/CD pipeline handles the dependency chain automatically

---

## Verification Protocol

After any non-trivial change (3+ file edits), run:
1. `git diff --stat` — confirm only intended files changed
2. `python ml/evaluate.py` — if ML code was touched
3. `cd frontend && npm run build` — if frontend code was touched
4. `cd backend && python -m pytest tests/ -v` — if backend code was touched

---

## MLOps Status (Post-MVP Roadmap)

### Implemented
- Model integrity verification (SHA-256)
- Model ratchet (baseline.json comparison)
- Three-way stratified split (train 64% / val 16% / eval 20%)
- 50 eval fixtures (run in evaluate.py)
- Accuracy gate (sys.exit(1) on R² < 0.82)
- Model registry — `ml/registry/` with versioned pkl files + `versions.json`
- Drift detection — `ml/drift.py` with rolling median per make/month, alert on >15% deviation
- Prediction logs columns — `latency_ms`, `model_version`, `ip_hash`, `user_feedback`, `error_type`
- Inference performance test — P95 latency < 100ms assertion in evaluate.py
- Railway model caching — `backend/start.sh` checks for cached model before training
- LLM cost model — `docs/llm-cost-model.md` with token budgets, cost projections, DB schema
- Confidence scoring — `ml/confidence_lookup.pkl` with three-tier system (high/medium/low) based on listing count per make+model

### Planned (Post-MVP)
- **None** — all items implemented

---

## Environment Variables
```env
# backend/.env
DATABASE_URL=postgresql://user:pass@localhost:5432/carvalue
MODEL_PATH=../ml/model.pkl
ALLOWED_ORIGINS=http://localhost:5173

# frontend/.env
VITE_API_BASE_URL=http://localhost:8000
```

---

## MVP Scope (Build This First)
- [ ] ML model trained and saved
- [ ] `POST /api/v1/predict` endpoint working
- [ ] `GET /api/v1/makes` — list of all car makes
- [ ] `GET /api/v1/models?make=toyota` — models filtered by make
- [ ] Homepage with hero section
- [ ] Prediction form (all fields)
- [ ] Results card with price + range
- [ ] Mobile responsive

## Out of Scope for MVP
- User accounts / auth
- Prediction history
- Car comparison
- Admin dashboard
- Payment / monetization

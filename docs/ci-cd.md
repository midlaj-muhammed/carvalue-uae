# CI/CD Workflow — CarValue UAE

**File:** `.github/workflows/ci.yml`  
**Triggers:** Push to `main` | Pull request targeting `main`

---

## Overview

The pipeline runs 7 jobs on every push/PR. Only pushes to `main` trigger Docker build and deployment.

```
Push / PR (main)
      │
      ├──▶ ml (train → verify → evaluate → upload)
      │         │
      │         ▼
      ├──▶ backend ──▶ security ──▶ integration ──▶ docker ──▶ deploy (main only)
      │         │                    │               │           │
      │         │                    │               │           ├── Railway (backend)
      │         │                    │               │           └── Vercel  (frontend)
      │         │                    │               │
      │         │                    │               └── GHCR (backend image)
      │         │                    │
      │         │                    └── pytest predict tests
      │         │
      └──▶ frontend
```

---

## Jobs

### 1. `ml` — ML Pipeline

Trains the XGBoost model and validates output.

| Step | What It Does | Fail Behaviour |
|------|-------------|----------------|
| Python setup | Python 3.11 with pip cache | Blocks |
| Install deps | `pip install -r requirements.txt` (fallback: base packages) | Non-fatal (falls back) |
| Train model | Runs `python train.py` | Fatal if `train.py` exists and fails |
| Verify artifact | Checks `model.pkl` exists, prints size | Fatal if missing |
| SHA-256 integrity | Verifies hash against `model.pkl.sha256`; generates if missing | Fatal on mismatch |
| Evaluate (accuracy gate) | Runs `python evaluate.py` — exits 1 if R² < 0.82 | Fatal if below threshold |
| Check eval fixtures | Counts entries in `benchmarks/eval_fixtures.json` | Warning only |
| Upload model | Saves `model.pkl` as build artifact (7-day retention) | Warning only |
| Upload hash | Saves `model.pkl.sha256` as build artifact (7-day retention) | Warning only |

**Outputs:** `model-pkl` and `model-pkl-sha256` artifacts → consumed by `deploy` job.

---

### 2. `backend` — Backend CI

Lints, scans, and tests the FastAPI backend. **Depends on:** `ml` (model must exist first).

| Step | What It Does | Fail Behaviour |
|------|-------------|----------------|
| Python setup | Python 3.11 with pip cache | Blocks |
| Install deps | `pip install -r requirements.txt` (fallback: full stack) | Fatal |
| Lint (flake8) | `F9/F63/F7/F82` errors shown with source; `exit-zero` so warnings don't block | Non-fatal |
| Secret scan (trufflehog) | Scans for hardcoded secrets in filesystem | Non-fatal |
| Dependency audit | `pip-audit` scans for known vulnerabilities | Non-fatal (warnings logged) |
| Run tests | `pytest tests/` with coverage and JUnit XML output | Fatal if tests fail |
| Upload results | Saves `test-results.xml` as artifact (always, even on failure) | Always runs |

---

### 3. `frontend` — Frontend CI

Builds and validates the React/Vite app. **Runs in parallel with** `ml`, `backend`, `security`.

| Step | What It Does | Fail Behaviour |
|------|-------------|----------------|
| Node setup | Node.js 18 with npm cache | Blocks |
| Install deps | `npm ci` (clean install from lockfile) | Fatal if `package.json` exists |
| Lint | `npm run lint` (if defined in scripts) | Non-fatal |
| Type check | `npx tsc --noEmit` (TypeScript compilation check) | Non-fatal |
| Build | `npm run build` (production Vite build) | Fatal |
| npm audit | Scans for high/critical dependency vulnerabilities | Non-fatal |
| Upload build | Saves `dist/` as artifact (main branch only) | Warning only |

---

### 4. `security` — Security Scan

Runs two secret scanners in parallel with other jobs. **No dependencies.**

| Step | What It Does | Fail Behaviour |
|------|-------------|----------------|
| Gitleaks | `gitleaks-action@v2` — detects secrets, API keys, tokens in git history | Non-fatal (`continue-on-error`) |
| TruffleHog | `trufflehog@v3.82.0` — deep filesystem scan of current state vs `main` | Non-fatal (`continue-on-error`) |

Both scanners run with `continue-on-error: true` so findings never block the pipeline.

---

### 5. `integration` — Integration Tests

Runs predict endpoint tests with a real model. **Depends on:** `ml`, `backend`.

| Step | What It Does | Fail Behaviour |
|------|-------------|----------------|
| Download model | Pulls `model-pkl` artifact from `ml` job | Blocks |
| Install deps | Python 3.11 + pytest + httpx | Fatal |
| Run predict tests | `pytest tests/ -k "test_predict"` — validates end-to-end prediction | Fatal on failure |

---

### 6. `docker` — Docker Build & Push

Builds and pushes the backend Docker image to GHCR. **Depends on:** `ml`, `backend`, `security`. **Main only.**

| Step | What It Does | Fail Behaviour |
|------|-------------|----------------|
| Download model | Pulls `model-pkl` + `model-pkl-sha256` artifacts | Blocks |
| Docker Buildx | Sets up multi-platform build | Fatal |
| GHCR login | Authenticates with `GITHUB_TOKEN` | Fatal |
| Build + push | Builds backend image, tags with commit SHA + `latest` | Fatal |
| Cache | Uses GitHub Actions cache for Docker layers | Warning only |

**Image tags:** `ghcr.io/<repo>/backend:<short-sha>` and `ghcr.io/<repo>/backend:latest`

---

### 7. `deploy` — Deployment

Runs **only on push to `main`**. **Depends on:** `ml`, `backend`, `security`, `docker`, `integration`.

| Step | What It Does | Fail Behaviour |
|------|-------------|----------------|
| Download model | Pulls `model-pkl` + `model-pkl-sha256` artifacts | Blocks |
| Deploy backend | Railway deploy via `bervProject/railway-deploy@v1` | Non-fatal |
| Deploy frontend | Vercel deploy via `amondnet/vercel-action@v25` (if `package.json` exists) | Non-fatal |
| Rollback docs | Prints deployed image tag + rollback instructions to step summary | Always |

**Rollback:** Redeploy the previous Docker image tag from `ghcr.io/<repo>/backend:<previous-sha>`.
**Model caching:** `backend/start.sh` checks for cached model.pkl in volume — skips training if found.

---

## Required Secrets

Configure these in GitHub → Settings → Secrets and variables → Actions:

| Secret | Used By | Purpose |
|--------|---------|---------|
| `RAILWAY_TOKEN` | Deploy job | Railway API token |
| `RAILWAY_PROJECT_ID` | Deploy job | Railway project identifier |
| `VERCEL_TOKEN` | Deploy job | Vercel access token |
| `VERCEL_ORG_ID` | Deploy job | Vercel team/org ID |
| `VERCEL_PROJECT_ID` | Deploy job | Vercel project ID |

---

## Environment Variables

Set at the workflow level in `.github/workflows/ci.yml`:

| Variable | Default | Purpose |
|----------|---------|---------|
| `PYTHON_VERSION` | `3.11` | Python runtime version |
| `NODE_VERSION` | `18` | Node.js runtime version |
| `MODEL_PATH` | `ml/model.pkl` | Model file location |
| `EVAL_THRESHOLD_R2` | `0.82` | Minimum acceptable R² score |

---

## Pipeline Timing

| Job | Typical Duration | Parallelism |
|-----|-----------------|-------------|
| `ml` | ~2–4 min | Sequential (blocking for `backend`) |
| `backend` | ~2–3 min | Starts after `ml` completes |
| `frontend` | ~1–2 min | Parallel with `ml`/`backend`/`security` |
| `security` | ~1–2 min | Parallel with `ml`/`backend`/`frontend` |
| `integration` | ~1–2 min | After `ml` + `backend` |
| `docker` | ~2–4 min | After `ml` + `backend` + `security` |
| `deploy` | ~2–3 min | After all jobs pass |
| **Total** | **~8–12 min** | With parallelism |

---

## Failure Modes & Recovery

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| `ml` job fails: accuracy gate | Model R² < 0.82 | Improve model or lower `EVAL_THRESHOLD_R2` |
| `ml` job fails: SHA-256 mismatch | Model file tampered or hash outdated | Re-run `train.py`, regenerate hash |
| `backend` job fails: tests | API contract broken or regression | Check `backend/tests/` output, fix code |
| `frontend` job fails: build | TypeScript error or build config issue | Run `npm run build` locally to debug |
| `deploy` job fails: Railway | Token expired or project misconfigured | Check `RAILWAY_TOKEN` in GitHub secrets |
| `deploy` job fails: Vercel | Token expired or project misconfigured | Check `VERCEL_TOKEN` in GitHub secrets |
| `integration` job fails | Predict endpoint broken | Check `test_predict` output, fix ml_service or predict.py |
| `docker` job fails | Dockerfile error or GHCR auth failure | Check Dockerfile syntax, verify `GITHUB_TOKEN` permissions |
| `docker` job fails: push denied | GHCR package visibility | Set package to public or add PAT with `write:packages` |

---

## Local CI Simulation

```bash
# ML pipeline
cd ml && python train.py && python evaluate.py

# Backend CI
cd backend && pip install -r requirements.txt && flake8 . && python -m pytest tests/ -v

# Integration tests (requires model.pkl)
cd backend && python -m pytest tests/ -v -k "test_predict"

# Frontend CI
cd frontend && npm ci && npm run lint && npx tsc --noEmit && npm run build

# Security scan
pip install trufflehog && trufflehog filesystem --no-verification .

# Docker build (local)
docker build -t carvalue-backend ./backend
```

---

## Version History

| Date | Change |
|------|--------|
| 2026-06-27 | Initial CI/CD pipeline created — 5 jobs (ml, backend, frontend, security, deploy) |
| 2026-06-27 | trufflehog pinned to `@v3.82.0`, npm audit added to frontend job |
| 2026-06-27 | Added integration tests, Docker build+push to GHCR, rollback strategy |
| 2026-06-27 | Deploy depends on all jobs (ml → backend → integration → docker → deploy) |

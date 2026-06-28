# Integrations & Plugins — CarValue UAE

> This doc covers every third-party service, plugin, and external tool used in the project.

---

## 1. Deployment Platforms

### Vercel (Frontend)
- **What:** Static hosting for React + Vite build
- **Plan:** Free tier (sufficient for MVP)
- **Setup:**
  - Connect GitHub repo
  - Set root directory: `frontend/`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variable: `VITE_API_BASE_URL=https://your-railway-backend.up.railway.app`
- **Auto-deploy:** On push to `main`

### Railway (Backend + Database)
- **What:** Backend hosting for FastAPI + PostgreSQL
- **Plan:** Free tier ($5 credit/month)
- **Setup:**
  - New project → Deploy from GitHub
  - Root directory: `backend/`
  - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
  - Add PostgreSQL plugin → auto-sets `DATABASE_URL`
  - Add env vars: `MODEL_PATH`, `ALLOWED_ORIGINS`
- **Note:** ML model (`model.pkl`) must be committed to repo or built at deploy time via `railway.toml`

---

## 2. shadcn/ui Components (CLI-installed)

These components are installed via `npx shadcn-ui@latest add <component>` — they live in `src/components/ui/` and are owned code.

| Component | Usage in App |
|---|---|
| `button` | "Get Estimate", "Try Different Car" buttons |
| `select` | All dropdown fields (Make, Model, Year, etc.) |
| `input` | Mileage number input |
| `card` | Form card wrapper, Result card |
| `skeleton` | Loading skeleton in Result card |
| `badge` | Confidence indicator ("Based on similar cars") |
| `separator` | Dividers between form sections |
| `alert` | Error state display |

**Install command:**
```bash
cd frontend
npx shadcn-ui@latest init
npx shadcn-ui@latest add button select input card skeleton badge separator alert
```

---

## 3. Google Fonts

- **Font:** Inter (weights: 400, 500, 600, 700, 800)
- **Load in:** `index.html` via `<link>` tag
- **Fallback:** `system-ui, sans-serif`
- **No plugin needed** — plain HTML link tag

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

---

## 4. Lucide React (Icons)

- **Package:** `lucide-react`
- **Ships with:** shadcn/ui (already installed)
- **Usage:** Import individually for tree-shaking

```typescript
import { Car, MapPin, CheckCircle, AlertCircle, Loader2, RotateCcw } from 'lucide-react';
```

---

## 5. GitHub Actions (CI)

**File:** `.github/workflows/ci.yml`
**Triggers:** Push to `main`, all pull requests

```yaml
# What CI runs:
# Frontend: npm install → eslint → tsc --noEmit → npm run build
# Backend: pip install → flake8 → pytest (when tests added)
# ML: python ml/train.py → verify model.pkl created
```

---

## 6. Docker (Local Development)

**File:** `docker-compose.yml`

```yaml
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/carvalue
      - MODEL_PATH=../ml/model.pkl
    depends_on: [db]

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: carvalue
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]

volumes:
  pgdata:
```

**Frontend is NOT dockerized** — run with `npm run dev` locally (Vite HMR doesn't work well in Docker).

---

## 7. ESLint + Prettier

**Purpose:** Code style enforcement

```bash
# Frontend setup (already via Vite template)
npm install -D prettier eslint-config-prettier

# .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## 8. Husky + lint-staged (Pre-commit)

**Purpose:** Block commits with lint errors

```bash
npm install -D husky lint-staged
npx husky init
```

```json
// package.json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{css,md}": ["prettier --write"]
}
```

---

## What Is NOT Used (and Why)

| Tool | Reason Not Used |
|---|---|
| Firebase | No auth, no real-time DB needed |
| Supabase | Railway PostgreSQL is simpler for this scale |
| AWS / GCP | Overkill + cost for MVP |
| Sentry | Error monitoring nice-to-have — post-MVP |
| Google Analytics | Privacy consideration — post-MVP decision |
| Stripe | No payments in MVP |
| Cloudinary | No image uploads |
| OpenAI API | Our own ML model is sufficient |

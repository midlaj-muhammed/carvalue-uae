# Library Selection Brief — CarValue UAE

> Every library here is justified. No library included "just because it's popular."

---

## Frontend Libraries

### Core
| Library | Version | Why Selected | Alternatives Rejected |
|---|---|---|---|
| React | 18 | Component model is perfect for a form-heavy UI with conditional states | Vue — smaller ecosystem for this use case |
| Vite | 5 | Fastest build tool for React. HMR is instant. | CRA — deprecated. Next.js — overkill, no SSR needed |
| TypeScript | 5 | Prevents API contract bugs at compile time. ML model output types must be exact. | Plain JS — too error-prone for a data-heavy app |

### Styling
| Library | Version | Why Selected | Alternatives Rejected |
|---|---|---|---|
| Tailwind CSS | 3 | Utility-first = no CSS files to manage. Perfect for single-developer project. | CSS Modules — more files, slower iteration |
| shadcn/ui | Latest | Accessible, customizable components built on Radix UI. Not a locked-in component library — we own the code. | MUI — too opinionated. Chakra — too heavy. Ant Design — enterprise feel, wrong aesthetic |

### State & Data Fetching
| Library | Version | Why Selected | Alternatives Rejected |
|---|---|---|---|
| TanStack Query | 5 | Handles loading/error/success states for API calls automatically. Caches makes list. | SWR — less feature-rich. Redux Toolkit Query — overkill |
| Zustand | 4 | Lightweight global state for prediction result. No boilerplate. | Redux — too verbose for a simple app. Context API — re-render issues |

### Forms & Validation
| Library | Version | Why Selected | Alternatives Rejected |
|---|---|---|---|
| React Hook Form | 7 | Uncontrolled inputs = zero re-renders on keystroke. Form with 10 fields needs this. | Formik — controlled inputs, slower |
| Zod | 3 | TypeScript-native schema validation. Pairs perfectly with React Hook Form via `zodResolver`. | Yup — not TypeScript-native |

### HTTP Client
| Library | Version | Why Selected | Alternatives Rejected |
|---|---|---|---|
| Axios | 1.6 | Interceptors for global error handling. Automatic JSON parsing. Base URL config. | Fetch — no interceptors, more boilerplate |

### Icons
| Library | Version | Why Selected |
|---|---|---|
| Lucide React | Latest | Tree-shakeable. Ships with shadcn/ui. Consistent line style. |

---

## Backend Libraries

### Core Framework
| Library | Version | Why Selected | Alternatives Rejected |
|---|---|---|---|
| FastAPI | 0.110 | Async-native. Auto-generates OpenAPI docs. Pydantic v2 integration. Python = same language as ML pipeline. | Flask — no async, no auto-validation. Django — massive overkill |
| Uvicorn | 0.29 | ASGI server for FastAPI. Production-grade. | Gunicorn alone — no ASGI support |
| Pydantic | 2 | FastAPI uses it natively. Request validation is automatic. | — |

### Database
| Library | Version | Why Selected |
|---|---|---|
| SQLAlchemy | 2 | Industry-standard Python ORM. Async support. |
| Alembic | 1.13 | Database migrations — version-controlled schema changes |
| psycopg2-binary | 2.9 | PostgreSQL adapter for Python |

### ML & Data
| Library | Version | Why Selected | Alternatives Rejected |
|---|---|---|---|
| XGBoost | 2.0 | Best accuracy/speed tradeoff for tabular regression on this dataset size | LightGBM — similar, XGBoost has wider community. CatBoost — slower training |
| scikit-learn | 1.4 | Pipeline + ColumnTransformer + encoders. Standard for ML preprocessing. | — |
| pandas | 2.2 | CSV loading, feature engineering, data cleaning | — |
| numpy | 1.26 | Numeric ops, log/exp transform on price | — |
| joblib | 1.3 | Model serialization. Part of scikit-learn ecosystem. | pickle — less safe for complex objects |

### Utility
| Library | Version | Why Selected |
|---|---|---|
| python-dotenv | 1.0 | Load `.env` files for config |
| python-multipart | 0.0.9 | Required by FastAPI for form data support |

---

## Dev & Tooling

| Tool | Why |
|---|---|
| ESLint + Prettier | Code consistency. Non-negotiable on any real project. |
| Husky + lint-staged | Pre-commit hooks — prevent bad code from being committed |
| Docker + Docker Compose | Reproducible local environment. Backend + DB spin up with one command |
| GitHub Actions | CI — run linting and tests on every push to main |

---

## What Was Explicitly Rejected

| Library | Reason Rejected |
|---|---|
| Next.js | SSR not needed. Single form page. Adds complexity for zero benefit. |
| Prisma | Python backend doesn't use it. SQLAlchemy is the Python equivalent. |
| GraphQL | REST is sufficient. One main endpoint. |
| Redux | Zustand handles state with 10x less code. |
| Material UI | Visual style doesn't match the clean financial tool aesthetic. |
| TensorFlow / PyTorch | 10K row dataset. XGBoost outperforms neural nets on tabular data at this scale. |
| Celery | No async background jobs needed in MVP. |
| Redis | No caching layer needed for MVP. Single prediction endpoint is fast enough. |

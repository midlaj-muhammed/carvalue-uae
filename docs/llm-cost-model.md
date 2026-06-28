# LLM Cost Model — CarValue UAE (Post-MVP)

> Token budget tracking for WhatsApp bot and AI report features planned for post-MVP.

---

## Overview

Post-MVP features (WhatsApp bot, AI report generation) will use LLM APIs for natural language interactions. This document tracks expected token consumption and cost projections.

---

## Feature Cost Estimates

### WhatsApp Bot (User Conversations)

| Metric | Value |
|--------|-------|
| Model | GPT-4o-mini or Claude 3.5 Haiku |
| Avg tokens per user message | ~200 input + 300 output |
| Avg tokens per bot response | ~150 output |
| Context window per conversation | ~2,000 tokens (5 messages) |
| Max conversations/day (est.) | 1,000 |
| **Monthly cost estimate** | **~$30-50/month** |

### AI Report Generation (Per Prediction)

| Metric | Value |
|--------|-------|
| Model | GPT-4o or Claude 3.5 Sonnet |
| Input tokens (prediction context) | ~500 tokens |
| Output tokens (report text) | ~800 tokens |
| Max reports/day (est.) | 500 |
| **Monthly cost estimate** | **~$40-80/month** |

---

## Token Budget Guardrails

### Per-User Limits
- WhatsApp: 20 messages/hour per user (prevents abuse)
- Reports: 3 reports/day per user

### Per-Day Limits
- Total input tokens: 1M/day
- Total output tokens: 1.5M/day
- Total daily cost ceiling: $25/day

### Monitoring
- Log token usage per request in `llm_usage_logs` table
- Alert if daily cost exceeds $20 (80% of ceiling)
- Dashboard tracks rolling 7-day average cost

---

## Database Schema (Post-MVP)

```sql
CREATE TABLE llm_usage_logs (
    id              SERIAL PRIMARY KEY,
    created_at      TIMESTAMP DEFAULT NOW(),
    feature         VARCHAR(30),          -- 'whatsapp_bot', 'ai_report'
    model_name      VARCHAR(50),          -- 'gpt-4o-mini', 'claude-3.5-haiku'
    input_tokens    INTEGER,
    output_tokens   INTEGER,
    cost_usd        DECIMAL(10,4),
    user_id         VARCHAR(50),          -- hashed identifier
    latency_ms      INTEGER,
    success         BOOLEAN DEFAULT TRUE
);
```

---

## Cost Optimization Strategies

1. **Cache common responses** — Car make/model predictions are repeatable. Cache LLM responses for identical inputs.
2. **Use smaller models for simple tasks** — GPT-4o-mini for WhatsApp conversations, GPT-4o only for complex reports.
3. **Batch processing** — Generate reports in batches rather than real-time to reduce API overhead.
4. **Prompt engineering** — Optimize system prompts to reduce output token count while maintaining quality.
5. **Local fallback** — For high-volume, low-complexity queries, use a fine-tuned local model instead of API calls.

---

## Implementation Priority

| Phase | Feature | Cost Impact |
|-------|---------|-------------|
| MVP | None — no LLM features | $0 |
| Phase 2 | WhatsApp bot (GPT-4o-mini) | ~$50/month |
| Phase 3 | AI reports (GPT-4o) | ~$80/month |
| Phase 4 | Both combined with caching | ~$60/month (30% reduction) |

---

## Monthly Budget Projection

| Scenario | Users | Reports/Day | Monthly Cost |
|----------|-------|-------------|-------------|
| Low usage | 100 | 50 | $30-40 |
| Medium usage | 500 | 200 | $60-80 |
| High usage | 2,000 | 500 | $100-150 |
| With caching (30% reduction) | 2,000 | 500 | $70-105 |

---

## Related Files (Post-MVP)

- `backend/app/services/llm_service.py` — LLM API wrapper with token tracking
- `backend/app/models/llm_usage_log.py` — SQLAlchemy model for usage logs
- `ml/drift.py` — Can be extended to monitor LLM cost drift
- `docs/ci-cd.md` — Add LLM cost alert to monitoring pipeline

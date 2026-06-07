---
name: opsiq-smoke-test
description: >-
  End-to-end smoke test for OpsIQ UI and FastAPI backend. Verifies Docker/PostgreSQL,
  API health, knowledge base stats, and all 5 chat agents. Use before commits, after
  agent/API changes, or when the user asks to test the app.
---

# OpsIQ Smoke Test

Run this checklist before committing changes that touch chat, agents, ingestion, or API integration.

## Prerequisites

- Backend repo: `/Users/sisampat/WSpace/opsiq`
- Frontend repo: `/Users/sisampat/WSpace/opsiq-ui`
- API base (via Next.js proxy): `http://localhost:3000/api/v1`
- Direct backend: `http://localhost:8000/api/v1`

## Checklist

```
- [ ] PostgreSQL running (Docker)
- [ ] Backend health 200
- [ ] Frontend lint + build pass
- [ ] Stats endpoint returns documents
- [ ] All 5 agents return 200 (not 500)
- [ ] Obscure query returns graceful "no documents" (not crash)
```

## Step 1: Infrastructure

```bash
docker info >/dev/null 2>&1 || open -a Docker
cd /Users/sisampat/WSpace/opsiq/docker && docker compose up -d pgvector
curl -s http://localhost:8000/api/v1/health
```

Expected: `{"status":"healthy",...}`

If health fails, start backend:

```bash
cd /Users/sisampat/WSpace/opsiq && source .venv/bin/activate && python main.py
```

## Step 2: Frontend build

```bash
cd /Users/sisampat/WSpace/opsiq-ui && npm run lint && npm run build
```

## Step 3: Knowledge base

```bash
curl -s http://localhost:8000/api/v1/stats
```

Expected: `total_documents` > 0. If 500, PostgreSQL is down — not a missing-backend issue.

## Step 4: Agent chat smoke (all 5)

POST `http://localhost:8000/api/v1/agent/chat` with `context.agent` set explicitly:

| agent | sample query |
|-------|----------------|
| internal | What is the expense reimbursement policy? |
| support | How do I get help with a billing question? |
| report | Summarize Q1 operations performance |
| onboarding | What should I do on my first day? |
| contract | Summarize vendor contracts |

Each must return HTTP 200 and a non-empty `answer` field.

## Step 5: Graceful empty retrieval

```json
{
  "query": "Summarize Acme Corp 2099 intergalactic vendor agreement",
  "session_id": "smoke_empty_test",
  "context": { "agent": "contract" }
}
```

Expected: 200 with a message explaining documents are unavailable — **not** Internal Server Error.

## Step 6: Verify retrieval vs agent message

If an agent says "no relevant documents", confirm with direct query:

```bash
curl -s -X POST http://localhost:8000/api/v1/query \
  -H "Content-Type: application/json" \
  -d '{"query":"YOUR_QUERY","top_k":5}'
```

If `/query` returns sources but the agent says no documents, check:
- `agents/state.py` — custom flags (`has_sources`, `no_documents`) must be declared on TypedDict
- Backend reloaded after Python changes (restart `python main.py` if stale)

## Do not run

- `POST /api/v1/ragas/evaluate` — avoid token usage unless explicitly requested

## Report format

```markdown
## Smoke test results

| Check | Status | Notes |
|-------|--------|-------|
| PostgreSQL | pass/fail | |
| Backend health | pass/fail | |
| Lint + build | pass/fail | |
| Stats | pass/fail | doc count |
| internal agent | pass/fail | |
| support agent | pass/fail | |
| report agent | pass/fail | |
| onboarding agent | pass/fail | |
| contract agent | pass/fail | |
| empty-query graceful | pass/fail | |
```

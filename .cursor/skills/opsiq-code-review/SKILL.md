---
name: opsiq-code-review
description: >-
  Code review checklist for OpsIQ UI and backend changes. Covers API contracts,
  LangGraph agent patterns, error handling, and scope. Use before commits, pull
  requests, or when the user asks for a code review.
---

# OpsIQ Code Review

Review changes against this checklist. Focus on integration bugs that unit tests miss.

## UI (`opsiq-ui`)

- [ ] Chat reads `answer` from API (`data.answer ?? data.response ?? data.message`)
- [ ] API errors distinguish backend down vs PostgreSQL unavailable (`getApiFailureHint`)
- [ ] `context.agent` passed in `sendChat` matches selected agent in sidebar
- [ ] No UI triggers `POST /api/v1/ragas/evaluate`
- [ ] Dynamic imports for client-only libs (e.g. Recharts) use `ssr: false`
- [ ] Minimal diff — no unrelated refactors

## Backend (`opsiq`)

- [ ] `/agent/chat` respects `context.agent` from UI (supervisor bypasses LLM routing when set)
- [ ] Contract/report agents accept `query=` for chat mode (not only `file_path` / `topic`)
- [ ] New agent state fields declared in `agents/state.py` (LangGraph drops undeclared keys)
- [ ] Empty retrieval returns graceful message via `no_documents_message()` — not HTTP 500
- [ ] `agent.run()` return dict includes `answer` or `final_answer` (routes use `extract_answer`)
- [ ] Route handler or supervisor wraps unexpected exceptions — no raw 500 to UI

## API contract

| Endpoint | UI expects | Backend returns |
|----------|------------|-----------------|
| POST `/agent/chat` | `answer` | `AgentChatResponse.answer` |
| GET `/stats` | `StatsResponse` | 200 or throw |
| GET `/health` | `{ status }` | always 200 if API up |
| GET `/ragas/*` | null/[] on error | never throw in UI client |

## Common regressions (this project)

1. **Internal Server Error on contract queries** — supervisor routed to `ContractAgent.run(file_path=...)` without a file
2. **"No response received" in UI** — API returns `answer` but hook reads only `response`
3. **Agent says no docs but KB has data** — undeclared `has_sources` / score threshold too aggressive
4. **Stale dev server** — Next.js 14 process after upgrade to 16; run `npm run dev:clean`
5. **Stats 500** — PostgreSQL not running; not a backend-down issue

## Review output format

```markdown
## Code review

### Critical (must fix)
- ...

### Suggestions
- ...

### Verified
- ...
```

Run `@opsiq-smoke-test` after fixing critical items.

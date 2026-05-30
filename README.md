# OpsIQ UI

Next.js frontend for **OpsIQ** — an AI Operations Hub that turns your business documents into a 24/7 intelligent assistant.

## Overview

OpsIQ helps teams upload operational documents (policies, SOPs, contracts, reports) and interact with specialized AI agents grounded in that knowledge. This repository is the web UI; it connects to a separate **FastAPI** backend for ingestion, retrieval, agents, and RAGAS quality evaluation.

**What you can do in the app:**

- Chat with five specialized agents (Internal, Support, Report, Onboarding, Contract)
- Upload documents to the knowledge base with department and document type tags
- View ingestion stats and documents by department
- Browse past agent sessions and conversation history
- Monitor RAGAS retrieval/answer quality scores and run evaluations
- Learn about the product on the About page

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui-style (Radix primitives) |
| Charts | Recharts (AI Quality dashboard) |
| Fonts | Inter + Plus Jakarta Sans |
| Backend | FastAPI at `http://localhost:8000/api/v1` |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Redirects to `/chat` |
| `/chat` | Agent chat, sidebar agent selector, file upload, approval flow for reports/contracts |
| `/knowledge-base` | Total documents/chunks, department breakdown, upload modal |
| `/sessions` | List sessions and view conversation history |
| `/about` | Product overview, agents, features, benefits, tech stack |
| `/quality` | RAGAS AI quality dashboard — scores, trends, history, run evaluation |

## Prerequisites

- **Node.js** 18+ and npm
- **OpsIQ FastAPI backend** running on port `8000` (separate repo/service)
- PostgreSQL + configured backend env (for full functionality)

## Project setup

### 1. Clone and install

```bash
git clone https://github.com/sampatsi/OpsIQ.git
cd OpsIQ   # or opsiq-ui if the UI lives in a subfolder
npm install
```

### 2. Start the backend

From your OpsIQ backend project:

```bash
uvicorn main:app --reload --port 8000
```

Verify the API is up:

```bash
curl http://localhost:8000/api/v1/health
```

### 3. Start the frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

API calls from the browser go to `/api/v1/*` and are **proxied** to the backend via `next.config.mjs`:

```js
/api/v1/:path*  →  http://localhost:8000/api/v1/:path*
```

### 4. Production build

```bash
npm run build
npm start
```

For production, update the rewrite destination in `next.config.mjs` to your deployed API host, or set up a reverse proxy.

## Environment variables

No env vars are required for local development. The dev proxy assumes the backend at `http://localhost:8000`.

For production deployments (e.g. Vercel), configure the API base URL in `next.config.mjs` rewrites or your hosting platform’s proxy settings.

## Backend API (summary)

The UI expects these endpoint groups under `http://localhost:8000/api/v1`:

| Area | Key endpoints |
|------|----------------|
| Health | `GET /health` |
| Ingestion | `POST /ingest`, `GET /stats` |
| Chat / agents | `POST /agent/chat`, `POST /agent/report/approve`, `GET /agent/sessions`, `GET /agent/sessions/:id` |
| RAGAS quality | `GET /ragas/thresholds`, `GET /ragas/latest`, `GET /ragas/history?limit=30`, `GET /ragas/status`, `POST /ragas/evaluate` |

RAGAS base path: `http://localhost:8000/api/v1/ragas`

## Project structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── chat/
│   ├── knowledge-base/
│   ├── sessions/
│   ├── about/
│   └── quality/
├── components/             # UI components
│   ├── ui/                 # shadcn-style primitives
│   ├── quality/            # RAGAS dashboard widgets
│   └── about/              # About page sections
├── hooks/                  # useSession, useAgent, useChat, useQuality, …
├── lib/                    # API client, agents config, RAGAS helpers
└── types/                  # Shared TypeScript types
```

## Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (with file polling for macOS) |
| `npm run dev:clean` | Clear `.next` cache and start dev server |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | ESLint |

## Troubleshooting

**404 or `Cannot find module './xxx.js'` in dev**

The Next.js cache can get stale after many hot reloads. Fix:

```bash
pkill -f "next dev"
rm -rf .next
npm run dev
```

Or use:

```bash
npm run dev:clean
```

**API errors / empty data**

- Confirm the backend is running: `curl http://localhost:8000/api/v1/health`
- AI Quality page shows an empty state until the first RAGAS evaluation exists (`GET /ragas/latest` returns 404 until then)

**Port 3000 in use**

Next.js may start on port 3001. Stop other dev servers or kill the process on 3000.

## License

Private — see repository owner for terms.

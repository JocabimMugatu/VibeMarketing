# VibeLaunch OS

VibeLaunch OS is an AI-assisted operating system for planning, launching, and scaling new products. It includes a Next.js App Router frontend for the CMO dashboard and a FastAPI backend scaffold for ingestion, context parsing, and browser-agent log hooks.

## Architecture

```
.
├── apps/
│   └── web/                    # Next.js 14 App Router frontend
├── backend/                    # FastAPI Python backend
├── .env.template              # Environment variables template
└── README.md                  # This file
```

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.10+ (for backend)
- OpenAI API key (for LLM context parsing)
- Tavily API key (optional, for research)
- GitHub Token (optional, for private repos)

## Quick Start

### 1. Environment Setup

Copy `.env.template` to `.env` and fill in your API keys:

```bash
cp .env.template .env
```

Edit `.env` with your credentials:
```env
# Shared
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Backend
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
TAVILY_API_KEY=tvly-...
GITHUB_TOKEN=ghp_...
BROWSER_USE_API_KEY=
PLAYWRIGHT_BROWSERS_PATH=
```

### 2. Frontend (Next.js)

```bash
cd apps/web
npm install
npm run dev
```

The UI runs at `http://localhost:3000`.

Features:
- Dark-mode CMO Dashboard with live mission log
- Ingestion & Context Parser UI (builds project context from GitHub/README)
- Tactics Library with 20 high-impact plays
- Magic Launch Workflow with Kanban board
- Real-time SSE log streaming
- Framer Motion animations

### 3. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Optional: Install Playwright browsers for browser automation
playwright install chromium

uvicorn main:app --reload
```

The API runs at `http://localhost:8000` with routes under `/api`.

## API Endpoints

### Health
- `GET /health` - Health check

### Ingestion
- `POST /api/ingest` - Ingest project from GitHub URL or README
  ```json
  {
    "github_url": "https://github.com/org/repo",
    "readme_text": "optional readme content"
  }
  ```

### Context Parser
- `POST /api/context/parse` - Parse structured context from README
  ```json
  {
    "github_url": "https://github.com/org/repo",
    "readme_text": "optional readme content"
  }
  ```
  Returns:
  ```json
  {
    "product_name": "...",
    "summary": "...",
    "audience": "...",
    "value_props": [...],
    "tone": "...",
    "channels": [...],
    "constraints": [...],
    "source": "llm|heuristic"
  }
  ```

### Tactics Library
- `GET /api/tactics` - List all tactics
- `GET /api/tactics/{id}` - Get specific tactic
- `GET /api/tactics/tier/{tier}` - Filter by tier (Foundation/Growth/Viral)

### Magic Launch
- `GET /api/launch/plans` - List launch plans
- `POST /api/launch/plans?name={name}` - Create new plan
- `GET /api/launch/plans/{id}` - Get plan details
- `POST /api/launch/plans/{id}/steps` - Add workflow step
- `PATCH /api/launch/steps/{id}?status={status}` - Update step status
- `GET /api/launch/board` - Get Kanban board data

### Logs
- `GET /api/logs` - List recent logs
- `POST /api/logs` - Create log entry
- `GET /api/logs/stream` - SSE stream for real-time logs
- `POST /api/logs/clear` - Clear log store

## Frontend Routes

- `/` - Dashboard with stats, objectives, and live mission log
- `/ingest` - Project ingestion and context parser UI
- `/tactics` - Tactics library with filtering
- `/magic-launch` - Launch workflow with Kanban board

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animations)

### Backend
- FastAPI
- Pydantic (data validation)
- OpenAI (LLM context parsing)
- Playwright (browser automation scaffold)
- python-dotenv (environment management)

## Context Parser

The context parser extracts structured product launch context from README files:

1. **Heuristic fallback**: Basic extraction from README structure
2. **LLM extraction**: Uses OpenAI to intelligently parse:
   - Product name and summary
   - Target audience
   - Value propositions
   - Brand tone
   - Marketing channels
   - Constraints

The parser handles GitHub URLs by fetching the raw README from:
- `raw.githubusercontent.com` (fast path)
- GitHub API (fallback with base64 decoding)

## Browser Agent

The `services/browser_agent.py` module provides scaffolding for Playwright-based automation:

```python
from services.browser_agent import get_browser_agent

agent = await get_browser_agent()
log = await agent.scrape_readme("https://github.com/org/repo")
print(log.to_dict())
await agent.close()
```

## Development

### Frontend Development
```bash
cd apps/web
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # Run ESLint
```

### Backend Development
```bash
cd backend
uvicorn main:app --reload --port 8000

# With custom settings
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Testing the API
```bash
# Health check
curl http://localhost:8000/health

# Parse context
curl -X POST http://localhost:8000/api/context/parse \
  -H "Content-Type: application/json" \
  -d '{"github_url":"https://github.com/vercel/next.js"}'

# Stream logs
curl http://localhost:8000/api/logs/stream
```

## Project Structure

```
apps/web/
├── app/                      # Next.js App Router
│   ├── globals.css          # Global styles (dark mode)
│   ├── layout.tsx           # Root layout with sidebar
│   ├── page.tsx             # Dashboard page
│   ├── ingest/page.tsx      # Ingestion UI
│   ├── tactics/page.tsx     # Tactics library
│   └── magic-launch/page.tsx # Launch workflow
├── components/              # React components
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   ├── StatCard.tsx
│   ├── ProgressBar.tsx
│   ├── LogStream.tsx
│   ├── KanbanBoard.tsx
│   ├── Stepper.tsx
│   └── AnimatedCard.tsx
├── lib/                     # Utilities
│   ├── api.ts              # API client
│   ├── types.ts            # TypeScript types
│   └── tactics.ts          # Tactics data
└── package.json

backend/
├── main.py                 # FastAPI app entry
├── requirements.txt        # Python dependencies
├── routers/               # API route handlers
│   ├── ingest.py
│   ├── context.py
│   ├── tactics.py
│   ├── launch.py
│   └── logs.py
└── services/              # Business logic
    ├── context_parser.py  # README → structured context
    └── browser_agent.py   # Playwright automation scaffold
```

## License

MIT

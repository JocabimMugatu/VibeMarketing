# VibeLaunch OS

VibeLaunch OS is a bootstrap workspace for a growth-focused operating system. It includes a Next.js App Router frontend for the CMO dashboard and a FastAPI backend scaffold for ingestion, context parsing, and browser-agent log hooks.

## Frontend (Next.js)

```bash
cd apps/web
npm install
npm run dev
```

The UI runs at `http://localhost:3000`.

## Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API runs at `http://localhost:8000` with routes under `/api`.

## Environment

Copy `.env.template` to `.env` and fill in the values you need. The frontend reads `NEXT_PUBLIC_API_URL` for API calls, and the backend uses OpenAI and GitHub credentials for context parsing.

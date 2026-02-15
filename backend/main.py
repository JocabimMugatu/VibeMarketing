from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import ingest, logs, context, tactics, launch

app = FastAPI(title="VibeLaunch OS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include all routers
app.include_router(ingest.router, prefix="/api")
app.include_router(logs.router, prefix="/api")
app.include_router(context.router, prefix="/api")
app.include_router(tactics.router, prefix="/api")
app.include_router(launch.router, prefix="/api")


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}


@app.get("/")
def root() -> dict:
    return {
        "name": "VibeLaunch OS API",
        "version": "0.1.0",
        "endpoints": [
            "/api/ingest",
            "/api/context/parse",
            "/api/tactics",
            "/api/launch/plans",
            "/api/logs",
            "/api/logs/stream"
        ]
    }

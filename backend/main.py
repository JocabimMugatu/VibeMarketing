from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import ingest, logs

app = FastAPI(title="VibeLaunch OS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(ingest.router, prefix="/api")
app.include_router(logs.router, prefix="/api")


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}

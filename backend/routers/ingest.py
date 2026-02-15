from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from routers.logs import add_log, emit_browser_log
from services.context_parser import parse_project_context

router = APIRouter(tags=["ingest"])


class IngestRequest(BaseModel):
    github_url: Optional[str] = None
    readme_text: Optional[str] = None


class ContextResponse(BaseModel):
    product_name: str
    summary: str
    audience: str
    value_props: list[str]
    tone: str
    channels: list[str]
    constraints: list[str]
    source: str


class IngestResponse(BaseModel):
    status: str
    context: Optional[ContextResponse] = None


@router.post("/ingest", response_model=IngestResponse)
async def ingest(payload: IngestRequest) -> IngestResponse:
    if not payload.github_url and not payload.readme_text:
        raise HTTPException(status_code=400, detail="Provide github_url or readme_text")

    add_log(level="info", message="Ingestion started", source="ingest")
    emit_browser_log("ingest", "capture repository metadata")

    context = parse_project_context(payload.github_url, payload.readme_text)
    add_log(level="success", message="Context parsed", source="parser")

    return IngestResponse(status="ok", context=ContextResponse(**context))


from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from routers.logs import add_log
from services.context_parser import parse_project_context

router = APIRouter(tags=["context"])


class ContextParseRequest(BaseModel):
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


@router.post("/context/parse", response_model=ContextResponse)
async def parse_context(payload: ContextParseRequest) -> ContextResponse:
    """Parse project context from GitHub URL or README text."""
    if not payload.github_url and not payload.readme_text:
        raise HTTPException(status_code=400, detail="Provide github_url or readme_text")

    add_log(level="info", message="Context parse requested", source="parser")
    
    context = parse_project_context(payload.github_url, payload.readme_text)
    
    add_log(
        level="success",
        message=f"Context extracted for: {context.get('product_name', 'Unknown')}",
        source="parser"
    )
    
    return ContextResponse(**context)


@router.get("/context/health")
async def context_health() -> dict:
    """Health check for context parser service."""
    return {"status": "ok", "service": "context_parser"}

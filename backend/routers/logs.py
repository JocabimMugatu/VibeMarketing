from datetime import datetime
from typing import List, Optional
from uuid import uuid4

from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(tags=["logs"])


class LogEventCreate(BaseModel):
    level: str = Field("info", pattern="^(info|warning|error|success)$")
    message: str
    source: Optional[str] = None


class LogEvent(BaseModel):
    id: str
    timestamp: str
    level: str
    message: str
    source: Optional[str] = None


LOG_STORE: List[LogEvent] = []


def _build_event(payload: LogEventCreate) -> LogEvent:
    return LogEvent(
        id=str(uuid4()),
        timestamp=datetime.utcnow().isoformat() + "Z",
        level=payload.level,
        message=payload.message,
        source=payload.source
    )


def add_log(level: str, message: str, source: Optional[str] = None) -> LogEvent:
    payload = LogEventCreate(level=level, message=message, source=source)
    event = _build_event(payload)
    LOG_STORE.append(event)
    return event


def emit_browser_log(action: str, detail: str) -> LogEvent:
    return add_log(level="info", message=f"Browser-agent: {action} - {detail}", source="browser-agent")


@router.post("/logs", response_model=LogEvent)
async def create_log(payload: LogEventCreate) -> LogEvent:
    event = _build_event(payload)
    LOG_STORE.append(event)
    return event


@router.get("/logs", response_model=List[LogEvent])
async def list_logs(limit: int = 50) -> List[LogEvent]:
    return LOG_STORE[-limit:]

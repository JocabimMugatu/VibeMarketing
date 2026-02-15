import asyncio
from datetime import datetime
from typing import List, Optional, AsyncGenerator
from uuid import uuid4

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
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
# List of queues for SSE subscribers
SSE_SUBSCRIBERS: List[asyncio.Queue] = []


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
    
    # Notify all SSE subscribers
    for queue in SSE_SUBSCRIBERS:
        try:
            queue.put_nowait(event)
        except asyncio.QueueFull:
            pass
    
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


async def log_event_generator() -> AsyncGenerator[str, None]:
    """Generate SSE events for log stream."""
    queue: asyncio.Queue = asyncio.Queue(maxsize=100)
    SSE_SUBSCRIBERS.append(queue)
    
    # Send initial connection message
    yield f"data: {LogEvent(id='conn', timestamp=datetime.utcnow().isoformat() + 'Z', level='info', message='Connected to log stream', source='system').json()}\n\n"
    
    try:
        while True:
            try:
                # Wait for new log events with timeout
                event = await asyncio.wait_for(queue.get(), timeout=30.0)
                yield f"data: {event.json()}\n\n"
            except asyncio.TimeoutError:
                # Send keepalive comment
                yield ":keepalive\n\n"
    except asyncio.CancelledError:
        SSE_SUBSCRIBERS.remove(queue)
        raise
    finally:
        if queue in SSE_SUBSCRIBERS:
            SSE_SUBSCRIBERS.remove(queue)


@router.get("/logs/stream")
async def stream_logs() -> StreamingResponse:
    """Stream logs via Server-Sent Events (SSE)."""
    return StreamingResponse(
        log_event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@router.post("/logs/clear")
async def clear_logs() -> dict:
    """Clear all stored logs."""
    LOG_STORE.clear()
    return {"status": "ok", "message": "Logs cleared"}

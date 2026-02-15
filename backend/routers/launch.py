from datetime import datetime
from typing import List, Optional
from uuid import uuid4

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from routers.logs import add_log

router = APIRouter(tags=["launch"])


class WorkflowStepCreate(BaseModel):
    title: str
    owner: str
    status: str = Field("Backlog", pattern="^(Backlog|In Progress|Review|Shipped)$")
    due: Optional[str] = None


class WorkflowStep(WorkflowStepCreate):
    id: str
    created_at: str
    updated_at: str


class WorkflowStage(BaseModel):
    title: str
    detail: str
    status: str = Field(..., pattern="^(complete|active|upcoming)$")


class LaunchPlan(BaseModel):
    id: str
    name: str
    stages: List[WorkflowStage]
    steps: List[WorkflowStep]
    created_at: str
    updated_at: str


# In-memory storage for demo
LAUNCH_PLANS: dict[str, LaunchPlan] = {}
WORKFLOW_STEPS: dict[str, WorkflowStep] = {}


@router.post("/launch/plans", response_model=LaunchPlan)
async def create_launch_plan(name: str) -> LaunchPlan:
    """Create a new launch plan with default workflow stages."""
    plan_id = str(uuid4())
    now = datetime.utcnow().isoformat() + "Z"
    
    default_stages = [
        {"title": "Ideation + Research", "detail": "Lock launch thesis, market signal, and ICP insights.", "status": "complete"},
        {"title": "Positioning", "detail": "Finalize narrative and messaging map.", "status": "active"},
        {"title": "Assets", "detail": "Build landing, demo, and sales enablement assets.", "status": "active"},
        {"title": "Launch Ops", "detail": "Coordinate channels, partners, and press.", "status": "upcoming"},
        {"title": "Analytics + Learnings", "detail": "Measure performance and capture launch retro.", "status": "upcoming"}
    ]
    
    plan = LaunchPlan(
        id=plan_id,
        name=name,
        stages=default_stages,
        steps=[],
        created_at=now,
        updated_at=now
    )
    
    LAUNCH_PLANS[plan_id] = plan
    add_log(level="success", message=f"Created launch plan: {name}", source="launch")
    
    return plan


@router.get("/launch/plans", response_model=List[LaunchPlan])
async def list_launch_plans() -> List[LaunchPlan]:
    """List all launch plans."""
    return list(LAUNCH_PLANS.values())


@router.get("/launch/plans/{plan_id}", response_model=LaunchPlan)
async def get_launch_plan(plan_id: str) -> LaunchPlan:
    """Get a specific launch plan by ID."""
    if plan_id not in LAUNCH_PLANS:
        raise HTTPException(status_code=404, detail="Launch plan not found")
    return LAUNCH_PLANS[plan_id]


@router.post("/launch/plans/{plan_id}/steps", response_model=WorkflowStep)
async def add_workflow_step(plan_id: str, step: WorkflowStepCreate) -> WorkflowStep:
    """Add a workflow step to a launch plan."""
    if plan_id not in LAUNCH_PLANS:
        raise HTTPException(status_code=404, detail="Launch plan not found")
    
    step_id = str(uuid4())
    now = datetime.utcnow().isoformat() + "Z"
    
    new_step = WorkflowStep(
        id=step_id,
        title=step.title,
        owner=step.owner,
        status=step.status,
        due=step.due,
        created_at=now,
        updated_at=now
    )
    
    WORKFLOW_STEPS[step_id] = new_step
    LAUNCH_PLANS[plan_id].steps.append(new_step)
    LAUNCH_PLANS[plan_id].updated_at = now
    
    add_log(
        level="info",
        message=f"Added step '{step.title}' to launch plan",
        source="launch"
    )
    
    return new_step


@router.patch("/launch/steps/{step_id}", response_model=WorkflowStep)
async def update_step_status(step_id: str, status: str) -> WorkflowStep:
    """Update the status of a workflow step."""
    if step_id not in WORKFLOW_STEPS:
        raise HTTPException(status_code=404, detail="Step not found")
    
    if status not in ["Backlog", "In Progress", "Review", "Shipped"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    WORKFLOW_STEPS[step_id].status = status
    WORKFLOW_STEPS[step_id].updated_at = datetime.utcnow().isoformat() + "Z"
    
    add_log(
        level="success",
        message=f"Updated step '{WORKFLOW_STEPS[step_id].title}' to {status}",
        source="launch"
    )
    
    return WORKFLOW_STEPS[step_id]


@router.get("/launch/steps", response_model=List[WorkflowStep])
async def list_steps(status: Optional[str] = None) -> List[WorkflowStep]:
    """List all workflow steps, optionally filtered by status."""
    steps = list(WORKFLOW_STEPS.values())
    if status:
        steps = [s for s in steps if s.status == status]
    return steps


@router.get("/launch/board")
async def get_kanban_board() -> dict:
    """Get Kanban board data grouped by status columns."""
    columns = {
        "Backlog": [],
        "In Progress": [],
        "Review": [],
        "Shipped": []
    }
    
    for step in WORKFLOW_STEPS.values():
        if step.status in columns:
            columns[step.status].append({
                "id": step.id,
                "title": step.title,
                "owner": step.owner,
                "due": step.due
            })
    
    return {
        "columns": [
            {"title": "Backlog", "items": columns["Backlog"]},
            {"title": "In Progress", "items": columns["In Progress"]},
            {"title": "Review", "items": columns["Review"]},
            {"title": "Shipped", "items": columns["Shipped"]}
        ]
    }

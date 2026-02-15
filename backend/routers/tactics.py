from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(tags=["tactics"])


class Tactic(BaseModel):
    id: str
    name: str
    tier: str
    summary: str
    impact: str
    channels: List[str]


class TacticsListResponse(BaseModel):
    tactics: List[Tactic]
    count: int


# Seed tactics library
TACTICS_LIBRARY = [
    {
        "id": "tactic-001",
        "name": "Positioning Clarity Sprint",
        "tier": "Foundation",
        "summary": "Define a single-sentence positioning statement and differentiators.",
        "impact": "Sharper messaging across every channel.",
        "channels": ["Website", "Sales", "Press"]
    },
    {
        "id": "tactic-002",
        "name": "Ideal Customer Profile Snapshot",
        "tier": "Foundation",
        "summary": "Codify top 3 customer archetypes with pains and triggers.",
        "impact": "Improves targeting precision.",
        "channels": ["Ads", "Outbound"]
    },
    {
        "id": "tactic-003",
        "name": "Hero Value Prop Stack",
        "tier": "Foundation",
        "summary": "Create a three-layer value prop hierarchy (core, proof, payoff).",
        "impact": "Consistency across landing and sales decks.",
        "channels": ["Website", "Sales"]
    },
    {
        "id": "tactic-004",
        "name": "Onboarding Activation Map",
        "tier": "Foundation",
        "summary": "Identify aha moment and map steps to reach it fast.",
        "impact": "Higher activation rates.",
        "channels": ["Product", "Lifecycle"]
    },
    {
        "id": "tactic-005",
        "name": "Founder Story Vault",
        "tier": "Foundation",
        "summary": "Capture origin story, mission, and founder POV narratives.",
        "impact": "Better trust and storytelling.",
        "channels": ["PR", "Social"]
    },
    {
        "id": "tactic-006",
        "name": "Competitor Angle Board",
        "tier": "Foundation",
        "summary": "Map top competitors and find whitespace language.",
        "impact": "Creates distinct positioning.",
        "channels": ["Website", "Sales"]
    },
    {
        "id": "tactic-007",
        "name": "Launch Narrative Brief",
        "tier": "Foundation",
        "summary": "Outline launch narrative, proof points, and CTA journey.",
        "impact": "Launch alignment across teams.",
        "channels": ["Launch", "PR"]
    },
    {
        "id": "tactic-008",
        "name": "Pricing Page Heatmap Review",
        "tier": "Growth",
        "summary": "Analyze scroll + click maps to reduce drop-off.",
        "impact": "Higher conversion on pricing.",
        "channels": ["Website"]
    },
    {
        "id": "tactic-009",
        "name": "Feature Adoption Campaign",
        "tier": "Growth",
        "summary": "Target feature adoption with segmented in-app prompts.",
        "impact": "Accelerated feature usage.",
        "channels": ["Product", "Lifecycle"]
    },
    {
        "id": "tactic-010",
        "name": "Partner Co-Marketing Kit",
        "tier": "Growth",
        "summary": "Build shared assets for partner announcements.",
        "impact": "New audience reach.",
        "channels": ["Partnerships"]
    },
    {
        "id": "tactic-011",
        "name": "Customer Proof Sprint",
        "tier": "Growth",
        "summary": "Collect 5 quick testimonials and integrate on site.",
        "impact": "Improves trust signals.",
        "channels": ["Website", "Sales"]
    },
    {
        "id": "tactic-012",
        "name": "Community Warm Start",
        "tier": "Growth",
        "summary": "Seed a private community with 15 power users.",
        "impact": "Stronger retention flywheel.",
        "channels": ["Community"]
    },
    {
        "id": "tactic-013",
        "name": "Lifecycle Win-Back",
        "tier": "Growth",
        "summary": "Re-engage dormant leads with a 3-step nurture.",
        "impact": "Recaptures pipeline.",
        "channels": ["Email", "Lifecycle"]
    },
    {
        "id": "tactic-014",
        "name": "Sales Enablement Playbook",
        "tier": "Growth",
        "summary": "Deliver objection handling, battlecards, and ROI proof.",
        "impact": "Higher close rates.",
        "channels": ["Sales"]
    },
    {
        "id": "tactic-015",
        "name": "Launch Event Run of Show",
        "tier": "Growth",
        "summary": "Plan agenda, speakers, and CTA for virtual launch.",
        "impact": "Better live engagement.",
        "channels": ["Events"]
    },
    {
        "id": "tactic-016",
        "name": "Founder AMA Circuit",
        "tier": "Viral",
        "summary": "Schedule AMAs across communities and podcasts.",
        "impact": "Earned distribution.",
        "channels": ["Community", "PR"]
    },
    {
        "id": "tactic-017",
        "name": "Viral Loop CTA",
        "tier": "Viral",
        "summary": "Embed share-ready moments in onboarding.",
        "impact": "Organic referral growth.",
        "channels": ["Product"]
    },
    {
        "id": "tactic-018",
        "name": "Influencer Brief Pack",
        "tier": "Viral",
        "summary": "Provide creators with demo scripts and hooks.",
        "impact": "Amplifies social reach.",
        "channels": ["Social"]
    },
    {
        "id": "tactic-019",
        "name": "Launch Day Swarm",
        "tier": "Viral",
        "summary": "Coordinate team amplification across networks.",
        "impact": "Spike in awareness.",
        "channels": ["Social", "Community"]
    },
    {
        "id": "tactic-020",
        "name": "Press Momentum Ladder",
        "tier": "Viral",
        "summary": "Tiered outreach from niche blogs to marquee press.",
        "impact": "Sustained PR momentum.",
        "channels": ["PR"]
    }
]


@router.get("/tactics", response_model=TacticsListResponse)
async def list_tactics() -> TacticsListResponse:
    """List all available tactics in the library."""
    tactics = [Tactic(**t) for t in TACTICS_LIBRARY]
    return TacticsListResponse(tactics=tactics, count=len(tactics))


@router.get("/tactics/{tactic_id}", response_model=Tactic)
async def get_tactic(tactic_id: str) -> Tactic:
    """Get a specific tactic by ID."""
    for t in TACTICS_LIBRARY:
        if t["id"] == tactic_id:
            return Tactic(**t)
    raise HTTPException(status_code=404, detail="Tactic not found")


@router.get("/tactics/tier/{tier}", response_model=TacticsListResponse)
async def get_tactics_by_tier(tier: str) -> TacticsListResponse:
    """Filter tactics by tier (Foundation, Growth, Viral)."""
    filtered = [t for t in TACTICS_LIBRARY if t["tier"].lower() == tier.lower()]
    tactics = [Tactic(**t) for t in filtered]
    return TacticsListResponse(tactics=tactics, count=len(tactics))

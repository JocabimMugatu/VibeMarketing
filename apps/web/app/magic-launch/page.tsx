import KanbanBoard from "../../components/KanbanBoard";
import Stepper from "../../components/Stepper";
import { WorkflowStep } from "../../lib/types";

const workflowSteps = [
  {
    title: "Ideation + Research",
    detail: "Lock launch thesis, market signal, and ICP insights.",
    status: "complete"
  },
  {
    title: "Positioning",
    detail: "Finalize narrative and messaging map.",
    status: "active"
  },
  {
    title: "Assets",
    detail: "Build landing, demo, and sales enablement assets.",
    status: "active"
  },
  {
    title: "Launch Ops",
    detail: "Coordinate channels, partners, and press.",
    status: "upcoming"
  },
  {
    title: "Analytics + Learnings",
    detail: "Measure performance and capture launch retro.",
    status: "upcoming"
  }
];

const workflowItems: WorkflowStep[] = [
  {
    id: "step-1",
    title: "Competitive positioning brief",
    owner: "Ava",
    status: "Backlog",
    due: "Tue"
  },
  {
    id: "step-2",
    title: "Hero landing page refresh",
    owner: "Liam",
    status: "In Progress",
    due: "Wed"
  },
  {
    id: "step-3",
    title: "Launch email sequence",
    owner: "Noah",
    status: "Review",
    due: "Thu"
  },
  {
    id: "step-4",
    title: "PR briefing deck",
    owner: "Sophia",
    status: "Shipped",
    due: "Mon"
  },
  {
    id: "step-5",
    title: "Partner co-marketing kit",
    owner: "Mia",
    status: "Backlog",
    due: "Fri"
  },
  {
    id: "step-6",
    title: "Onboarding activation path",
    owner: "Ethan",
    status: "In Progress",
    due: "Wed"
  }
];

const columns = [
  {
    title: "Backlog" as const,
    items: workflowItems.filter((item) => item.status === "Backlog")
  },
  {
    title: "In Progress" as const,
    items: workflowItems.filter((item) => item.status === "In Progress")
  },
  {
    title: "Review" as const,
    items: workflowItems.filter((item) => item.status === "Review")
  },
  {
    title: "Shipped" as const,
    items: workflowItems.filter((item) => item.status === "Shipped")
  }
];

export default function MagicLaunchPage() {
  return (
    <div className="space-y-8">
      <header>
        <h3 className="text-lg font-semibold text-white">Magic Launch Workflow</h3>
        <p className="text-sm text-slate-400">
          Orchestrate the launch pipeline from ideation to analytics.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h4 className="text-sm font-semibold text-white">Stage Progress</h4>
        <div className="mt-6">
          <Stepper items={workflowSteps} />
        </div>
      </section>

      <section>
        <h4 className="text-sm font-semibold text-white">Execution Board</h4>
        <p className="text-sm text-slate-400">Move initiatives across the launch pipeline.</p>
        <div className="mt-4">
          <KanbanBoard columns={columns} />
        </div>
      </section>
    </div>
  );
}

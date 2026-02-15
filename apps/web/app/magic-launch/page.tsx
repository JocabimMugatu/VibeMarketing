"use client";

import { useState, useEffect } from "react";
import KanbanBoard from "../../components/KanbanBoard";
import Stepper from "../../components/Stepper";
import { WorkflowStep } from "../../lib/types";
import { getLaunchPlans, getKanbanBoard, createLaunchPlan, LaunchPlan, addWorkflowStep } from "../../lib/api";

interface KanbanColumn {
  title: WorkflowStep["status"];
  items: Array<{
    id: string;
    title: string;
    owner: string;
    due?: string;
  }>;
}

const workflowStages = [
  {
    title: "Ideation + Research",
    detail: "Lock launch thesis, market signal, and ICP insights.",
    status: "complete" as const,
  },
  {
    title: "Positioning",
    detail: "Finalize narrative and messaging map.",
    status: "active" as const,
  },
  {
    title: "Assets",
    detail: "Build landing, demo, and sales enablement assets.",
    status: "active" as const,
  },
  {
    title: "Launch Ops",
    detail: "Coordinate channels, partners, and press.",
    status: "upcoming" as const,
  },
  {
    title: "Analytics + Learnings",
    detail: "Measure performance and capture launch retro.",
    status: "upcoming" as const,
  },
];

export default function MagicLaunchPage() {
  const [plans, setPlans] = useState<LaunchPlan[]>([]);
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [showNewStepForm, setShowNewStepForm] = useState(false);
  const [newStep, setNewStep] = useState({
    title: "",
    owner: "",
    status: "Backlog" as WorkflowStep["status"],
    due: "",
  });
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  async function loadData() {
    try {
      const [plansData, boardData] = await Promise.all([
        getLaunchPlans(),
        getKanbanBoard(),
      ]);
      setPlans(plansData);
      setColumns(boardData.columns as KanbanColumn[]);
      if (plansData.length > 0 && !selectedPlanId) {
        setSelectedPlanId(plansData[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load launch data");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreatePlan(e: React.FormEvent) {
    e.preventDefault();
    if (!newPlanName.trim()) return;

    try {
      await createLaunchPlan(newPlanName);
      setNewPlanName("");
      setShowNewPlanForm(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create plan");
    }
  }

  async function handleAddStep(e: React.FormEvent) {
    e.preventDefault();
    if (!newStep.title.trim() || !newStep.owner.trim() || !selectedPlanId) return;

    try {
      await addWorkflowStep(selectedPlanId, {
        title: newStep.title,
        owner: newStep.owner,
        status: newStep.status,
        due: newStep.due || undefined,
      });
      setNewStep({ title: "", owner: "", status: "Backlog" as WorkflowStep["status"], due: "" });
      setShowNewStepForm(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add step");
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
          <p className="mt-4 text-sm text-slate-500">Loading launch data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Magic Launch Workflow</h3>
          <p className="text-sm text-slate-400">
            Orchestrate the launch pipeline from ideation to analytics.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewStepForm(true)}
            className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:text-slate-200"
          >
            Add Step
          </button>
          <button
            onClick={() => setShowNewPlanForm(true)}
            className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            New Plan
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-lg border border-rose-800 bg-rose-950/30 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {showNewPlanForm && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h4 className="text-sm font-semibold text-white">Create New Launch Plan</h4>
          <form onSubmit={handleCreatePlan} className="mt-4 flex gap-3">
            <input
              type="text"
              value={newPlanName}
              onChange={(e) => setNewPlanName(e.target.value)}
              placeholder="Plan name..."
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-200 placeholder:text-slate-600"
            />
            <button
              type="submit"
              className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowNewPlanForm(false)}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-400 transition hover:text-slate-300"
            >
              Cancel
            </button>
          </form>
        </section>
      )}

      {showNewStepForm && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h4 className="text-sm font-semibold text-white">Add Workflow Step</h4>
          <form onSubmit={handleAddStep} className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Title</label>
              <input
                type="text"
                value={newStep.title}
                onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                placeholder="Step title..."
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-200 placeholder:text-slate-600"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Owner</label>
              <input
                type="text"
                value={newStep.owner}
                onChange={(e) => setNewStep({ ...newStep, owner: e.target.value })}
                placeholder="Owner name..."
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-200 placeholder:text-slate-600"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Status</label>
              <select
                value={newStep.status}
                onChange={(e) =>
                  setNewStep({ ...newStep, status: e.target.value as WorkflowStep["status"] })
                }
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-200"
              >
                <option value="Backlog">Backlog</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Shipped">Shipped</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Due</label>
              <input
                type="text"
                value={newStep.due}
                onChange={(e) => setNewStep({ ...newStep, due: e.target.value })}
                placeholder="e.g., Mon, Tue, Wed..."
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-200 placeholder:text-slate-600"
              />
            </div>
            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Add Step
              </button>
              <button
                type="button"
                onClick={() => setShowNewStepForm(false)}
                className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-400 transition hover:text-slate-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {plans.length > 0 && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">Active Plans</h4>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1 text-sm text-slate-300"
            >
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h4 className="text-sm font-semibold text-white">Stage Progress</h4>
        <div className="mt-6">
          <Stepper items={workflowStages} />
        </div>
      </section>

      <section>
        <h4 className="text-sm font-semibold text-white">Execution Board</h4>
        <p className="text-sm text-slate-400">Move initiatives across the launch pipeline.</p>
        <div className="mt-4">
          {columns.length > 0 ? (
            <KanbanBoard columns={columns} />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-8 text-center">
              <p className="text-sm text-slate-500">
                No workflow items yet. Create a plan and add steps to get started.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

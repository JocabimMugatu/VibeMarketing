"use client";

import { useState, useEffect } from "react";
import { Tactic } from "../../lib/types";
import { getTactics } from "../../lib/api";

const tiers = ["Foundation", "Growth", "Viral"] as const;
const tierColors: Record<string, string> = {
  Foundation: "border-slate-700 text-slate-400",
  Growth: "border-indigo-700 text-indigo-400",
  Viral: "border-emerald-700 text-emerald-400",
};

export default function TacticsPage() {
  const [tactics, setTactics] = useState<Tactic[]>([]);
  const [filteredTactics, setFilteredTactics] = useState<Tactic[]>([]);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTactics() {
      try {
        const data = await getTactics();
        setTactics(data.tactics);
        setFilteredTactics(data.tactics);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tactics");
      } finally {
        setIsLoading(false);
      }
    }

    loadTactics();
  }, []);

  useEffect(() => {
    if (selectedTier) {
      setFilteredTactics(tactics.filter((t) => t.tier === selectedTier));
    } else {
      setFilteredTactics(tactics);
    }
  }, [selectedTier, tactics]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
          <p className="mt-4 text-sm text-slate-500">Loading tactics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-800 bg-rose-950/30 p-6">
        <p className="text-rose-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Tactics Library</h3>
          <p className="text-sm text-slate-400">
            {tactics.length} launch plays prioritized by tier. Filter and expand as you scale to 100+.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTier(null)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              selectedTier === null
                ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                : "border-slate-700 text-slate-400 hover:border-slate-600"
            }`}
          >
            All
          </button>
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                selectedTier === tier
                  ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                  : tierColors[tier].replace("text-", "hover:text-").replace("border-", "hover:border-slate-") +
                    " " +
                    tierColors[tier]
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredTactics.map((tactic) => (
          <div
            key={tactic.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-white">{tactic.name}</h4>
              <span
                className={`rounded-full border px-3 py-1 text-xs ${
                  tierColors[tactic.tier]
                }`}
              >
                {tactic.tier}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-300">{tactic.summary}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">Impact</p>
            <p className="mt-1 text-sm text-slate-200">{tactic.impact}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tactic.channels.map((channel) => (
                <span
                  key={channel}
                  className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-400"
                >
                  {channel}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredTactics.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-8 text-center">
          <p className="text-sm text-slate-500">No tactics found for the selected tier.</p>
        </div>
      )}
    </div>
  );
}

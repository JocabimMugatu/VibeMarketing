"use client";

import { useState, useEffect } from "react";
import { Tactic } from "../../lib/types";
import { getTactics } from "../../lib/api";

const tiers = ["Foundation", "Growth", "Viral"] as const;
const tierBadgeConfig: Record<string, { base: string; active: string }> = {
  Foundation: {
    base: "badge-neutral",
    active: "border-neutral-500/50 bg-neutral-900/60 text-neutral-300",
  },
  Growth: {
    base: "border-primary-500/30 bg-primary-500/10 text-primary-300",
    active: "border-primary-500/50 bg-primary-900/20 text-primary-200",
  },
  Viral: {
    base: "border-accent-emerald-500/30 bg-accent-emerald-500/10 text-accent-emerald-300",
    active: "border-accent-emerald-500/50 bg-accent-emerald-900/20 text-accent-emerald-200",
  },
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
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-800 border-t-primary-500 mx-auto" />
          <p className="mt-4 text-sm text-neutral-500">Loading tactics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-elevated border-accent-rose-800 bg-accent-rose-950/20 p-6">
        <p className="text-accent-rose-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-white">Tactics Library</h3>
          <p className="mt-1 text-sm text-neutral-400">
            {tactics.length} launch plays prioritized by tier. Filter and expand as you scale to 100+.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTier(null)}
            className={`badge border px-4 py-2 text-xs font-medium transition-all duration-300 ${
              selectedTier === null
                ? "border-primary-500/50 bg-primary-500/20 text-primary-200 shadow-glow"
                : "border-neutral-700/50 bg-neutral-800/40 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300"
            }`}
          >
            All
          </button>
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`badge border px-4 py-2 text-xs font-medium transition-all duration-300 ${
                selectedTier === tier
                  ? tierBadgeConfig[tier].active + " shadow-glow"
                  : tierBadgeConfig[tier].base + " hover:opacity-80"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        {filteredTactics.map((tactic) => (
          <div
            key={tactic.id}
            className="card-elevated p-6 transition-all duration-300 hover:shadow-soft-lg hover:border-neutral-700/70"
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-base font-semibold tracking-tight text-white">{tactic.name}</h4>
              <span
                className={`badge ${tierBadgeConfig[tactic.tier].base} shrink-0`}
              >
                {tactic.tier}
              </span>
            </div>
            <p className="mt-4 text-sm text-neutral-300 leading-relaxed">{tactic.summary}</p>
            <p className="mt-5 text-[10px] uppercase tracking-[0.25em] text-neutral-500">Impact</p>
            <p className="mt-2 text-sm text-neutral-200 leading-relaxed">{tactic.impact}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {tactic.channels.map((channel) => (
                <span
                  key={channel}
                  className="badge-neutral text-[10px]"
                >
                  {channel}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredTactics.length === 0 && (
        <div className="card-subtle border-dashed border-neutral-800/40 p-10 text-center">
          <p className="text-sm text-neutral-500">No tactics found for the selected tier.</p>
        </div>
      )}
    </div>
  );
}

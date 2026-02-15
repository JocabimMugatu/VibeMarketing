import { tactics } from "../../lib/tactics";

const tiers = ["Foundation", "Growth", "Viral"] as const;

export default function TacticsPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Tactics Library</h3>
          <p className="text-sm text-slate-400">
            First 20 launch plays prioritized by tier. Filter and expand as you scale to 100+.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tiers.map((tier) => (
            <span
              key={tier}
              className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300"
            >
              {tier}
            </span>
          ))}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {tactics.map((tactic) => (
          <div key={tactic.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-white">{tactic.name}</h4>
              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
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
    </div>
  );
}

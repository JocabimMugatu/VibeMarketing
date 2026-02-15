import LogStream from "../components/LogStream";
import ProgressBar from "../components/ProgressBar";
import StatCard from "../components/StatCard";
import { LogEvent } from "../lib/types";

const logEvents: LogEvent[] = [
  {
    id: "log-1",
    timestamp: "2m ago",
    level: "success",
    message: "Ingestion completed for inbound waitlist campaign",
    source: "Ingest"
  },
  {
    id: "log-2",
    timestamp: "5m ago",
    level: "info",
    message: "Persona refresh: Added Growth PM archetype",
    source: "Context"
  },
  {
    id: "log-3",
    timestamp: "12m ago",
    level: "warning",
    message: "Launch channel overlap detected in paid social",
    source: "Magic Launch"
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-semibold text-white">Launch Overview</h3>
        <p className="text-sm text-slate-400">
          Pulse check on launch readiness, pipeline health, and execution velocity.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard label="Launch Readiness" value="82%" trend="+6% wk" />
          <StatCard label="Pipeline Coverage" value="$420k" trend="+14% wk" />
          <StatCard label="Retention Signals" value="7.4" trend="+0.8" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h4 className="text-sm font-semibold text-white">Quarterly Objectives</h4>
          <div className="mt-6 space-y-5">
            <ProgressBar label="Narrative Alignment" value={76} />
            <ProgressBar label="Activation Journey" value={58} />
            <ProgressBar label="Launch Assets" value={64} />
            <ProgressBar label="Channel Readiness" value={71} />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h4 className="text-sm font-semibold text-white">Key Focus</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>Finalize ICP messaging with sales enablement.</li>
            <li>Launch landing page variant B for testing.</li>
            <li>Prep partner co-marketing kit by Friday.</li>
            <li>Audit onboarding for drop-off risk.</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <LogStream title="Live Mission Log" events={logEvents} />
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h4 className="text-sm font-semibold text-white">Next Moves</h4>
          <div className="mt-4 space-y-4 text-sm text-slate-300">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Today</p>
              <p className="mt-2">Review context extraction and approve tactics shortlist.</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">This Week</p>
              <p className="mt-2">Lock launch narrative and content calendar.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

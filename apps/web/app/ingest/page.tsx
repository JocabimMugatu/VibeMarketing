import LogStream from "../../components/LogStream";
import ProgressBar from "../../components/ProgressBar";
import { LogEvent, ProjectContext } from "../../lib/types";

const sampleContext: ProjectContext = {
  productName: "VibeLaunch OS",
  summary: "An AI-assisted operating system for planning, launching, and scaling new products.",
  audience: "Growth leaders, founders, and product marketers preparing for launch.",
  valueProps: [
    "Context-aware launch planning",
    "Tactics library with launch-ready plays",
    "Live execution tracking"
  ],
  tone: "Confident, decisive, and data-driven",
  channels: ["Website", "Email", "PR", "Community"],
  constraints: ["Lean team", "14-day launch window"]
};

const logEvents: LogEvent[] = [
  {
    id: "ingest-1",
    timestamp: "Just now",
    level: "info",
    message: "Queued GitHub README fetch",
    source: "Ingestion"
  },
  {
    id: "ingest-2",
    timestamp: "1m ago",
    level: "success",
    message: "Context parser extracted core audience segments",
    source: "Parser"
  },
  {
    id: "ingest-3",
    timestamp: "3m ago",
    level: "warning",
    message: "Missing pricing details; flagged for manual input",
    source: "Parser"
  }
];

export default function IngestPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-8">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Project Ingestion</h3>
          <p className="text-sm text-slate-400">
            Drop a GitHub URL or paste a README to build the launch context.
          </p>
          <form className="mt-6 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                GitHub URL
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200"
                placeholder="https://github.com/org/repo"
                type="url"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Or paste README
              </label>
              <textarea
                className="mt-2 h-40 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200"
                placeholder="Paste README or product brief here..."
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white"
              >
                Start Ingestion
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-300"
              >
                Parse Context
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Context Output</h3>
          <p className="text-sm text-slate-400">Review and adjust the extracted context.</p>
          <div className="mt-6 space-y-4 text-sm text-slate-300">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Product</p>
              <p className="mt-2 text-base text-white">{sampleContext.productName}</p>
              <p className="mt-1">{sampleContext.summary}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Audience</p>
              <p className="mt-2">{sampleContext.audience}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Value Props</p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                {sampleContext.valueProps.map((prop) => (
                  <li key={prop}>{prop}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Constraints</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {sampleContext.constraints.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Ingestion Progress</h3>
          <div className="mt-6 space-y-4">
            <ProgressBar label="Fetch Repo" value={90} />
            <ProgressBar label="Parse Context" value={62} />
            <ProgressBar label="Generate Tactics" value={35} />
          </div>
        </section>
        <LogStream title="Parser Log" events={logEvents} />
      </div>
    </div>
  );
}

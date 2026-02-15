import { LogEvent } from "../lib/types";

interface LogStreamProps {
  title: string;
  events: LogEvent[];
}

const levelStyles: Record<LogEvent["level"], string> = {
  info: "text-slate-300",
  warning: "text-amber-300",
  error: "text-rose-300",
  success: "text-emerald-300"
};

export default function LogStream({ title, events }: LogStreamProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <span className="text-xs text-slate-500">Live</span>
      </div>
      <div className="mt-4 space-y-3 text-xs">
        {events.map((event) => (
          <div key={event.id} className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
            <div>
              <p className={`font-medium ${levelStyles[event.level]}`}>
                {event.message}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {event.timestamp} {event.source ? `• ${event.source}` : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogEvent } from "../lib/types";

interface LogStreamProps {
  title: string;
  events: LogEvent[];
}

const levelStyles: Record<LogEvent["level"], string> = {
  info: "text-slate-300",
  warning: "text-amber-300",
  error: "text-rose-300",
  success: "text-emerald-300",
};

const levelIcons: Record<LogEvent["level"], string> = {
  info: "●",
  warning: "▲",
  error: "✕",
  success: "✓",
};

export default function LogStream({ title, events }: LogStreamProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Live
        </span>
      </div>
      <div className="mt-4 space-y-3 text-xs max-h-64 overflow-y-auto pr-2">
        <AnimatePresence mode="popLayout">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{
                duration: 0.3,
                delay: index === 0 ? 0 : 0,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="flex items-start gap-3"
            >
              <span
                className={`mt-0.5 text-[10px] ${
                  event.level === "success"
                    ? "text-emerald-400"
                    : event.level === "warning"
                    ? "text-amber-400"
                    : event.level === "error"
                    ? "text-rose-400"
                    : "text-indigo-400"
                }`}
              >
                {levelIcons[event.level]}
              </span>
              <div className="flex-1">
                <p className={`font-medium ${levelStyles[event.level]}`}>{event.message}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  {event.timestamp} {event.source ? `• ${event.source}` : ""}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {events.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-500 text-center py-4"
          >
            No logs yet. Waiting for events...
          </motion.p>
        )}
      </div>
    </div>
  );
}

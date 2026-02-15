"use client";

import { motion } from "framer-motion";
import { WorkflowStep } from "../lib/types";

interface KanbanBoardProps {
  columns: Array<{
    title: WorkflowStep["status"];
    items: Array<{
      id: string;
      title: string;
      owner: string;
      due?: string;
    }>;
  }>;
}

const columnConfig: Record<string, { border: string; badge: string }> = {
  Backlog: {
    border: "border-neutral-700/50",
    badge: "bg-neutral-950/60 text-neutral-400 border-neutral-700/30",
  },
  "In Progress": {
    border: "border-primary-500/30",
    badge: "bg-primary-950/40 text-primary-300 border-primary-500/20",
  },
  Review: {
    border: "border-accent-amber-500/30",
    badge: "bg-accent-amber-950/40 text-accent-amber-300 border-accent-amber-500/20",
  },
  Shipped: {
    border: "border-accent-emerald-500/30",
    badge: "bg-accent-emerald-950/40 text-accent-emerald-300 border-accent-emerald-500/20",
  },
};

export default function KanbanBoard({ columns }: KanbanBoardProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {columns.map((column, colIndex) => {
        const config = columnConfig[column.title] || columnConfig.Backlog;

        return (
          <motion.div
            key={column.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: colIndex * 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className={`card-subtle border-t-2 ${config.border} p-4`}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                {column.title}
              </h4>
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${config.badge}`}>
                {column.items.length}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {column.items.map((item, itemIndex) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: colIndex * 0.1 + itemIndex * 0.05,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="card-elevated p-4 cursor-pointer transition-all duration-300 hover:shadow-soft-lg hover:border-neutral-700/70"
                >
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-neutral-400">{item.owner}</p>
                    {item.due && (
                      <span className="rounded-lg bg-neutral-950/60 px-2 py-1 text-[10px] text-neutral-500 border border-neutral-800/30">
                        {item.due}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
              {column.items.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-dashed border-neutral-800/40 p-6 text-center"
                >
                  <p className="text-xs text-neutral-600">No items</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

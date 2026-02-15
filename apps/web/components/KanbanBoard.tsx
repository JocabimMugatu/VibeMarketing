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

const columnColors: Record<string, string> = {
  Backlog: "border-slate-700",
  "In Progress": "border-indigo-700",
  Review: "border-amber-700",
  Shipped: "border-emerald-700",
};

const columnBgColors: Record<string, string> = {
  Backlog: "bg-slate-950/50",
  "In Progress": "bg-indigo-950/20",
  Review: "bg-amber-950/20",
  Shipped: "bg-emerald-950/20",
};

export default function KanbanBoard({ columns }: KanbanBoardProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {columns.map((column, colIndex) => (
        <motion.div
          key={column.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: colIndex * 0.1,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className={`rounded-2xl border ${columnColors[column.title]} bg-slate-900/50 p-4`}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {column.title}
            </h4>
            <span className="rounded-full bg-slate-950 px-2 py-0.5 text-[10px] text-slate-400">
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
                  duration: 0.3,
                  delay: colIndex * 0.1 + itemIndex * 0.05,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`rounded-xl border border-slate-800 ${columnBgColors[column.title]} p-4 transition-colors hover:border-slate-700 cursor-pointer`}
              >
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-slate-400">{item.owner}</p>
                  {item.due && (
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500">
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
                className="rounded-xl border border-dashed border-slate-800 p-4 text-center"
              >
                <p className="text-xs text-slate-600">No items</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

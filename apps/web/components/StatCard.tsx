"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
}

export default function StatCard({ label, value, trend }: StatCardProps) {
  // Determine if trend is positive
  const isPositive = trend.includes("+") || trend.includes("↑");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-colors hover:border-slate-700"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <div className="mt-4 flex items-end justify-between">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-semibold text-white"
        >
          {value}
        </motion.span>
        <motion.span
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className={`text-sm ${isPositive ? "text-emerald-300" : "text-rose-300"}`}
        >
          {trend}
        </motion.span>
      </div>
    </motion.div>
  );
}

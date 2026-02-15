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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="card-elevated p-6 transition-all duration-500 hover:border-primary-500/20 hover:shadow-soft-lg"
    >
      <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">{label}</p>
      <div className="mt-5 flex items-end justify-between">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl font-semibold tracking-tight text-white"
        >
          {value}
        </motion.span>
        <motion.span
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`text-sm font-medium ${
            isPositive ? "text-accent-emerald-400" : "text-accent-rose-400"
          }`}
        >
          {trend}
        </motion.span>
      </div>
    </motion.div>
  );
}

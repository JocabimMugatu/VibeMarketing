"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  label: string;
  value: number;
}

export default function ProgressBar({ label, value }: ProgressBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-neutral-500">
        <span className="font-medium">{label}</span>
        <span className="text-neutral-400">{value}%</span>
      </div>
      <div className="mt-2.5 h-2 w-full rounded-full bg-neutral-800/50 overflow-hidden backdrop-blur-sm">
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-lavender-400 shadow-glow"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        />
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

interface StepperItem {
  title: string;
  detail: string;
  status: "complete" | "active" | "upcoming";
}

interface StepperProps {
  items: StepperItem[];
}

export default function Stepper({ items }: StepperProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isComplete = item.status === "complete";
        const isActive = item.status === "active";

        const indicatorClass = isComplete
          ? "bg-accent-emerald-500 shadow-glow"
          : isActive
          ? "bg-gradient-to-r from-primary-500 to-accent-lavender-400 shadow-glow"
          : "bg-neutral-700";

        const textClass = isComplete
          ? "text-accent-emerald-300"
          : isActive
          ? "text-primary-200"
          : "text-neutral-500";

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className={`flex items-start gap-4 rounded-xl px-4 py-3 transition-all duration-300 ${
              isActive ? "bg-primary-500/5 border border-primary-500/10" : ""
            }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1 + 0.2,
                type: "spring",
                stiffness: 300,
              }}
              className={`mt-1 h-3 w-3 rounded-full ${indicatorClass}`}
            />
            <div className="flex-1">
              <p className={`text-sm font-semibold ${textClass}`}>
                {index + 1}. {item.title}
              </p>
              <p
                className={`mt-1 text-xs ${
                  item.status === "upcoming" ? "text-neutral-600" : "text-neutral-400"
                }`}
              >
                {item.detail}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

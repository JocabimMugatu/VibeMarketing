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
        const indicatorClass =
          item.status === "complete"
            ? "bg-emerald-500"
            : item.status === "active"
            ? "bg-indigo-500"
            : "bg-slate-700";

        const textClass =
          item.status === "complete"
            ? "text-emerald-300"
            : item.status === "active"
            ? "text-indigo-300"
            : "text-slate-500";

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="flex items-start gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1 + 0.2,
                type: "spring",
                stiffness: 300,
              }}
              className={`mt-1 h-3 w-3 rounded-full ${indicatorClass}`}
            />
            <div>
              <p className={`text-sm font-semibold ${textClass}`}>
                {index + 1}. {item.title}
              </p>
              <p
                className={`text-xs ${
                  item.status === "upcoming" ? "text-slate-600" : "text-slate-400"
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

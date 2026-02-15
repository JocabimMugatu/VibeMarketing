"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/ingest", label: "Ingestion" },
  { href: "/tactics", label: "Tactics Library" },
  { href: "/magic-launch", label: "Magic Launch" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-72 flex-col border-r border-neutral-800/30 bg-neutral-950/50 backdrop-blur-xl px-6 py-8">
      <div className="mb-12">
        <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">VibeLaunch OS</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gradient">
          CMO Command
        </h1>
      </div>
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between rounded-2xl px-5 py-3.5 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-primary-500/10 to-transparent border border-primary-500/20 text-primary-200 shadow-glow"
                  : "text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-100 border border-transparent"
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`text-xs transition-all duration-300 ${
                  isActive ? "text-primary-300" : "text-neutral-600 group-hover:text-neutral-400"
                }`}
              >
                ↗
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto card-subtle p-5">
        <p className="text-xs font-medium text-neutral-300">Launch Status</p>
        <p className="mt-3 text-xs leading-relaxed text-neutral-500">
          Next sprint kickoff in 2 days. <span className="text-neutral-400">3 initiatives in review.</span>
        </p>
        <div className="mt-4 h-1.5 w-full rounded-full bg-neutral-800">
          <div className="h-1.5 w-3/5 rounded-full bg-gradient-to-r from-primary-500 to-accent-lavender-400" />
        </div>
      </div>
    </aside>
  );
}

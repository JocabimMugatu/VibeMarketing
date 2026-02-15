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
    <aside className="flex h-full w-64 flex-col border-r border-slate-800 bg-slate-950 px-6 py-8">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">VibeLaunch OS</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">CMO Command</h1>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
              }`}
            >
              <span>{item.label}</span>
              <span className="text-xs text-slate-500">↗</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300">
        <p className="font-semibold text-white">Launch Status</p>
        <p className="mt-2">Next sprint kickoff in 2 days. 3 initiatives in review.</p>
      </div>
    </aside>
  );
}

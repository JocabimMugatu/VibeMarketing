"use client";

export default function Topbar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 px-8 py-6">
      <div>
        <p className="text-sm text-slate-400">Welcome back</p>
        <h2 className="text-2xl font-semibold text-white">CMO Mission Control</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
          Launch Window: 14 days
        </div>
        <div className="rounded-full bg-indigo-500/20 px-4 py-2 text-sm text-indigo-200">
          Dark mode
        </div>
      </div>
    </div>
  );
}

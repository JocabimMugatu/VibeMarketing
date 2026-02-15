"use client";

export default function Topbar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/30 px-10 py-6 backdrop-blur-sm">
      <div>
        <p className="text-sm text-neutral-500">Welcome back</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">CMO Mission Control</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="badge-neutral border-neutral-700/50 bg-neutral-900/50 px-5 py-2.5 text-sm">
          Launch Window: 14 days
        </div>
        <div className="badge-primary px-5 py-2.5 text-sm">
          ✨ Dark mode
        </div>
      </div>
    </div>
  );
}

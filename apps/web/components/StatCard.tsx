interface StatCardProps {
  label: string;
  value: string;
  trend: string;
}

export default function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <div className="mt-4 flex items-end justify-between">
        <span className="text-3xl font-semibold text-white">{value}</span>
        <span className="text-sm text-emerald-300">{trend}</span>
      </div>
    </div>
  );
}

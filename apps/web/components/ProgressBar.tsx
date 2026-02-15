interface ProgressBarProps {
  label: string;
  value: number;
}

export default function ProgressBar({ label, value }: ProgressBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-500">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-slate-800">
        <div
          className="h-2 rounded-full bg-indigo-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

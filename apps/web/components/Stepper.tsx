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
        return (
          <div key={item.title} className="flex items-start gap-4">
            <div className={`mt-1 h-3 w-3 rounded-full ${indicatorClass}`} />
            <div>
              <p className="text-sm font-semibold text-white">
                {index + 1}. {item.title}
              </p>
              <p className="text-xs text-slate-400">{item.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

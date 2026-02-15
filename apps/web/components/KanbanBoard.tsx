import { WorkflowStep } from "../lib/types";

interface KanbanBoardProps {
  columns: Array<{
    title: WorkflowStep["status"];
    items: WorkflowStep[];
  }>;
}

export default function KanbanBoard({ columns }: KanbanBoardProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {columns.map((column) => (
        <div key={column.title} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {column.title}
          </h4>
          <div className="mt-4 space-y-3">
            {column.items.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-xs text-slate-400">Owner: {item.owner}</p>
                {item.due ? <p className="text-xs text-slate-500">Due {item.due}</p> : null}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

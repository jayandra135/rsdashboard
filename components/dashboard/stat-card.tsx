import type { LucideIcon } from "lucide-react";

export function StatCard(props: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
}) {
  const Icon = props.icon;

  return (
    <div className="card-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{props.label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{props.value}</p>
          {props.hint ? <p className="mt-2 text-xs text-slate-500">{props.hint}</p> : null}
        </div>
        <div className="rounded-2xl bg-brand-50 p-3 text-brand-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

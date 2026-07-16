import type { ReactNode } from "react";

export function PageHeader(props: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-slate-950">{props.title}</h1>
        {props.description ? <p className="mt-2 text-slate-600">{props.description}</p> : null}
      </div>
      {props.actions ? <div className="flex flex-wrap gap-3">{props.actions}</div> : null}
    </div>
  );
}

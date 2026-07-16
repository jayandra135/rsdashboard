import type { ReactNode } from "react";

export function DataTable(props: {
  headers: string[];
  children: ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
}) {
  return (
    <div className="card-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              {props.headers.map((header) => (
                <th key={header} className="px-4 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{props.isEmpty ? null : props.children}</tbody>
        </table>
      </div>
      {props.isEmpty ? (
        <div className="px-4 py-10 text-center text-sm text-slate-500">
          {props.emptyMessage ?? "No records found."}
        </div>
      ) : null}
    </div>
  );
}

export function DataTableRow(props: { children: ReactNode }) {
  return <tr className="border-b border-slate-100 last:border-0">{props.children}</tr>;
}

export function DataTableCell(props: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-slate-700 ${props.className ?? ""}`}>{props.children}</td>;
}

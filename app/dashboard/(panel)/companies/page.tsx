"use client";

import { useQuery } from "@tanstack/react-query";

import { DataTable, DataTableCell, DataTableRow } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { getCompanies } from "@/services/jobs";

export default function DashboardCompaniesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  if (isLoading) {
    return <p className="text-slate-600">Loading companies...</p>;
  }

  return (
    <div>
      <PageHeader
        title="Companies"
        description="Review hiring organizations and their active job counts."
      />
      <DataTable headers={["Name", "Industry", "Headquarters", "Jobs"]} isEmpty={!data?.length}>
        {data?.map((company) => (
          <DataTableRow key={company.id}>
            <DataTableCell className="font-medium text-slate-900">{company.name}</DataTableCell>
            <DataTableCell>{company.industry ?? "—"}</DataTableCell>
            <DataTableCell>{company.headquarters ?? "—"}</DataTableCell>
            <DataTableCell>{company._count?.jobs ?? 0}</DataTableCell>
          </DataTableRow>
        ))}
      </DataTable>
    </div>
  );
}

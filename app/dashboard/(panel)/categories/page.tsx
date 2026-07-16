"use client";

import { useQuery } from "@tanstack/react-query";

import { DataTable, DataTableCell, DataTableRow } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { getCategories } from "@/services/jobs";

export default function DashboardCategoriesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isLoading) {
    return <p className="text-slate-600">Loading categories...</p>;
  }

  return (
    <div>
      <PageHeader title="Categories" description="Manage job categories used across listings." />
      <DataTable headers={["Name", "Slug", "Jobs"]} isEmpty={!data?.length}>
        {data?.map((category) => (
          <DataTableRow key={category.id}>
            <DataTableCell className="font-medium text-slate-900">{category.name}</DataTableCell>
            <DataTableCell>{category.slug}</DataTableCell>
            <DataTableCell>{category._count?.jobs ?? 0}</DataTableCell>
          </DataTableRow>
        ))}
      </DataTable>
    </div>
  );
}

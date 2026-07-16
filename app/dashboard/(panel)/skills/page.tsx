"use client";

import { useQuery } from "@tanstack/react-query";

import { DataTable, DataTableCell, DataTableRow } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { getSkills } from "@/services/jobs";

export default function DashboardSkillsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
  });

  if (isLoading) {
    return <p className="text-slate-600">Loading skills...</p>;
  }

  return (
    <div>
      <PageHeader title="Skills" description="Review skills attached to job listings." />
      <DataTable headers={["Name", "Slug", "Assignments"]} isEmpty={!data?.length}>
        {data?.map((skill) => (
          <DataTableRow key={skill.id}>
            <DataTableCell className="font-medium text-slate-900">{skill.name}</DataTableCell>
            <DataTableCell>{skill.slug}</DataTableCell>
            <DataTableCell>{skill._count?.jobs ?? 0}</DataTableCell>
          </DataTableRow>
        ))}
      </DataTable>
    </div>
  );
}

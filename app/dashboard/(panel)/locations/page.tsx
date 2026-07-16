"use client";

import { useQuery } from "@tanstack/react-query";

import { DataTable, DataTableCell, DataTableRow } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { getLocations } from "@/services/jobs";

export default function DashboardLocationsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: getLocations,
  });

  if (isLoading) {
    return <p className="text-slate-600">Loading locations...</p>;
  }

  return (
    <div>
      <PageHeader title="Locations" description="Review locations used for job filtering and display." />
      <DataTable headers={["City", "State", "Country", "Type", "Jobs"]} isEmpty={!data?.length}>
        {data?.map((location) => (
          <DataTableRow key={location.id}>
            <DataTableCell>{location.city ?? "—"}</DataTableCell>
            <DataTableCell>{location.state ?? "—"}</DataTableCell>
            <DataTableCell>{location.country}</DataTableCell>
            <DataTableCell>{location.workplaceType}</DataTableCell>
            <DataTableCell>{location._count?.jobs ?? 0}</DataTableCell>
          </DataTableRow>
        ))}
      </DataTable>
    </div>
  );
}

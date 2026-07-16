"use client";

import { useQuery } from "@tanstack/react-query";

import { DataTable, DataTableCell, DataTableRow } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { getAdminUsers } from "@/services/admin";

export default function DashboardUsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => getAdminUsers(1, 50),
  });

  if (isLoading) {
    return <p className="text-slate-600">Loading users...</p>;
  }

  return (
    <div>
      <PageHeader title="Users" description="Monitor registered users and engagement activity." />
      <DataTable
        headers={["Name", "Email", "Role", "Status", "Bookmarks", "Joined"]}
        isEmpty={!data?.items.length}
      >
        {data?.items.map((user) => (
          <DataTableRow key={user.id}>
            <DataTableCell className="font-medium text-slate-900">
              {user.firstName} {user.lastName}
            </DataTableCell>
            <DataTableCell>{user.email}</DataTableCell>
            <DataTableCell>{user.role}</DataTableCell>
            <DataTableCell>{user.isActive ? "Active" : "Inactive"}</DataTableCell>
            <DataTableCell>{user._count?.bookmarks ?? 0}</DataTableCell>
            <DataTableCell>{new Date(user.createdAt).toLocaleDateString()}</DataTableCell>
          </DataTableRow>
        ))}
      </DataTable>
    </div>
  );
}

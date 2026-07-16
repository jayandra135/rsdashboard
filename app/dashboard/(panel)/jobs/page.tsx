"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "react-hot-toast";

import { DataTable, DataTableCell, DataTableRow } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { deleteAdminJob, getAdminJobs } from "@/services/admin";

export default function DashboardJobsPage() {
  const queryClient = useQueryClient();
  const jobsQuery = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: () => getAdminJobs({ limit: 50, sortBy: "newest" }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminJob,
    onSuccess: async () => {
      toast.success("Job archived");
      await queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
    },
    onError: () => {
      toast.error("Unable to archive job");
    },
  });

  return (
    <div>
      <PageHeader
        title="Manage Jobs"
        description="Create, update, publish, and archive job listings."
        actions={
          <Link href="/dashboard/jobs/new" className="btn-primary">
            Add Job
          </Link>
        }
      />

      <DataTable
        headers={["Title", "Company", "Status", "Featured", "Actions"]}
        isEmpty={!jobsQuery.data?.items.length}
      >
        {jobsQuery.data?.items.map((job) => (
          <DataTableRow key={job.id}>
            <DataTableCell>
              <Link href={`/dashboard/jobs/${job.id}/edit`} className="font-medium text-brand-600">
                {job.title}
              </Link>
            </DataTableCell>
            <DataTableCell>{job.company.name}</DataTableCell>
            <DataTableCell>{job.status}</DataTableCell>
            <DataTableCell>{job.isFeatured ? "Yes" : "No"}</DataTableCell>
            <DataTableCell>
              <div className="flex gap-2">
                <Link href={`/dashboard/jobs/${job.id}/edit`} className="text-sm text-brand-600">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(job.id)}
                  className="text-sm text-red-600"
                >
                  Archive
                </button>
              </div>
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTable>
    </div>
  );
}

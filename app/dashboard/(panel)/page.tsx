"use client";

import { useQuery } from "@tanstack/react-query";
import { Bookmark, BriefcaseBusiness, Building2, Eye, Share2 } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable, DataTableCell, DataTableRow } from "@/components/dashboard/data-table";
import { getDashboardSummary } from "@/services/admin";

export default function DashboardOverviewPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
  });

  if (isLoading || !data) {
    return <p className="text-slate-600">Loading dashboard analytics...</p>;
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Monitor platform activity, recent jobs, and engagement metrics."
        actions={
          <Link href="/dashboard/jobs/new" className="btn-primary">
            Create Job
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Jobs" value={data.totalJobs} icon={BriefcaseBusiness} />
        <StatCard label="Total Companies" value={data.totalCompanies} icon={Building2} />
        <StatCard label="Total Views" value={data.totalViews} icon={Eye} />
        <StatCard label="Total Shares" value={data.totalShares} icon={Share2} />
        <StatCard label="Bookmarks" value={data.totalBookmarks} icon={Bookmark} />
        <StatCard label="Today's Jobs" value={data.todaysJobs} icon={BriefcaseBusiness} />
        <StatCard label="Registered Users" value={data.totalUsers} icon={Building2} />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-slate-950">Recent Jobs</h2>
        <DataTable
          headers={["Title", "Company", "Category", "Status", "Created"]}
          isEmpty={data.recentJobs.length === 0}
        >
          {data.recentJobs.map((job) => (
            <DataTableRow key={job.id}>
              <DataTableCell>
                <Link href={`/dashboard/jobs/${job.id}/edit`} className="font-medium text-brand-600">
                  {job.title}
                </Link>
              </DataTableCell>
              <DataTableCell>{job.company.name}</DataTableCell>
              <DataTableCell>{job.category.name}</DataTableCell>
              <DataTableCell>{job.status}</DataTableCell>
              <DataTableCell>{new Date(job.createdAt).toLocaleDateString()}</DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
      </div>
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { JobForm } from "@/features/dashboard/job-form";
import { getAdminJob } from "@/services/admin";

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const jobQuery = useQuery({
    queryKey: ["admin-job", id],
    queryFn: () => getAdminJob(id),
  });

  if (jobQuery.isLoading) {
    return <p className="text-slate-600">Loading job...</p>;
  }

  if (!jobQuery.data) {
    return <p className="text-slate-600">Job not found.</p>;
  }

  return (
    <div>
      <PageHeader title="Edit Job" description="Update job details, status, and referral settings." />
      <JobForm job={jobQuery.data} />
    </div>
  );
}

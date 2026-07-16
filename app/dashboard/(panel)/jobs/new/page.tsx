import { PageHeader } from "@/components/dashboard/page-header";
import { JobForm } from "@/features/dashboard/job-form";

export default function NewJobPage() {
  return (
    <div>
      <PageHeader title="Create Job" description="Publish a new referral-ready job listing." />
      <JobForm />
    </div>
  );
}

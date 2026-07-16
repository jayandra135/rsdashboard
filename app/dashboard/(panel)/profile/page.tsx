"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardProfilePage() {
  const { admin } = useAuth();

  return (
    <div>
      <PageHeader title="Profile" description="Your admin account details and role information." />
      <div className="card-surface grid gap-4 p-6 md:grid-cols-2">
        <div>
          <p className="text-sm text-slate-500">Full name</p>
          <p className="mt-1 font-medium text-slate-900">
            {admin ? `${admin.firstName} ${admin.lastName}` : "—"}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Email</p>
          <p className="mt-1 font-medium text-slate-900">{admin?.email ?? "—"}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Role</p>
          <p className="mt-1 font-medium text-slate-900">{admin?.role ?? "—"}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Admin ID</p>
          <p className="mt-1 font-medium text-slate-900">{admin?.id ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}

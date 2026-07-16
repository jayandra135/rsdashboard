"use client";

import { PageHeader } from "@/components/dashboard/page-header";

export default function DashboardSettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Platform configuration and operational preferences."
      />
      <div className="card-surface space-y-6 p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">General</h2>
          <p className="mt-2 text-sm text-slate-600">
            Notification routing, default job status, and moderation preferences will be managed
            here in a later settings expansion.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Security</h2>
          <p className="mt-2 text-sm text-slate-600">
            Session cookies, password reset flows, and role policies are enforced by the backend
            auth layer.
          </p>
        </div>
      </div>
    </div>
  );
}

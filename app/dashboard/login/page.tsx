import { DashboardLoginForm } from "@/features/dashboard-login-form";

export default function DashboardLoginPage() {
  return (
    <div className="section-space">
      <div className=" mx-auto max-w-lg p-5">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-slate-950">
            Dashboard Login
          </h1>
          <p className="mt-3 text-slate-600">
            Sign in with your admin credentials to manage jobs and analytics.
          </p>
        </div>
        <DashboardLoginForm />
      </div>
    </div>
  );
}

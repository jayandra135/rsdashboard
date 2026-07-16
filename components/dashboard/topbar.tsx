"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { useAuth } from "@/hooks/use-auth";
import { logoutAdmin } from "@/services/auth";

export function DashboardTopbar() {
  const router = useRouter();
  const { admin, clearAuth } = useAuth();

  async function handleLogout() {
    try {
      await logoutAdmin();
      clearAuth();
      toast.success("Logged out");
      router.push("/dashboard/login");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    }
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <p className="text-sm text-slate-500">Signed in as</p>
        <p className="font-medium text-slate-900">
          {admin ? `${admin.firstName} ${admin.lastName}` : "Administrator"}
        </p>
      </div>
      <button
        type="button"
        onClick={() => void handleLogout()}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </header>
  );
}

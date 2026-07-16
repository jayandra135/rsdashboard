"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getAdminProfile } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";

export function useAuth() {
  const admin = useAuthStore((state) => state.admin);
  const setAdmin = useAuthStore((state) => state.setAdmin);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const profileQuery = useQuery({
    queryKey: ["admin-profile"],
    queryFn: getAdminProfile,
    retry: false,
    staleTime: 5 * 60_000,
  });

  useEffect(() => {
    if (profileQuery.data) {
      setAdmin(profileQuery.data);
    }
  }, [profileQuery.data, setAdmin]);

  useEffect(() => {
    if (profileQuery.isError) {
      clearAuth();
    }
  }, [profileQuery.isError, clearAuth]);

  return {
    admin: admin ?? profileQuery.data ?? null,
    isLoading: profileQuery.isLoading,
    isAuthenticated: Boolean(admin ?? profileQuery.data),
    refetch: profileQuery.refetch,
    clearAuth,
  };
}

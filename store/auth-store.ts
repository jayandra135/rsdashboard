"use client";

import { create } from "zustand";

import type { AdminProfile } from "@/types/auth";

interface AuthStore {
  admin: AdminProfile | null;
  isAuthenticated: boolean;
  setAdmin: (admin: AdminProfile | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  admin: null,
  isAuthenticated: false,
  setAdmin: (admin) =>
    set({
      admin,
      isAuthenticated: Boolean(admin),
    }),
  clearAuth: () =>
    set({
      admin: null,
      isAuthenticated: false,
    }),
}));

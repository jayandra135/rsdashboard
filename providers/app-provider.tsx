"use client";

import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import { QueryProvider } from "./query-provider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toaster position="top-right" />
    </QueryProvider>
  );
}

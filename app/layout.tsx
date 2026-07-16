import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppProvider } from "@/providers/app-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Job Referral Admin",
    template: "%s | Job Referral Admin",
  },
  description: "Admin dashboard for managing jobs, companies, categories, and users.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

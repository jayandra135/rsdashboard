import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="section-space">
      <div className="container-shell max-w-2xl text-center">
        <p className="text-sm font-medium text-brand-600">404</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-950">Page not found</h1>
        <p className="mt-4 text-slate-600">
          The page you requested does not exist or may have moved.
        </p>
        <div className="mt-8">
          <Link href="/dashboard" className="btn-primary">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

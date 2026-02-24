"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import type { RecentApplication } from "@/app/dashboard/types";

interface RecentApplicationsTableProps {
  applications: RecentApplication[];
}

export default function RecentApplicationsTable({
  applications,
}: RecentApplicationsTableProps) {
  if (applications.length === 0) {
    return (
      <div className="bento-card p-8 text-center">
        <FileText className="w-10 h-10 text-foreground/30 mx-auto mb-3" />
        <h3 className="text-lg font-medium mb-1">No applications yet</h3>
        <p className="text-sm text-foreground/60 mb-4">
          Start your first loan application today
        </p>
        <Link
          href="/dashboard/application-type"
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          New Application
        </Link>
      </div>
    );
  }

  return (
    <div className="bento-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Recent Applications</h2>
          <p className="text-sm text-foreground/60">
            Your latest submitted applications
          </p>
        </div>
        <Link
          href="/dashboard/applications"
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full applications-table">
          <thead>
            <tr className="text-left text-sm text-foreground/60 border-b border-border">
              <th className="pb-3 font-medium">Reference</th>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Submitted</th>
              <th className="pb-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {applications.map((app) => (
              <tr
                key={app.id}
                className="group hover:bg-card/80 transition-colors"
              >
                <td className="py-3 font-medium">#{app.reference}</td>
                <td className="py-3">
                  {app.type === "SME" ? "SME Working Capital" : "Payroll Loan"}
                </td>
                <td className="py-3 font-medium">
                  MWK {app.amount.toLocaleString()}
                </td>
                <td className="py-3">
                  <span
                    className="status-chip"
                    data-status={app.status.toLowerCase().replace("_", "-")}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="py-3 text-foreground/60">
                  {app.submittedAt
                    ? new Date(app.submittedAt).toLocaleDateString()
                    : new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 text-right">
                  <Link
                    href={`/dashboard/applications/${app.id}`}
                    className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
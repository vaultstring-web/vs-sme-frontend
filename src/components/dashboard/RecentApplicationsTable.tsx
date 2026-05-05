"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { RecentApplication } from "@/app/dashboard/types";
import NewApplicationModal from "@/components/modals/NewApplicationModal";
import ResponsiveTable from "@/components/ui/ResponsiveTable";

interface RecentApplicationsTableProps {
  applications: RecentApplication[];
}

export default function RecentApplicationsTable({
  applications,
}: RecentApplicationsTableProps) {
  // 1. Add state to handle modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (applications.length === 0) {
    return (
      <div className="bento-card p-8 text-center">
        <FileText className="w-10 h-10 text-foreground/30 mx-auto mb-3" />
        <h3 className="text-lg font-medium mb-1">No applications yet</h3>
        <p className="text-sm text-foreground/60 mb-4">
          Start your first loan application today
        </p>
        
        {/* 2. Changed from Link to Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          New Application
        </button>

        {/* 3. Include the modal here */}
        <NewApplicationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    );
  }

  return (
    <>
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

        <ResponsiveTable
          mobileCards={
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="space-y-2 rounded-xl border border-border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium">#{app.reference}</span>
                    <Link
                      href={`/dashboard/applications/${app.id}`}
                      className="text-sm font-medium text-primary-600 dark:text-primary-400"
                    >
                      View
                    </Link>
                  </div>
                  <p className="text-sm text-foreground/80">
                    {app.type === "SME" ? "SME Working Capital" : "Payroll Loan"}
                  </p>
                  <p className="font-medium">MWK {app.amount.toLocaleString()}</p>
                  <span
                    className="status-chip"
                    data-status={app.status.toLowerCase().replace("_", "-")}
                  >
                    {app.status}
                  </span>
                  <p className="text-xs text-foreground/60">
                    {app.submittedAt
                      ? new Date(app.submittedAt).toLocaleDateString()
                      : new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          }
          table={
          <table className="applications-table hidden w-full min-w-[640px] md:table">
            <thead>
              <tr className="border-b border-border text-left text-sm text-foreground/60">
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
                  className="group transition-colors hover:bg-card/80"
                >
                  <td className="py-3 font-medium">#{app.reference}</td>
                  <td className="py-3">
                    {app.type === "SME" ? "SME Working Capital" : "Payroll Loan"}
                  </td>
                  <td className="py-3 font-medium whitespace-nowrap">
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
                  <td className="py-3 text-foreground/60 sm:whitespace-nowrap">
                    {app.submittedAt
                      ? new Date(app.submittedAt).toLocaleDateString()
                      : new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-left md:text-right">
                    <Link
                      href={`/dashboard/applications/${app.id}`}
                      className="text-sm text-primary-600 hover:underline dark:text-primary-400"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          }
        />
      </div>

      {/* 4. Include the modal for the non-empty state as well */}
      <NewApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
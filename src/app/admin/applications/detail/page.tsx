'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminApplicationDetailClient from '@/components/admin/applications/AdminApplicationDetailClient';

function ApplicationDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>No application ID provided.</p>
        <a href="/admin/applications" className="text-primary-600 hover:underline mt-2 inline-block">
          Return to Applications
        </a>
      </div>
    );
  }

  return <AdminApplicationDetailClient id={id} />;
}

export default function AdminApplicationDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ApplicationDetailContent />
    </Suspense>
  );
}

'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminUserDetailClient from '@/components/admin/users/AdminUserDetailClient';

function UserDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>No user ID provided.</p>
        <a href="/admin/users" className="text-primary-600 hover:underline mt-2 inline-block">
          Return to User Management
        </a>
      </div>
    );
  }

  return <AdminUserDetailClient id={id} />;
}

export default function AdminUserDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading user details...</div>}>
      <UserDetailContent />
    </Suspense>
  );
}

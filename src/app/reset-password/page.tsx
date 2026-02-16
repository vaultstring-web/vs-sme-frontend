// src/app/reset-password/page.tsx
import { Suspense } from 'react';
import PasswordResetClient from './PasswordResetClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12">Loading...</div>}>
      <PasswordResetClient />
    </Suspense>
  );
}
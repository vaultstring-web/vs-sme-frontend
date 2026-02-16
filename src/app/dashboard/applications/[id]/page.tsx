// src/app/dashboard/applications/[id]/page.tsx
import { notFound } from 'next/navigation';
import ApplicationDetailClient from './ApplicationDetailClient';
import type { ApplicationDetail } from '@/context/ApplicationsContext';

// ------------------------------------------------------------
// 1. Tell Next.js which [id] pages to generate at build time.
//    For static export, you MUST return at least one ID.
//    Replace this with real API calls if your backend allows
//    unauthenticated read access or you have a build‑time token.
// ------------------------------------------------------------
export async function generateStaticParams() {
  // Option A: Real data (requires server‑side API with credentials)
  // const apps = await fetchAllApplicationIdsFromAPI();
  // return apps.map((id) => ({ id }));

  // Option B: Placeholder – the client will fetch the real data
  return [{ id: 'placeholder' }];
}

// ------------------------------------------------------------
// 2. Server‑side data fetching (runs at build time for each ID).
//    In static export, you usually CANNOT fetch authenticated user data.
//    We return `null` – the client will load the real application.
// ------------------------------------------------------------
async function getApplication(id: string): Promise<ApplicationDetail | null> {
  // If you have a public endpoint or can use a build‑time API key:
  // const res = await fetch(`${process.env.API_URL}/applications/${id}`, {
  //   headers: { Authorization: `Bearer ${process.env.BUILD_API_KEY}` }
  // });
  // if (!res.ok) return null;
  // return res.json();

  // For now: placeholder – no data at build time
  return null;
}

// ------------------------------------------------------------
// 3. Server Component – receives params, fetches data, renders Client Component
// ------------------------------------------------------------
export default async function Page({ params }: { params: { id: string } }) {
  const application = await getApplication(params.id);

  // If the ID is not found and you don't want to pre‑render an error page,
  // you can still render the client component – it will handle missing data.
  // Optionally uncomment to return 404:
  // if (!application && params.id !== 'placeholder') notFound();

  return (
    <ApplicationDetailClient
      initialApplication={application ?? undefined}
      applicationId={params.id}
    />
  );
}
'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import apiClient from '@/lib/apiClient';

/**
 * Edit route for draft applications
 * This page redirects to the appropriate form (SME or Payroll) based on the application type
 */
export default function EditApplicationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (!id) {
      router.push('/dashboard/applications');
      return;
    }

    // Fetch the application to determine its type
    const fetchApplicationAndRedirect = async () => {
      try {
        console.log('Fetching application:', id);
        
        const response = await apiClient.get(`/applications/${id}`);
        console.log('Application data:', response.data);
        
        const application = response.data.app;

        // Check if it's a draft
        if (application.status !== 'DRAFT') {
          console.log('Not a draft, redirecting to detail page');
          // If not a draft, redirect to the detail page
          router.push(`/dashboard/applications/${id}`);
          return;
        }

        console.log('Application type:', application.type);
        
        // Redirect to the appropriate form based on type
        if (application.type === 'SME') {
          console.log('Redirecting to SME form with id:', id);
          router.push(`/dashboard/sme?id=${id}`);
        } else if (application.type === 'PAYROLL') {
          console.log('Redirecting to Payroll form with id:', id);
          router.push(`/dashboard/payroll?id=${id}`);
        } else {
          console.log('Unknown type, redirecting to applications list');
          // Unknown type, redirect to applications list
          router.push('/dashboard/applications');
        }
      } catch (error) {
        console.error('Error fetching application:', error);
        alert(`Error loading draft: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // On error, redirect to applications list
        router.push('/dashboard/applications');
      }
    };

    fetchApplicationAndRedirect();
  }, [id, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
        <p className="text-foreground/60">Loading application...</p>
      </div>
    </div>
  );
}

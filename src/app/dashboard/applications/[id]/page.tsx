import ApplicationDetailClient from './ApplicationDetailClient';

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  return <ApplicationDetailClient applicationId={params.id} />;
}

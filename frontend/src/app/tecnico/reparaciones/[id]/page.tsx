import { Suspense } from 'react';
import TecnicoReparacionDetailClient from '@/components/tecnico/TecnicoReparacionDetailClient';

export default async function TecnicoReparacionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TecnicoReparacionDetailClient ticketId={id} />
    </Suspense>
  );
}

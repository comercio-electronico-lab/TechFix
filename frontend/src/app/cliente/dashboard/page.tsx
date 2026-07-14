import { Suspense } from 'react';
import ClienteDashboardClient from '@/components/dashboard/ClienteDashboardClient';

export default function ClienteDashboard() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ClienteDashboardClient />
    </Suspense>
  );
}

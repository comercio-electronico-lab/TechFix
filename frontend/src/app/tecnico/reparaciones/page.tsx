import { Suspense } from 'react';
import TecnicoReparacionesClient from '@/components/tecnico/TecnicoReparacionesClient';

export default function TecnicoReparacionesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TecnicoReparacionesClient />
    </Suspense>
  );
}

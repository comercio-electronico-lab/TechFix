import { Suspense } from 'react';
import TecnicoHistorialClient from '@/components/tecnico/TecnicoHistorialClient';

export default function TecnicoHistorialPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TecnicoHistorialClient />
    </Suspense>
  );
}

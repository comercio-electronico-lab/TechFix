import { Suspense } from 'react';
import TecnicoInventarioClient from '@/components/tecnico/TecnicoInventarioClient';

export default function TecnicoInventarioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TecnicoInventarioClient />
    </Suspense>
  );
}

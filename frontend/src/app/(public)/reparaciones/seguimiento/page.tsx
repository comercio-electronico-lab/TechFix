import { Suspense } from 'react';
import RepairTrackingClient from '@/components/repair/RepairTrackingClient';

export default function RepairTracking() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-surface dark:bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent dark:border-sky-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-on-surface-variant dark:text-slate-400 text-sm">Cargando seguimiento de reparación...</p>
        </div>
      </div>
    }>
      <RepairTrackingClient />
    </Suspense>
  );
}

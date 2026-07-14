import { Suspense } from 'react';
import ReparacionesWrapper from '@/components/repair/ReparacionesWrapper';

export default function ReparacionesPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] py-6 md:py-12 px-4 md:px-gutter bg-surface-bright dark:bg-slate-950 transition-colors duration-300 flex justify-center">
      <div className="max-w-5xl w-full space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-500">
        <Suspense fallback={
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-primary dark:border-sky-500 border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <ReparacionesWrapper />
        </Suspense>
      </div>
    </div>
  );
}

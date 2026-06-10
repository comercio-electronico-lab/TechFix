import CatalogoClient from '@/components/sections/CatalogoClient';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Catálogo de Productos | Laboratorio L1',
  description: 'Encuentra los mejores productos tecnológicos y repuestos.',
};

export default function CatalogoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-surface-bright dark:bg-slate-950">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent dark:border-sky-400 dark:border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-450 dark:text-slate-500">Cargando catálogo...</p>
        </div>
      </div>
    }>
      <CatalogoClient />
    </Suspense>
  );
}

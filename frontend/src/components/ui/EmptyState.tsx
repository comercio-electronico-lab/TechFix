'use client';

import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  title = 'Ningún resultado encontrado',
  description = 'Prueba ajustando los filtros para ver más resultados.',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-outline-variant/70 dark:border-slate-800 rounded-lg bg-surface dark:bg-slate-900/5">
      <div className="p-4 bg-primary/5 dark:bg-sky-500/5 rounded-full">
        <SlidersHorizontal className="w-10 h-10 text-primary/60 dark:text-sky-400/60" />
      </div>
      <div className="space-y-2">
        <h3 className="text-base font-bold text-on-surface dark:text-white">{title}</h3>
        <p className="text-xs text-on-surface-variant dark:text-slate-400 max-w-sm mx-auto">{description}</p>
      </div>
      {action}
    </div>
  );
}

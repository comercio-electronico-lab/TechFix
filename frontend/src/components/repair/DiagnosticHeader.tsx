'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';

interface DiagnosticHeaderProps {
  step: number;
  onBack: () => void;
  progressPercentage: number;
}

export default function DiagnosticHeader({ step, onBack, progressPercentage }: DiagnosticHeaderProps) {
  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white/95 dark:bg-slate-900/95 border-b border-outline-variant/30 dark:border-slate-800/80 backdrop-blur-md transition-colors duration-300">
      {/* Barra de progreso */}
      <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-primary dark:bg-sky-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="flex justify-between items-center h-16 px-4 md:px-8 max-w-[1280px] mx-auto">
        {/* Botón Atrás */}
        {step > 1 && step < 5 ? (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-sky-400 transition-colors font-semibold text-xs uppercase tracking-wider group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Atrás
          </button>
        ) : (
          <div className="w-10" />
        )}

        {/* Label de paso */}
        <div className="font-semibold text-xs text-on-surface-variant dark:text-slate-400 uppercase tracking-widest">
          {step === 5 ? 'Diagnóstico Completado' : `Paso de Diagnóstico ${step} de 4`}
        </div>

        {/* Botón cerrar */}
        <Link
          href="/"
          className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400 hover:text-error dark:hover:text-red-400 transition-colors font-semibold text-xs uppercase"
        >
          <X className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}

import React from 'react';
import { Clock, Wrench } from 'lucide-react';

interface DiagnosticSummaryCardProps {
  badge: string;
  title: string;
  description: string;
  time: string;
  difficulty: string;
  costMin: number;
  costMax: number;
}

export default function DiagnosticSummaryCard({
  badge,
  title,
  description,
  time,
  difficulty,
  costMin,
  costMax
}: DiagnosticSummaryCardProps) {
  return (
    <div className="bg-surface-container-low dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-primary dark:hover:border-sky-500 transition-all duration-300 hover:shadow-md">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container dark:bg-sky-500 opacity-10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-105"></div>
      
      <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
        
        <div className="flex-grow">
          <span className="inline-block bg-error-container text-on-error-container dark:bg-red-950/40 dark:text-red-400 px-3 py-1 rounded-full text-xs font-semibold mb-4 border border-error/20">
            {badge}
          </span>
          
          <h2 className="text-2xl md:text-[30px] font-semibold tracking-tight text-on-surface dark:text-slate-100 mb-2 leading-tight">
            {title}
          </h2>
          
          <p className="text-base text-on-surface-variant dark:text-slate-400 mb-4 leading-relaxed">
            {description}
          </p>
          
          <div className="flex items-center gap-4 text-on-surface-variant dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-outline dark:text-slate-500" />
              <span>Tiempo Estimado: {time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-outline dark:text-slate-500" />
              <span>Dificultad: {difficulty}</span>
            </div>
          </div>
        </div>

        {/* Rango de Precios */}
        <div className="flex-shrink-0 flex flex-col items-start md:items-end md:text-right border-t md:border-t-0 md:border-l border-outline-variant dark:border-slate-800 pt-6 md:pt-0 md:pl-6 min-w-[160px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-500 mb-1">
            Costo de Reparación Est.
          </span>
          
          <div className="text-3xl md:text-4xl font-bold text-primary dark:text-sky-400 mb-2 flex items-baseline tracking-tight font-mono">
            <span>${costMin}</span>
            <span className="text-on-surface-variant/40 dark:text-slate-650 mx-1.5">-</span>
            <span>${costMax}</span>
          </div>
          
          <span className="text-[11px] text-on-surface-variant dark:text-slate-500 leading-tight max-w-[150px] md:max-w-none">
            *Incluye refacciones genuinas y mano de obra experta en laboratorio.
          </span>
        </div>

      </div>
    </div>
  );
}

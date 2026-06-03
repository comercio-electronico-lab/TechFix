import React from 'react';
import { Check, Clock, Wrench } from 'lucide-react';

export interface TimelineStep {
  id: number;
  title: string;
  description: string;
  date?: string;
  status: 'completed' | 'active' | 'pending';
  detailedInfo?: string;
}

interface RepairTimelineProps {
  steps: TimelineStep[];
}

export default function RepairTimeline({ steps }: RepairTimelineProps) {
  return (
    <div className="pl-4 pt-2">
      <ul className="relative border-l-2 border-primary/20 dark:border-slate-800/80 space-y-10">
        {steps.map((step) => {
          const isCompleted = step.status === 'completed';
          const isActive = step.status === 'active';
          const isPending = step.status === 'pending';
          
          return (
            <li key={step.id} className={`relative pl-8 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
              
              {/* Icono del Círculo Flotante */}
              <div className={`absolute -left-[17px] flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-white dark:ring-slate-900 ${
                isCompleted 
                  ? 'bg-primary dark:bg-sky-600 text-white' 
                  : isActive 
                  ? 'bg-primary-container dark:bg-sky-950/80 border-2 border-primary dark:border-sky-500 text-primary dark:text-sky-400' 
                  : 'bg-white dark:bg-slate-900 border-2 border-outline-variant dark:border-slate-700 text-on-surface-variant'
              }`}>
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3px]" />
                ) : isActive ? (
                  <Clock className="w-4 h-4 animate-pulse stroke-[2.5px]" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-outline-variant dark:bg-slate-600"></span>
                )}
              </div>

              {/* Título */}
              <h3 className={`font-semibold text-sm leading-snug ${
                isActive ? 'text-primary dark:text-sky-400 text-base font-bold' : 'text-on-surface dark:text-slate-200'
              }`}>
                {step.title}
              </h3>
              
              {/* Descripción */}
              <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                {step.description}
              </p>

              {/* Info Detallada Adicional para el Estado Activo */}
              {isActive && step.detailedInfo && (
                <div className="bg-surface-container-low dark:bg-slate-950/60 border border-outline-variant dark:border-slate-800 rounded-lg p-4 mt-3 mb-2 flex items-start gap-3 shadow-inner">
                  <Wrench className="w-5 h-5 text-amber-500 dark:text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-on-surface dark:text-slate-350 leading-normal">
                    {step.detailedInfo}
                  </p>
                </div>
              )}

              {/* Fecha de actualización */}
              {step.date && (
                <span className="text-[10px] font-bold text-outline dark:text-slate-500 uppercase tracking-wide block mt-1.5 select-none">
                  {step.date}
                </span>
              )}
              
              {/* Stage Badge */}
              {isActive && (
                <span className="inline-block text-[9px] font-bold text-primary dark:text-sky-400 bg-primary/5 dark:bg-sky-500/10 border border-primary/10 dark:border-sky-500/20 px-2 py-0.5 rounded uppercase tracking-wider mt-2 animate-pulse">
                  Etapa Actual
                </span>
              )}

            </li>
          );
        })}
      </ul>
    </div>
  );
}

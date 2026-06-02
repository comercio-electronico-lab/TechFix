'use client';

import React from 'react';
import { ArrowRight, History, Sparkles } from 'lucide-react';

interface Step2Props {
  currentNode: any;
  options: any[];
  symptomPath: string[];
  onSelect: (optionNode: any) => void;
}

export function DiagnosticStep2({ currentNode, options, symptomPath, onSelect }: Step2Props) {
  if (!currentNode) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 dark:border-sky-500/20 border-t-primary dark:border-t-sky-500 animate-spin" />
        <p className="text-sm font-semibold text-on-surface-variant dark:text-slate-400">
          Cargando árbol de decisión técnico...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-350">
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1 bg-primary/10 dark:bg-sky-500/10 text-primary dark:text-sky-400 text-[10px] font-extrabold px-3 py-1 rounded-full border border-primary/20 dark:border-sky-500/20 uppercase tracking-widest">
          <Sparkles className="w-3 h-3" /> Asistente Inteligente
        </span>
        <h1 className="text-2xl md:text-[34px] font-bold text-on-surface dark:text-white tracking-tight leading-snug max-w-2xl mx-auto">
          {currentNode.question_text}
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant dark:text-slate-400 max-w-lg mx-auto">
          Responde según el comportamiento actual de tu dispositivo para identificar la causa raíz.
        </p>
      </div>

      <div className="flex flex-col gap-3.5 max-w-2xl mx-auto">
        {options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C...
          return (
            <button
              type="button"
              key={opt.id}
              onClick={() => onSelect(opt)}
              className="group p-5 bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800/80 rounded-xl hover:border-primary dark:hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 cursor-pointer"
            >
              <div className="flex items-center gap-4 pr-4">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-sky-500 dark:group-hover:text-slate-950 group-hover:border-transparent transition-all">
                  {letter}
                </span>
                <span className="text-sm md:text-base font-semibold text-on-surface dark:text-slate-200 group-hover:text-primary dark:group-hover:text-sky-400 transition-colors">
                  {opt.answer_option}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-on-surface-variant/40 dark:text-slate-500 group-hover:text-primary dark:group-hover:text-sky-400 group-hover:translate-x-1.5 transition-all flex-shrink-0" />
            </button>
          );
        })}
      </div>

      {/* Symptom Path History Tracker */}
      {symptomPath && symptomPath.length > 0 && (
        <div className="max-w-2xl mx-auto mt-10 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-outline-variant/30 dark:border-slate-800/60 shadow-inner">
          <span className="flex items-center gap-1.5 text-xs font-extrabold text-on-surface-variant dark:text-slate-400 uppercase tracking-widest mb-3">
            <History className="w-3.5 h-3.5 text-primary dark:text-sky-400" /> Historial de Diagnóstico
          </span>
          <div className="flex flex-col gap-2">
            {symptomPath.map((stepStr, idx) => {
              const [q, a] = stepStr.split(' → ');
              return (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 dark:bg-sky-500/40 mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="text-on-surface-variant/60 dark:text-slate-500">{q}:</span>{' '}
                    <span className="font-bold text-on-surface dark:text-slate-300">{a}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { ChevronLeft, AlertCircle } from 'lucide-react';

interface Step4Props {
  description: string;
  onChange: (description: string) => void;
  onBack: () => void;
}

const COMMON_ISSUES = [
  'Pantalla rota o no enciende',
  'Batería descargada rápidamente',
  'No carga',
  'Botones no responden',
  'Altavoces dañados',
  'Cámara no funciona',
  'Problemas de conectividad',
  'Sobrecalentamiento',
];

export function Step4_Damage({ description, onChange, onBack }: Step4Props) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary dark:text-sky-400 hover:opacity-80 transition-opacity"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver
      </button>

      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-[40px] font-bold text-on-surface dark:text-white tracking-tight leading-tight">
          Describe el daño
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Cuéntanos qué problema tiene tu dispositivo para diagnosticar mejor.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Quick select buttons */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-on-surface-variant dark:text-slate-400">
            Problemas comunes:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {COMMON_ISSUES.map((issue) => (
              <button
                key={issue}
                onClick={() => onChange(issue)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 font-semibold text-sm text-left ${
                  description === issue
                    ? 'border-primary dark:border-sky-400 bg-primary/10 dark:bg-sky-400/10 text-primary dark:text-sky-400'
                    : 'border-outline-variant/40 dark:border-slate-800 bg-white dark:bg-slate-900 text-on-surface dark:text-slate-200 hover:border-primary dark:hover:border-sky-400'
                }`}
              >
                {issue}
              </button>
            ))}
          </div>
        </div>

        {/* Custom description */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-on-surface dark:text-slate-200">
            O describe el problema con más detalle:
          </label>
          <textarea
            value={description}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Por ejemplo: La pantalla no se enciende desde que el dispositivo cayó. No responde a ningún botón y cuando intento cargarlo no da señales de vida..."
            className="w-full h-32 bg-white dark:bg-slate-900 border-2 border-outline-variant/40 dark:border-slate-800 rounded-xl px-4 py-3 text-on-surface dark:text-slate-200 placeholder:text-on-surface-variant/50 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary dark:focus:border-sky-400 transition-colors resize-none"
          />
          <p className="text-xs text-on-surface-variant/70 dark:text-slate-500">
            Cuanto más detalle, mejor diagnóstico. ¿Cuándo comenzó? ¿Hubo eventos precipitantes?
          </p>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900 dark:text-blue-200">
              Usa tu descripción para que nuestra IA genere un diagnóstico preciso y recomendaciones de reparación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

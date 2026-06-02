'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface Step4Props {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  isSubmitting: boolean;
  onChange: (field: 'clientName' | 'clientEmail' | 'clientPhone', value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const inputClass =
  'w-full bg-slate-50 dark:bg-slate-950 border border-outline-variant/70 dark:border-slate-700 rounded px-4 py-2.5 pl-10 text-sm text-on-surface dark:text-white placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 transition-colors';

export function DiagnosticStep4({ 
  clientName, 
  clientEmail, 
  clientPhone, 
  isSubmitting, 
  onChange, 
  onSubmit 
}: Step4Props) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-350">
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" /> Falla Identificada
        </span>
        <h1 className="text-3xl md:text-[40px] font-bold text-on-surface dark:text-white tracking-tight leading-tight">
          Ingresa tus datos de contacto
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Guardaremos el reporte y generaremos un ticket técnico para reservar tu diagnóstico prioritario en nuestro laboratorio.
        </p>
      </div>

      <form onSubmit={onSubmit} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl border border-outline-variant/60 dark:border-slate-800 shadow-sm max-w-xl mx-auto space-y-6">
        {/* Nombre */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
            Nombre Completo
          </label>
          <div className="relative">
            <input 
              type="text" 
              required 
              placeholder="Juan Pérez"
              value={clientName} 
              onChange={(e) => onChange('clientName', e.target.value)}
              className={inputClass} 
            />
            <svg className="w-4 h-4 text-on-surface-variant/65 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
            Correo Electrónico
          </label>
          <div className="relative">
            <input 
              type="email" 
              required 
              placeholder="juan.perez@example.com"
              value={clientEmail} 
              onChange={(e) => onChange('clientEmail', e.target.value)}
              className={inputClass} 
            />
            <svg className="w-4 h-4 text-on-surface-variant/65 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
            Número de Celular / WhatsApp
          </label>
          <div className="relative">
            <input 
              type="tel" 
              required 
              placeholder="+51 987 654 321"
              value={clientPhone} 
              onChange={(e) => onChange('clientPhone', e.target.value)}
              className={inputClass} 
            />
            <svg className="w-4 h-4 text-on-surface-variant/65 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-primary dark:bg-sky-600 hover:bg-primary/95 text-white rounded text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin animate-duration-1000" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Guardando pre-evaluación...
            </>
          ) : (
            <>
              Guardar Reporte y Crear Ticket
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

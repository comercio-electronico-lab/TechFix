'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wrench, ShieldCheck, Activity, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full h-screen flex bg-background dark:bg-slate-950 transition-colors duration-300 font-body-md overflow-hidden text-on-background dark:text-slate-200">
      {/* Left Panel: Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-slate-900 via-indigo-950 to-slate-950 p-12 flex-col justify-between text-white relative overflow-hidden border-r border-outline-variant/10 dark:border-slate-900">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-500/10 blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-400/20 shadow-inner text-sky-400">
            <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="5" width="14" height="14" rx="3" />
              <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
              <path d="M12 9a3 3 0 1 0 3 3c0-.83-.34-1.58-.88-2.12L16 8M8 16l1.88-1.88" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-sm tracking-wider uppercase bg-linear-to-r from-white via-slate-100 to-sky-400 bg-clip-text text-transparent">TechFix Lab</span>
            <span className="block text-[9px] text-sky-400 font-semibold tracking-widest uppercase">Engineered Quality</span>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="my-auto max-w-md space-y-8 z-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
              Calibración y Diagnóstico de <span className="bg-linear-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Siguiente Nivel</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Registra tu inventario tecnológico personal para acceder a planes de garantía digital, agendar diagnósticos de laboratorio y monitorear reparaciones en tiempo real con total transparencia.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800/60">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-sky-500/10 rounded-lg text-sky-400 border border-sky-500/15 shrink-0 mt-0.5">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-200">Monitoreo Quirúrgico en Tiempo Real</h4>
                <p className="text-[10px] text-slate-450 mt-0.5 leading-normal">Observa cada etapa del diagnóstico, desde la microsoldadura hasta las pruebas de estrés.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/15 shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-200">Garantías Digitales Resguardadas</h4>
                <p className="text-[10px] text-slate-450 mt-0.5 leading-normal">Administra los tokens criptográficos de garantía de tus reparaciones sin papeles.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Form Content */}
      <div className="w-full lg:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-surface-bright dark:bg-slate-950 transition-colors relative">
        {/* Navigation Actions */}
        <div className="absolute top-6 right-6 md:top-10 md:right-10 flex items-center gap-3 z-20">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl bg-surface dark:bg-slate-900 border border-outline-variant/50 dark:border-slate-800 text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-sky-400 hover:border-primary/30 transition-all shadow-sm"
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface dark:bg-slate-900 border border-outline-variant/50 dark:border-slate-800 text-xs font-bold text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-sky-400 hover:border-primary/30 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Volver al Inicio</span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

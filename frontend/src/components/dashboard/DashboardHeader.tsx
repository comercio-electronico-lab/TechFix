"use client";

import React from 'react';
import { Sparkles, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface DashboardHeaderProps {
  userName: string;
  deviceCount: number;
  activeRepairsCount: number;
  warrantiesCount: number;
}

const DashboardHeader = ({
  userName,
  deviceCount,
  activeRepairsCount,
  warrantiesCount
}: DashboardHeaderProps) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-primary dark:text-white font-h1 font-bold">Panel Personal</h1>
          <p className="text-sm text-on-surface-variant mt-1">Bienvenido de nuevo a tu centro de control TechFix.</p>
        </div>
        <Link href="/catalogo">
          <button className="bg-primary/10 hover:bg-primary/15 dark:bg-sky-500/10 dark:hover:bg-sky-500/15 text-primary dark:text-sky-400 font-bold py-2.5 px-5 rounded-xl text-[10px] tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99]">
            <ShoppingBag className="w-3.5 h-3.5" /> Volver a la Tienda
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Banner */}
        <div className="lg:col-span-2 relative overflow-hidden bg-slate-950 text-white rounded-3xl p-6 md:p-8 border border-slate-850 flex flex-col justify-between min-h-[160px] shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest inline-flex items-center gap-1 bg-sky-500/10 px-3 py-1 rounded-full w-max">
              <Sparkles className="w-3 h-3" /> Acceso Cliente
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-2">
              ¡Hola de nuevo, {userName}! 👋
            </h2>
            <p className="text-xs md:text-sm text-slate-350 leading-relaxed max-w-xl">
              Administra tus equipos registrados, monitorea el progreso de calibración, soldadura de tus reparaciones en tiempo real y gestiona tus garantías oficiales.
            </p>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="bg-white/70 dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Resumen Rápido</h4>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-center space-y-1">
              <span className="block text-2xl font-black text-primary dark:text-sky-400">{deviceCount}</span>
              <span className="block text-[10px] text-on-surface-variant font-medium">Equipos</span>
            </div>
            <div className="text-center space-y-1 border-x border-slate-150 dark:border-slate-800">
              <span className="block text-2xl font-black text-primary dark:text-sky-400">{activeRepairsCount}</span>
              <span className="block text-[10px] text-on-surface-variant font-medium">Activos</span>
            </div>
            <div className="text-center space-y-1">
              <span className="block text-2xl font-black text-primary dark:text-sky-400">{warrantiesCount}</span>
              <span className="block text-[10px] text-on-surface-variant font-medium">Garantías</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;

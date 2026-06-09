"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Wrench } from 'lucide-react';

interface MegaMenuRepairsProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const MegaMenuRepairs: React.FC<MegaMenuRepairsProps> = ({
  isOpen,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute left-0 right-0 top-14 bg-surface dark:bg-[#020816] border-b border-slate-200/60 dark:border-slate-900/80 z-45 transition-all duration-300 ease-out origin-top overflow-hidden shadow-2xl ${
        isOpen 
          ? 'opacity-100 scale-y-100 max-h-[380px] py-10' 
          : 'opacity-0 scale-y-95 max-h-0 pointer-events-none'
      }`}
    >
      <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
        <div className="space-y-4">
          <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block">Servicios</span>
          <ul className="space-y-3">
            <li>
              <Link href="/reparaciones" className="text-sm font-black text-slate-900 dark:text-white hover:text-secondary dark:hover:text-sky-400 flex items-center gap-1 group/item">
                Ver Todos los Servicios <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
              </Link>
            </li>
            <li><Link href="/reparaciones?type=macbook" className="text-xs font-semibold text-slate-650 dark:text-slate-355 hover:text-slate-950 dark:hover:text-white">Reparación de Placas Macbook</Link></li>
            <li><Link href="/reparaciones?type=microsoldering" className="text-xs font-semibold text-slate-650 dark:text-slate-355 hover:text-slate-955 dark:hover:text-white">Microsoldadura SMD & BGA</Link></li>
            <li><Link href="/reparaciones?type=data-recovery" className="text-xs font-semibold text-slate-650 dark:text-slate-355 hover:text-slate-955 dark:hover:text-white">Recuperación de Datos Forense</Link></li>
            <li><Link href="/reparaciones?type=screens" className="text-xs font-semibold text-slate-650 dark:text-slate-355 hover:text-slate-955 dark:hover:text-white">Cambio de Pantallas & Baterías</Link></li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block">Gestión y Rápido</span>
          <ul className="space-y-3 text-xs font-semibold text-slate-650 dark:text-slate-355">
            <li><Link href="/reparaciones" className="hover:text-slate-955 dark:hover:text-white">Iniciar Asistente de Diagnóstico</Link></li>
            <li><Link href="/portal?tab=Repairs" className="hover:text-slate-955 dark:hover:text-white">Consultar Estado de Ticket</Link></li>
            <li><Link href="/nosotros" className="hover:text-slate-955 dark:hover:text-white">Ubicar Laboratorios Físicos</Link></li>
            <li><Link href="/nosotros" className="hover:text-slate-955 dark:hover:text-white">Contactar con un Ingeniero</Link></li>
          </ul>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">Ingeniería Certificada</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Nuestras reparaciones se ejecutan en campanas de flujo laminar con soldadura libre de plomo, siguiendo la norma industrial IPC-A-610.
            </p>
          </div>
          <Link href="/reparaciones" className="text-[10px] font-black text-secondary dark:text-sky-400 uppercase tracking-widest hover:underline mt-4 block">
            Agendar ahora
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuRepairs;

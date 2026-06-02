import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Calendar, PhoneCall, ArrowRight } from 'lucide-react';

export default function RepairActionPanel() {
  return (
    <div className="bg-surface-container dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6 sticky top-24 shadow-sm transition-colors">
      <h3 className="text-2xl font-semibold text-on-surface dark:text-slate-100 mb-4 border-b border-outline-variant/10 dark:border-slate-800 pb-3 uppercase tracking-wider text-xs">
        Siguientes Pasos
      </h3>
      
      <div className="flex flex-col gap-4">
        
        {/* Botón Principal: Comprar Piezas */}
        <Link href="/carrito" className="w-full">
          <button 
            className="w-full bg-primary hover:bg-primary/95 text-on-primary dark:bg-sky-600 dark:hover:bg-sky-500 dark:text-slate-950 py-3 px-4 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            Comprar Piezas (DIY)
          </button>
        </Link>
        
        {/* Divisor OR */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-outline-variant dark:border-slate-800"></div>
          <span className="flex-shrink-0 mx-4 text-outline dark:text-slate-500 font-semibold text-xs uppercase tracking-wider">Ó</span>
          <div className="flex-grow border-t border-outline-variant dark:border-slate-800"></div>
        </div>
        
        {/* Botón Secundario: Reservar Reparación Profesional */}
        <Link href="/portal" className="w-full">
          <button 
            className="w-full bg-transparent border border-primary dark:border-sky-500 text-primary dark:text-sky-400 py-3 px-4 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 hover:bg-primary/5 dark:hover:bg-sky-500/10 transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            Reservar Cita Profesional
          </button>
        </Link>

      </div>

      {/* Asistencia de Soporte */}
      <div className="mt-6 pt-6 border-t border-outline-variant dark:border-slate-800">
        <div className="flex items-start gap-3">
          <PhoneCall className="w-5 h-5 text-secondary dark:text-sky-400 mt-1 shrink-0" />
          <div>
            <h4 className="font-semibold text-sm text-on-surface dark:text-slate-200">
              ¿Necesitas Asesoría?
            </h4>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1 leading-normal font-body-md">
              Nuestros ingenieros de hardware están a tu total disposición para ayudarte a decidir.
            </p>
            <Link 
              href="/portal" 
              className="text-sm font-semibold text-primary dark:text-sky-400 mt-2.5 inline-flex items-center gap-1 hover:underline group"
            >
              Contactar Soporte <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

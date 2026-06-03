"use client";

import React from 'react';
import { ShieldCheck } from 'lucide-react';

const WarrantiesEmpty = () => {
  return (
    <div className="bg-white/70 dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 p-16 text-center rounded-3xl flex flex-col items-center justify-center border-dashed border-outline-variant/40">
      <ShieldCheck className="w-14 h-14 text-on-surface-variant/40 mb-3 animate-pulse" />
      <h4 className="text-primary dark:text-white font-bold mb-1">No hay certificados de garantía activos</h4>
      <p className="text-xs text-on-surface-variant max-w-sm">Los certificados se generan automáticamente al entregar un equipo reparado o adquirir componentes seleccionados.</p>
    </div>
  );
};

export default WarrantiesEmpty;

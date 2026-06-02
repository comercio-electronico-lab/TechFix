'use client';

import React, { useState } from 'react';
import { ShieldCheck, Copy } from 'lucide-react';

interface WarrantyCertificateCardProps {
  token: string;
  startDate: string;
  endDate: string;
}

export default function WarrantyCertificateCard({ token, startDate, endDate }: WarrantyCertificateCardProps) {
  const [copiedToken, setCopiedToken] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6 shadow-sm relative overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300">
      
      {/* Sello de seguridad decorativo */}
      <div className="absolute -right-8 -top-8 text-primary/5 dark:text-sky-500/5 select-none pointer-events-none transition-transform group-hover:scale-105 duration-500">
        <ShieldCheck className="w-32 h-32" />
      </div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-primary dark:text-sky-400" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-on-surface dark:text-white">
              Cobertura TechCare
            </h3>
          </div>
          <p className="text-xs text-on-surface-variant dark:text-slate-400">
            Soporte Integral de Mano de Obra y Repuesto
          </p>
        </div>

        {/* Badge Activa */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/20 dark:bg-sky-950/30 text-primary dark:text-sky-400 font-bold text-[10px] uppercase tracking-wider shadow-sm border border-primary/10 dark:border-sky-900/30 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-sky-400 animate-pulse"></div>
          ACTIVA
        </div>
      </div>

      <div className="space-y-4 relative z-10 flex-1">
        <div>
          <span className="text-[10px] font-bold text-outline dark:text-slate-500 uppercase tracking-wide block mb-1">
            Token de Garantía
          </span>
          
          <div 
            onClick={handleCopyToken}
            className="bg-slate-50 dark:bg-slate-950 border border-outline-variant/50 dark:border-slate-800 rounded-lg p-3 flex justify-between items-center group cursor-pointer hover:border-primary dark:hover:border-sky-500 transition-colors"
          >
            <span className="font-mono text-xs tracking-wider text-on-surface dark:text-slate-300 font-bold">
              {token}
            </span>
            {copiedToken ? (
              <span className="text-[10px] font-bold text-emerald-650 dark:text-emerald-400 uppercase">
                Copiado
              </span>
            ) : (
              <Copy className="w-3.5 h-3.5 text-outline group-hover:text-primary dark:group-hover:text-sky-400 transition-colors" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-outline dark:text-slate-500 uppercase tracking-wide block mb-0.5">Fecha de Inicio</span>
            <span className="text-xs font-semibold text-on-surface dark:text-slate-350">{startDate}</span>
          </div>
          <div className="w-px h-8 bg-outline-variant/20 dark:bg-slate-800 mx-4"></div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-outline dark:text-slate-500 uppercase tracking-wide block mb-0.5">Fecha de Venc.</span>
            <span className="text-xs font-semibold text-on-surface dark:text-slate-350">{endDate}</span>
          </div>
        </div>
      </div>
      
      {/* Línea estética de seguridad */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-primary dark:via-sky-600 to-primary/30"></div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, PhoneCall, ShoppingCart } from 'lucide-react';

interface RepairActionPanelProps {
  costMin?: number;
  costMax?: number;
}

export default function RepairActionPanel({ costMin = 50, costMax = 150 }: RepairActionPanelProps) {

  const [showConfirmForm, setShowConfirmForm] = useState(false);
  const [partType, setPartType] = useState<'original' | 'compatible' | 'economic'>('compatible');
  const [acceptDiagnosis, setAcceptDiagnosis] = useState(false);

  const getPriceRange = () => {
    switch (partType) {
      case 'economic':
        return `$${(costMin * 0.75).toFixed(2)} - $${(costMax * 0.75).toFixed(2)}`;
      case 'compatible':
        return `$${costMin.toFixed(2)} - $${costMax.toFixed(2)}`;
      case 'original':
        return `$${(costMin * 1.15).toFixed(2)} - $${(costMax * 1.15).toFixed(2)}`;
    }
  };

  const handleConfirmRepair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptDiagnosis) {
      alert('Debes aceptar el diagnóstico para continuar');
      return;
    }
    // Guardar selección y redirigir al login
    localStorage.setItem('techfix_pending_repair', JSON.stringify({
      partType,
      acceptDiagnosis,
      costMin,
      costMax
    }));
    window.location.href = '/auth?redirect=%2Freparaciones';
  };

  return (
    <div className="bg-surface-container dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6 sticky top-24 shadow-sm transition-colors">
      <h3 className="text-2xl font-semibold text-on-surface dark:text-slate-100 mb-4 border-b border-outline-variant/10 dark:border-slate-800 pb-3 uppercase tracking-wider text-xs">
        {showConfirmForm ? 'Confirmar Cita' : 'Siguientes Pasos'}
      </h3>

      {!showConfirmForm ? (
        <div className="flex flex-col gap-4">
          {/* Botón Principal: Confirmar y Agendar */}
          <button
            onClick={() => setShowConfirmForm(true)}
            className="w-full bg-primary hover:bg-primary/95 text-on-primary dark:bg-sky-600 dark:hover:bg-sky-500 dark:text-slate-950 py-3 px-4 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            Confirmar y Agendar Cita
          </button>

          {/* Divisor OR */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-outline-variant dark:border-slate-800"></div>
            <span className="flex-shrink-0 mx-4 text-outline dark:text-slate-500 font-semibold text-xs uppercase tracking-wider">Ó</span>
            <div className="flex-grow border-t border-outline-variant dark:border-slate-800"></div>
          </div>

          {/* Botón Secundario: Comprar DIY */}
          <Link href="/carrito" className="w-full">
            <button
              className="w-full bg-transparent border border-primary dark:border-sky-500 text-primary dark:text-sky-400 py-3 px-4 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 hover:bg-primary/5 dark:hover:bg-sky-500/10 transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              Comprar Piezas (DIY)
            </button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleConfirmRepair} className="space-y-4">
          {/* Tipo de Repuestos */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-on-background block">Tipo de Repuestos</label>
            <div className="space-y-2">
              {[
                { id: 'original', label: 'Originales', desc: 'Piezas OEM' },
                { id: 'compatible', label: 'Compatibles', desc: 'Mejor relación precio-calidad' },
                { id: 'economic', label: 'Económicos', desc: 'Costo reducido' }
              ].map(option => (
                <div
                  key={option.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-outline-variant/20 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  onClick={() => setPartType(option.id as any)}
                >
                  <input
                    type="radio"
                    name="partType"
                    value={option.id}
                    checked={partType === option.id}
                    onChange={(e) => setPartType(e.target.value as any)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-on-background text-sm">{option.label}</p>
                    <p className="text-xs text-on-surface-variant">{option.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg">
              <p className="text-sm text-on-surface-variant">Costo estimado: {getPriceRange()}</p>
            </div>
          </div>

          {/* Aceptar Diagnóstico */}
          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-outline-variant/20 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <input
                type="checkbox"
                checked={acceptDiagnosis}
                onChange={(e) => setAcceptDiagnosis(e.target.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-on-background text-sm">Acepto el diagnóstico</p>
                <p className="text-xs text-on-surface-variant mt-1">Confirmo que deseo agendar una cita profesional</p>
              </div>
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowConfirmForm(false)}
              className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-on-background dark:text-slate-100 py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
            >
              Atrás
            </button>
            <button
              type="submit"
              disabled={!acceptDiagnosis}
              className="flex-1 bg-primary dark:bg-sky-500 hover:bg-primary/90 dark:hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Confirmar
            </button>
          </div>
        </form>
      )}

      {/* Asistencia de Soporte */}
      <div className="mt-6 pt-6 border-t border-outline-variant dark:border-slate-800">
        <div className="flex items-start gap-3">
          <PhoneCall className="w-5 h-5 text-secondary dark:text-sky-400 mt-1 shrink-0" />
          <div>
            <h4 className="font-semibold text-sm text-on-surface dark:text-slate-200">
              ¿Necesitas Asesoría?
            </h4>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1 leading-normal font-body-md">
              Nuestros ingenieros están listos para ayudarte a decidir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

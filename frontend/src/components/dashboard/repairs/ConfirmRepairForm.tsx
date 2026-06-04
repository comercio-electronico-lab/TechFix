"use client";

import React, { useState } from 'react';

interface ConfirmRepairFormProps {
  onConfirm: (options: ConfirmRepairOptions) => void;
  estimatedMin: number;
  estimatedMax: number;
}

export interface ConfirmRepairOptions {
  partType: 'original' | 'compatible' | 'economic';
  acceptDiagnosis: boolean;
}

const ConfirmRepairForm = ({ onConfirm, estimatedMin, estimatedMax }: ConfirmRepairFormProps) => {
  const [partType, setPartType] = useState<'original' | 'compatible' | 'economic'>('original');
  const [acceptDiagnosis, setAcceptDiagnosis] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptDiagnosis) {
      alert('Debes aceptar el diagnóstico para continuar');
      return;
    }
    onConfirm({ partType, acceptDiagnosis });
  };

  const getPriceRange = () => {
    switch (partType) {
      case 'economic':
        return `$${(estimatedMin * 0.75).toFixed(2)} - $${(estimatedMax * 0.75).toFixed(2)}`;
      case 'compatible':
        return `$${estimatedMin.toFixed(2)} - $${estimatedMax.toFixed(2)}`;
      case 'original':
        return `$${(estimatedMin * 1.15).toFixed(2)} - $${(estimatedMax * 1.15).toFixed(2)}`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-outline-variant/10 dark:border-slate-800/80 pt-4 space-y-4">
      {/* Tipo de Repuestos */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-on-background block">Tipo de Repuestos</label>
        <div className="space-y-2">
          {[
            { id: 'original', label: 'Originales (Máxima Calidad)', desc: 'Piezas OEM garantizadas' },
            { id: 'compatible', label: 'Compatibles (Recomendado)', desc: 'Calidad certified, mejor relación precio-calidad' },
            { id: 'economic', label: 'Económicos (Presupuesto)', desc: 'Funcionales, costo reducido' }
          ].map(option => (
            <div key={option.id} className="flex items-start gap-3 p-3 rounded-lg border border-outline-variant/20 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
              onClick={() => setPartType(option.id as any)}>
              <input
                type="radio"
                name="partType"
                value={option.id}
                checked={partType === option.id}
                onChange={(e) => setPartType(e.target.value as any)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-on-background">{option.label}</p>
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
            <p className="font-medium text-on-background text-sm">Acepto el diagnóstico y deseo continuar con la reparación</p>
            <p className="text-xs text-on-surface-variant mt-1">Confirmo que deseo agendar una cita para reparar mi equipo</p>
          </div>
        </label>
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={!acceptDiagnosis}
        className="w-full bg-primary dark:bg-sky-500 hover:bg-primary/90 dark:hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-xl transition-colors"
      >
        Confirmar y Agendar Cita
      </button>
    </form>
  );
};

export default ConfirmRepairForm;

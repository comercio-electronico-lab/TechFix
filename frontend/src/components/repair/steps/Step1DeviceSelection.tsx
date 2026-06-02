'use client';

import React from 'react';
import { Smartphone, Laptop, Tablet, Monitor, ShieldAlert } from 'lucide-react';
import { SelectionCard } from './SelectionCard';

interface Step1Props {
  currentDevice: string | null;
  serialNumber: string;
  deviceModel: string;
  onSelect: (device: string) => void;
  onFieldChange: (field: 'serialNumber' | 'deviceModel', value: string) => void;
}

const DEVICE_OPTIONS = [
  { type: 'Smartphone', icon: Smartphone, label: 'Teléfono Móvil', desc: 'Soporte premium para iPhone, Samsung Galaxy, Xiaomi y más.', disabled: false },
  { type: 'Laptop', icon: Laptop, label: 'Computadora Portátil', desc: 'Ingeniería experta para MacBook Pro/Air, Dell XPS, HP y Lenovo.', disabled: false },
  { type: 'Tablet', icon: Tablet, label: 'Tableta Gráfica/Móvil', desc: 'Reparación especializada de iPad Pro/Air y Samsung Galaxy Tab.', disabled: false },
  { type: 'Desktop', icon: Monitor, label: 'PC de Escritorio', desc: 'Diagnóstico en PCs de alto rendimiento, iMacs y estaciones de trabajo.', disabled: false },
];

export function DiagnosticStep1({ 
  currentDevice, 
  serialNumber, 
  deviceModel, 
  onSelect,
  onFieldChange
}: Step1Props) {
  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-[40px] font-bold text-on-surface dark:text-white tracking-tight leading-tight">
          ¿Qué dispositivo deseas diagnosticar?
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Selecciona la categoría de tu equipo para inicializar las pruebas lógicas y de hardware correspondientes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {DEVICE_OPTIONS.map((opt) => (
          <SelectionCard
            key={opt.type}
            isSelected={currentDevice === opt.type}
            onClick={() => !opt.disabled && onSelect(opt.type)}
            icon={opt.icon}
            label={opt.label}
            description={opt.desc}
            disabled={opt.disabled}
          />
        ))}
      </div>

      {currentDevice && (
        <div className="bg-white dark:bg-slate-900 border border-outline-variant/65 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-md max-w-xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex gap-2.5 items-center text-xs font-black text-primary dark:text-sky-400 uppercase tracking-widest border-b border-outline-variant/20 dark:border-slate-800 pb-2.5">
            <ShieldAlert className="w-4 h-4 text-primary dark:text-sky-400" />
            <span>Detalles del Dispositivo (Recomendado)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="space-y-2">
              <label className="block text-on-surface-variant/80 dark:text-slate-400 uppercase tracking-wider font-extrabold text-[10px]">
                Modelo del Dispositivo
              </label>
              <input 
                type="text" 
                placeholder="Ej. MacBook Pro M1 2020"
                value={deviceModel}
                onChange={(e) => onFieldChange('deviceModel', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-outline-variant/60 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-on-surface dark:text-slate-200 focus:outline-none focus:border-primary dark:focus:border-sky-500 transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-on-surface-variant/80 dark:text-slate-400 uppercase tracking-wider font-extrabold text-[10px]">
                Número de Serie (S/N)
              </label>
              <input 
                type="text" 
                placeholder="Ej. SN-APPL-7721"
                value={serialNumber}
                onChange={(e) => onFieldChange('serialNumber', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-outline-variant/60 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-on-surface dark:text-slate-200 focus:outline-none focus:border-primary dark:focus:border-sky-500 transition-colors"
              />
            </div>
          </div>
          <p className="text-[10px] text-on-surface-variant/70 dark:text-slate-500">
            Ingresar estos datos nos permite verificar la cobertura de garantía oficial o compatibilidad de repuestos antes de que traigas el equipo.
          </p>
        </div>
      )}
    </div>
  );
}


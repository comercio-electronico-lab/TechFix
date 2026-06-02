'use client';

import React from 'react';
import { Smartphone, Laptop, Tablet, Monitor } from 'lucide-react';
import { SelectionCard } from './SelectionCard';

interface Step1Props {
  currentDevice: string | null;
  onSelect: (device: string) => void;
}

const DEVICE_OPTIONS = [
  { type: 'Smartphone', icon: Smartphone, label: 'Teléfono Móvil', desc: 'Soporte premium para iPhone, Samsung Galaxy, Xiaomi y más.', disabled: false },
  { type: 'Laptop', icon: Laptop, label: 'Computadora Portátil', desc: 'Ingeniería experta para MacBook Pro/Air, Dell XPS, HP y Lenovo.', disabled: false },
  { type: 'Tablet', icon: Tablet, label: 'Tableta Gráfica/Móvil', desc: 'Reparación especializada de iPad Pro/Air y Samsung Galaxy Tab.', disabled: true },
  { type: 'Desktop', icon: Monitor, label: 'PC de Escritorio', desc: 'Diagnóstico en PCs de alto rendimiento, iMacs y estaciones de trabajo.', disabled: true },
];

export function DiagnosticStep1({ currentDevice, onSelect }: Step1Props) {
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
    </div>
  );
}

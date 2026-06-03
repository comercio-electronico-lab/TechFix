'use client';

import React from 'react';
import { Smartphone, Laptop, Tablet, Monitor } from 'lucide-react';
import { SelectionCard } from './SelectionCard';

interface Step1Props {
  selectedType: string | null;
  onSelect: (type: string) => void;
}

const DEVICE_TYPES = [
  {
    id: 'smartphones',
    type: 'Smartphone',
    icon: Smartphone,
    label: 'Teléfono Móvil',
    desc: 'iPhone, Samsung, Google Pixel, Xiaomi y más.',
  },
  {
    id: 'laptops',
    type: 'Laptop',
    icon: Laptop,
    label: 'Computadora Portátil',
    desc: 'MacBook, Dell, HP, Lenovo, ASUS.',
  },
  {
    id: 'tablets',
    type: 'Tablet',
    icon: Tablet,
    label: 'Tableta',
    desc: 'iPad, Samsung Tab, Microsoft Surface.',
  },
  {
    id: 'desktops',
    type: 'Desktop',
    icon: Monitor,
    label: 'PC de Escritorio',
    desc: 'iMac, Dell, HP, Lenovo, ASUS.',
  },
];

export function Step1_DeviceType({ selectedType, onSelect }: Step1Props) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-[40px] font-bold text-on-surface dark:text-white tracking-tight leading-tight">
          ¿Qué dispositivo tienes?
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Selecciona la categoría de tu equipo para continuar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
        {DEVICE_TYPES.map((device) => (
          <SelectionCard
            key={device.id}
            isSelected={selectedType === device.id}
            onClick={() => onSelect(device.id)}
            icon={device.icon}
            label={device.label}
            description={device.desc}
          />
        ))}
      </div>
    </div>
  );
}

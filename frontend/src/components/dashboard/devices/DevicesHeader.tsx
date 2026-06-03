"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

interface DevicesHeaderProps {
  onCreateClick: () => void;
}

const DevicesHeader = ({ onCreateClick }: DevicesHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/70 dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 p-6 rounded-3xl shadow-md gap-4">
      <div>
        <h3 className="text-primary dark:text-white mb-1 font-h3 font-bold">Mis Dispositivos</h3>
        <p className="text-xs text-on-surface-variant">Registra tus equipos para agilizar tus reparaciones y servicio futuro.</p>
      </div>
      <Button
        onClick={onCreateClick}
        variant="primary"
        icon={Plus}
        className="py-2.5 px-5 text-sm"
      >
        Registrar Equipo
      </Button>
    </div>
  );
};

export default DevicesHeader;

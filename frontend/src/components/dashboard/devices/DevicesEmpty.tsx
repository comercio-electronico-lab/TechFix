"use client";

import React from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

interface DevicesEmptyProps {
  onCreateClick: () => void;
}

const DevicesEmpty = ({ onCreateClick }: DevicesEmptyProps) => {
  return (
    <div className="bg-white/70 dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 p-16 text-center rounded-3xl flex flex-col items-center justify-center border-dashed border-outline-variant/40">
      <FolderOpen className="w-16 h-16 text-on-surface-variant/40 mb-4" />
      <h4 className="text-primary dark:text-white font-bold mb-1">Aún no tienes equipos registrados</h4>
      <p className="text-xs text-on-surface-variant mb-6 max-w-sm">Registra tus laptops, PCs o smartphones para llevar un seguimiento de sus mantenimientos.</p>
      <Button
        onClick={onCreateClick}
        variant="primary"
        icon={Plus}
      >
        Registrar Mi Primer Equipo
      </Button>
    </div>
  );
};

export default DevicesEmpty;

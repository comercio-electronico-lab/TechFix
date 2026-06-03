"use client";

import React from 'react';
import { FolderOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const RepairsEmpty = () => {
  return (
    <div className="bg-white/70 dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 p-16 text-center rounded-3xl flex flex-col items-center justify-center border-dashed border-outline-variant/40">
      <FolderOpen className="w-14 h-14 text-on-surface-variant/40 mb-3" />
      <h4 className="text-primary dark:text-white font-bold mb-1">No tienes órdenes de reparación activas</h4>
      <p className="text-xs text-on-surface-variant max-w-sm mb-6">Si tu equipo está fallando, completa nuestro pre-diagnóstico interactivo.</p>
      <Link href="/reparaciones">
        <Button variant="secondary" icon={ArrowRight}>
          Iniciar Diagnóstico
        </Button>
      </Link>
    </div>
  );
};

export default RepairsEmpty;

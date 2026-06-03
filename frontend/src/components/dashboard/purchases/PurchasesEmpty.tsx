"use client";

import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const PurchasesEmpty = () => {
  return (
    <div className="bg-white/70 dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 p-16 text-center rounded-3xl flex flex-col items-center justify-center border-dashed border-outline-variant/40">
      <ShoppingBag className="w-14 h-14 text-on-surface-variant/40 mb-3" />
      <h4 className="text-primary dark:text-white font-bold mb-1">Aún no tienes compras registradas</h4>
      <p className="text-xs text-on-surface-variant mb-6">Visita nuestro catálogo de hardware premium OEM.</p>
      <Link href="/catalogo">
        <Button variant="secondary" icon={ArrowRight}>
          Ver Catálogo de Componentes
        </Button>
      </Link>
    </div>
  );
};

export default PurchasesEmpty;

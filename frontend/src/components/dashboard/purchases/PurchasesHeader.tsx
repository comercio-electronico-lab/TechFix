"use client";

import React from 'react';

const PurchasesHeader = () => {
  return (
    <div className="bg-white/70 dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 p-6 rounded-3xl shadow-md">
      <h3 className="text-primary dark:text-white mb-1 font-h3 font-bold">Historial de Pedidos</h3>
      <p className="text-xs text-on-surface-variant">Revisa los componentes de hardware y repuestos que has adquirido.</p>
    </div>
  );
};

export default PurchasesHeader;

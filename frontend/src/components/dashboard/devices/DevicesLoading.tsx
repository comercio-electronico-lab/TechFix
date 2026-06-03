"use client";

import React from 'react';

const DevicesLoading = () => {
  return (
    <div className="bg-white/70 dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 p-12 text-center rounded-3xl flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary mb-4"></div>
      <p className="text-on-surface-variant font-bold text-sm">Cargando tus equipos...</p>
    </div>
  );
};

export default DevicesLoading;

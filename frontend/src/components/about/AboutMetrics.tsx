import React from 'react';

export default function AboutMetrics() {
  return (
    <section className="-mt-8 relative z-20 max-w-container-max mx-auto px-gutter w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-slate-950 border border-outline-variant/10 dark:border-slate-800 rounded-3xl p-8 shadow-xl dark:shadow-slate-950/50 transition-colors duration-300">
        <div className="text-center space-y-2 border-r border-outline-variant/10 dark:border-slate-800/80 last:border-none">
          <p className="text-3xl md:text-4xl font-extrabold text-primary dark:text-sky-400">4.9★</p>
          <p className="text-xs font-bold text-on-surface-variant/80 dark:text-slate-400 uppercase tracking-widest">Satisfacción</p>
        </div>
        <div className="text-center space-y-2 md:border-r border-outline-variant/10 dark:border-slate-800/80 last:border-none">
          <p className="text-3xl md:text-4xl font-extrabold text-primary dark:text-sky-400">98%</p>
          <p className="text-xs font-bold text-on-surface-variant/80 dark:text-slate-400 uppercase tracking-widest">Éxito SLA</p>
        </div>
        <div className="text-center space-y-2 border-r border-outline-variant/10 dark:border-slate-800/80 last:border-none">
          <p className="text-3xl md:text-4xl font-extrabold text-primary dark:text-sky-400">15K+</p>
          <p className="text-xs font-bold text-on-surface-variant/80 dark:text-slate-400 uppercase tracking-widest">Reparados</p>
        </div>
        <div className="text-center space-y-2 last:border-none">
          <p className="text-3xl md:text-4xl font-extrabold text-primary dark:text-sky-400">100%</p>
          <p className="text-xs font-bold text-on-surface-variant/80 dark:text-slate-400 uppercase tracking-widest">Garantía</p>
        </div>
      </div>
    </section>
  );
}

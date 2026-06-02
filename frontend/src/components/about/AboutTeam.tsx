import React from 'react';

export default function AboutTeam() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900/20 transition-colors duration-300">
      <div className="max-w-container-max mx-auto px-gutter space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400 uppercase tracking-widest bg-sky-500/10 px-3 py-1 rounded-full">
            NUESTROS EXPERTOS
          </span>
          <h2 className="text-3xl md:text-[40px] font-bold text-primary dark:text-white tracking-tight">
            Ingenieros certificados en hardware
          </h2>
          <p className="text-on-surface-variant dark:text-slate-400 text-sm md:text-base">
            Conoce a los especialistas técnicos con más certificaciones de micro-electrónica y reparación del país.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Member 1 */}
          <div className="bg-slate-50 dark:bg-slate-950 rounded-3xl border border-outline-variant/10 dark:border-slate-800 p-6 text-center space-y-6 transition-all hover:shadow-lg dark:hover:shadow-slate-950">
            <div className="w-24 h-24 bg-sky-500/10 dark:bg-sky-500/20 rounded-full flex items-center justify-center text-primary dark:text-sky-400 text-3xl font-extrabold mx-auto border-2 border-sky-400/20 shadow-inner">
              MR
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-primary dark:text-white">Marcos Rodriguez</h4>
              <p className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wide">Fundador & Especialista L3</p>
            </div>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              Más de 12 años de experiencia en diagnósticos a nivel de integrados en placas lógicas Apple MacBooks e iPhones.
            </p>
            <div className="flex justify-center gap-2">
              <span className="bg-white dark:bg-slate-900 border border-outline-variant/20 dark:border-slate-800 text-[9px] font-extrabold text-on-surface-variant dark:text-slate-400 px-2.5 py-1 rounded-lg">ACMT Certified</span>
              <span className="bg-white dark:bg-slate-900 border border-outline-variant/20 dark:border-slate-800 text-[9px] font-extrabold text-on-surface-variant dark:text-slate-400 px-2.5 py-1 rounded-lg">IPC-7711 Expert</span>
            </div>
          </div>

          {/* Member 2 */}
          <div className="bg-slate-50 dark:bg-slate-950 rounded-3xl border border-outline-variant/10 dark:border-slate-800 p-6 text-center space-y-6 transition-all hover:shadow-lg dark:hover:shadow-slate-950">
            <div className="w-24 h-24 bg-secondary/10 dark:bg-sky-500/25 rounded-full flex items-center justify-center text-secondary dark:text-sky-300 text-3xl font-extrabold mx-auto border-2 border-secondary/20 shadow-inner">
              LM
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-primary dark:text-white">Laura Martinez</h4>
              <p className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wide">Líder de Soporte & QA</p>
            </div>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              Supervisa el estricto protocolo de pruebas post-reparación y la comunicación rápida con el cliente.
            </p>
            <div className="flex justify-center gap-2">
              <span className="bg-white dark:bg-slate-900 border border-outline-variant/20 dark:border-slate-800 text-[9px] font-extrabold text-on-surface-variant dark:text-slate-400 px-2.5 py-1 rounded-lg">ITIL Foundation</span>
              <span className="bg-white dark:bg-slate-900 border border-outline-variant/20 dark:border-slate-800 text-[9px] font-extrabold text-on-surface-variant dark:text-slate-400 px-2.5 py-1 rounded-lg">Soporte Técnico</span>
            </div>
          </div>

          {/* Member 3 */}
          <div className="bg-slate-50 dark:bg-slate-950 rounded-3xl border border-outline-variant/10 dark:border-slate-800 p-6 text-center space-y-6 transition-all hover:shadow-lg dark:hover:shadow-slate-950 sm:col-span-2 lg:col-span-1 sm:max-w-sm sm:mx-auto lg:max-w-none">
            <div className="w-24 h-24 bg-purple-500/10 dark:bg-purple-500/25 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 text-3xl font-extrabold mx-auto border-2 border-purple-400/20 shadow-inner">
              SL
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-primary dark:text-white">Sofía López</h4>
              <p className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wide">Técnica de Red & Microelectrónica</p>
            </div>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              Experta en reconstrucción de líneas de radiofrecuencia (RF), osciloscopio digital e instrumental avanzado.
            </p>
            <div className="flex justify-center gap-2">
              <span className="bg-white dark:bg-slate-900 border border-outline-variant/20 dark:border-slate-800 text-[9px] font-extrabold text-on-surface-variant dark:text-slate-400 px-2.5 py-1 rounded-lg">CompTIA A+</span>
              <span className="bg-white dark:bg-slate-900 border border-outline-variant/20 dark:border-slate-800 text-[9px] font-extrabold text-on-surface-variant dark:text-slate-400 px-2.5 py-1 rounded-lg">Logic Board Micro</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

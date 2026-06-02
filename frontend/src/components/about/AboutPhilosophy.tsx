import React from 'react';
import { Cpu, ShieldCheck, Layers } from 'lucide-react';

export default function AboutPhilosophy() {
  return (
    <section className="py-24 bg-background dark:bg-slate-900/10 transition-colors duration-300">
      <div className="max-w-container-max mx-auto px-gutter space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400 uppercase tracking-widest bg-sky-500/10 px-3 py-1 rounded-full">
            NUESTROS PILARES
          </span>
          <h2 className="text-3xl md:text-[40px] font-bold text-primary dark:text-white tracking-tight">
            Ingeniería a tu alcance
          </h2>
          <p className="text-on-surface-variant dark:text-slate-400 text-sm md:text-base leading-relaxed">
            No somos simplemente un taller de cambios de piezas. Diagnosticamos y resolvemos fallas a nivel de componente con instrumentación avanzada de laboratorio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-card p-8 rounded-3xl border border-outline-variant/20 dark:border-slate-800/60 hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 rounded-2xl flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary dark:text-white">Precisión en Placa</h3>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
                Realizamos microsoldadura de alta complejidad (reballing, reconstrucción de pistas, reemplazo de integrados de carga y alimentación) bajo microscopía estereofónica.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-8 rounded-3xl border border-outline-variant/20 dark:border-slate-800/60 hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary dark:text-white">Transparencia Total</h3>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
                Hacemos seguimiento en tiempo real. Puedes ver la fase exacta en la que está tu equipo (diagnóstico, en reparación, control de calidad, listo) desde nuestra cola de tickets Kanban.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-8 rounded-3xl border border-outline-variant/20 dark:border-slate-800/60 hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary dark:text-white">Economía Circular</h3>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
                Salvar un dispositivo evita la generación de residuos electrónicos y te ahorra hasta un 70% comparado con comprar uno nuevo. Reparar es cuidar nuestro planeta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

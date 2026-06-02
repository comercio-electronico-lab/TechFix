import React from 'react';

export default function AboutLabStandards() {
  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="rounded-3xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary dark:from-slate-950 to-transparent z-10 opacity-80 md:opacity-75"></div>
          <img 
            alt="Mesa de laboratorio técnico"
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200"
            className="w-full h-[400px] object-cover transform scale-100 group-hover:scale-[1.03] transition-transform duration-700"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 md:p-16 space-y-6 max-w-xl text-white">
            <span className="inline-flex self-start bg-secondary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              ESTÁNDARES DE CALIDAD
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              Maquinaria sofisticada y laboratorio antiestático ESD.
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              Todas nuestras estaciones cuentan con protección contra descargas electrostáticas (ESD), herramientas de medición calibradas Fluke, soldadores JBC de respuesta térmica ultrarrápida y osciloscopios de alta velocidad.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

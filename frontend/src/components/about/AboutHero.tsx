import React from 'react';
import Button from '@/components/ui/Button';
import { Wrench, Sparkles } from 'lucide-react';

export default function AboutHero() {
  return (
    <section className="hero-gradient relative overflow-hidden py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.15),transparent_60%)]"></div>
      <div className="max-w-container-max mx-auto px-gutter relative z-10 text-center lg:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-300 dark:text-sky-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> QUIÉNES SOMOS
            </span>
            <h1 className="text-4xl md:text-[56px] leading-[1.1] font-bold text-white tracking-tight">
              Innovación & precisión <br />
              <span className="text-sky-400">en cada reparación.</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              En TechFix combinamos ingeniería de laboratorio, procesos 100% transparentes y repuestos de grado premium para devolverle la vida a tus dispositivos favoritos con la máxima garantía.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button variant="accent" icon={Wrench}>
                Programar Diagnóstico
              </Button>
              <Button variant="outline">
                Ver Servicios
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="absolute -top-10 w-72 h-72 bg-sky-500/20 rounded-full blur-[80px]"></div>
            <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 p-2 max-w-sm md:max-w-md transform hover:rotate-1 transition-transform duration-500">
              <img 
                alt="Laboratorio de Reparación TechFix" 
                src="https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=800"
                className="rounded-xl w-full h-[320px] object-cover filter brightness-90 hover:brightness-100 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

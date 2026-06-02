import React from 'react';
import Button from '@/components/ui/Button';
import { Wrench } from 'lucide-react';

export default function AboutCTA() {
  return (
    <section className="py-20 hero-gradient text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(14,165,233,0.15),transparent_50%)]"></div>
      <div className="max-w-3xl mx-auto px-gutter text-center space-y-8 relative z-10">
        <h2 className="text-3xl md:text-[44px] font-bold text-white tracking-tight leading-tight">
          ¿Listo para revivir tu equipo?
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Obtén un diagnóstico preciso y una estimación de costo sin compromisos. Nuestro equipo de ingenieros está listo para ayudarte.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="accent" icon={Wrench}>
            Comenzar Diagnóstico
          </Button>
          <Button variant="outline">
            Contáctanos
          </Button>
        </div>
      </div>
    </section>
  );
}

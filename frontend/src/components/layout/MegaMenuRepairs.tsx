"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { 
  MegaMenuLayout, 
  MegaMenuSectionTitle, 
  MegaMenuLargeLink, 
  MegaMenuRegularLink, 
  MegaMenuCtaCard 
} from './MegaMenuComponents';

const MegaMenuRepairs: React.FC = () => {
  return (
    <MegaMenuLayout>
      {/* Columna Principal - Estilo Apple */}
      <div className="space-y-4">
        <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block">Servicios de Soporte</span>
        <ul className="flex flex-col gap-3">
          <li>
            <Link 
              href="/reparaciones" 
              className="text-sm font-semibold text-slate-650 dark:text-slate-355 hover:text-secondary dark:hover:text-sky-400 flex items-center gap-1 group/item transition-colors"
            >
              Ver todos los servicios <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
            </Link>
          </li>
          <li>
            <MegaMenuLargeLink href="/reparaciones?type=laptops">Soporte Laptops</MegaMenuLargeLink>
          </li>
          <li>
            <MegaMenuLargeLink href="/reparaciones?type=smartphones">Soporte Celulares</MegaMenuLargeLink>
          </li>
          <li>
            <MegaMenuLargeLink href="/reparaciones?type=tablets">Soporte Tablets</MegaMenuLargeLink>
          </li>
          <li>
            <MegaMenuLargeLink href="/reparaciones?type=screens">Reparación de Placas</MegaMenuLargeLink>
          </li>
          <li className="pt-2 mt-2 border-t border-slate-200/50 dark:border-slate-800/40">
            <Link href="/nosotros" className="text-[11px] font-black text-secondary dark:text-sky-400 uppercase tracking-wider hover:underline">
              Hablar con un Ingeniero
            </Link>
          </li>
        </ul>
      </div>
      
      {/* Columna Secundaria */}
      <div className="space-y-4">
        <MegaMenuSectionTitle>Recursos y Consultas</MegaMenuSectionTitle>
        <ul className="space-y-3.5">
          <li>
            <MegaMenuRegularLink href="/reparaciones">Asistente de Diagnóstico con IA</MegaMenuRegularLink>
          </li>
          <li>
            <MegaMenuRegularLink href="/portal?tab=Repairs">Consultar Estado de Ticket</MegaMenuRegularLink>
          </li>
          <li>
            <MegaMenuRegularLink href="/reparaciones">Agendar Diagnóstico en Tienda</MegaMenuRegularLink>
          </li>
          <li>
            <MegaMenuRegularLink href="/reparaciones">Tarifas Estándar de Reparación</MegaMenuRegularLink>
          </li>
        </ul>
      </div>

      {/* Tarjeta de Destacado / CTA */}
      <MegaMenuCtaCard 
        title="Ingeniería Certificada"
        description="Nuestras reparaciones se ejecutan en campanas de flujo laminar con soldadura libre de plomo, siguiendo estrictas normas de microsoldadura IPC-A-610."
        buttonText="Agendar ahora"
        buttonHref="/reparaciones"
      />
    </MegaMenuLayout>
  );
};

export default MegaMenuRepairs;

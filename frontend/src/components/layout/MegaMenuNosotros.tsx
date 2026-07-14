"use client";

import React from 'react';
import Link from 'next/link';
import { 
  MegaMenuLayout, 
  MegaMenuSectionTitle, 
  MegaMenuLargeLink, 
  MegaMenuRegularLink, 
  MegaMenuCtaCard 
} from './MegaMenuComponents';

const MegaMenuNosotros: React.FC = () => {
  return (
    <MegaMenuLayout>
      {/* Columna Principal - Estilo Premium */}
      <div className="space-y-4">
        <MegaMenuSectionTitle>Conoce TechFix</MegaMenuSectionTitle>
        <ul className="flex flex-col gap-3">
          <li>
            <MegaMenuLargeLink href="/nosotros">Quiénes Somos</MegaMenuLargeLink>
          </li>
          <li>
            <MegaMenuLargeLink href="/nosotros">Nuestra Filosofía</MegaMenuLargeLink>
          </li>
          <li>
            <MegaMenuLargeLink href="/nosotros">Calidad OEM</MegaMenuLargeLink>
          </li>
          <li>
            <MegaMenuLargeLink href="/nosotros">Sostenibilidad</MegaMenuLargeLink>
          </li>
          <li className="pt-2 mt-2 border-t border-slate-200/50 dark:border-slate-800/40">
            <Link href="/nosotros" className="text-[11px] font-black text-secondary dark:text-sky-400 uppercase tracking-wider hover:underline">
              Preguntas Frecuentes
            </Link>
          </li>
        </ul>
      </div>
      
      {/* Columna Secundaria */}
      <div className="space-y-4">
        <MegaMenuSectionTitle>Contacto y Alianzas</MegaMenuSectionTitle>
        <ul className="space-y-3.5">
          <li>
            <MegaMenuRegularLink href="/nosotros">Nuestros Laboratorios Físicos</MegaMenuRegularLink>
          </li>
          <li>
            <MegaMenuRegularLink href="/nosotros">Soporte Corporativo y Empresas</MegaMenuRegularLink>
          </li>
          <li>
            <MegaMenuRegularLink href="/nosotros">Trabaja con Nosotros</MegaMenuRegularLink>
          </li>
          <li>
            <MegaMenuRegularLink href="/nosotros">Prensa e Innovación de Hardware</MegaMenuRegularLink>
          </li>
        </ul>
      </div>

      {/* Tarjeta de Destacado / CTA */}
      <MegaMenuCtaCard 
        title="Ingenieros Certificados"
        description="Contamos con un equipo de ingenieros electrónicos y de hardware graduados con certificaciones avanzadas de microsoldadura y diagnóstico de alto nivel."
        buttonText="Saber más del equipo"
        buttonHref="/nosotros"
      />
    </MegaMenuLayout>
  );
};

export default MegaMenuNosotros;

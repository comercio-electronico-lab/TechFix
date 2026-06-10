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

const MegaMenuCatalog: React.FC = () => {
  return (
    <MegaMenuLayout>
      {/* Columna Principal - Estilo Apple */}
      <div className="space-y-4">
        <MegaMenuSectionTitle>Explorar Catálogo</MegaMenuSectionTitle>
        <ul className="flex flex-col gap-3">
          <li>
            <Link 
              href="/catalogo" 
              className="text-sm font-semibold text-slate-650 dark:text-slate-355 hover:text-secondary dark:hover:text-sky-400 flex items-center gap-1 group/item transition-colors"
            >
              Ver todos los productos <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
            </Link>
          </li>
          <li>
            <MegaMenuLargeLink href="/catalogo?category=Laptops">Laptops</MegaMenuLargeLink>
          </li>
          <li>
            <MegaMenuLargeLink href="/catalogo?category=Smartphones">Smartphones</MegaMenuLargeLink>
          </li>
          <li>
            <MegaMenuLargeLink href="/catalogo?category=Monitors">Monitors</MegaMenuLargeLink>
          </li>
          <li>
            <MegaMenuLargeLink href="/catalogo?category=Tablets">Tablets</MegaMenuLargeLink>
          </li>
          <li className="pt-2 mt-2 border-t border-slate-200/50 dark:border-slate-800/40">
            <Link href="/catalogo" className="text-[11px] font-black text-secondary dark:text-sky-400 uppercase tracking-wider hover:underline">
              Comparar Dispositivos
            </Link>
          </li>
        </ul>
      </div>
      
      {/* Columna Secundaria */}
      <div className="space-y-4">
        <MegaMenuSectionTitle>Más del Catálogo</MegaMenuSectionTitle>
        <ul className="space-y-3.5">
          <li>
            <MegaMenuRegularLink href="/nosotros">Garantía Certificada de Equipos</MegaMenuRegularLink>
          </li>
          <li>
            <MegaMenuRegularLink href="/catalogo">Financiamiento de Dispositivos</MegaMenuRegularLink>
          </li>
          <li>
            <MegaMenuRegularLink href="/reparaciones">Planes de Mantenimiento OEM</MegaMenuRegularLink>
          </li>
          <li>
            <MegaMenuRegularLink href="/nosotros">Soporte Técnico Especializado</MegaMenuRegularLink>
          </li>
        </ul>
      </div>

      {/* Tarjeta de Destacado / CTA */}
      <MegaMenuCtaCard 
        title="Garantía Certificada"
        description="Todos los repuestos y dispositivos en nuestra tienda cuentan con certificación oficial de compatibilidad técnica y 12 meses de garantía directa en laboratorio."
        buttonText="Comprar ahora"
        buttonHref="/catalogo"
      />
    </MegaMenuLayout>
  );
};

export default MegaMenuCatalog;

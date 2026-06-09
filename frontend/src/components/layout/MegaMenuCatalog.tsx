"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface MegaMenuCatalogProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const MegaMenuCatalog: React.FC<MegaMenuCatalogProps> = ({
  isOpen,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute left-0 right-0 top-14 bg-surface dark:bg-[#020816] border-b border-slate-200/60 dark:border-slate-900/80 z-45 transition-all duration-300 ease-out origin-top overflow-hidden shadow-2xl ${
        isOpen 
          ? 'opacity-100 scale-y-100 max-h-[380px] py-10' 
          : 'opacity-0 scale-y-95 max-h-0 pointer-events-none'
      }`}
    >
      <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
        <div className="space-y-4">
          <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block">Explorar</span>
          <ul className="space-y-3">
            <li>
              <Link href="/catalogo" className="text-sm font-black text-slate-900 dark:text-white hover:text-secondary dark:hover:text-sky-400 flex items-center gap-1 group/item">
                Ver Todos los Componentes <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
              </Link>
            </li>
            <li><Link href="/catalogo?category=procesadores" className="text-xs font-semibold text-slate-650 dark:text-slate-350 hover:text-slate-950 dark:hover:text-white">Procesadores & CPUs</Link></li>
            <li><Link href="/catalogo?category=gpu" className="text-xs font-semibold text-slate-650 dark:text-slate-355 hover:text-slate-955 dark:hover:text-white">Tarjetas Gráficas GPU</Link></li>
            <li><Link href="/catalogo?category=ram" className="text-xs font-semibold text-slate-650 dark:text-slate-355 hover:text-slate-955 dark:hover:text-white">Memorias RAM DDR5</Link></li>
            <li><Link href="/catalogo?category=storage" className="text-xs font-semibold text-slate-650 dark:text-slate-355 hover:text-slate-955 dark:hover:text-white">Discos Sólidos SSD M.2</Link></li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block">Kits DIY & Lab</span>
          <ul className="space-y-3 text-xs font-semibold text-slate-650 dark:text-slate-355">
            <li><Link href="/catalogo?category=herramientas" className="hover:text-slate-955 dark:hover:text-white">Herramientas de Precisión</Link></li>
            <li><Link href="/catalogo?category=kits" className="hover:text-slate-955 dark:hover:text-white">Kits de Reparación Rápida</Link></li>
            <li><Link href="/catalogo?category=estaciones" className="hover:text-slate-955 dark:hover:text-white">Estaciones de Soldadura BGA</Link></li>
            <li><Link href="/catalogo?category=insumos" className="hover:text-slate-955 dark:hover:text-white">Pastas Térmicas e Insumos</Link></li>
          </ul>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">Garantía Certificada</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Todos los repuestos adquiridos en nuestra tienda cuentan con certificación oficial de compatibilidad técnica y 12 meses de garantía directa.
            </p>
          </div>
          <Link href="/catalogo" className="text-[10px] font-black text-secondary dark:text-sky-400 uppercase tracking-widest hover:underline mt-4 block">
            Comprar ahora
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuCatalog;

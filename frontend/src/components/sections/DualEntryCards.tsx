import React from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import { 
  ArrowRight, 
  Wrench, 
  ShoppingBag, 
  Activity, 
  ShieldCheck, 
  Cpu 
} from 'lucide-react';

import Container from '../ui/Container';

const DualEntryCards = () => {
  return (
    <Container as="section" className="-mt-16 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Tarjeta Izquierda: Diagnóstico Técnico */}
        <div className="group bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col justify-between hover:border-primary dark:hover:border-sky-500 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/5 dark:bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-colors" />
          
          <div className="space-y-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-primary/5 dark:bg-sky-500/10 text-primary dark:text-sky-400 border border-primary/10 dark:border-sky-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Wrench className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-primary dark:text-sky-400 uppercase tracking-widest block">
                ASISTENTE INTELIGENTE PIG
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-on-surface dark:text-white leading-tight">
                ¿Tu equipo presenta fallas de hardware?
              </h2>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
                Utiliza nuestro asistente de diagnóstico automatizado. Descubre problemas de batería, pantalla, cortocircuitos o software en menos de 2 minutos.
              </p>
            </div>
            
            <ul className="space-y-2 text-xs font-semibold text-on-surface-variant/90 dark:text-slate-350">
              <li className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-500" /> Diagnóstico paso a paso sin costo técnico.
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-500" /> Presupuesto y tiempos estimados de inmediato.
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-850">
            <Link href="/reparaciones" className="block w-full">
              <Button 
                variant="secondary" 
                icon={ArrowRight} 
                className="w-full !py-4 !text-xs font-black uppercase tracking-wider group/btn shadow-md hover:shadow-lg"
              >
                Diagnosticar Mi Equipo
              </Button>
            </Link>
          </div>
        </div>

        {/* Tarjeta Derecha: Catálogo DIY */}
        <div className="group bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col justify-between hover:border-primary dark:hover:border-sky-500 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-secondary/5 dark:bg-secondary-container/5 rounded-full blur-2xl group-hover:bg-secondary-container/10 transition-colors" />
          
          <div className="space-y-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-secondary/5 dark:bg-sky-500/10 text-secondary dark:text-sky-400 border border-secondary/10 dark:border-sky-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-secondary dark:text-sky-400 uppercase tracking-widest block">
                REPUESTOS Y KITS DE TIENDA
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-on-surface dark:text-white leading-tight">
                ¿Buscas repuestos profesionales u OEM?
              </h2>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
                Adquiere repuestos directos de fábrica: pantallas, baterías de alta densidad, memorias ultrarrápidas y herramientas especializadas de calibración.
              </p>
            </div>
            
            <ul className="space-y-2 text-xs font-semibold text-on-surface-variant/90 dark:text-slate-350">
              <li className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-500" /> Garantía oficial y repuestos con certificación de fábrica.
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-500" /> Facturación electrónica y checkout simplificado de 1 clic.
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-850">
            <Link href="/catalogo" className="block w-full">
              <Button 
                variant="primary" 
                icon={ArrowRight} 
                className="w-full !py-4 !text-xs font-black uppercase tracking-wider group/btn shadow-md hover:shadow-lg"
              >
                Explorar Catálogo de Piezas
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </Container>
  );
};

export default DualEntryCards;

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Wrench, 
  ShoppingBag, 
  Search, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Sparkles,
  SearchCode
} from 'lucide-react';
import Hero from "@/components/sections/Hero";
import { mockProducts } from "@/mock/products";
import ProductCard from "@/components/cards/ProductCard";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [ticketSearchId, setTicketSearchId] = useState('');

  const handleTicketSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSearchId.trim()) return;
    router.push(`/portal?tab=Repairs&search=${encodeURIComponent(ticketSearchId.trim())}`);
  };

  return (
    <div className="space-y-20 pb-24">
      <Hero />
      {/* Dual Entry Premium Cards - Apple Support vs iFixit Style */}
      <section className="max-w-container-max mx-auto px-gutter -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Tarjeta Izquierda: Diagnóstico Técnico (Apple / Geek Squad style) */}
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
              <Link 
                href="/reparaciones" 
                className="w-full py-4 bg-primary dark:bg-sky-600 hover:bg-primary/95 dark:hover:bg-sky-500 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow cursor-pointer uppercase tracking-wider group-hover:shadow-lg"
              >
                Diagnosticar Mi Equipo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Tarjeta Derecha: Catálogo DIY (iFixit style) */}
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
              <Link 
                href="/catalogo" 
                className="w-full py-4 bg-secondary dark:bg-sky-700 hover:bg-secondary/95 dark:hover:bg-sky-600 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow cursor-pointer uppercase tracking-wider group-hover:shadow-lg"
              >
                Explorar Catálogo de Piezas <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-container-max mx-auto px-gutter py-4">
        <div className="flex justify-between items-end mb-8 border-b border-outline-variant/20 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-black text-on-surface dark:text-white tracking-tight">Componentes Destacados</h2>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1">Los repuestos de alto rendimiento más ordenados por laboratorios técnicos.</p>
          </div>
          <Link href="/catalogo" className="text-xs font-bold text-secondary dark:text-sky-400 flex items-center gap-1 hover:underline uppercase tracking-wider">
            Ver Catálogo Completo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Geek Squad Style Repairs Tracker */}
      <section className="max-w-container-max mx-auto px-gutter">
        <div className="bg-gradient-to-br from-primary-container to-slate-900 dark:from-slate-900/40 dark:to-slate-950 border border-outline-variant/10 dark:border-slate-850 p-8 md:p-12 rounded-3xl shadow-xl flex flex-col lg:flex-row justify-between items-center gap-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-secondary-container">
              <SearchCode className="w-3.5 h-3.5" /> Estado del Dispositivo
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
              ¿Tu equipo ya está en nuestro laboratorio técnico?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Introduce el número de ticket (ej: WO-2026-0001) para comprobar la fase actual de calibración, pruebas de calidad o disponibilidad de piezas OEM.
            </p>
          </div>

          <form onSubmit={handleTicketSearch} className="w-full max-w-md bg-white/5 border border-white/10 p-2 rounded-2xl flex items-center gap-2 backdrop-blur-md">
            <Search className="w-5 h-5 text-white/50 ml-3" />
            <input 
              type="text" 
              placeholder="Número de Ticket o WO-..."
              className="bg-transparent border-none text-white text-xs font-semibold focus:outline-none flex-grow placeholder:text-white/30 px-2 py-3"
              value={ticketSearchId}
              onChange={(e) => setTicketSearchId(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-secondary hover:bg-secondary/95 text-white px-5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shadow active:scale-95"
            >
              Rastrear Orden
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}


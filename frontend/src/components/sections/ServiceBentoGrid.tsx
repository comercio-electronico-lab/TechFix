'use client';

import React from 'react';
import Link from 'next/link';
import { ScrollReveal } from '../ui';
import { Wrench, ArrowRight, ShieldCheck, Database, HardDrive } from 'lucide-react';

const ServiceBentoGrid = () => {
  return (
    <section className="w-full py-16 bg-background">
      {/* Title block of the section */}
      <ScrollReveal variant="fade-up" className="w-full">
        <div className="text-center py-10 max-w-2xl mx-auto px-6">
          <span className="text-[10px] font-extrabold text-secondary dark:text-sky-400 uppercase tracking-widest block mb-2">
            Nuestras Especialidades
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-on-surface dark:text-white tracking-tight leading-tight font-h1">
            Ingeniería de Precisión
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto mt-3 font-medium">
            Equipados con laboratorios industriales y técnicos certificados para realizar micro-soldadura, reconstrucción de circuitos y diagnósticos asistidos por software.
          </p>
        </div>
      </ScrollReveal>

      {/* Bento Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Laptops (md:col-span-2) - Glassmorphic / Light Ice Theme */}
        <ScrollReveal 
          variant="fade-up" 
          delay="0"
          className="relative md:col-span-2 min-h-[350px] rounded-3xl overflow-hidden glass-card dark:bg-slate-900/60 p-8 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-primary/50 dark:hover:border-sky-400/50 transition-all duration-300 shadow-sm hover:shadow-lg"
        >
          <div className="flex-1 flex flex-col justify-between h-full z-10 space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-on-surface dark:text-white leading-tight font-h2">
                Laptops Empresariales
              </h3>
              <p className="text-xs md:text-sm text-on-surface-variant dark:text-slate-400 mt-2 max-w-md font-medium leading-relaxed">
                Diagnóstico avanzado y reparación de placa madre a nivel de microcomponente para series MacBook Pro, ThinkPad P y Dell Precision.
              </p>
            </div>
            <div>
              <Link href="/reparaciones?type=laptops">
                <button className="bg-primary dark:bg-sky-500 text-white font-bold py-2.5 px-6 rounded-full inline-flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px] tracking-wider uppercase cursor-pointer">
                  Reservar Reparación <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center relative select-none pointer-events-none">
            <img 
              alt="Reparación Laptops" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJgM0XVvkuVt1SxY1SIN3aX8vZiXBTtFdYw4mwCLf_GVrXnoZas571zfMvC8tSIK6PyZUWd9EeBtqIkWrRmSe_zYD2mltbiY021JjP0bWmisa4IRUF_NXTSwv0x7pjiZFUn0cvxNUyuJBhzdQaruat1927G2omoXE7B59WEAL4Flo8rbIPrxFXb5wCezBoPMie8v8IAilg9LM7BfJ_Tp_gtaduBNMN3c_dxnvTdhWIS8vBarAx_RTiSDXsJze6s5puJAgHzethfbM"
              className="max-h-[200px] md:max-h-[220px] object-contain transform group-hover:scale-[1.04] transition-transform duration-500"
            />
          </div>
        </ScrollReveal>

        {/* Card 2: Microsoldadura (md:col-span-1) - Space Navy Theme */}
        <ScrollReveal 
          variant="fade-up" 
          delay="100"
          className="relative md:col-span-1 min-h-[350px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#030c24] via-[#061533] to-[#020816] border border-[#13306d]/40 p-8 flex flex-col justify-between group hover:border-secondary/50 transition-all duration-300 shadow-sm"
        >
          <div className="z-10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white leading-tight font-h2">
                Microsoldadura SMD
              </h3>
              <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">
                Reparación microscópica de placas lógicas, micro-soldadura SMD e integrados BGA bajo rigurosos estándares IPC.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center my-4 select-none pointer-events-none">
            <img 
              alt="Microsoldadura" 
              src="/microsoldering.png"
              className="max-h-[140px] object-contain transform group-hover:scale-[1.05] transition-transform duration-500"
            />
          </div>
          <div className="z-10">
            <Link href="/reparaciones?type=laptops">
              <button className="bg-secondary text-on-secondary font-bold py-2.5 px-5 rounded-full w-full inline-flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px] tracking-wider uppercase cursor-pointer">
                Reservar Cita <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </ScrollReveal>

        {/* Card 3: Data Recovery (md:col-span-1) - Glassmorphic / Light Theme */}
        <ScrollReveal 
          variant="fade-up" 
          delay="200"
          className="relative md:col-span-1 min-h-[350px] rounded-3xl overflow-hidden glass-card dark:bg-slate-900/60 p-8 flex flex-col justify-between group hover:border-primary/50 dark:hover:border-sky-400/50 transition-all duration-300 shadow-sm hover:shadow-lg"
        >
          <div className="z-10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-on-surface dark:text-white leading-tight font-h2">
                Recuperación Forense
              </h3>
              <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-2 font-medium leading-relaxed">
                Recuperación forense de archivos en memorias de estado sólido NVMe y discos duros mecánicos dañados físicamente.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center my-4 select-none pointer-events-none">
            <img 
              alt="Recuperación de Datos" 
              src="/data_recovery.png"
              className="max-h-[140px] object-contain transform group-hover:scale-[1.05] transition-transform duration-500"
            />
          </div>
          <div className="z-10">
            <Link href="/reparaciones?type=desktops">
              <button className="bg-[#0b61a1] text-white font-bold py-2.5 px-5 rounded-full w-full inline-flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px] tracking-wider uppercase cursor-pointer">
                Solicitar Cotización <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </ScrollReveal>

        {/* Card 4: OEM Parts (md:col-span-2) - Dark Theme */}
        <ScrollReveal 
          variant="fade-up" 
          delay="300"
          className="relative md:col-span-2 min-h-[350px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#010512] via-[#0b1a30]/20 to-[#020816] border border-slate-800/60 p-8 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-secondary/50 transition-all duration-300 shadow-sm"
        >
          <div className="flex-1 flex flex-col justify-between h-full z-10 space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                <HardDrive className="w-5 h-5" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white leading-tight font-h2">
                Repuestos Certificados OEM
              </h3>
              <p className="text-xs md:text-sm text-slate-400 mt-2 max-w-md font-medium leading-relaxed">
                Instalación y calibración de paneles de pantalla OLED, celdas de batería de alta densidad y repuestos oficiales importados directamente de fábrica.
              </p>
            </div>
            <div>
              <Link href="/catalogo">
                <button className="bg-secondary text-on-secondary font-bold py-2.5 px-6 rounded-full inline-flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px] tracking-wider uppercase cursor-pointer">
                  Ver repuestos en stock <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center relative select-none pointer-events-none">
            <img 
              alt="Repuestos Certificados" 
              src="/oem_screens_batteries.png"
              className="max-h-[200px] md:max-h-[220px] object-contain transform group-hover:scale-[1.04] transition-transform duration-500"
            />
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

export default ServiceBentoGrid;
import React from 'react';
import { Laptop, Wrench, Database, Smartphone } from 'lucide-react';
import Container from '../ui/Container';
import { ScrollReveal } from '../ui';

const ServiceBentoGrid = () => {
  return (
    <section className="py-20 bg-surface dark:bg-slate-950/20">
      <Container>
        <ScrollReveal variant="fade-up" duration="700">
          <div className="text-center mb-16">
            <span className="text-[10px] font-extrabold text-secondary dark:text-sky-400 uppercase tracking-widest block mb-2">
              Nuestras Habilidades
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-on-surface dark:text-white tracking-tight">
              Especialidades de Ingeniería
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto mt-3">
              Nuestros laboratorios cuentan con ingenieros especializados y herramientas industriales de calibración y microsoldadura.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[550px]">
          {/* Item Grande: Laptop */}
          <ScrollReveal variant="fade-up" delay="0" className="md:col-span-2 md:row-span-2 h-full">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-outline-variant/60 dark:border-slate-800/80 shadow-md flex flex-col justify-between group hover:shadow-2xl hover:border-primary dark:hover:border-sky-500 hover:-translate-y-1 transition-all duration-300 h-full">
              <div>
                <div className="bg-primary/5 dark:bg-sky-500/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary dark:text-sky-400 mb-6 group-hover:scale-110 transition-transform">
                  <Laptop className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-on-surface dark:text-white mb-2">Reparación de Laptops Empresariales</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
                  Diagnóstico y reparación autorizada de placa madre a nivel de componente para series MacBook Pro, ThinkPad P y Dell Precision.
                </p>
              </div>
              <div className="mt-6 rounded-2xl overflow-hidden aspect-video border border-slate-100 dark:border-slate-800">
                <img 
                  alt="Reparación de Laptop" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJgM0XVvkuVt1SxY1SIN3aX8vZiXBTtFdYw4mwCLf_GVrXnoZas571zfMvC8tSIK6PyZUWd9EeBtqIkWrRmSe_zYD2mltbiY021JjP0bWmisa4IRUF_NXTSwv0x7pjiZFUn0cvxNUyuJBhzdQaruat1927G2omoXE7B59WEAL4Flo8rbIPrxFXb5wCezBoPMie8v8IAilg9LM7BfJ_Tp_gtaduBNMN3c_dxnvTdhWIS8vBarAx_RTiSDXsJze6s5puJAgHzethfbM"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Item Horizontal: Microsoldadura */}
          <ScrollReveal variant="fade-up" delay="100" className="md:col-span-2 h-full">
            <div className="bg-gradient-to-br from-secondary to-sky-500 dark:from-[#061533] dark:to-[#020816] p-8 rounded-3xl text-white flex flex-col sm:flex-row items-center gap-6 group overflow-hidden border border-outline-variant/10 dark:border-slate-850 shadow-md hover:shadow-2xl hover:border-secondary dark:hover:border-sky-500 hover:-translate-y-1 transition-all duration-300 h-full">
              <div className="flex-1 space-y-2">
                <span className="text-[9px] font-black text-blue-100 dark:text-sky-300 uppercase tracking-widest block">
                  Alta Precisión
                </span>
                <h3 className="text-xl font-black text-white leading-tight">Microsoldadura Avanzada</h3>
                <p className="text-xs text-blue-50/90 dark:text-slate-350 leading-relaxed">
                  Reparación microscópica de componentes SMD y reemplazo de integrados BGA bajo estándares internacionales IPC.
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10 group-hover:scale-110 group-hover:bg-sky-500/20 transition-all duration-300 shrink-0">
                <Wrench className="w-8 h-8 text-sky-400" />
              </div>
            </div>
          </ScrollReveal>

          {/* Item Pequeño 1: Recuperación de Datos */}
          <ScrollReveal variant="fade-up" delay="200" className="h-full">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-outline-variant/60 dark:border-slate-800/80 shadow-md flex flex-col justify-center gap-4 group hover:shadow-2xl hover:border-primary dark:hover:border-sky-500 hover:-translate-y-1 transition-all duration-300 h-full">
              <div className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-sky-500/10 flex items-center justify-center text-secondary dark:text-sky-400 group-hover:scale-110 transition-transform">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-on-surface dark:text-white">Recuperación de Datos</h4>
                <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1 leading-relaxed">
                  Recuperación forense de archivos en memorias sólidas NVMe y discos duros mecánicos dañados.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Item Pequeño 2: Cambio de Pantalla */}
          <ScrollReveal variant="fade-up" delay="300" className="h-full">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-outline-variant/60 dark:border-slate-800/80 shadow-md flex flex-col justify-center gap-4 group hover:shadow-2xl hover:border-primary dark:hover:border-sky-500 hover:-translate-y-1 transition-all duration-300 h-full">
              <div className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-sky-500/10 flex items-center justify-center text-secondary dark:text-sky-400 group-hover:scale-110 transition-transform">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-on-surface dark:text-white">Pantallas y Baterías OEM</h4>
                <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1 leading-relaxed">
                  Instalación certificada de paneles OLED, celdas de batería y repuestos oficiales de fábrica.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
};

export default ServiceBentoGrid;
'use client';

import React from 'react';
import AppleBanner from './AppleBanner';
import { ScrollReveal } from '../ui';

interface ServiceBanner {
  id: string;
  title: string;
  description: string;
  image: string;
  isDarkTheme: boolean;
  bgGradient: string;
  linkAction: string;
  actionText: string;
}

const ServiceBentoGrid = () => {
  const banners: ServiceBanner[] = [
    {
      id: "laptops",
      title: "Reparación de Laptops Empresariales",
      description: "Diagnóstico avanzado y reparación de placa madre a nivel de componente para series MacBook Pro, ThinkPad P y Dell Precision.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJgM0XVvkuVt1SxY1SIN3aX8vZiXBTtFdYw4mwCLf_GVrXnoZas571zfMvC8tSIK6PyZUWd9EeBtqIkWrRmSe_zYD2mltbiY021JjP0bWmisa4IRUF_NXTSwv0x7pjiZFUn0cvxNUyuJBhzdQaruat1927G2omoXE7B59WEAL4Flo8rbIPrxFXb5wCezBoPMie8v8IAilg9LM7BfJ_Tp_gtaduBNMN3c_dxnvTdhWIS8vBarAx_RTiSDXsJze6s5puJAgHzethfbM",
      isDarkTheme: false,
      bgGradient: "from-[#ecf3fa] via-[#f5f8fc] to-[#ffffff]",
      linkAction: "/reparaciones?type=laptops",
      actionText: "Reservar reparación",
    },
    {
      id: "microsoldering",
      title: "Microsoldadura de Alta Precisión",
      description: "Reparación microscópica de componentes SMD y reemplazo de integrados BGA bajo estándares internacionales IPC.",
      image: "/microsoldering.png",
      isDarkTheme: true,
      bgGradient: "from-[#030c24] via-[#061533] to-[#020816]",
      linkAction: "/reparaciones?type=laptops",
      actionText: "Reservar cita",
    },
    {
      id: "data-recovery",
      title: "Recuperación de Datos Forense",
      description: "Recuperación forense de archivos en memorias sólidas NVMe y discos duros mecánicos dañados físicamente.",
      image: "/data_recovery.png",
      isDarkTheme: false,
      bgGradient: "from-[#f3f7ff] via-[#f7faff] to-[#ffffff]",
      linkAction: "/reparaciones?type=desktops",
      actionText: "Solicitar cotización",
    },
    {
      id: "oem-parts",
      title: "Pantallas y Baterías Certificadas",
      description: "Instalación y calibración certificada de paneles OLED, celdas de batería y repuestos oficiales de fábrica.",
      image: "/oem_screens_batteries.png",
      isDarkTheme: true,
      bgGradient: "from-[#010512] via-[#0b1a30]/20 to-[#020816]",
      linkAction: "/catalogo",
      actionText: "Ver piezas en stock",
    }
  ];

  return (
    <section className="w-full flex flex-col gap-6 py-6 bg-background">
      {/* Title block of the section */}
      <ScrollReveal variant="fade-up" className="w-full">
        <div className="text-center py-10 max-w-2xl mx-auto px-6">
          <span className="text-[10px] font-extrabold text-secondary dark:text-sky-400 uppercase tracking-widest block mb-2">
            Nuestras Habilidades
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-on-surface dark:text-white tracking-tight leading-tight">
            Especialidades de Ingeniería
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto mt-3 font-medium">
            Nuestros laboratorios cuentan con ingenieros certificados, herramientas industriales de calibración y microsoldadura de precisión.
          </p>
        </div>
      </ScrollReveal>

      {/* Vertical banners list */}
      {banners.map((banner, index) => (
        <AppleBanner
          key={banner.id}
          id={banner.id}
          tagline="Especialidad de Ingeniería"
          title={banner.title}
          description={banner.description}
          image={banner.image}
          isDarkTheme={banner.isDarkTheme}
          bgGradient={banner.bgGradient}
          linkAction={banner.linkAction}
          actionText={banner.actionText}
          delay={(index % 2 === 0 ? '0' : '100') as any}
        />
      ))}
    </section>
  );
};

export default ServiceBentoGrid;
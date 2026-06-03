'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ShieldCheck, 
  Wrench, 
  Cpu, 
  Users, 
  Award, 
  Target,
  ArrowRight,
  HeartHandshake
} from 'lucide-react';

// Reusable components
import StatsCard from '@/components/cards/StatsCard';
import PillarCard from '@/components/cards/PillarCard';
import TeamMemberCard from '@/components/cards/TeamMemberCard';
import Timeline from '@/components/about/Timeline';
import Button from '@/components/ui/Button';

export default function SobreNosotros() {
  const stats = [
    { label: 'Reparaciones Exitosas', value: '15,000+', icon: Wrench, color: 'blue' as const },
    { label: 'Clientes Satisfechos', value: '99.8%', icon: HeartHandshake, color: 'green' as const },
    { label: 'Componentes en Catálogo', value: '2,500+', icon: Cpu, color: 'primary' as const },
    { label: 'Años de Experiencia', value: '5+', icon: Award, color: 'amber' as const },
  ];

  const pillars = [
    {
      title: 'Calidad Certificada (OEM)',
      description: 'Trabajamos exclusivamente con fabricantes autorizados y repuestos originales de calidad premium (OEM) para asegurar que cada reparación mantenga los estándares de fábrica.',
      icon: ShieldCheck,
      iconColor: 'text-sky-500 dark:text-sky-400',
    },
    {
      title: 'Diagnóstico Inteligente',
      description: 'Pioneros en la integración del Asistente PIG, un flujo lógico interactivo guiado por software que te ayuda a aislar problemas físicos y lógicos en minutos.',
      icon: Sparkles,
      iconColor: 'text-indigo-500 dark:text-indigo-400',
    },
    {
      title: 'Transparencia Total',
      description: 'Olvídate de las sorpresas. Ofrecemos cotizaciones estructuradas, seguimiento en tiempo real de tus órdenes y explicaciones técnicas comprensibles.',
      icon: Users,
      iconColor: 'text-emerald-500 dark:text-emerald-400',
    },
  ];

  const milestones = [
    {
      year: '2021',
      title: 'Fundación de TechFix',
      description: 'Nacimos con el propósito de dignificar y profesionalizar el servicio técnico de dispositivos electrónicos mediante procesos transparentes.',
    },
    {
      year: '2022',
      title: 'Catálogo de Repuestos DIY',
      description: 'Lanzamos nuestra tienda en línea para proveer componentes premium a técnicos independientes y entusiastas de la electrónica.',
    },
    {
      year: '2024',
      title: 'El Asistente PIG',
      description: 'Desarrollamos el primer motor de diagnóstico lógico en línea, optimizando los tiempos de recepción y soporte de hardware.',
    },
    {
      year: '2026',
      title: 'Expansión de Laboratorios',
      description: 'Inauguramos laboratorios especializados con microscopía avanzada y soldadura de precisión micro-BGA para reparaciones complejas a nivel de placa.',
    },
  ];

  const team = [
    {
      name: 'Alejandro Ramos',
      role: 'Co-Fundador & Especialista BGA',
      initials: 'AR',
      bgGradient: 'bg-gradient-to-br from-sky-400 to-indigo-600',
      bio: 'Ingeniero de Microelectrónica con más de 8 años reparando placas base y sistemas lógicos de Apple y PC.',
    },
    {
      name: 'Sofía Valenzuela',
      role: 'Directora de Operaciones',
      initials: 'SV',
      bgGradient: 'bg-gradient-to-br from-emerald-400 to-teal-600',
      bio: 'Especialista en logística y cadena de suministro OEM, asegurando que cada componente cumpla con control de calidad.',
    },
    {
      name: 'Kevin Martínez',
      role: 'Desarrollador de Sistemas de Diagnóstico',
      initials: 'KM',
      bgGradient: 'bg-gradient-to-br from-purple-400 to-pink-600',
      bio: 'Arquitecto de software detrás del asistente interactivo de diagnóstico lógico PIG y flujos de automatización.',
    },
  ];

  return (
    <div className="space-y-24 pb-28 min-h-screen bg-background text-on-background">
      {/* Premium Integrated Hero Section */}
      <section className="relative overflow-hidden -mt-[72px] pt-[150px] pb-20 text-white bg-slate-950 flex items-center justify-center">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-container-max w-full mx-auto px-gutter relative z-10 flex flex-col items-center text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" /> Innovación y Precisión en Hardware
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight">
            Redefiniendo el <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400">Servicio Técnico</span>
          </h1>
          <p className="font-body-lg text-slate-350 max-w-2xl leading-relaxed text-sm md:text-base">
            Somos un equipo de apasionados por la ingeniería y la microelectrónica. Nos dedicamos a revivir tus dispositivos con diagnósticos de vanguardia y componentes certificados.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-container-max mx-auto px-gutter -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, idx) => (
            <StatsCard 
              key={idx}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>
      </section>

      {/* Company Philosophy & Pillars */}
      <section className="max-w-container-max mx-auto px-gutter space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-on-surface dark:text-white">
            Nuestros Pilares Operativos
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant dark:text-slate-400">
            Fundamos TechFix sobre la base de la excelencia técnica y la honestidad al cliente. Estos valores guían cada una de nuestras reparaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <PillarCard 
              key={index}
              title={pillar.title}
              description={pillar.description}
              icon={pillar.icon}
              iconColor={pillar.iconColor}
            />
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-slate-50 dark:bg-slate-950/40 py-16 border-y border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-gutter space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-on-surface dark:text-white">
              Nuestra Trayectoria
            </h2>
            <p className="text-sm md:text-base text-on-surface-variant dark:text-slate-400">
              Cómo pasamos de diagnosticar hardware de forma local a automatizar flujos técnicos de forma digital.
            </p>
          </div>

          <Timeline items={milestones} />
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-container-max mx-auto px-gutter space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-on-surface dark:text-white">
            El Equipo Detrás del Servicio
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant dark:text-slate-400">
            Contamos con ingenieros certificados y técnicos apasionados listos para resolver cualquier desafío de hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <TeamMemberCard 
              key={index}
              name={member.name}
              role={member.role}
              initials={member.initials}
              bgGradient={member.bgGradient}
              bio={member.bio}
            />
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="max-w-container-max mx-auto px-gutter">
        <div className="relative bg-slate-950 rounded-3xl overflow-hidden p-8 md:p-12 text-white border border-slate-800 flex flex-col lg:flex-row justify-between items-center gap-8">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="space-y-4 max-w-2xl relative z-10 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-black text-white">
              ¿Tu equipo electrónico necesita ayuda profesional?
            </h2>
            <p className="text-xs md:text-sm text-slate-350 leading-relaxed">
              Usa nuestro asistente interactivo para diagnosticar tu dispositivo gratis en línea, o visita nuestro catálogo para encontrar el componente exacto que necesitas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full sm:w-auto">
            <Link href="/reparaciones" className="w-full sm:w-auto">
              <Button variant="secondary" icon={Wrench} className="w-full uppercase tracking-wider text-xs font-black py-3.5 bg-sky-600 hover:bg-sky-500 border-none text-white">
                Diagnosticar Dispositivo
              </Button>
            </Link>
            <Link href="/catalogo" className="w-full sm:w-auto">
              <Button variant="outline" icon={ArrowRight} className="w-full uppercase tracking-wider text-xs font-black py-3.5 bg-slate-800 hover:bg-slate-700 border-slate-700 text-white">
                Ver Catálogo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

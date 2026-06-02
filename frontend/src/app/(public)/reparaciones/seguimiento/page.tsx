"use client";

import React, { useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Wrench, 
  Download, 
  ShieldCheck, 
  Laptop, 
  ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';
import RepairTimeline, { TimelineStep } from '@/components/repair/RepairTimeline';
import DeviceSummaryCard from '@/components/repair/DeviceSummaryCard';
import WarrantyCertificateCard from '@/components/repair/WarrantyCertificateCard';

function RepairTrackingContent() {
  const searchParams = useSearchParams();
  
  // Parámetros dinámicos del ticket o valores mock por defecto
  const ticketId = searchParams.get('ticket') || 'TFX-8924-M';
  const deviceModel = searchParams.get('device') || 'MacBook Pro 16"';
  const deviceSpecs = searchParams.get('specs') || 'M1 Max, 32GB RAM, 1TB SSD';
  const serialNumber = searchParams.get('serial') || 'C02G8493Q05D';

  const steps = useMemo<TimelineStep[]>(() => [
    {
      id: 1,
      title: 'Dispositivo Recibido',
      description: 'Tu dispositivo ha sido ingresado de forma segura en nuestro laboratorio central.',
      date: 'Oct 24, 09:15 AM',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Revisión y Diagnóstico',
      description: 'Nuestros ingenieros de hardware han concluido la revisión lógica inicial. Se identificó un fallo crítico en el circuito integrado de energía (IC de carga) en la placa base.',
      date: 'Oct 25, 02:30 PM',
      status: 'completed'
    },
    {
      id: 3,
      title: 'En Espera de Repuestos',
      description: 'Actualmente estamos esperando el arribo del chip controlador original de energía (Power IC) directo del fabricante OEM. Tiempo estimado de tránsito a nuestra sucursal: 2 días hábiles.',
      status: 'active',
      detailedInfo: 'Estamos a la espera de un circuito integrado original directo de fábrica. La entrega estimada a nuestras instalaciones de laboratorio es de 2 días hábiles.'
    },
    {
      id: 4,
      title: 'Reparación y Control de Calidad',
      description: 'Instalación microscópica de nuevos componentes y fases rigurosas de stress-testing para validar la reparación.',
      status: 'pending'
    },
    {
      id: 5,
      title: 'Listo para Entrega',
      description: 'El dispositivo será limpiado por ultrasonido, sellado con adhesivo original y puesto en recepción para retiro o despacho.',
      status: 'pending'
    }
  ], []);

  return (
    <div className="bg-surface dark:bg-slate-950 min-h-screen flex transition-colors duration-300 font-sans">
      
      {/* Sidebar de Portal de Clientes */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-outline-variant/30 dark:border-slate-800 p-4 shrink-0 transition-colors">
        <div className="flex items-center gap-4 mb-8 px-2 mt-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-850 shrink-0 border border-outline-variant/30">
            <img 
              alt="Cliente Avatar" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0UEDyYFZRhkV1tfOUGdJZUt84g5tOj3_KlrvAt2ne8Pa0gtGXvUiT4K0lIwJ1VvBURRAfuNo2Mo_yh-oTK2sjFd0G8BaLf6MFC6Dnyixy-4QeMX9_QXZLmlx-GrKCc4MpfPEN-wlUPJtCxuRo6hNDQghcXF83upDo_yGMasAOACvCd0Nk42yQJy2AQPiwuGdSm7l17M_R2r4-Zuia3zRPwon5U5KCG4FNQofvQIS90pwWJ4Pcj7fSzlXNs39uF9_6M9HWXNJZ8xZQ" 
            />
          </div>
          <div>
            <h2 className="font-bold text-sm text-primary dark:text-sky-400 leading-snug">Portal de Clientes</h2>
            <p className="text-[10px] text-on-surface-variant dark:text-slate-500 font-bold uppercase tracking-wide mt-0.5">Carlos Pérez</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          <Link 
            href="/portal?tab=Devices"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all duration-200"
          >
            <Laptop className="w-4 h-4 shrink-0" />
            <span>Mis Dispositivos</span>
          </Link>
          
          <Link 
            href="/portal?tab=Purchases"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all duration-200"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Mis Compras</span>
          </Link>

          <Link 
            href="/portal?tab=Repairs"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider bg-primary dark:bg-sky-600 text-white transition-all duration-200"
          >
            <Wrench className="w-4 h-4 shrink-0" />
            <span>Mis Reparaciones</span>
          </Link>
        </nav>
      </aside>

      {/* Main Tracking Panel */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        {/* Cabecera del Diagnóstico y Navegación móvil */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 md:hidden">
              <Link 
                href="/portal" 
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary dark:text-sky-400"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Volver al Portal
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-on-surface dark:text-white leading-tight">
              Seguimiento de Reparación
            </h1>
            <p className="text-sm text-on-surface-variant dark:text-slate-450 mt-1">
              Ticket <span className="font-mono font-bold select-all text-primary dark:text-sky-400">#{ticketId}</span> • Creado el 24 de Oct, 2023
            </p>
          </div>
          
          <button 
            onClick={() => alert('Descargando factura en formato PDF (Demostración)...')}
            className="inline-flex items-center justify-center h-10 px-4 bg-transparent border border-primary dark:border-sky-500 text-primary dark:text-sky-400 font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-primary/5 dark:hover:bg-sky-500/10 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Factura
          </button>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna Izquierda: Cronograma Temporal Vertical */}
          <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-on-surface dark:text-white mb-8 border-b border-outline-variant/20 dark:border-slate-800 pb-4 tracking-tight">
              Estado del Servicio
            </h2>
            
            <RepairTimeline steps={steps} />
          </div>

          {/* Columna Derecha: Tarjetas de Información Adicional */}
          <div className="col-span-1 flex flex-col gap-6">
            
            {/* Device Summary Card */}
            <DeviceSummaryCard 
              deviceModel={deviceModel}
              deviceSpecs={deviceSpecs}
              serialNumber={serialNumber}
            />

            {/* Warranty Certificate Card */}
            <WarrantyCertificateCard 
              token="TC-892-XVF-441"
              startDate="Oct 24, 2023"
              endDate="Oct 24, 2024"
            />

          </div>

        </div>

      </main>
    </div>
  );
}

export default function RepairTracking() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-surface dark:bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent dark:border-sky-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-on-surface-variant dark:text-slate-400 text-sm">Cargando seguimiento de reparación...</p>
        </div>
      </div>
    }>
      <RepairTrackingContent />
    </Suspense>
  );
}

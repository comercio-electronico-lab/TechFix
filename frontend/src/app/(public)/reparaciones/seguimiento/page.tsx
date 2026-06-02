"use client";

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Wrench, 
  Check, 
  Download, 
  ShieldCheck, 
  Copy, 
  Laptop, 
  ArrowLeft, 
  Clock, 
  FileText,
  User,
  HeartHandshake
} from 'lucide-react';
import Link from 'next/link';

interface TimelineStep {
  id: number;
  title: string;
  description: string;
  date?: string;
  status: 'completed' | 'active' | 'pending';
  detailedInfo?: string;
}

function RepairTrackingContent() {
  const searchParams = useSearchParams();
  
  // Parámetros dinámicos del ticket o valores mock por defecto
  const ticketId = searchParams.get('ticket') || 'TFX-8924-M';
  const deviceBrand = searchParams.get('brand') || 'Apple';
  const deviceModel = searchParams.get('device') || 'MacBook Pro 16"';
  const deviceSpecs = searchParams.get('specs') || 'M1 Max, 32GB RAM, 1TB SSD';
  const serialNumber = searchParams.get('serial') || 'C02G8493Q05D';

  const [copiedToken, setCopiedToken] = useState(false);

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

  const handleCopyToken = () => {
    navigator.clipboard.writeText('TC-892-XVF-441');
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

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
            
            <div className="pl-4 pt-2">
              <ul className="relative border-l-2 border-primary/20 dark:border-slate-800/80 space-y-10">
                {steps.map((step) => {
                  const isCompleted = step.status === 'completed';
                  const isActive = step.status === 'active';
                  const isPending = step.status === 'pending';
                  
                  return (
                    <li key={step.id} className={`relative pl-8 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                      
                      {/* Icono del Círculo Flotante */}
                      <div className={`absolute -left-[17px] flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-white dark:ring-slate-900 ${
                        isCompleted 
                          ? 'bg-primary dark:bg-sky-600 text-white' 
                          : isActive 
                          ? 'bg-primary-container dark:bg-sky-950/80 border-2 border-primary dark:border-sky-500 text-primary dark:text-sky-400' 
                          : 'bg-white dark:bg-slate-900 border-2 border-outline-variant dark:border-slate-700 text-on-surface-variant'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-4 h-4 stroke-[3px]" />
                        ) : isActive ? (
                          <Clock className="w-4 h-4 animate-pulse stroke-[2.5px]" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-outline-variant dark:bg-slate-600"></span>
                        )}
                      </div>

                      {/* Título */}
                      <h3 className={`font-semibold text-sm leading-snug ${
                        isActive ? 'text-primary dark:text-sky-400 text-base font-bold' : 'text-on-surface dark:text-slate-200'
                      }`}>
                        {step.title}
                      </h3>
                      
                      {/* Descripción */}
                      <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                        {step.description}
                      </p>

                      {/* Info Detallada Adicional para el Estado Activo */}
                      {isActive && step.detailedInfo && (
                        <div className="bg-surface-container-low dark:bg-slate-950/60 border border-outline-variant dark:border-slate-800 rounded-lg p-4 mt-3 mb-2 flex items-start gap-3 shadow-inner">
                          <Wrench className="w-5 h-5 text-amber-500 dark:text-amber-400 mt-0.5 shrink-0" />
                          <p className="text-xs text-on-surface dark:text-slate-300 leading-normal">
                            {step.detailedInfo}
                          </p>
                        </div>
                      )}

                      {/* Fecha de actualización */}
                      {step.date && (
                        <span className="text-[10px] font-bold text-outline dark:text-slate-500 uppercase tracking-wide block mt-1.5 select-none">
                          {step.date}
                        </span>
                      )}
                      
                      {/* Stage Badge */}
                      {isActive && (
                        <span className="inline-block text-[9px] font-bold text-primary dark:text-sky-400 bg-primary/5 dark:bg-sky-500/10 border border-primary/10 dark:border-sky-500/20 px-2 py-0.5 rounded uppercase tracking-wider mt-2 animate-pulse">
                          Etapa Actual
                        </span>
                      )}

                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Columna Derecha: Tarjetas de Información Adicional */}
          <div className="col-span-1 flex flex-col gap-6">
            
            {/* Device Summary Card */}
            <div className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all duration-300">
              <div className="h-40 bg-slate-50 dark:bg-slate-950/60 relative w-full overflow-hidden border-b border-outline-variant/30 dark:border-slate-850">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-200/25 dark:from-slate-950/30 to-transparent z-10"></div>
                <img 
                  alt="Dispositivo en Taller" 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4ZpBupfXu7VTPUUiFwAV5yPa_W81Zh7-t0T8CD0tRbZa5FL9F6kZE5gWjg22V-2EiGKycoTSTN3wT2c4EZcs0mXcIG1gJrv8Gyvk0qnvekQ4KKyt5Kd554jlvNiZSQkf-eCW76YBaxeSFeuVDiGwYIOxcCLKXKrU3u5HKTiuSk-VSsUTd9g8ZZ-oXBWsGKhszo-mDcWoqIMc9vC74kzfkUOsUvJoduI6DHy-l8u_zLg8h2hiiHJjJmla74Eo95yYvs3ftwmC80Nwu" 
                />
              </div>
              <div className="p-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-outline dark:text-slate-500 block mb-1">
                  INFORMACIÓN DEL EQUIPO
                </span>
                <h3 className="font-bold text-lg text-on-surface dark:text-slate-200">
                  {deviceModel}
                </h3>
                <p className="text-xs text-on-surface-variant dark:text-slate-450 mt-0.5">
                  {deviceSpecs}
                </p>
                
                <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/10 dark:border-slate-800 pt-4 mt-4">
                  <div>
                    <span className="text-[10px] font-bold text-outline dark:text-slate-500 uppercase tracking-wide block mb-0.5">Nº de Serie</span>
                    <span className="font-mono text-xs font-semibold text-on-surface dark:text-slate-300 select-all block">
                      {serialNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-outline dark:text-slate-500 uppercase tracking-wide block mb-0.5">Estado Estético</span>
                    <span className="text-xs font-semibold text-on-surface dark:text-slate-300 block">
                      Bueno (Detalles Leves)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warranty Certificate Card */}
            <div className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6 shadow-sm relative overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300">
              
              {/* Sello de seguridad decorativo */}
              <div className="absolute -right-8 -top-8 text-primary/5 dark:text-sky-500/5 select-none pointer-events-none transition-transform group-hover:scale-105 duration-500">
                <ShieldCheck className="w-32 h-32" />
              </div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-5 h-5 text-primary dark:text-sky-400" />
                    <h3 className="font-bold text-sm uppercase tracking-wider text-on-surface dark:text-white">
                      Cobertura TechCare
                    </h3>
                  </div>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400">
                    Soporte Integral de Mano de Obra y Repuesto
                  </p>
                </div>

                {/* Badge Activa */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/20 dark:bg-sky-950/30 text-primary dark:text-sky-400 font-bold text-[10px] uppercase tracking-wider shadow-sm border border-primary/10 dark:border-sky-900/30 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-sky-400 animate-pulse"></div>
                  ACTIVA
                </div>
              </div>

              <div className="space-y-4 relative z-10 flex-1">
                <div>
                  <span className="text-[10px] font-bold text-outline dark:text-slate-500 uppercase tracking-wide block mb-1">
                    Token de Garantía
                  </span>
                  
                  <div 
                    onClick={handleCopyToken}
                    className="bg-slate-50 dark:bg-slate-950 border border-outline-variant/50 dark:border-slate-800 rounded-lg p-3 flex justify-between items-center group cursor-pointer hover:border-primary dark:hover:border-sky-500 transition-colors"
                  >
                    <span className="font-mono text-xs tracking-wider text-on-surface dark:text-slate-300 font-bold">
                      TC-892-XVF-441
                    </span>
                    {copiedToken ? (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                        Copiado
                      </span>
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-outline group-hover:text-primary dark:group-hover:text-sky-400 transition-colors" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold text-outline dark:text-slate-500 uppercase tracking-wide block mb-0.5">Fecha de Inicio</span>
                    <span className="text-xs font-semibold text-on-surface dark:text-slate-350">Oct 24, 2023</span>
                  </div>
                  <div className="w-px h-8 bg-outline-variant/20 dark:bg-slate-800 mx-4"></div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-outline dark:text-slate-500 uppercase tracking-wide block mb-0.5">Fecha de Venc.</span>
                    <span className="text-xs font-semibold text-on-surface dark:text-slate-350">Oct 24, 2024</span>
                  </div>
                </div>
              </div>
              
              {/* Línea estética de seguridad */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-primary dark:via-sky-600 to-primary/30"></div>
            </div>

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

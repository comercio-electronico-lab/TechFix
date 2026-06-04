'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Wrench,
  Download,
  ShieldCheck,
  Laptop,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getRepairTrackingAction } from '@/actions';
import RepairTimeline, { TimelineStep } from '@/components/repair/RepairTimeline';
import DeviceSummaryCard from '@/components/repair/DeviceSummaryCard';
import WarrantyCertificateCard from '@/components/repair/WarrantyCertificateCard';

export default function RepairTrackingClient() {
  const router = useRouter();
  const { token, user, isAuthenticated, loading } = useAuth();
  const searchParams = useSearchParams();

  const ticketId = searchParams.get('ticket') || '';

  const [order, setOrder] = useState<any>(null);
  const [trackingLogs, setTrackingLogs] = useState<any[]>([]);
  const [warranty, setWarranty] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth?redirect=/reparaciones/seguimiento');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    async function fetchTracking() {
      if (!ticketId) {
        setError('No se especificó un ID de ticket válido en la URL.');
        setDataLoading(false);
        return;
      }

      setDataLoading(true);
      setError(null);

      try {
        const data = await getRepairTrackingAction(ticketId);
        setOrder(data.order);
        setTrackingLogs(data.tracking || []);
        setWarranty(data.warranty);
      } catch (e: any) {
        console.error(e);
        setError(e.message || 'No se pudo encontrar el ticket de reparación. Por favor, asegúrate de que el código sea correcto.');
      } finally {
        setDataLoading(false);
      }
    }

    if (isAuthenticated && ticketId) {
      fetchTracking();
    }
  }, [ticketId, isAuthenticated]);

  const getStatusIndex = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'in_review': return 1;
      case 'waiting_parts': return 2;
      case 'repairing': return 3;
      case 'ready':
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const getStageLog = (newStatus: string) => {
    if (newStatus === 'ready_or_delivered') {
      return trackingLogs.find(l => l.new_status === 'ready' || l.new_status === 'delivered');
    }
    return trackingLogs.find(l => l.new_status === newStatus);
  };

  const currentStageIndex = order ? getStatusIndex(order.status) : 0;

  const steps = useMemo<TimelineStep[]>(() => {
    if (!order) return [];

    const stages = [
      {
        id: 1,
        statusKey: 'pending',
        title: 'Dispositivo Recibido',
        defaultDesc: 'Tu dispositivo ha sido ingresado de forma segura en nuestro laboratorio central.',
      },
      {
        id: 2,
        statusKey: 'in_review',
        title: 'Revisión y Diagnóstico',
        defaultDesc: 'Nuestros ingenieros de hardware realizan la revisión lógica inicial para diagnosticar fallas de microelectrónica.',
      },
      {
        id: 3,
        statusKey: 'waiting_parts',
        title: 'En Espera de Repuestos',
        defaultDesc: 'Solicitud e importación express de repuestos OEM directos del fabricante si aplica.',
      },
      {
        id: 4,
        statusKey: 'repairing',
        title: 'Reparación y Control de Calidad',
        defaultDesc: 'Instalación microscópica de nuevos componentes y fases rigurosas de stress-testing para validar la reparación.',
      },
      {
        id: 5,
        statusKey: 'ready_or_delivered',
        title: 'Listo para Entrega',
        defaultDesc: 'El dispositivo es limpiado, sellado con adhesivo original y puesto en recepción para entrega o despacho.',
      },
    ];

    return stages.map((stage, idx) => {
      const log = getStageLog(stage.statusKey);
      const isCompleted = currentStageIndex > idx;
      const isActive = currentStageIndex === idx;

      return {
        id: stage.id,
        title: stage.title,
        description: log?.notes || stage.defaultDesc,
        date: log
          ? new Date(log.created_at).toLocaleString('es-ES', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
          : undefined,
        status: isCompleted ? 'completed' : isActive ? 'active' : 'pending',
        detailedInfo: isActive ? log?.notes : undefined,
      };
    });
  }, [order, trackingLogs, currentStageIndex]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const clientName = user?.nombre || 'Portal de Clientes';

  if (loading || dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] space-y-4 bg-surface dark:bg-slate-950">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 dark:border-sky-500/20 border-t-primary dark:border-t-sky-500 animate-spin" />
        <p className="text-sm font-semibold text-on-surface-variant dark:text-slate-400 animate-pulse">
          Sincronizando con los servidores de laboratorio...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error || !order) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-surface dark:bg-slate-950 p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-lg">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto border border-red-500/20 animate-pulse">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-on-surface dark:text-white">Ticket de Reparación Inaccesible</h2>
            <p className="text-sm text-on-surface-variant dark:text-slate-450 leading-relaxed">
              {error || 'No pudimos verificar las credenciales de esta orden de reparación.'}
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/portal"
              className="w-full py-2.5 bg-primary dark:bg-sky-600 hover:bg-primary/95 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-all shadow-sm"
            >
              Iniciar Sesión en el Portal
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 bg-transparent border border-outline-variant/60 dark:border-slate-800 text-on-surface-variant dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-all"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const deviceModelStr = `${order.device?.brand} ${order.device?.model}`;
  const deviceSpecsStr = order.device?.specs || 'N/A';
  const serialNumberStr = order.device?.serial_number || 'N/A';
  const ticketTag = `TKT-${order.id.slice(0, 8).toUpperCase()}`;

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
            <p className="text-[10px] text-on-surface-variant dark:text-slate-500 font-bold uppercase tracking-wide mt-0.5 truncate max-w-[120px]">{clientName}</p>
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
      <main className="flex-grow p-4 md:p-8 overflow-y-auto">
        {/* Cabecera del Diagnóstico y Navegación móvil */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/portal?tab=Repairs"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary dark:text-sky-400 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Volver al Portal
              </Link>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-on-surface dark:text-white leading-tight">
              Seguimiento de Reparación
            </h1>
            <p className="text-sm text-on-surface-variant dark:text-slate-450 mt-1.5">
              Ticket <span className="font-mono font-bold select-all text-primary dark:text-sky-400">#{ticketTag}</span> • Creado el {formatDate(order.created_at)}
            </p>
          </div>

          <button
            onClick={() => alert(`Factura proforma del ticket ${ticketTag} por un valor estimado. Servicio de laboratorio TechFix.`)}
            className="inline-flex items-center justify-center h-10 px-4 bg-transparent border border-primary dark:border-sky-500 text-primary dark:text-sky-400 font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-primary/5 dark:hover:bg-sky-500/10 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Proforma
          </button>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Cronograma Temporal Vertical */}
          <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-on-surface dark:text-white mb-8 border-b border-outline-variant/20 dark:border-slate-800 pb-4 tracking-tight">
              Estado del Servicio en Laboratorio
            </h2>

            <RepairTimeline steps={steps} />
          </div>

          {/* Columna Derecha: Tarjetas de Información Adicional */}
          <div className="col-span-1 flex flex-col gap-6">
            {/* Device Summary Card */}
            <DeviceSummaryCard
              deviceModel={deviceModelStr}
              deviceSpecs={deviceSpecsStr}
              serialNumber={serialNumberStr}
            />

            {/* Warranty Certificate Card (Condicional si ya se emitió en el backend) */}
            {warranty ? (
              <WarrantyCertificateCard
                token={warranty.warranty_token}
                startDate={formatDate(warranty.start_date)}
                endDate={formatDate(warranty.end_date)}
              />
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-on-surface dark:text-slate-350">
                    Certificado de Garantía
                  </h4>
                </div>
                <p className="text-[11px] text-on-surface-variant dark:text-slate-450 leading-relaxed">
                  Tu certificado de cobertura premium por 90 días aparecerá aquí automáticamente una vez finalizado el servicio y retirado el equipo del laboratorio.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

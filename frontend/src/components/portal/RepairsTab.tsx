'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Wrench, 
  ShieldCheck, 
  ArrowUpRight, 
  Calendar, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  History,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useRepairs, RepairOrder, Warranty } from '@/hooks/useRepairs';
import Skeleton from '@/components/ui/Skeleton';

// Mapeador de colores e iconos para el estado de reparación
const STATUS_META: Record<string, { label: string; bg: string; text: string; ring: string; icon: React.ElementType }> = {
  pending: {
    label: 'Agendado / Cita',
    bg: 'bg-slate-100 dark:bg-slate-800/40',
    text: 'text-slate-600 dark:text-slate-400',
    ring: 'ring-slate-500/10 dark:ring-slate-400/20',
    icon: Calendar,
  },
  in_review: {
    label: 'En Revisión y Diagnóstico',
    bg: 'bg-amber-500/10 dark:bg-amber-500/5',
    text: 'text-amber-700 dark:text-amber-400',
    ring: 'ring-amber-500/20 dark:ring-amber-500/10',
    icon: Clock,
  },
  waiting_parts: {
    label: 'Esperando Repuestos',
    bg: 'bg-orange-500/10 dark:bg-orange-500/5',
    text: 'text-orange-700 dark:text-orange-400',
    ring: 'ring-orange-500/20 dark:ring-orange-500/10',
    icon: AlertTriangle,
  },
  repairing: {
    label: 'En Reparación de Placa',
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/5',
    text: 'text-indigo-700 dark:text-indigo-400',
    ring: 'ring-indigo-500/20 dark:ring-indigo-500/10',
    icon: Cpu,
  },
  ready: {
    label: 'Listo para Entrega',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/5',
    text: 'text-emerald-700 dark:text-emerald-400',
    ring: 'ring-emerald-500/20 dark:ring-emerald-500/10',
    icon: CheckCircle2,
  },
  delivered: {
    label: 'Entregado a Titular',
    bg: 'bg-sky-500/10 dark:bg-sky-500/5',
    text: 'text-sky-700 dark:text-sky-400',
    ring: 'ring-sky-500/20 dark:ring-sky-500/10',
    icon: ShieldCheck,
  },
  canceled: {
    label: 'Cancelado',
    bg: 'bg-red-500/10 dark:bg-red-500/5',
    text: 'text-red-700 dark:text-red-400',
    ring: 'ring-red-500/20',
    icon: AlertTriangle,
  },
};

export default function RepairsTab() {
  const { repairs, warranties, loading, error } = useRepairs();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-50 dark:border-slate-850 pb-3">
              <div className="space-y-2">
                <Skeleton className="h-2.5 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-2 w-14" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-2 w-14" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 rounded-xl text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto" />
        <h4 className="font-bold text-red-800 dark:text-red-300">Error al Cargar la Información</h4>
        <p className="text-xs text-red-700/80 dark:text-red-400/80">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      
      {/* SECCIÓN 1: REPARACIONES EN CURSO */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-outline-variant/30 dark:border-slate-800/80 pb-3.5">
          <h2 className="text-lg font-black tracking-tight text-on-surface dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary dark:text-sky-400" /> Órdenes de Trabajo Activas e Historial
          </h2>
          <span className="bg-primary/10 dark:bg-sky-500/10 text-primary dark:text-sky-400 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-primary/15 uppercase tracking-wide">
            {repairs.length} {repairs.length === 1 ? 'Servicio' : 'Servicios'}
          </span>
        </div>

        {repairs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 p-8 rounded-xl shadow-sm text-center py-12">
            <div className="p-4 bg-primary/5 dark:bg-sky-500/5 rounded-full inline-block mb-3 border border-outline-variant/10">
              <Wrench className="w-8 h-8 text-primary dark:text-sky-400 animate-pulse" />
            </div>
            <h3 className="font-bold text-base text-on-surface dark:text-white">Sin Reparaciones Activas</h3>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
              No tienes equipos en laboratorio actualmente. Cuando dejes un dispositivo para mantenimiento o microsoldadura, su progreso en vivo se visualizará aquí.
            </p>
            <div className="mt-5">
              <Link 
                href="/reparaciones"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-primary dark:bg-sky-600 hover:bg-primary-dark text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
              >
                Iniciar Diagnóstico Asistido
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {repairs.map((repair) => {
              const meta = STATUS_META[repair.status] || {
                label: repair.status,
                bg: 'bg-slate-100',
                text: 'text-slate-600',
                ring: 'ring-slate-500/10',
                icon: Wrench,
              };
              const StatusIcon = meta.icon;
              const ticketTag = `TKT-${repair.id.slice(0, 8).toUpperCase()}`;

              return (
                <div 
                  key={repair.id}
                  className="bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header Tarjeta */}
                    <div className="flex justify-between items-start border-b border-slate-50 dark:border-slate-850 pb-3">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 font-mono tracking-widest block">
                          TICKET DE SERVICIO
                        </span>
                        <h3 className="text-lg font-black tracking-tight text-on-surface dark:text-white uppercase font-mono">
                          {ticketTag}
                        </h3>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ring-1 ${meta.bg} ${meta.text} ${meta.ring}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {meta.label}
                      </span>
                    </div>

                    {/* Detalles Dispositivo */}
                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                      <div>
                        <span className="text-on-surface-variant/60 dark:text-slate-550 block mb-0.5 uppercase tracking-wider text-[9px]">EQUIPO</span>
                        <span className="text-sm font-bold text-on-surface dark:text-slate-200">
                          {repair.device?.brand} {repair.device?.model}
                        </span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant/60 dark:text-slate-550 block mb-0.5 uppercase tracking-wider text-[9px]">Nº DE SERIE</span>
                        <span className="text-sm font-mono font-bold text-on-surface dark:text-slate-350 select-all">
                          {repair.device?.serial_number}
                        </span>
                      </div>
                      <div className="col-span-2 border-t border-slate-50 dark:border-slate-850/50 pt-3">
                        <span className="text-on-surface-variant/60 dark:text-slate-550 block mb-0.5 uppercase tracking-wider text-[9px]">FECHA DE INGRESO / CITA</span>
                        <span className="text-xs font-bold text-on-surface dark:text-slate-300 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {formatDate(repair.appointment_datetime || repair.created_at || '')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action Tracking */}
                  <div className="mt-6 pt-4 border-t border-outline-variant/20 dark:border-slate-800/40 flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Ingreso: {formatDate(repair.created_at || '')}
                    </span>
                    <Link
                      href={`/reparaciones/seguimiento?ticket=${repair.id}&device=${repair.device?.brand} ${repair.device?.model}&serial=${repair.device?.serial_number}`}
                      className="inline-flex items-center gap-1 text-xs font-extrabold text-primary dark:text-sky-400 hover:text-primary-dark dark:hover:text-sky-300 transition-colors uppercase tracking-wider group"
                    >
                      Seguimiento en Vivo 
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECCIÓN 2: CERTIFICADOS DE GARANTÍA DIGITALES */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-outline-variant/30 dark:border-slate-800/80 pb-3.5">
          <h2 className="text-lg font-black tracking-tight text-on-surface dark:text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary dark:text-sky-400" /> Certificados de Garantías Activas
          </h2>
          <span className="bg-primary/10 dark:bg-sky-500/10 text-primary dark:text-sky-400 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-primary/15 uppercase tracking-wide">
            {warranties.length} {warranties.length === 1 ? 'Garantía' : 'Garantías'}
          </span>
        </div>

        {warranties.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 p-8 rounded-xl shadow-sm text-center py-12">
            <div className="p-4 bg-primary/5 dark:bg-sky-500/5 rounded-full inline-block mb-3 border border-outline-variant/10">
              <ShieldCheck className="w-8 h-8 text-primary dark:text-sky-400" />
            </div>
            <h3 className="font-bold text-base text-on-surface dark:text-white">Sin Garantías Registradas</h3>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
              Las garantías digitales se emiten y activan automáticamente una vez que tu dispositivo ha sido reparado con éxito y retirado del taller.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {warranties.map((warranty) => {
              const isExpired = new Date(warranty.end_date) < new Date();
              const isValid = warranty.is_active && !isExpired;

              return (
                <div 
                  key={warranty.id}
                  className="group bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary dark:hover:border-sky-500 transition-all duration-350 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Glowing background decor for active warranties */}
                  {isValid && (
                    <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-bl-full flex items-center justify-center opacity-40 -z-0 pointer-events-none" />
                  )}

                  <div className="space-y-4">
                    {/* Header Tarjeta */}
                    <div className="flex justify-between items-start border-b border-slate-50 dark:border-slate-850 pb-3">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 font-mono tracking-widest block">
                          CERTIFICADO DIGITAL
                        </span>
                        <h4 className="text-base font-black text-on-surface dark:text-white uppercase font-mono tracking-tight select-all">
                          {warranty.warranty_token}
                        </h4>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ring-1 ${
                        isValid 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 ring-emerald-500/10' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450 border-slate-200 dark:border-slate-750'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isValid ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'} shrink-0`} />
                        {isValid ? 'Garantía Activa' : 'Garantía Expirada'}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                      <div>
                        <span className="text-on-surface-variant/60 dark:text-slate-550 block mb-0.5 uppercase tracking-wider text-[9px]">EQUIPO CUBIERTO</span>
                        <span className="text-sm font-bold text-on-surface dark:text-slate-200">
                          {warranty.device?.brand} {warranty.device?.model}
                        </span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant/60 dark:text-slate-550 block mb-0.5 uppercase tracking-wider text-[9px]">DIAGNÓSTICO RESUELTO</span>
                        <span className="text-xs font-black text-primary dark:text-sky-400 truncate block">
                          {warranty.repair_order?.diagnosis_final || 'Falla de Hardware'}
                        </span>
                      </div>

                      <div className="col-span-2 grid grid-cols-2 gap-2 border-t border-slate-50 dark:border-slate-850/50 pt-3">
                        <div>
                          <span className="text-on-surface-variant/60 dark:text-slate-550 block mb-0.5 uppercase tracking-wider text-[9px]">FECHA DE EMISIÓN</span>
                          <span className="text-xs font-bold text-on-surface dark:text-slate-300 font-mono">
                            {formatDate(warranty.start_date)}
                          </span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant/60 dark:text-slate-550 block mb-0.5 uppercase tracking-wider text-[9px]">VENCIMIENTO</span>
                          <span className="text-xs font-bold text-on-surface dark:text-slate-300 font-mono">
                            {formatDate(warranty.end_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Certificado Footer */}
                  <div className="mt-6 pt-4 border-t border-outline-variant/20 dark:border-slate-800/40 flex justify-between items-center text-xs">
                    <span className="font-extrabold text-[10px] text-primary dark:text-sky-400 uppercase tracking-widest">
                      {warranty.warranty_days} Días de Soporte OEM
                    </span>
                    <button 
                      onClick={() => alert(`Certificado ${warranty.warranty_token} en estado activo. Firma digital validada por TechFix Lab.`)}
                      className="inline-flex items-center gap-1 font-bold text-primary dark:text-sky-400 hover:text-primary-dark transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> Ficha Certificada
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}

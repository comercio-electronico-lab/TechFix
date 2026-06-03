"use client";

import React, { useState } from 'react';
import RepairTimeline, { TimelineStep } from '@/components/repair/RepairTimeline';
import ConfirmRepairForm, { ConfirmRepairOptions } from './ConfirmRepairForm';
import { ClientRepair } from '@/mock/repairs';

interface RepairCardProps {
  repair: ClientRepair;
}

const RepairCard = ({ repair }: RepairCardProps) => {
  const [showConfirmForm, setShowConfirmForm] = useState(false);

  const handleConfirmRepair = (options: ConfirmRepairOptions) => {
    console.log('Reparación confirmada con opciones:', options);
    // TODO: Llamar a acción del servidor para actualizar estado a "agendado"
    setShowConfirmForm(false);
  };
  const getTimelineSteps = (status: string, diagnosis: string, appointmentDate?: string): TimelineStep[] => {
    const baseSteps: TimelineStep[] = [
      {
        id: 1,
        title: 'Diagnóstico Completado',
        description: 'Se realizó el análisis inicial de tu equipo.',
        status: 'completed',
        detailedInfo: diagnosis
      },
      {
        id: 2,
        title: 'Cita Agendada',
        description: 'Tu equipo tiene una cita para reparación.',
        status: 'pending',
        date: appointmentDate
      },
      {
        id: 3,
        title: 'En Reparación',
        description: 'Nuestros técnicos están trabajando en tu equipo.',
        status: 'pending'
      },
      {
        id: 4,
        title: 'Listo para Retirar',
        description: 'Tu equipo superó todas las pruebas y está listo.',
        status: 'pending'
      },
      {
        id: 5,
        title: 'Completado',
        description: 'Equipamiento retirado satisfactoriamente.',
        status: 'pending'
      }
    ];

    // Mapear nuevos estados al timeline
    if (status === 'pending') {
      // Solo diagnóstico completado
      baseSteps[0].status = 'active';
      baseSteps[0].detailedInfo = diagnosis || 'Diagnóstico inicial completado. Confirma para agendar reparación.';
    } else if (status === 'agendado') {
      baseSteps[0].status = 'completed';
      baseSteps[1].status = 'active';
      baseSteps[1].detailedInfo = `Cita confirmada para ${new Date(appointmentDate || '').toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })}`;
    } else if (status === 'en_reparacion') {
      baseSteps[0].status = 'completed';
      baseSteps[1].status = 'completed';
      baseSteps[2].status = 'active';
      baseSteps[2].detailedInfo = diagnosis || 'Nuestros técnicos están trabajando en tu equipo.';
    } else if (status === 'reparado') {
      baseSteps[0].status = 'completed';
      baseSteps[1].status = 'completed';
      baseSteps[2].status = 'completed';
      baseSteps[3].status = 'active';
      baseSteps[3].detailedInfo = 'Reparación completada. Tu equipo está en nuestras instalaciones listo para ser retirado.';
    } else if (status === 'completado') {
      baseSteps[0].status = 'completed';
      baseSteps[1].status = 'completed';
      baseSteps[2].status = 'completed';
      baseSteps[3].status = 'completed';
      baseSteps[4].status = 'completed';
      baseSteps[4].detailedInfo = 'Equipamiento retirado. Garantía activa.';
    }

    return baseSteps;
  };

  const deviceLabel = repair.device ? `${repair.device.brand} ${repair.device.model}` : 'Dispositivo';
  const steps = getTimelineSteps(repair.status, repair.diagnosis_final, repair.appointment_datetime);

  // Formatear moneda
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <div className="bg-white/70 dark:bg-slate-900 border border-outline-variant/15 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-md space-y-6">
      {/* Header con ID y Precio */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-outline-variant/10 dark:border-slate-800/80 pb-4 gap-2">
        <div>
          <span className="text-[10px] font-bold text-secondary dark:text-sky-400 font-mono">ID: {repair.id}</span>
          <h4 className="text-base font-black text-on-background mt-1">{deviceLabel}</h4>
          {repair.device?.serial_number && (
            <span className="text-[10px] text-on-surface-variant dark:text-slate-400">S/N: {repair.device.serial_number}</span>
          )}
        </div>
        <div className="text-left sm:text-right space-y-1">
          <span className="text-[10px] text-on-surface-variant block uppercase font-bold">Costo Final</span>
          <span className="text-lg font-mono font-black text-primary dark:text-sky-400">{formatPrice(repair.final_price)}</span>
          {repair.estimated_price_min && repair.estimated_price_max && (
            <span className="text-[9px] text-on-surface-variant block">Est: {formatPrice(repair.estimated_price_min)} - {formatPrice(repair.estimated_price_max)}</span>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="pt-2">
        <RepairTimeline steps={steps} />
      </div>

      {/* Productos Recomendados - Informativo */}
      {repair.productos && repair.productos.length > 0 && (
        <div className="border-t border-outline-variant/10 dark:border-slate-800/80 pt-4 space-y-3">
          <p className="text-xs font-semibold text-on-surface-variant uppercase">Repuestos Recomendados</p>
          <div className="space-y-2">
            {repair.productos.map(producto => (
              <div key={producto.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg text-xs">
                <p className="font-medium text-on-background flex-1">{producto.nombre}</p>
                <p className="font-mono text-on-surface-variant ml-2">{formatPrice(producto.subtotal)}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-on-surface-variant italic">Compra estos repuestos en la sección Compras</p>
        </div>
      )}

      {/* Acciones por Estado */}
      {repair.status === 'pending' && !showConfirmForm && (
        <div className="border-t border-outline-variant/10 dark:border-slate-800/80 pt-4">
          <button
            onClick={() => setShowConfirmForm(true)}
            className="w-full bg-primary dark:bg-sky-500 hover:bg-primary/90 dark:hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
          >
            Confirmar y Agendar Cita
          </button>
        </div>
      )}

      {repair.status === 'pending' && showConfirmForm && (
        <ConfirmRepairForm
          estimatedMin={repair.estimated_price_min || 0}
          estimatedMax={repair.estimated_price_max || 0}
          onConfirm={handleConfirmRepair}
        />
      )}

      {repair.status === 'agendado' && (
        <div className="border-t border-outline-variant/10 dark:border-slate-800/80 pt-4 space-y-3">
          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Pago Pendiente</p>
            <p className="text-[12px] text-amber-800 dark:text-amber-200">Completa el pago para confirmar tu cita</p>
          </div>
          <button className="w-full bg-primary dark:bg-sky-500 hover:bg-primary/90 dark:hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors">
            Pagar Cita
          </button>
        </div>
      )}

      {/* Warranty Badge */}
      {repair.warranty && repair.warranty.is_active && (
        <div className="border-t border-outline-variant/10 dark:border-slate-800/80 pt-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800 space-y-2">
            <div className="flex items-center gap-2">
              <div>
                <p className="text-sm font-semibold text-green-900 dark:text-green-100">Garantía Activa</p>
                <p className="text-[12px] text-green-800 dark:text-green-200">
                  {repair.warranty.warranty_days} días de cobertura
                  {repair.warranty.end_date && ` - Vence: ${new Date(repair.warranty.end_date).toLocaleDateString('es-ES')}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notas */}
      {repair.notes && (
        <div className="border-t border-outline-variant/10 dark:border-slate-800/80 pt-4">
          <p className="text-[12px] text-on-surface-variant italic">{repair.notes}</p>
        </div>
      )}
    </div>
  );
};

export default RepairCard;

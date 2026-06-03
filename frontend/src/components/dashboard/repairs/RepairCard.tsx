"use client";

import React from 'react';
import RepairTimeline, { TimelineStep } from '@/components/repair/RepairTimeline';

interface Repair {
  id: string;
  device?: { brand: string; model: string };
  status: string;
  diagnosis_final: string;
  created_at: string;
  final_price?: number;
}

interface RepairCardProps {
  repair: Repair;
}

const RepairCard = ({ repair }: RepairCardProps) => {
  const getTimelineSteps = (status: string, notes: string, date: string): TimelineStep[] => {
    const baseSteps: TimelineStep[] = [
      { id: 1, title: 'Orden Recibida', description: 'El pre-diagnóstico ha sido recibido y el dispositivo está en cola para inspección.', status: 'completed', date },
      { id: 2, title: 'En Revisión y Diagnóstico', description: 'Nuestros técnicos están revisando la placa base y probando componentes OEM.', status: 'pending' },
      { id: 3, title: 'Reparaciones en Curso', description: 'Se realiza la microsoldadura o recambio de piezas aprobadas.', status: 'pending' },
      { id: 4, title: 'Listo para Entrega', description: 'El equipo superó las pruebas de rendimiento y está listo para ser recogido.', status: 'pending' },
    ];

    if (status === 'in_review' || status === 'repairing') {
      baseSteps[1].status = 'active';
      baseSteps[1].detailedInfo = notes || 'Se están verificando fallas de corriente y componentes de energía.';
    } else if (status === 'waiting_parts') {
      baseSteps[1].status = 'completed';
      baseSteps[2].status = 'active';
      baseSteps[2].detailedInfo = 'Orden pausada temporalmente en espera de componentes de importación.';
    } else if (status === 'ready') {
      baseSteps[1].status = 'completed';
      baseSteps[2].status = 'completed';
      baseSteps[3].status = 'active';
      baseSteps[3].detailedInfo = 'Reparación completada con éxito. Se iniciaron pruebas de calibración y estrés de 24 horas.';
    } else if (status === 'delivered') {
      baseSteps[1].status = 'completed';
      baseSteps[2].status = 'completed';
      baseSteps[3].status = 'completed';
    }

    return baseSteps;
  };

  const deviceLabel = repair.device ? `${repair.device.brand} ${repair.device.model}` : 'Dispositivo';
  const steps = getTimelineSteps(repair.status, repair.diagnosis_final, repair.created_at);

  return (
    <div className="bg-white/70 dark:bg-slate-900 border border-outline-variant/15 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-outline-variant/10 dark:border-slate-800/80 pb-4 gap-2">
        <div>
          <span className="text-[10px] font-bold text-secondary dark:text-sky-400 font-mono">ID DE TICKET: {repair.id}</span>
          <h4 className="text-base font-black text-on-background mt-1">{deviceLabel}</h4>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-[10px] text-on-surface-variant block uppercase font-bold">Costo Final Estimado</span>
          <span className="text-sm font-mono font-black text-primary dark:text-sky-400">${(repair.final_price || 0).toFixed(2)} USD</span>
        </div>
      </div>

      <div className="pt-2">
        <RepairTimeline steps={steps} />
      </div>
    </div>
  );
};

export default RepairCard;

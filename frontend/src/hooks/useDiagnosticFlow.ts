'use client';

import { useState } from 'react';
import { DiagnosticState } from '@/types';

export type DeviceType = 'Smartphone' | 'Laptop' | 'Tablet' | 'Desktop';
export type IssueCategory = 'Display' | 'Battery' | 'Performance' | 'Physical';

const ISSUE_DETAILS: Record<IssueCategory, string[]> = {
  Display: [
    'Vidrio trizado o rajado con astillas.',
    'Manchas de tinta negra, píxeles muertos o distorsión de color.',
    'Pantalla completamente negra (no da imagen).',
    'El táctil no responde o se presiona solo.',
  ],
  Battery: [
    'La batería se agota extremadamente rápido (menos de 2 horas).',
    'El puerto de carga no detecta el cable o carga intermitente.',
    'El dispositivo se apaga inesperadamente en porcentajes aleatorios.',
    'La batería está inflada, sobrecalienta el chasis o hace ruido.',
  ],
  Performance: [
    'El sistema operativo está lento o se congela constantemente.',
    'Las aplicaciones se cierran solas sin advertencia previa.',
    'No enciende o entra en un bucle infinito en el logo de inicio.',
    'Calentamiento excesivo con ruidos de ventilación extremos.',
  ],
  Physical: [
    'Daño por líquidos (mojado accidental recientemente).',
    'Botón de encendido o botones de volumen atascados/rotos.',
    'El micrófono no graba audio o los altavoces suenan distorsionados.',
    'Otro problema físico mecánico no listado.',
  ],
};

export const REPAIR_COST_ESTIMATES: Record<IssueCategory, string> = {
  Display: '$150.00 - $220.00',
  Battery: '$45.00 - $79.00',
  Performance: '$59.00 - $109.00',
  Physical: '$39.00 - $129.00',
};

const TOTAL_STEPS = 5;

export interface UseDiagnosticFlowReturn {
  state: DiagnosticState;
  isSubmitting: boolean;
  ticketId: string | null;
  progressPercentage: number;
  detailsList: string[];
  handleBack: () => void;
  handleNext: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  setDeviceType: (device: DeviceType) => void;
  setIssueCategory: (cat: IssueCategory) => void;
  setIssueDetail: (detail: string) => void;
  setClientField: (field: 'clientName' | 'clientEmail' | 'clientPhone', value: string) => void;
}

export function useDiagnosticFlow(): UseDiagnosticFlowReturn {
  const [state, setState] = useState<DiagnosticState>({
    step: 1,
    deviceType: null,
    issueCategory: null,
    issueDetail: null,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const progressPercentage = (state.step / TOTAL_STEPS) * 100;

  const detailsList = state.issueCategory ? ISSUE_DETAILS[state.issueCategory] : [];

  const handleBack = () => {
    if (state.step > 1) setState(prev => ({ ...prev, step: prev.step - 1 }));
  };

  const handleNext = () => {
    if (state.step < TOTAL_STEPS) setState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const setDeviceType = (device: DeviceType) => {
    setState(prev => ({ ...prev, deviceType: device, step: 2 }));
  };

  const setIssueCategory = (cat: IssueCategory) => {
    setState(prev => ({ ...prev, issueCategory: cat, step: 3 }));
  };

  const setIssueDetail = (detail: string) => {
    setState(prev => ({ ...prev, issueDetail: detail, step: 4 }));
  };

  const setClientField = (field: 'clientName' | 'clientEmail' | 'clientPhone', value: string) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.clientName || !state.clientEmail || !state.clientPhone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const randomTicket = `TK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setTicketId(randomTicket);
      setState(prev => ({ ...prev, step: 5 }));
    }, 1500);
  };

  return {
    state,
    isSubmitting,
    ticketId,
    progressPercentage,
    detailsList,
    handleBack,
    handleNext,
    handleSubmit,
    setDeviceType,
    setIssueCategory,
    setIssueDetail,
    setClientField,
  };
}

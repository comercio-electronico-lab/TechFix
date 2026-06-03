import { RepairView } from '@/components/views/RepairView';
import { Metadata } from 'next';
import { IDiagnosticNode } from '@/interfaces/domain';

export const metadata: Metadata = {
  title: 'Diagnóstico de Reparaciones | Laboratorio L1',
  description: 'Usa nuestro asistente inteligente para diagnosticar fallas en tus equipos.',
};

const diagnosticTree: IDiagnosticNode[] = [
  {
    id: 'start',
    question: '¿Qué tipo de dispositivo deseas reparar?',
    options: [
      { label: 'Smartphone / Tablet', nextStepId: 'mobile_power' },
      { label: 'Laptop / PC', nextStepId: 'pc_power' },
      { label: 'Consola de Juegos', nextStepId: 'console_power' },
    ]
  },
  {
    id: 'mobile_power',
    question: '¿El dispositivo enciende?',
    options: [
      { label: 'Sí, pero la pantalla está rota', action: 'complete' },
      { label: 'No enciende nada', nextStepId: 'mobile_charge' },
      { label: 'Enciende pero se queda en el logo', action: 'complete' },
    ]
  },
  {
    id: 'mobile_charge',
    question: '¿Has intentado con otro cargador?',
    options: [
      { label: 'Sí, y sigue igual', action: 'complete' },
      { label: 'No, voy a probar', action: 'complete' },
    ]
  }
];

export default function ReparacionesPage() {
  return <RepairView diagnosticTree={diagnosticTree} />;
}

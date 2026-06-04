'use client';

import React, { useState } from 'react';
import { DiagnosticFlow } from '@/components/features/repairs/DiagnosticFlow';
import { Icon } from '@/components/ui';
import { IDiagnosticNode } from '@/interfaces/domain';

interface IRepairViewProps {
  diagnosticTree: IDiagnosticNode[];
}

export const RepairView = ({ diagnosticTree }: IRepairViewProps) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {!isStarted && !isFinished && (
          <div className="text-center space-y-6 py-12">
            <div className="inline-block p-4 bg-[var(--color-primary)]/10 rounded-3xl mb-4">
              <Icon name="Tool" size={64} className="text-[var(--color-primary)]" />
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase">¿Problemas con tu equipo?</h1>
            <p className="text-xl text-[var(--color-muted)] max-w-2xl mx-auto">
              Nuestro asistente inteligente te ayudará a diagnosticar el problema y agendar una cita técnica en menos de 2 minutos.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <button 
                onClick={() => setIsStarted(true)}
                className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2"
              >
                Iniciar Diagnóstico <Icon name="ArrowRight" size={20} />
              </button>
            </div>
          </div>
        )}

        {isStarted && !isFinished && (
          <DiagnosticFlow 
            nodes={diagnosticTree} 
            onComplete={() => {
              setIsStarted(false);
              setIsFinished(true);
            }} 
          />
        )}

        {isFinished && (
          <div className="text-center space-y-6 py-12 animate-in fade-in zoom-in duration-500">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
              <Icon name="CheckCircle" size={64} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold">Diagnóstico Completado</h2>
            <p className="text-[var(--color-muted)] max-w-md mx-auto">
              Hemos identificado la posible falla. Un técnico se pondrá en contacto contigo o puedes agendar tu cita ahora.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg font-bold">Agendar Cita</button>
              <button className="border border-[var(--color-border)] px-6 py-3 rounded-lg font-bold">Ver Resumen</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

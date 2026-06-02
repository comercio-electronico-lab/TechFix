"use client";

import React from 'react';
import { Wrench, CheckCircle2, AlertCircle } from 'lucide-react';
import Badge from '../ui/Badge';

export interface RepairJob {
  id: string;
  client: string;
  device: string;
  serialNumber: string;
  symptom: string;
  status: 'pending' | 'in_progress' | 'completed';
  date: string;
}

interface AssignedJobsProps {
  jobs: RepairJob[];
  onUpdateStatus: (jobId: string, newStatus: 'pending' | 'in_progress' | 'completed') => void;
}

const AssignedJobs: React.FC<AssignedJobsProps> = ({ jobs, onUpdateStatus }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completado</Badge>;
      case 'in_progress':
        return <Badge variant="info">En Curso</Badge>;
      default:
        return <Badge variant="pending">Pendiente</Badge>;
    }
  };

  return (
    <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-8 rounded-2xl shadow-sm space-y-6">
      <div>
        <h3 className="text-primary dark:text-white font-h3 font-bold mb-1">Órdenes de Trabajo Asignadas</h3>
        <p className="text-xs text-on-surface-variant">Revisa los síntomas de los dispositivos, actualiza sus estados de reparación e ingresa los diagnósticos finales.</p>
      </div>

      <div className="divide-y divide-outline-variant/15 dark:divide-outline/10 space-y-6">
        {jobs.map((job, idx) => (
          <div key={job.id} className={`pt-6 ${idx === 0 ? 'pt-0' : ''} flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group`}>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-primary dark:text-white font-mono bg-surface-container-low dark:bg-white/5 px-2.5 py-0.5 rounded-lg">{job.id}</span>
                {getStatusBadge(job.status)}
              </div>
              <h4 className="text-base font-bold text-on-background">{job.device}</h4>
              <p className="text-xs text-on-surface-variant">Cliente: <strong className="text-on-background">{job.client}</strong> | S/N: <strong className="text-on-background">{job.serialNumber}</strong></p>
              <div className="flex items-center gap-2 text-xs bg-amber-500/5 text-amber-600 dark:text-amber-300 px-3 py-2 rounded-xl max-w-xl border border-amber-500/10">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Sintomatología: <strong>{job.symptom}</strong></span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 justify-end">
              {job.status === 'pending' && (
                <button 
                  onClick={() => onUpdateStatus(job.id, 'in_progress')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Iniciar Diagnóstico
                </button>
              )}
              {job.status === 'in_progress' && (
                <button 
                  onClick={() => onUpdateStatus(job.id, 'completed')}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Marcar Completado
                </button>
              )}
              {job.status === 'completed' && (
                <div className="flex items-center gap-1.5 text-xs text-green-500 font-bold bg-green-500/5 border border-green-500/10 px-4 py-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                  Trabajo Entregado
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignedJobs;

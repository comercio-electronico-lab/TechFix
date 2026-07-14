'use client';

import React, { useState } from 'react';
import { Wrench, CheckCircle2, AlertCircle, Plus, Cpu, DollarSign } from 'lucide-react';
import Badge from '../ui/Badge';

interface AssignedJobsProps {
  jobs: any[];
  products: any[];
  onUpdateStatus: (jobId: string, newStatus: 'pending' | 'in_progress' | 'completed') => void;
  onAddPart: (jobId: string, productId: string) => void;
}

const AssignedJobs: React.FC<AssignedJobsProps> = ({ 
  jobs, 
  products, 
  onUpdateStatus, 
  onAddPart 
}) => {
  // Estado local para almacenar qué repuesto se seleccionó para cada ticket
  const [selectedParts, setSelectedParts] = useState<Record<string, string>>({});

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

  const handleSelectPartChange = (jobId: string, val: string) => {
    setSelectedParts(prev => ({
      ...prev,
      [jobId]: val
    }));
  };

  return (
    <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/10 dark:border-outline/20 p-8 rounded-2xl shadow-sm space-y-6">
      <div>
        <h3 className="text-primary dark:text-white font-h3 font-bold mb-1">Órdenes de Trabajo Asignadas</h3>
        <p className="text-xs text-on-surface-variant">Revisa los síntomas de los dispositivos, vincula los repuestos OEM y actualiza los estados de la orden técnica.</p>
      </div>

      <div className="divide-y divide-outline-variant/15 dark:divide-outline/10 space-y-6">
        {jobs.length === 0 ? (
          <p className="text-sm text-on-surface-variant text-center py-6">No hay órdenes de reparación activas.</p>
        ) : (
          jobs.map((job, idx) => {
            const selectedPartId = selectedParts[job.id] || '';
            const deviceName = job.device ? `${job.device.brand} ${job.device.model}` : 'Dispositivo Genérico';
            const serialNumber = job.device ? job.device.serial_number : 'S/N Desconocido';
            const clientName = job.customerName || 'Cliente';
            
            return (
              <div key={job.id} className={`pt-6 ${idx === 0 ? 'pt-0' : ''} flex flex-col gap-4 group`}>
                
                {/* Cabecera y datos del equipo */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-primary dark:text-white font-mono bg-surface-container-low dark:bg-white/5 px-2.5 py-0.5 rounded-lg">
                        {job.id}
                      </span>
                      {getStatusBadge(job.status)}
                    </div>
                    <h4 className="text-base font-bold text-on-background">{deviceName}</h4>
                    <p className="text-xs text-on-surface-variant">
                      Cliente: <strong className="text-on-background">{clientName}</strong> | S/N: <strong className="text-on-background">{serialNumber}</strong>
                    </p>
                  </div>

                  {/* Acciones principales de estado */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto justify-end">
                    <div className="flex items-center gap-1.5 text-xs text-primary dark:text-sky-400 font-bold bg-primary/5 border border-primary/10 px-4 py-2.5 rounded-xl">
                      <DollarSign className="w-4 h-4" />
                      Costo Final: <span className="font-mono text-sm">${(job.final_price || 0).toFixed(2)}</span>
                    </div>

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
                        Trabajo Listo para Entrega
                      </div>
                    )}
                  </div>
                </div>

                {/* Síntoma e Historial de Diagnóstico */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs bg-amber-500/5 text-amber-600 dark:text-amber-300 px-3 py-2 rounded-xl max-w-2xl border border-amber-500/10">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Sintomatología: <strong>{job.notes || 'No se detallaron síntomas'}</strong></span>
                  </div>
                  {job.diagnosis_final && (
                    <div className="flex items-center gap-2 text-xs bg-emerald-500/5 text-emerald-600 dark:text-emerald-300 px-3 py-2 rounded-xl max-w-2xl border border-emerald-500/10">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Diagnóstico / Repuestos Vinculados: <strong>{job.diagnosis_final}</strong></span>
                    </div>
                  )}
                </div>

                {/* Sección de Vinculación de Repuestos (Solo en Diagnóstico/Curso) */}
                {job.status === 'in_progress' && (
                  <div className="mt-2 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-outline-variant/30 dark:border-slate-800/40 max-w-2xl space-y-3">
                    <h5 className="text-xs font-black text-on-surface dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-blue-500" />
                      Vincular Repuestos de Inventario
                    </h5>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <select
                        className="bg-white dark:bg-slate-950 border border-outline-variant dark:border-slate-800 text-xs rounded-lg px-3 py-2.5 flex-grow font-semibold text-on-background focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={selectedPartId}
                        onChange={(e) => handleSelectPartChange(job.id, e.target.value)}
                      >
                        <option value="">-- Seleccionar Repuesto / Componente --</option>
                        {products
                          .filter(p => p.stock_actual > 0)
                          .map(p => (
                            <option key={p.id} value={p.id}>
                              {p.nombre} (Stock: {p.stock_actual} | Costo: ${p.precio_venta} USD)
                            </option>
                          ))
                        }
                      </select>

                      <button
                        onClick={() => {
                          if (!selectedPartId) {
                            alert('Selecciona un repuesto primero');
                            return;
                          }
                          onAddPart(job.id, selectedPartId);
                          handleSelectPartChange(job.id, ''); // Limpiar selección
                        }}
                        className="bg-secondary hover:bg-secondary/95 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        Vincular Pieza
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AssignedJobs;

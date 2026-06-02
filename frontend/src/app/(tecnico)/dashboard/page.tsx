"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import TecnicoStats from '@/components/tecnico/TecnicoStats';
import AssignedJobs, { RepairJob } from '@/components/tecnico/AssignedJobs';

export default function TecnicoDashboard() {
  const { user } = useAuth();

  // Simulated repair orders assigned to this logged-in technician
  const [jobs, setJobs] = useState<RepairJob[]>([
    {
      id: "WO-2026-0041",
      client: "Carlos González",
      device: "Asus ROG Strix G15",
      serialNumber: "SN-ASUS-9912",
      symptom: "Recalentamiento severo y apagados repentinos",
      status: "in_progress",
      date: "2026-06-02"
    },
    {
      id: "WO-2026-0089",
      client: "Ana Martínez",
      device: "iPhone 14 Pro Max",
      serialNumber: "SN-APPL-7721",
      symptom: "La batería dura menos de 4 horas",
      status: "pending",
      date: "2026-06-03"
    },
    {
      id: "WO-2026-0012",
      client: "Luis Sánchez",
      device: "Dell XPS 13",
      serialNumber: "SN-DELL-5521",
      symptom: "Pantalla azul al cargar el sistema operativo",
      status: "completed",
      date: "2026-05-30"
    }
  ]);

  const handleUpdateStatus = (jobId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    ));
  };

  const activeJobsCount = jobs.filter(j => j.status !== 'completed').length;

  return (
    <div className="space-y-10">
      
      {/* Title */}
      <div>
        <h1 className="text-primary dark:text-white font-h1 font-bold">Panel Técnico</h1>
        <p className="text-sm text-on-surface-variant">
          Bienvenido al laboratorio, {user?.nombre}. Tienes {activeJobsCount} trabajos de reparación asignados hoy.
        </p>
      </div>

      {/* Metrics Panel */}
      <TecnicoStats jobs={jobs} />

      {/* Assigned Orders List */}
      <AssignedJobs jobs={jobs} onUpdateStatus={handleUpdateStatus} />
      
    </div>
  );
}

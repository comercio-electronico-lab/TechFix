"use client";

import React from 'react';
import { Clock, Wrench, CheckCircle2 } from 'lucide-react';
import StatsCard from '@/components/cards/StatsCard';

interface RepairJob {
  status: 'pending' | 'in_progress' | 'completed';
}

interface TecnicoStatsProps {
  jobs: RepairJob[];
}

const TecnicoStats: React.FC<TecnicoStatsProps> = ({ jobs }) => {
  const pendingCount = jobs.filter(j => j.status === 'pending').length;
  const progressCount = jobs.filter(j => j.status === 'in_progress').length;
  const completedCount = jobs.filter(j => j.status === 'completed').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <StatsCard 
        label="Tareas Pendientes"
        value={pendingCount}
        icon={Clock}
        color="amber"
      />
      <StatsCard 
        label="En Diagnóstico/Curso"
        value={progressCount}
        icon={Wrench}
        color="blue"
      />
      <StatsCard 
        label="Completados esta Semana"
        value={completedCount}
        icon={CheckCircle2}
        color="green"
      />
    </div>
  );
};

export default TecnicoStats;

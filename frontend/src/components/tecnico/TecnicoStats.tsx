"use client";

import React from 'react';
import { Clock, Wrench, CheckCircle2, DollarSign, AlertTriangle } from 'lucide-react';
import StatsCard from '@/components/cards/StatsCard';

interface RepairJob {
  status: 'pending' | 'in_progress' | 'completed';
  final_price?: number;
  estimated_price_min?: number;
  estimated_price_max?: number;
}

interface TecnicoStatsProps {
  jobs: RepairJob[];
}

const TecnicoStats: React.FC<TecnicoStatsProps> = ({ jobs }) => {
  const pendingCount = jobs.filter(j => j.status === 'pending').length;
  const progressCount = jobs.filter(j => j.status === 'in_progress').length;
  const completedCount = jobs.filter(j => j.status === 'completed').length;

  const revenueSum = jobs
    .filter(j => j.status === 'completed')
    .reduce((acc, j) => acc + (j.final_price || 0), 0);

  const pendingRevenue = jobs
    .filter(j => j.status === 'pending' || j.status === 'in_progress')
    .reduce((acc, j) => acc + (j.estimated_price_max || 0), 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <StatsCard
        label="Pendientes"
        value={pendingCount}
        icon={Clock}
        color="amber"
      />
      <StatsCard
        label="En Curso"
        value={progressCount}
        icon={Wrench}
        color="blue"
      />
      <StatsCard
        label="Completados"
        value={completedCount}
        icon={CheckCircle2}
        color="green"
      />
      <StatsCard
        label="Ingresos Completados"
        value={`$${revenueSum.toFixed(0)}`}
        icon={DollarSign}
        color="primary"
      />
      <StatsCard
        label="Por Facturar (Est.)"
        value={`$${pendingRevenue.toFixed(0)}`}
        icon={AlertTriangle}
        color="purple"
      />
    </div>
  );
};

export default TecnicoStats;

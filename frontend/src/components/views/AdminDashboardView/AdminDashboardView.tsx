'use client';

import React from 'react';
import { MetricCard } from '@/components/features/dashboard/MetricCard/MetricCard';
import { ActivityList } from '@/components/features/dashboard/ActivityList/ActivityList';
import { IDashboardStats, IActivityLog } from '@/interfaces/domain';
import { Button, Icon } from '@/components/ui';

interface IAdminDashboardViewProps {
  stats: IDashboardStats[];
  activities: IActivityLog[];
}

export const AdminDashboardView = ({ stats, activities }: IAdminDashboardViewProps) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Panel de Control</h1>
          <p className="text-[var(--color-muted)]">Resumen general del negocio y operaciones.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Icon name="Download" size={18} />}>Reporte</Button>
          <Button leftIcon={<Icon name="Plus" size={18} />}>Nueva Tarea</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <MetricCard key={idx} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-[var(--color-border)] h-80 flex flex-col items-center justify-center text-center">
            <Icon name="BarChart" size={48} className="text-[var(--color-muted)] mb-4" />
            <h3 className="text-lg font-bold">Gráfico de Ingresos</h3>
            <p className="text-[var(--color-muted)] max-w-xs">Las métricas de ventas se actualizarán en tiempo real conforme se procesen los pagos.</p>
          </div>
        </div>
        
        <ActivityList activities={activities} />
      </div>
    </div>
  );
};

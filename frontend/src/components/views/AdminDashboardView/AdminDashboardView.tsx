'use client';

import React from 'react';
import { MetricCard } from '@/components/features/dashboard/MetricCard/MetricCard';
import { ActivityList } from '@/components/features/dashboard/ActivityList/ActivityList';
import { IDashboardStats, IActivityLog } from '@/interfaces/domain';
import { Button, Icon } from '@/components/ui';
import SalesBarChart from '@/components/admin/SalesBarChart';
import RepairAreaChart from '@/components/admin/RepairAreaChart';

interface IAdminDashboardViewProps {
  stats: IDashboardStats[];
  activities: IActivityLog[];
  salesData: Array<{ name: string; revenue: number; cost: number }>;
  repairData: Array<{ name: string; volume: number }>;
}

export const AdminDashboardView = ({ stats, activities, salesData, repairData }: IAdminDashboardViewProps) => {
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
          <div className="bg-white p-6 rounded-2xl border border-[var(--color-border)] h-80 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold">Ingresos Recientes</h3>
              <p className="text-xs text-[var(--color-muted)]">Evolución de ingresos y costos estimados por semana.</p>
            </div>
            <div className="flex-1 min-h-[180px] mt-4">
              <SalesBarChart data={salesData} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[var(--color-border)] h-80 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold">Volumen de Servicios</h3>
              <p className="text-xs text-[var(--color-muted)]">Tickets de servicio procesados por semana.</p>
            </div>
            <div className="flex-1 min-h-[180px] mt-4">
              <RepairAreaChart data={repairData} />
            </div>
          </div>
        </div>
        
        <ActivityList activities={activities} />
      </div>
    </div>
  );
};

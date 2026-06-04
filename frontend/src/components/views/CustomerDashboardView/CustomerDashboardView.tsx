'use client';

import React from 'react';
import { IRepair, IAppointment } from '@/interfaces/domain';
import { Card, Badge, Icon } from '@/components/ui';

interface ICustomerDashboardViewProps {
  myRepairs: IRepair[];
  myAppointments: IAppointment[];
}

export const CustomerDashboardView = ({ myRepairs, myAppointments }: ICustomerDashboardViewProps) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--color-primary)] text-white p-8 rounded-3xl shadow-xl shadow-[var(--color-primary)]/20">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Hola, Parker</h1>
          <p className="text-blue-100 mt-1 font-medium">Tienes {myRepairs.filter(r => r.status !== 'delivered').length} equipos en proceso técnica.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-4 border-r border-white/20">
            <p className="text-2xl font-black">{myRepairs.length}</p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-blue-100">Equipos</p>
          </div>
          <div className="text-center px-4">
            <p className="text-2xl font-black">{myAppointments.length}</p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-blue-100">Citas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Estado de mis Equipos">
          <div className="space-y-4">
            {myRepairs.map(repair => (
              <div key={repair.id} className="p-4 rounded-xl border border-[var(--color-border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--color-accent)] rounded-lg">
                    <Icon name="Tool" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{repair.deviceName}</p>
                    <p className="text-xs text-[var(--color-muted)]">Causa: {repair.issueDescription}</p>
                  </div>
                </div>
                <Badge variant={repair.status === 'ready' ? 'success' : 'info'}>
                  {repair.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Próximas Citas">
          <div className="space-y-4">
            {myAppointments.map(app => (
              <div key={app.id} className="p-4 rounded-xl border border-[var(--color-border)] flex items-center gap-4">
                <div className="flex flex-col items-center justify-center p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg min-w-[60px]">
                  <span className="text-xs font-bold uppercase">{app.date.split(' ')[0]}</span>
                  <span className="text-xl font-black leading-none">{app.date.split(' ')[1]}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{app.serviceType}</p>
                  <p className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                    <Icon name="Clock" size={12} /> {app.time}
                  </p>
                </div>
                <Badge variant={app.status === 'confirmed' ? 'success' : 'warning'}>
                  {app.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

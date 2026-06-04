'use client';

import React from 'react';
import { IRepair } from '@/interfaces/domain';
import { Card, Badge, Button, Icon } from '@/components/ui';

interface ITechnicianDashboardViewProps {
  assignedRepairs: IRepair[];
}

export const TechnicianDashboardView = ({ assignedRepairs }: ITechnicianDashboardViewProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">Panel Técnico</h1>
        <p className="text-[var(--color-muted)]">Cola de reparaciones asignadas y estados.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-600 text-white border-none">
          <p className="text-blue-100 text-sm font-bold uppercase tracking-widest">En Diagnóstico</p>
          <p className="text-4xl font-black mt-2">{assignedRepairs.filter(r => r.status === 'diagnosing').length}</p>
        </Card>
        <Card className="bg-orange-500 text-white border-none">
          <p className="text-orange-100 text-sm font-bold uppercase tracking-widest">Esperando Repuestos</p>
          <p className="text-4xl font-black mt-2">{assignedRepairs.filter(r => r.status === 'waiting_parts').length}</p>
        </Card>
        <Card className="bg-green-600 text-white border-none">
          <p className="text-green-100 text-sm font-bold uppercase tracking-widest">Listos para Entrega</p>
          <p className="text-4xl font-black mt-2">{assignedRepairs.filter(r => r.status === 'ready').length}</p>
        </Card>
      </div>

      <Card title="Cola de Trabajo">
        <div className="space-y-4">
          {assignedRepairs.map((repair) => (
            <div key={repair.id} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-accent)] transition-colors gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="p-3 bg-[var(--color-background)] rounded-lg">
                  <Icon name="Smartphone" size={24} className="text-[var(--color-primary)]" />
                </div>
                <div>
                  <h4 className="font-bold">{repair.deviceName}</h4>
                  <p className="text-xs text-[var(--color-muted)]">SN: {repair.serialNumber} • {repair.customerName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <Badge variant={repair.status === 'ready' ? 'success' : 'warning'}>
                  {repair.status.toUpperCase()}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Detalles</Button>
                  <Button size="sm" variant="primary">Actualizar</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

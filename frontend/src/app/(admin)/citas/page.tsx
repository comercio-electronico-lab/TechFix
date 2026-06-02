"use client";

import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { mockAppointments, Appointment } from '@/mock/admin';
import { Eye, Edit, Calendar, Plus, Clock, Monitor } from 'lucide-react';

export default function AdminCitas() {
  const columns = [
    { 
      header: 'Ticket ID', 
      key: 'id',
      render: (item: Appointment) => (
        <span className="font-mono text-xs font-bold text-primary px-2 py-1 bg-primary/5 rounded border border-primary/10">
          {item.id}
        </span>
      )
    },
    { 
      header: 'Cliente', 
      key: 'customer',
      render: (item: Appointment) => (
        <div>
          <p className="font-bold text-primary">{item.customer}</p>
        </div>
      )
    },
    { 
      header: 'Dispositivo', 
      key: 'device',
      render: (item: Appointment) => (
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-on-surface-variant/40" />
          <span className="text-sm">{item.device}</span>
        </div>
      )
    },
    { header: 'Servicio', key: 'service' },
    { 
      header: 'Programación', 
      key: 'date',
      render: (item: Appointment) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <Calendar className="w-3 h-3" /> {item.date}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-on-surface-variant uppercase font-medium">
            <Clock className="w-3 h-3" /> 10:30 AM
          </div>
        </div>
      )
    },
    { 
      header: 'Estado', 
      key: 'status',
      render: (item: Appointment) => {
        const variants = {
          'Pending': 'warning',
          'In Progress': 'info',
          'Completed': 'success',
          'Cancelled': 'error',
        } as const;
        return <Badge variant={variants[item.status]}>{item.status}</Badge>;
      }
    },
    {
      header: 'Acciones',
      key: 'actions',
      render: () => (
        <div className="flex gap-2">
          <Button variant="ghost" className="p-2 h-10 w-10 hover:bg-surface-container-high transition-colors">
            <Eye className="w-5 h-5" />
          </Button>
          <Button variant="ghost" className="p-2 h-10 w-10 text-secondary hover:bg-secondary/5 transition-colors">
            <Edit className="w-5 h-5" />
          </Button>
        </div>
      )
    }
  ];

  const tabs = ['Todas', 'Hoy', 'Esta Semana', 'Pendientes', 'Completadas'];

  return (
    <div className="space-y-stack-lg">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-primary text-[32px] font-bold">Calendario de Citas</h1>
          <p className="text-on-surface-variant mt-2">Gestión centralizada de reparaciones y servicios técnicos programados.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" icon={Calendar} className="border-outline-variant/30">Vista Mensual</Button>
          <Button variant="secondary" icon={Plus} className="shadow-lg shadow-secondary/20">Nueva Cita</Button>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10 bg-surface-container-lowest">
          <div className="flex gap-6 border-b border-outline-variant/10">
            {tabs.map((tab, i) => (
              <button 
                key={tab}
                className={`pb-4 text-sm font-bold transition-all relative ${
                  i === 0 ? 'text-secondary border-b-2 border-secondary' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {tab}
                {i === 3 && (
                  <span className="ml-2 bg-error text-white text-[10px] px-1.5 rounded-full">4</span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-2">
          <Table columns={columns} data={mockAppointments} />
        </div>
        
        <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/10">
          <div className="flex justify-between items-center px-4">
            <p className="text-xs text-on-surface-variant">Sincronizado con el calendario de Google for Work</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-xs font-bold text-primary hover:bg-surface-container-low rounded-lg transition-colors">Anterior</button>
              <button className="px-4 py-2 text-xs font-bold text-primary hover:bg-surface-container-low rounded-lg transition-colors border border-outline-variant/20">Siguiente</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getRepairTickets, getAllUsers } from '@/actions';
import { Eye, Edit, Calendar, Plus, Clock, Monitor } from 'lucide-react';

interface Appointment {
  id: string;
  customer: string;
  device: string;
  service: string;
  date: string;
  time: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}

export default function AdminCitasClient() {
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
            <Clock className="w-3 h-3" /> {item.time}
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

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const [repairs, users] = await Promise.all([
          getRepairTickets(),
          getAllUsers()
        ]);

        const items: Appointment[] = repairs.map((r: any) => {
          const user = users.find((u: any) => u.email?.toLowerCase() === r.customerEmail?.toLowerCase());
          const customerName = user ? user.name : (r.customerEmail || 'Cliente Anónimo');

          let status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' = 'Pending';
          if (r.status === 'en_reparacion') {
            status = 'In Progress';
          } else if (r.status === 'reparado' || r.status === 'entregado' || r.status === 'completado') {
            status = 'Completed';
          } else if (r.status === 'cancelado') {
            status = 'Cancelled';
          }

          const dtStr = r.appointment_datetime || r.created_at || new Date().toISOString();
          const dt = new Date(dtStr);
          const dateFormatted = dt.toISOString().split('T')[0];
          const timeFormatted = dt.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });

          return {
            id: r.id,
            customer: customerName,
            device: r.device ? `${r.device.brand} ${r.device.model}` : (r.deviceName || 'Dispositivo N/A'),
            service: r.notes || r.diagnosis_final || 'Mantenimiento General',
            date: dateFormatted,
            time: timeFormatted,
            status
          };
        });

        setAppointments(items);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAppointments();
  }, []);

  const tabs = ['Todas', 'Hoy', 'Esta Semana', 'Pendientes', 'Completadas'];

  const pendingCount = appointments.filter(a => a.status === 'Pending').length;

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
                {i === 3 && pendingCount > 0 && (
                  <span className="ml-2 bg-error text-white text-[10px] px-1.5 rounded-full">{pendingCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-2">
          {loading ? (
            <div className="py-12 text-center text-sm font-semibold text-on-surface-variant/60">
              Cargando citas y órdenes...
            </div>
          ) : (
            <Table columns={columns} data={appointments} />
          )}
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

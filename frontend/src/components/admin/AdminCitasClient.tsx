'use client';

import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import { Button, Badge } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { getRepairTickets, getAllUsers, assignTechnicianAction } from '@/actions';
import { Eye, Edit, Calendar, Plus, Clock, Monitor, UserPlus, ShieldAlert } from 'lucide-react';

interface Appointment {
  id: string;
  customer: string;
  device: string;
  service: string;
  date: string;
  time: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  technicianId?: string;
  technicianName?: string;
}

export default function AdminCitasClient() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Assign State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedTechId, setSelectedTechId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  const columns = [
    {
      header: 'Ticket ID',
      key: 'id',
      render: (item: Appointment) => (
        <span className="font-mono text-xs font-bold text-primary px-2 py-1 bg-primary/5 rounded border border-primary/10">
          {item.id.slice(0, 8)}...
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
          <span className="text-sm font-medium">{item.device}</span>
        </div>
      )
    },
    { header: 'Servicio / Diagnóstico', key: 'service' },
    {
      header: 'Técnico Asignado',
      key: 'technicianName',
      render: (item: Appointment) => (
        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
          item.technicianId ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
        }`}>
          {item.technicianName || 'Sin asignar'}
        </span>
      )
    },
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
      render: (item: Appointment) => (
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            title="Asignar Técnico"
            onClick={() => handleOpenAssign(item)}
            className="p-2 h-10 w-10 text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center"
          >
            <UserPlus className="w-5 h-5" />
          </Button>
        </div>
      )
    }
  ];

  async function loadAppointments() {
    setLoading(true);
    try {
      const [repairs, users] = await Promise.all([
        getRepairTickets(),
        getAllUsers()
      ]);

      // Filtrar técnicos
      const techs = users.filter((u: any) => 
        u.role?.toLowerCase() === 'tecnico' || u.role?.toLowerCase() === 'admin'
      );
      setTechnicians(techs);

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

        // Encontrar técnico si está asignado
        const techUser = users.find((u: any) => u.id === r.technician_id);
        const techName = techUser ? techUser.name : (r.technician?.nombre || 'Sin asignar');

        return {
          id: r.id,
          customer: customerName,
          device: r.device ? `${r.device.brand} ${r.device.model}` : (r.deviceName || 'Dispositivo N/A'),
          service: r.notes || r.diagnosis_final || 'Mantenimiento General',
          date: dateFormatted,
          time: timeFormatted,
          status,
          technicianId: r.technician_id,
          technicianName: techName
        };
      });

      setAppointments(items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleOpenAssign = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setSelectedTechId(appointment.technicianId || '');
    setIsAssignModalOpen(true);
  };

  const handleAssignTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;
    if (!selectedTechId) {
      alert('Por favor selecciona un técnico.');
      return;
    }
    setIsAssigning(true);
    try {
      const res = await assignTechnicianAction(selectedAppointment.id, selectedTechId);
      if (res.success) {
        alert('Técnico asignado correctamente');
        setIsAssignModalOpen(false);
        loadAppointments();
      } else {
        alert(res.error || 'Error al asignar el técnico');
      }
    } catch (err: any) {
      alert(err.message || 'Error de comunicación');
    } finally {
      setIsAssigning(false);
    }
  };

  const tabs = ['Todas', 'Hoy', 'Esta Semana', 'Pendientes', 'Completadas'];
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;

  return (
    <div className="space-y-stack-lg">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-primary text-[32px] font-bold">Calendario de Citas</h1>
          <p className="text-on-surface-variant mt-2">Gestión centralizada de reparaciones y servicios técnicos programados.</p>
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
          </div>
        </div>
      </div>

      {/* Modal para Asignar Técnico */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Asignar Técnico de Laboratorio"
        icon={<UserPlus className="w-5 h-5 text-primary" />}
      >
        <form onSubmit={handleAssignTechnician} className="p-6 space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detalles del Servicio</p>
            <p className="text-sm font-bold text-primary">Ticket: {selectedAppointment?.id}</p>
            <p className="text-sm text-on-surface"><strong>Cliente:</strong> {selectedAppointment?.customer}</p>
            <p className="text-sm text-on-surface"><strong>Equipo:</strong> {selectedAppointment?.device}</p>
            <p className="text-sm text-on-surface"><strong>Falla/Servicio:</strong> {selectedAppointment?.service}</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Seleccionar Técnico *</label>
            <select
              value={selectedTechId}
              onChange={(e) => setSelectedTechId(e.target.value)}
              required
              className="w-full bg-slate-50 border border-outline-variant/60 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary text-sm font-medium"
            >
              <option value="">-- Seleccionar Técnico --</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <Button variant="outline" type="button" onClick={() => setIsAssignModalOpen(false)} disabled={isAssigning}>
              Cancelar
            </Button>
            <Button variant="secondary" type="submit" disabled={isAssigning}>
              {isAssigning ? 'Asignando...' : 'Asignar Técnico'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

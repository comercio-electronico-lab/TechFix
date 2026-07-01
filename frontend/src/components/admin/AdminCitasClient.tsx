"use client";

import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import { Button, Badge } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { getRepairTickets, getAllUsers, assignTechnicianAction } from '@/actions';
import { Eye, Edit, Calendar, Plus, Clock, Monitor, UserPlus, ShieldAlert } from 'lucide-react';

interface RepairTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  deviceName: string;
  deviceSerial: string;
  deviceType: string;
  appointmentDatetime: string;
  status: string;
  notes: string;
  technicianName: string;
  technicianId?: string;
  finalPrice: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function AdminCitasClient() {
  const [repairs, setRepairs] = useState<RepairTicket[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<RepairTicket | null>(null);
  const [selectedTechId, setSelectedTechId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const repairsData = await getRepairTickets();
      const usersData = await getAllUsers();
      
      const mappedRepairs = (repairsData as any[]).map(r => ({
        id: r.id,
        customerName: r.customerName,
        customerEmail: r.customerEmail,
        deviceName: r.deviceName,
        deviceSerial: r.deviceSerial,
        deviceType: r.device?.device_type || 'Dispositivo',
        appointmentDatetime: r.appointmentDatetime || '',
        status: r.status,
        notes: r.notes,
        technicianName: r.technicianName || 'Sin asignar',
        technicianId: r.technicianId || undefined,
        finalPrice: r.finalPrice || 0
      }));

      // Filter techs or admins who can perform repairs
      const techs = (usersData as User[]).filter(u => u.role === 'Tecnico' || u.role === 'Admin');

      setRepairs(mappedRepairs);
      setTechnicians(techs);
    } catch (e) {
      console.error('Error loading repairs/techs:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDetail = (r: RepairTicket) => {
    setSelectedRepair(r);
    setIsDetailOpen(true);
  };

  const handleOpenAssign = (r: RepairTicket) => {
    setSelectedRepair(r);
    setSelectedTechId(r.technicianId || '');
    setIsAssignOpen(true);
  };

  const handleAssignSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepair || !selectedTechId) return;
    setIsSubmitting(true);
    try {
      const res = await assignTechnicianAction(selectedRepair.id, selectedTechId);
      if (!res.success) throw new Error(res.error);
      alert('Técnico asignado con éxito');
      setIsAssignOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error al asignar el técnico');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s === 'ready' || s === 'completed') return <Badge variant="success">Completado</Badge>;
    if (s === 'repairing' || s === 'in_progress') return <Badge variant="info">En Reparación</Badge>;
    if (s === 'in_review') return <Badge variant="warning">En Revisión</Badge>;
    return <Badge variant="neutral">Pendiente</Badge>;
  };

  const columns = [
    {
      header: 'Ticket ID',
      key: 'id',
      render: (item: RepairTicket) => (
        <span className="font-mono text-xs font-bold text-primary px-2.5 py-1 bg-primary/5 rounded-lg border border-primary/10">
          {item.id.slice(0, 8)}...
        </span>
      )
    },
    {
      header: 'Cliente / Propietario',
      key: 'customerName',
      render: (item: RepairTicket) => (
        <div>
          <p className="font-bold text-primary">{item.customerName}</p>
          <span className="text-[11px] text-on-surface-variant">{item.customerEmail}</span>
        </div>
      )
    },
    {
      header: 'Dispositivo',
      key: 'deviceName',
      render: (item: RepairTicket) => (
        <div>
          <p className="font-semibold text-sm text-on-surface">{item.deviceName}</p>
          <span className="text-[10px] font-mono bg-slate-50 border px-1.5 py-0.5 rounded text-on-surface-variant/80">
            S/N: {item.deviceSerial || 'N/A'}
          </span>
        </div>
      )
    },
    {
      header: 'Técnico Asignado',
      key: 'technicianName',
      render: (item: RepairTicket) => (
        <span className={`text-sm font-bold ${item.technicianId ? 'text-secondary' : 'text-slate-400 italic'}`}>
          {item.technicianName}
        </span>
      )
    },
    {
      header: 'Fecha Cita',
      key: 'appointmentDatetime',
      render: (item: RepairTicket) => (
        <span className="text-xs text-on-surface-variant flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 opacity-55" />
          {item.appointmentDatetime ? new Date(item.appointmentDatetime).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' }) : 'No agendada'}
        </span>
      )
    },
    {
      header: 'Estado',
      key: 'status',
      render: (item: RepairTicket) => getStatusBadge(item.status)
    },
    {
      header: 'Acciones',
      key: 'actions',
      render: (item: RepairTicket) => (
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => handleOpenDetail(item)}
            title="Ver Detalle"
            className="p-2 hover:bg-surface-container-high rounded-lg text-primary transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={() => handleOpenAssign(item)}
            title="Asignar Técnico"
            className="p-2 hover:bg-surface-container-high rounded-lg text-secondary transition-colors"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-stack-lg">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-primary text-[32px] font-bold">Citas y Reparaciones</h1>
          <p className="text-on-surface-variant mt-2">Cola de tickets técnicos de soporte. Asigna ingenieros de servicio a los dispositivos.</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
        <div className="p-2">
          {loading ? (
            <div className="py-12 text-center text-sm font-semibold text-on-surface-variant/60">
              Cargando tickets de reparación...
            </div>
          ) : repairs.length === 0 ? (
            <div className="py-12 text-center text-sm text-on-surface-variant/60 flex flex-col items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-on-surface-variant/40" />
              No hay tickets de reparación registrados.
            </div>
          ) : (
            <Table columns={columns} data={repairs} />
          )}
        </div>
      </div>

      {/* Modal Ver Detalle */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Detalle del Ticket de Soporte"
        icon={<Clock className="w-5 h-5 text-primary" />}
      >
        {selectedRepair && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Código Ticket</p>
                <p className="text-sm font-mono font-bold text-primary">{selectedRepair.id}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Estado Técnico</p>
                <div className="mt-1">{getStatusBadge(selectedRepair.status)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Cliente</p>
                <p className="text-sm font-bold text-on-surface">{selectedRepair.customerName}</p>
                <p className="text-xs text-on-surface-variant">{selectedRepair.customerEmail}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Dispositivo</p>
                <p className="text-sm font-bold text-on-surface">{selectedRepair.deviceName}</p>
                <p className="text-xs text-on-surface-variant">S/N: {selectedRepair.deviceSerial}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Síntoma reportado / Notas</p>
              <p className="text-xs text-on-surface bg-slate-50 p-3 rounded-lg border">
                {selectedRepair.notes || 'Ninguna nota detallada.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Ingeniero Asignado</p>
                <p className="text-sm font-bold text-secondary mt-1">{selectedRepair.technicianName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Costo Cobrado</p>
                <p className="text-sm font-mono font-black text-on-surface mt-1">
                  ${selectedRepair.finalPrice.toFixed(2)} USD
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button variant="secondary" onClick={() => setIsDetailOpen(false)}>
                Entendido
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Asignar Técnico */}
      <Modal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        title="Asignar Ingeniero de Servicio"
        icon={<UserPlus className="w-5 h-5 text-secondary" />}
      >
        <form onSubmit={handleAssignSave} className="p-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase">Equipo a Reparar</p>
            <p className="text-sm font-bold text-primary">{selectedRepair?.deviceName}</p>
            <p className="text-xs text-on-surface-variant">S/N: {selectedRepair?.deviceSerial}</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Seleccionar Técnico Especialista</label>
            <select
              value={selectedTechId}
              onChange={(e) => setSelectedTechId(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary font-bold text-sm text-primary"
              required
            >
              <option value="">-- Seleccionar Técnico --</option>
              {technicians.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <Button variant="outline" type="button" onClick={() => setIsAssignOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant="secondary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Asignando...' : 'Confirmar Asignación'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

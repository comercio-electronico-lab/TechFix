'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

export interface AdminRepairTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  deviceName: string;
  deviceSerial: string;
  description: string;
  status: string; // pending, in_review, waiting_parts, repairing, ready, delivered, canceled
  priority: 'Low' | 'Medium' | 'High';
  finalPrice: number;
  notes: string;
  createdAt: string;
}

export function useRepairQueue() {
  const { token, isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState<AdminRepairTicket[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newTicket, setNewTicket] = useState({
    customer: '',
    device: '',
    description: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    technician: 'Elena',
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const fetchQueue = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setTickets([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/admin/repairs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        // Mapear el formato GORM a lo esperado por las tarjetas
        const mapped: AdminRepairTicket[] = (data || []).map((o: any) => ({
          id: o.id,
          customerName: o.user?.nombre || 'Cliente Invitado',
          customerEmail: o.user?.email || 'N/A',
          deviceName: o.device ? `${o.device.brand} ${o.device.model}` : 'Equipo de Laboratorio',
          deviceSerial: o.device?.serial_number || 'N/A',
          description: o.notes || 'Revisión y diagnóstico físico de hardware.',
          status: o.status,
          priority: o.status === 'waiting_parts' ? 'High' : o.status === 'repairing' ? 'Medium' : 'Low',
          finalPrice: o.final_price || 0,
          notes: o.diagnosis_final || '',
          createdAt: o.created_at,
        }));
        setTickets(mapped);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Error al cargar la cola de reparaciones de taller.');
      }
    } catch (e) {
      console.error(e);
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  }, [API_URL, token, isAuthenticated]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  // Arrastrar / Mover ticket en el Kanban
  const moveTicket = async (ticketId: string, nextStatus: string, notes: string = 'Transición técnica en taller.') => {
    if (!token) return;

    // Traducir los estados del Kanban a los del backend
    let backendStatus = 'pending';
    if (nextStatus === 'Por diagnosticar') {
      backendStatus = 'in_review';
    } else if (nextStatus === 'En reparación') {
      backendStatus = 'repairing';
    } else if (nextStatus === 'Terminado') {
      backendStatus = 'ready';
    } else {
      backendStatus = nextStatus;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/repairs/${ticketId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: backendStatus,
          notes: notes,
        }),
      });

      if (res.ok) {
        await fetchQueue(); // Refrescar cola
      } else {
        alert('Error al mover la reparación en el servidor.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión con el servidor.');
    }
  };

  // Asociar repuesto y descontar existencias
  const addPartToRepair = async (ticketId: string, productId: string, quantity: number): Promise<boolean> => {
    if (!token) return false;

    try {
      const res = await fetch(`${API_URL}/api/admin/repairs/${ticketId}/parts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          producto_id: productId,
          cantidad: quantity,
        }),
      });

      if (res.ok) {
        await fetchQueue(); // Refrescar precio final y logs
        return true;
      } else {
        const data = await res.json();
        alert(data.error || 'Error al vincular el repuesto en el taller.');
        return false;
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión con el servidor.');
      return false;
    }
  };

  // Filtrar tarjetas
  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return tickets;
    const q = searchQuery.toLowerCase();
    return tickets.filter(t =>
      t.id.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.deviceName.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  }, [tickets, searchQuery]);

  // Agrupar en las 3 columnas reglamentarias de Flow 5
  const pendingTickets = useMemo(() => 
    filteredTickets.filter(t => t.status === 'pending' || t.status === 'in_review'),
    [filteredTickets]
  );
  
  const repairingTickets = useMemo(() => 
    filteredTickets.filter(t => t.status === 'waiting_parts' || t.status === 'repairing'),
    [filteredTickets]
  );
  
  const completedTickets = useMemo(() => 
    filteredTickets.filter(t => t.status === 'ready' || t.status === 'delivered'),
    [filteredTickets]
  );

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Acción simulada para registrar ticket físico del taller.');
    setIsModalOpen(false);
  };

  return {
    tickets,
    searchQuery,
    isModalOpen,
    pendingTickets,
    repairingTickets,
    completedTickets,
    newTicket,
    loading,
    error,
    setSearchQuery,
    setIsModalOpen,
    setNewTicket,
    moveTicket,
    addPartToRepair,
    handleCreateTicket,
    refetch: fetchQueue,
  };
}

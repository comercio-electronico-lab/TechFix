'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { IAdminRepairTicket, RepairStatus } from '@/interfaces/domain';
import { getRepairTickets, updateRepairStatus, assignPartToRepair } from '@/app/actions';

export interface UseRepairQueueReturn {
  tickets: IAdminRepairTicket[];
  searchQuery: string;
  isModalOpen: boolean;
  pendingTickets: IAdminRepairTicket[];
  repairingTickets: IAdminRepairTicket[];
  completedTickets: IAdminRepairTicket[];
  newTicket: {
    customer: string;
    device: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    technician: string;
  };
  loading: boolean;
  error: string | null;
  setSearchQuery: (q: string) => void;
  setIsModalOpen: (open: boolean) => void;
  setNewTicket: React.Dispatch<React.SetStateAction<UseRepairQueueReturn['newTicket']>>;
  moveTicket: (ticketId: string, nextStatus: string, notes?: string) => Promise<void>;
  addPartToRepair: (ticketId: string, productId: string, quantity: number) => Promise<boolean>;
  handleCreateTicket: (e: React.FormEvent) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useRepairQueue(): UseRepairQueueReturn {
  const { token, isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState<IAdminRepairTicket[]>([]);
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

  const fetchTickets = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setTickets([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getRepairTickets();
      const mapped: IAdminRepairTicket[] = data.map((o: any) => ({
        id: o.id,
        customerName: o.customerName || (o.user?.nombre) || 'Cliente',
        customerEmail: o.customerEmail || (o.user?.email) || '',
        deviceName: o.deviceName || `${o.device?.brand} ${o.device?.model}` || 'Equipo',
        serialNumber: o.deviceSerial || o.device?.serial_number || 'N/A',
        deviceSerial: o.deviceSerial || o.device?.serial_number || 'N/A',
        issueDescription: o.description || o.notes || '',
        description: o.description || o.notes || '',
        status: o.status as RepairStatus,
        priority: (o.priority as any) || 'Medium',
        finalPrice: o.finalPrice || o.final_price || 0,
        notes: o.notes || o.diagnosis_final || '',
        createdAt: o.createdAt || o.created_at,
      }));
      setTickets(mapped);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al cargar tickets';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const moveTicket = async (ticketId: string, nextStatus: string, notes?: string) => {
    try {
      await updateRepairStatus(ticketId, nextStatus as RepairStatus, notes);
      await fetchTickets();
    } catch (e) { console.error(e); }
  };

  const addPartToRepair = async (ticketId: string, productId: string, quantity: number) => {
    try {
      await assignPartToRepair(ticketId, productId, quantity);
      await fetchTickets();
      return true;
    } catch (e) { return false; }
  };

  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return tickets;
    const q = searchQuery.toLowerCase();
    return tickets.filter(t => 
      t.customerName.toLowerCase().includes(q) || 
      t.deviceName.toLowerCase().includes(q)
    );
  }, [tickets, searchQuery]);

  const pendingTickets = useMemo(() => filteredTickets.filter(t => t.status === 'pending' || t.status === 'diagnosing'), [filteredTickets]);
  const repairingTickets = useMemo(() => filteredTickets.filter(t => t.status === 'repairing' || t.status === 'waiting_parts'), [filteredTickets]);
  const completedTickets = useMemo(() => filteredTickets.filter(t => t.status === 'ready' || t.status === 'delivered'), [filteredTickets]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Función profesional de creación en progreso...');
    setIsModalOpen(false);
  };

  return {
    tickets, searchQuery, isModalOpen, pendingTickets, repairingTickets, completedTickets, newTicket, loading, error,
    setSearchQuery, setIsModalOpen, setNewTicket, moveTicket, addPartToRepair, handleCreateTicket,
    refetch: fetchTickets,
  };
}

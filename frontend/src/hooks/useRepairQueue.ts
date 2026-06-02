'use client';

import { useState, useMemo } from 'react';
import { RepairTicket } from '@/types';

const TECHNICIAN_AVATARS = {
  Elena: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYJwC3_maJB_9bA7M4PlFFBo95pvTJjfTvDw-KEsZiFmF8bJfCoF-9db_RS1cL997kc_tYdUh2QR-c39a_NsW0xPuVaAPZEbyI7mKLdqLANKQ2MKaaW3VqMvQWpX1hnmNA4Wtv1CjPNCoJ3rsaud5DFHTXAuKZnUkDGd9CSoNzkmGdtjbK1RK_YwEgrVsUUdg-XuSs40FuSpDsCGX35rz5I1TXHJvyimLqGkqvyMVZ5D21CTa2CVmEwHI8V5LGa54PEv_99RzTBK1G',
  Mike: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJImmL7C5EqVDjlA6tHXnTAHLo0AF94EuLogO1cEZpvJkqmtSkUtul2oM11-la3A3R94bJQCf1k3TIVDzRjPgIJU4gCSt6mZfTB06eagtQSX7rSkrD1m-dm1czg1aME4eyNcnwaEnoPHBxfhVTJS-2G2xKE7RHrZTPvyUa56jSndlierFlCqZsaORfptR8TDZ8pVvccVQWRsNYlFfDn0-QSKstJ9IBZThlZT5Yakeg4F3v6GxHTMb2jWwaRDvkOZa2cbm4Cu06X1Fv',
};

const INITIAL_TICKETS: RepairTicket[] = [
  { id: 'ORD-9024', customer: 'John Doe', device: 'MacBook Pro 16" (M2)', description: 'Battery replacement & thermal paste application. Deep fan cleanup required.', status: 'Pending', technician: 'Sin asignar', priority: 'Medium', timeSpent: '2h' },
  { id: 'ORD-9028', customer: 'Sarah Adams', device: 'Dell XPS 13', description: 'Screen flickering issues, potential ribbon cable fault or loose connector.', status: 'Pending', technician: 'Sin asignar', priority: 'High', timeSpent: '4h' },
  { id: 'ORD-9015', customer: 'Jameson Carter', device: 'iPhone 14 Pro Max', description: 'Liquid damage assessment. Board-level component checking and ultrasonic cleaning.', status: 'Diagnosis', technician: 'Mike', technicianAvatar: TECHNICIAN_AVATARS.Mike, priority: 'Low', timeSpent: '1d' },
  { id: 'ORD-8992', customer: 'Elena Rostova', device: 'Samsung Galaxy S23 Ultra', description: 'OLED display replacement & back glass swap. Frame alignment audit.', status: 'Repairing', technician: 'Elena', technicianAvatar: TECHNICIAN_AVATARS.Elena, priority: 'High', progress: 65, timeSpent: '3d' },
  { id: 'ORD-8950', customer: 'Alice Jenkins', device: 'iPad Pro 12.9"', description: 'Charging port reflow complete. Battery efficiency tested OK.', status: 'Completed', technician: 'Mike', technicianAvatar: TECHNICIAN_AVATARS.Mike, priority: 'Medium', timeSpent: 'Ready' },
];

export interface UseRepairQueueReturn {
  tickets: RepairTicket[];
  searchQuery: string;
  isModalOpen: boolean;
  pendingTickets: RepairTicket[];
  diagnosisTickets: RepairTicket[];
  repairingTickets: RepairTicket[];
  completedTickets: RepairTicket[];
  newTicket: { customer: string; device: string; description: string; priority: RepairTicket['priority']; technician: string };
  setSearchQuery: (q: string) => void;
  setIsModalOpen: (open: boolean) => void;
  setNewTicket: React.Dispatch<React.SetStateAction<UseRepairQueueReturn['newTicket']>>;
  moveTicket: (ticketId: string, nextStatus: RepairTicket['status']) => void;
  handleCreateTicket: (e: React.FormEvent) => void;
}

export function useRepairQueue(): UseRepairQueueReturn {
  const [tickets, setTickets] = useState<RepairTicket[]>(INITIAL_TICKETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    customer: '',
    device: '',
    description: '',
    priority: 'Medium' as RepairTicket['priority'],
    technician: 'Elena'
  });

  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return tickets;
    const q = searchQuery.toLowerCase();
    return tickets.filter(t =>
      t.id.toLowerCase().includes(q) ||
      t.customer.toLowerCase().includes(q) ||
      t.device.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  }, [tickets, searchQuery]);

  const pendingTickets = useMemo(() => filteredTickets.filter(t => t.status === 'Pending'), [filteredTickets]);
  const diagnosisTickets = useMemo(() => filteredTickets.filter(t => t.status === 'Diagnosis'), [filteredTickets]);
  const repairingTickets = useMemo(() => filteredTickets.filter(t => t.status === 'Repairing'), [filteredTickets]);
  const completedTickets = useMemo(() => filteredTickets.filter(t => t.status === 'Completed'), [filteredTickets]);

  const moveTicket = (ticketId: string, nextStatus: RepairTicket['status']) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      const update: Partial<RepairTicket> = { status: nextStatus };
      if (nextStatus === 'Repairing') {
        update.progress = 25;
        update.technician = t.technician === 'Sin asignar' ? 'Elena' : t.technician;
        update.technicianAvatar = TECHNICIAN_AVATARS.Elena;
      } else if (nextStatus === 'Completed') {
        update.progress = undefined;
        update.timeSpent = 'Ready';
      } else if (nextStatus === 'Diagnosis') {
        update.technician = 'Mike';
        update.technicianAvatar = TECHNICIAN_AVATARS.Mike;
      }
      return { ...t, ...update };
    }));
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.customer || !newTicket.device || !newTicket.description) return;

    const ticket: RepairTicket = {
      id: `ORD-${9000 + tickets.length + 1}`,
      customer: newTicket.customer,
      device: newTicket.device,
      description: newTicket.description,
      status: 'Pending',
      technician: newTicket.technician,
      technicianAvatar: TECHNICIAN_AVATARS[newTicket.technician as keyof typeof TECHNICIAN_AVATARS],
      priority: newTicket.priority,
      timeSpent: 'Just now'
    };

    setTickets(prev => [ticket, ...prev]);
    setIsModalOpen(false);
    setNewTicket({ customer: '', device: '', description: '', priority: 'Medium', technician: 'Elena' });
  };

  return {
    tickets,
    searchQuery,
    isModalOpen,
    pendingTickets,
    diagnosisTickets,
    repairingTickets,
    completedTickets,
    newTicket,
    setSearchQuery,
    setIsModalOpen,
    setNewTicket,
    moveTicket,
    handleCreateTicket,
  };
}

'use client';

import React from 'react';
import { RepairTicket } from '@/types';
import KanbanTicketCard from './KanbanTicketCard';
import { Plus } from 'lucide-react';

interface KanbanColumnConfig {
  status: RepairTicket['status'];
  label: string;
  dotClass: string;
  count: number;
  tickets: RepairTicket[];
}

interface KanbanBoardProps {
  pendingTickets: RepairTicket[];
  diagnosisTickets: RepairTicket[];
  repairingTickets: RepairTicket[];
  completedTickets: RepairTicket[];
  onMoveTicket: (ticketId: string, nextStatus: RepairTicket['status']) => void;
}

export default function KanbanBoard({
  pendingTickets,
  diagnosisTickets,
  repairingTickets,
  completedTickets,
  onMoveTicket,
}: KanbanBoardProps) {
  const columns: KanbanColumnConfig[] = [
    { status: 'Pending', label: 'Pending', dotClass: 'bg-outline dark:bg-slate-500', count: pendingTickets.length, tickets: pendingTickets },
    { status: 'Diagnosis', label: 'In Diagnosis', dotClass: 'bg-tertiary-fixed-dim', count: diagnosisTickets.length, tickets: diagnosisTickets },
    { status: 'Repairing', label: 'Repairing', dotClass: 'bg-primary', count: repairingTickets.length, tickets: repairingTickets },
    { status: 'Completed', label: 'Completed', dotClass: 'bg-emerald-500', count: completedTickets.length, tickets: completedTickets },
  ];

  const emptyMessages: Record<RepairTicket['status'], string> = {
    Pending: 'No pending tickets',
    Diagnosis: 'No tickets in diagnosis',
    Repairing: 'No active repairs',
    Completed: 'No completed tickets',
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 bg-surface-container-lowest dark:bg-slate-950/40">
      <div className="flex h-full gap-6 min-w-max items-start">
        {columns.map((col) => (
          <div
            key={col.status}
            className={`w-80 flex-shrink-0 flex flex-col max-h-[calc(100vh-220px)] bg-surface dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-850 rounded-xl shadow-sm overflow-hidden transition-colors ${col.status === 'Completed' ? 'opacity-90 hover:opacity-100' : ''}`}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-outline-variant/30 dark:border-slate-800 flex items-center justify-between bg-surface-container-low dark:bg-slate-950/40">
              <h3 className="font-bold text-xs text-on-surface dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                {col.status === 'Completed' ? (
                  <span className="material-symbols-outlined text-[16px] text-emerald-500">check_circle</span>
                ) : (
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotClass}`} />
                )}
                {col.label}
              </h3>
              <span className="font-mono text-xs bg-surface-variant dark:bg-slate-800 text-on-surface-variant dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
                {col.count}
              </span>
            </div>

            {/* Column Cards */}
            <div className="p-3 flex flex-col gap-3 overflow-y-auto flex-1">
              {col.tickets.map((ticket) => (
                <KanbanTicketCard key={ticket.id} ticket={ticket} onMove={onMoveTicket} />
              ))}
              {col.tickets.length === 0 && (
                <div className="text-center py-8 text-on-surface-variant/40 dark:text-slate-600 text-xs italic select-none">
                  {emptyMessages[col.status]}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add Column Placeholder */}
        <div className="w-12 flex-shrink-0 flex items-center justify-center h-[calc(100vh-220px)] border-2 border-dashed border-outline-variant/30 dark:border-slate-800 rounded-xl cursor-pointer hover:border-primary dark:hover:border-sky-500 hover:bg-white dark:hover:bg-slate-900/10 transition-colors group">
          <Plus className="w-5 h-5 text-outline group-hover:text-primary dark:group-hover:text-sky-500 transition-colors" />
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Search, Plus, Wrench } from 'lucide-react';
import { useRepairQueue } from '@/hooks/useRepairQueue';
import KanbanBoard from '@/components/admin/KanbanBoard';
import NewTicketModal from '@/components/admin/NewTicketModal';

export default function WorkshopDashboard() {
  const {
    searchQuery,
    isModalOpen,
    pendingTickets,
    repairingTickets,
    completedTickets,
    newTicket,
    setSearchQuery,
    setIsModalOpen,
    setNewTicket,
    moveTicket,
    handleCreateTicket,
  } = useRepairQueue();

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-140px)] bg-surface dark:bg-slate-900/30 rounded-2xl border border-outline-variant/30 dark:border-slate-800 overflow-hidden transition-colors duration-300 shadow-sm">

      {/* Top Toolbar */}
      <header className="h-16 flex-shrink-0 bg-surface-container-low dark:bg-slate-950/40 border-b border-outline-variant/30 dark:border-slate-800 flex items-center justify-between px-6 z-10 transition-colors">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-on-surface dark:text-white tracking-tight flex items-center gap-2.5">
            <Wrench className="w-5 h-5 text-primary dark:text-sky-400" />
            Active Repair Queue
          </h2>
          <div className="h-4 w-px bg-outline-variant/50 dark:bg-slate-800 mx-2" />
          <span className="text-[10px] font-bold text-on-surface-variant/60 dark:text-slate-500 uppercase tracking-widest">
            Last updated: Just now
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Barra de búsqueda */}
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, devices, customers..."
              className="pl-9 pr-4 py-1.5 bg-surface dark:bg-slate-950 border border-outline-variant/50 dark:border-slate-800 rounded-lg text-xs text-on-surface dark:text-white placeholder:text-outline/70 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 transition-all w-60"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="h-9 px-4 bg-primary dark:bg-sky-600 hover:bg-surface-tint dark:hover:bg-sky-500 text-on-primary dark:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> New Ticket
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <KanbanBoard
        pendingTickets={pendingTickets}
        repairingTickets={repairingTickets}
        completedTickets={completedTickets}
        onMoveTicket={moveTicket}
      />

      {/* Modal de Nuevo Ticket */}
      <NewTicketModal
        isOpen={isModalOpen}
        newTicket={newTicket}
        onClose={() => setIsModalOpen(false)}
        onChange={setNewTicket}
        onSubmit={handleCreateTicket}
      />

    </div>
  );
}

'use client';

import React from 'react';
import { RepairTicket } from '@/types';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

interface KanbanTicketCardProps {
  ticket: RepairTicket;
  onMove: (ticketId: string, nextStatus: RepairTicket['status']) => void;
}

const PRIORITY_STYLES: Record<RepairTicket['priority'], string> = {
  High: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60',
  Medium: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60',
  Low: 'bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800',
};

export default function KanbanTicketCard({ ticket, onMove }: KanbanTicketCardProps) {
  const renderActionButton = () => {
    switch (ticket.status) {
      case 'Pending':
        return (
          <button
            onClick={() => onMove(ticket.id, 'Diagnosis')}
            className="text-[9px] font-bold bg-primary/5 hover:bg-primary dark:bg-sky-500/5 dark:hover:bg-sky-600 text-primary dark:text-sky-400 hover:text-on-primary dark:hover:text-slate-950 px-2.5 py-1 rounded border border-primary/20 dark:border-sky-500/20 transition-all flex items-center gap-1 cursor-pointer"
          >
            Diagnose <ChevronRight className="w-2.5 h-2.5" />
          </button>
        );
      case 'Diagnosis':
        return (
          <button
            onClick={() => onMove(ticket.id, 'Repairing')}
            className="text-[9px] font-bold bg-primary/5 hover:bg-primary dark:bg-sky-500/5 dark:hover:bg-sky-600 text-primary dark:text-sky-400 hover:text-on-primary dark:hover:text-slate-950 px-2.5 py-1 rounded border border-primary/20 dark:border-sky-500/20 transition-all flex items-center gap-1 cursor-pointer"
          >
            Repair <ChevronRight className="w-2.5 h-2.5" />
          </button>
        );
      case 'Repairing':
        return (
          <button
            onClick={() => onMove(ticket.id, 'Completed')}
            className="text-[9px] font-bold bg-emerald-50 hover:bg-emerald-600 dark:bg-emerald-950/20 dark:hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-on-primary dark:hover:text-slate-950 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-900/60 transition-all flex items-center gap-1 cursor-pointer"
          >
            Complete <ChevronRight className="w-2.5 h-2.5" />
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-surface dark:bg-slate-950 border border-outline-variant/40 dark:border-slate-800 rounded-lg p-4 shadow-sm hover:border-primary dark:hover:border-sky-500 hover:-translate-y-0.5 hover:shadow-md transition-all group relative duration-200 cursor-default ${ticket.status !== 'Pending' ? 'overflow-hidden' : ''}`}>
      {/* Barra superior de color por estado */}
      {ticket.status === 'Diagnosis' && <div className="absolute top-0 left-0 w-full h-1 bg-tertiary-fixed-dim" />}
      {ticket.status === 'Repairing' && <div className="absolute top-0 left-0 w-full h-1 bg-primary" />}

      {/* Header */}
      <div className="flex justify-between items-start mb-2.5 mt-1">
        <span className="font-mono text-[9px] font-bold text-primary dark:text-sky-400 bg-primary/10 dark:bg-sky-500/10 px-2 py-0.5 rounded select-all uppercase tracking-wider border border-primary/10 dark:border-sky-500/10">
          #{ticket.id}
        </span>

        {ticket.status === 'Completed' ? (
          <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/60 uppercase tracking-wider">
            Ready
          </span>
        ) : ticket.status === 'Diagnosis' ? (
          <span className="text-[8px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/60 uppercase tracking-wider">
            Assigned
          </span>
        ) : ticket.status === 'Repairing' ? (
          <span className="text-[8px] font-bold text-primary dark:text-sky-400 bg-primary/10 dark:bg-sky-500/10 px-1.5 py-0.5 rounded border border-primary/15 dark:border-sky-500/20 uppercase tracking-wider">
            Lab
          </span>
        ) : (
          <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${PRIORITY_STYLES[ticket.priority]}`}>
            {ticket.priority}
          </span>
        )}
      </div>

      {/* Dispositivo y descripción */}
      <h4 className={`font-bold text-sm mb-1 leading-snug ${ticket.status === 'Completed' ? 'text-on-surface-variant dark:text-slate-450' : 'text-on-surface dark:text-slate-200'}`}>
        {ticket.device}
      </h4>
      <p className={`text-xs mb-4 line-clamp-2 leading-relaxed ${ticket.status === 'Completed' ? 'text-on-surface-variant/60 dark:text-slate-500' : 'text-on-surface-variant/80 dark:text-slate-400'}`}>
        {ticket.description}
      </p>

      {/* Barra de progreso (solo Repairing) */}
      {ticket.status === 'Repairing' && (
        <div className="mb-4">
          <div className="flex justify-between font-mono text-[9px] text-on-surface-variant/80 dark:text-slate-500 mb-1">
            <span>PROGRESS</span>
            <span className="font-bold text-primary dark:text-sky-400">{ticket.progress || 0}%</span>
          </div>
          <div className="w-full h-1.5 bg-surface-container-low dark:bg-slate-950 border border-outline-variant/10 dark:border-slate-800 rounded-full overflow-hidden">
            <div
              className="bg-primary dark:bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${ticket.progress || 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/15 dark:border-slate-850">
        {ticket.status === 'Completed' ? (
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Pickup
          </span>
        ) : ticket.technicianAvatar ? (
          <div className="flex items-center gap-1.5">
            <img src={ticket.technicianAvatar} className="w-5 h-5 rounded-full object-cover border border-outline-variant/20" alt="Tech" />
            <span className="text-[10px] font-medium text-on-surface-variant dark:text-slate-400">
              Tech: {ticket.technician}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-surface-container-high dark:bg-slate-800 flex items-center justify-center text-[9px] font-bold text-on-surface-variant dark:text-slate-400 uppercase border border-outline-variant/10">
              {ticket.customer.substring(0, 2)}
            </div>
            <span className="text-[10px] font-medium text-on-surface-variant dark:text-slate-400 truncate max-w-[80px]">
              {ticket.customer}
            </span>
          </div>
        )}

        {renderActionButton()}
      </div>
    </div>
  );
}

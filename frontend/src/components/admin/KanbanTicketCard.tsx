'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Coins, 
  Plus 
} from 'lucide-react';
import KanbanAddPartModal from './KanbanAddPartModal';

interface KanbanTicketCardProps {
  ticket: any;
  onMove: (ticketId: string, nextStatus: string) => void;
}

const PRIORITY_STYLES: Record<string, string> = {
  High: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60',
  Medium: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60',
  Low: 'bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800',
};

export default function KanbanTicketCard({ ticket, onMove }: KanbanTicketCardProps) {
  const [showPartsModal, setShowPartsModal] = useState(false);

  const renderActionButton = () => {
    const isCompleted = ticket.status === 'ready' || ticket.status === 'delivered';
    const isRepairing = ticket.status === 'waiting_parts' || ticket.status === 'repairing';
    const isPending = ticket.status === 'pending' || ticket.status === 'in_review';

    if (isPending) {
      return (
        <button
          onClick={() => onMove(ticket.id, 'En reparación')}
          className="text-[9px] font-black bg-primary/5 hover:bg-primary dark:bg-sky-500/5 dark:hover:bg-sky-600 text-primary dark:text-sky-400 hover:text-on-primary dark:hover:text-slate-950 px-2.5 py-1.5 rounded border border-primary/20 dark:border-sky-500/20 transition-all flex items-center gap-1 cursor-pointer"
        >
          Reparar <ChevronRight className="w-2.5 h-2.5" />
        </button>
      );
    }

    if (isRepairing) {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => setShowPartsModal(true)}
            className="text-[9px] font-black bg-amber-500/10 hover:bg-amber-500 dark:bg-amber-500/5 text-amber-600 dark:text-amber-400 hover:text-slate-950 px-2 py-1.5 rounded border border-amber-500/20 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-2.5 h-2.5" /> Repuesto
          </button>
          <button
            onClick={() => onMove(ticket.id, 'Terminado')}
            className="text-[9px] font-black bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-slate-950 px-2.5 py-1.5 rounded border border-emerald-500/25 transition-all flex items-center gap-1 cursor-pointer"
          >
            Completar <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>
      );
    }

    return null;
  };

  const isCompleted = ticket.status === 'ready' || ticket.status === 'delivered';
  const isRepairing = ticket.status === 'waiting_parts' || ticket.status === 'repairing';
  const isPending = ticket.status === 'pending' || ticket.status === 'in_review';

  return (
    <div className={`bg-surface dark:bg-slate-950 border border-outline-variant/40 dark:border-slate-800 rounded-lg p-4 shadow-sm hover:border-primary dark:hover:border-sky-500 hover:-translate-y-0.5 hover:shadow-md transition-all group relative duration-200 cursor-default ${!isPending ? 'overflow-hidden' : ''}`}>
      {/* Barra superior de color por estado */}
      {isRepairing && <div className="absolute top-0 left-0 w-full h-1 bg-primary" />}
      {isCompleted && <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />}

      {/* Header */}
      <div className="flex justify-between items-start mb-2.5 mt-1">
        <span className="font-mono text-[9px] font-bold text-primary dark:text-sky-400 bg-primary/10 dark:bg-sky-500/10 px-2 py-0.5 rounded select-all uppercase tracking-wider border border-primary/10 dark:border-sky-500/10">
          TKT-{ticket.id.slice(0, 8).toUpperCase()}
        </span>

        {isCompleted ? (
          <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/60 uppercase tracking-wider">
            Terminado
          </span>
        ) : isRepairing ? (
          <span className="text-[8px] font-bold text-primary dark:text-sky-400 bg-primary/10 dark:bg-sky-500/10 px-1.5 py-0.5 rounded border border-primary/15 dark:border-sky-500/20 uppercase tracking-wider">
            Taller
          </span>
        ) : (
          <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.Medium}`}>
            {ticket.priority}
          </span>
        )}
      </div>

      {/* Dispositivo y descripción */}
      <h4 className={`font-bold text-sm mb-1 leading-snug ${isCompleted ? 'text-on-surface-variant dark:text-slate-450' : 'text-on-surface dark:text-slate-200'}`}>
        {ticket.deviceName}
      </h4>
      <p className={`text-xs mb-4 line-clamp-2 leading-relaxed ${isCompleted ? 'text-on-surface-variant/60 dark:text-slate-500' : 'text-on-surface-variant/80 dark:text-slate-400'}`}>
        {ticket.description}
      </p>

      {/* Costo Acumulado Badge */}
      {ticket.finalPrice > 0 && (
        <div className="mb-4 inline-flex items-center gap-1 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold px-2.5 py-1 rounded border border-emerald-500/10">
          <Coins className="w-3.5 h-3.5" /> Facturación: ${ticket.finalPrice.toFixed(2)} USD
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/15 dark:border-slate-850">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-[9px] font-bold text-on-surface-variant dark:text-slate-400 uppercase border border-outline-variant/10 shrink-0">
            {ticket.customerName.substring(0, 2)}
          </div>
          <span className="text-[10px] font-medium text-on-surface-variant dark:text-slate-450 truncate max-w-[80px]">
            {ticket.customerName}
          </span>
        </div>

        {renderActionButton()}
      </div>

      {/* Modal para Asociar Repuesto */}
      <KanbanAddPartModal
        isOpen={showPartsModal}
        ticketId={ticket.id}
        onClose={() => setShowPartsModal(false)}
      />
    </div>
  );
}

'use client';

import React from 'react';
import { Wrench } from 'lucide-react';
import Modal from '@/components/ui/Modal';

interface NewTicketFormData {
  customer: string;
  device: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  technician: string;
}

interface NewTicketModalProps {
  isOpen: boolean;
  newTicket: NewTicketFormData;
  onClose: () => void;
  onChange: React.Dispatch<React.SetStateAction<NewTicketFormData>>;
  onSubmit: (e: React.FormEvent) => void;
}

const inputClass = "w-full bg-surface dark:bg-slate-950 border border-outline-variant/70 dark:border-slate-700 rounded px-3 py-2 text-xs text-on-surface dark:text-white placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20";

export default function NewTicketModal({ isOpen, newTicket, onClose, onChange, onSubmit }: NewTicketModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Technical Ticket"
      icon={<Wrench className="w-4 h-4 text-primary dark:text-sky-400" />}
    >
      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Customer</label>
            <input
              type="text" required placeholder="Ej: John Doe"
              value={newTicket.customer}
              onChange={(e) => onChange(prev => ({ ...prev, customer: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Device</label>
            <input
              type="text" required placeholder="Ej: iPad Pro 11"
              value={newTicket.device}
              onChange={(e) => onChange(prev => ({ ...prev, device: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Technical Issue Description</label>
          <textarea
            required rows={3} placeholder="Detail physical or board-level symptoms..."
            value={newTicket.description}
            onChange={(e) => onChange(prev => ({ ...prev, description: e.target.value }))}
            className={`${inputClass} resize-none leading-relaxed`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Priority</label>
            <select
              value={newTicket.priority}
              onChange={(e) => onChange(prev => ({ ...prev, priority: e.target.value as any }))}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="Low" className="dark:bg-slate-900">Low</option>
              <option value="Medium" className="dark:bg-slate-900">Medium</option>
              <option value="High" className="dark:bg-slate-900">High</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Assigned Technician</label>
            <select
              value={newTicket.technician}
              onChange={(e) => onChange(prev => ({ ...prev, technician: e.target.value }))}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="Elena" className="dark:bg-slate-900">Elena (Micro-soldering)</option>
              <option value="Mike" className="dark:bg-slate-900">Mike (Systems & OS)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant/30 dark:border-slate-800 flex justify-end gap-3">
          <button
            type="button" onClick={onClose}
            className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest dark:bg-slate-800 dark:hover:bg-slate-750 text-on-surface-variant dark:text-slate-300 rounded-lg text-xs font-semibold transition-all cursor-pointer border border-outline-variant/20"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-primary dark:bg-sky-600 hover:bg-surface-tint dark:hover:bg-sky-500 text-on-primary dark:text-white rounded-lg text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-sm"
          >
            Create Ticket
          </button>
        </div>
      </form>
    </Modal>
  );
}

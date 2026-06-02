'use client';

import React from 'react';
import { Laptop, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { NewDeviceForm } from '@/hooks/useCustomerPortal';

interface RegisterDeviceModalProps {
  isOpen: boolean;
  newDevice: NewDeviceForm;
  isSubmitting: boolean;
  onClose: () => void;
  onChange: React.Dispatch<React.SetStateAction<NewDeviceForm>>;
  onSubmit: (e: React.FormEvent) => void;
}

const inputClass =
  'w-full bg-surface dark:bg-slate-950 border border-outline-variant/70 dark:border-slate-750 rounded px-3 py-2 text-xs text-on-surface dark:text-white placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20 transition-all';

export default function RegisterDeviceModal({
  isOpen,
  newDevice,
  isSubmitting,
  onClose,
  onChange,
  onSubmit,
}: RegisterDeviceModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Hardware"
      icon={<Laptop className="w-4 h-4 text-primary dark:text-sky-400" />}
    >
      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Marca</label>
            <input
              type="text" required placeholder="Ej: Apple, Dell, Asus"
              value={newDevice.brand}
              onChange={(e) => onChange(prev => ({ ...prev, brand: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Modelo</label>
            <input
              type="text" required placeholder="Ej: MacBook Air 13 o ROG Zephyrus"
              value={newDevice.model}
              onChange={(e) => onChange(prev => ({ ...prev, model: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Especificaciones (CPU/RAM)</label>
            <input
              type="text" placeholder="Ej: Intel i7 / 16GB RAM / 512GB SSD"
              value={newDevice.specs}
              onChange={(e) => onChange(prev => ({ ...prev, specs: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Número de Serie</label>
            <input
              type="text" required placeholder="Ej: CO2XG543JGH7"
              value={newDevice.serialNumber}
              onChange={(e) => onChange(prev => ({ ...prev, serialNumber: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Fecha de Compra</label>
            <input
              type="text" placeholder="Ej: 15 Dic, 2024"
              value={newDevice.purchaseDate}
              onChange={(e) => onChange(prev => ({ ...prev, purchaseDate: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Estado de Garantía</label>
            <select
              value={newDevice.status}
              onChange={(e) => onChange(prev => ({ ...prev, status: e.target.value as NewDeviceForm['status'] }))}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="Active Warranty" className="dark:bg-slate-900">Garantía Activa</option>
              <option value="Out of Warranty" className="dark:bg-slate-900">Sin Garantía</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant/30 dark:border-slate-800 flex justify-end gap-3">
          <button
            type="button" onClick={onClose}
            className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest dark:bg-slate-800 dark:hover:bg-slate-750 text-on-surface-variant dark:text-slate-350 rounded-lg text-xs font-semibold transition-all cursor-pointer border border-outline-variant/20"
          >
            Cancelar
          </button>
          <button
            type="submit" disabled={isSubmitting}
            className="px-5 py-2 bg-primary dark:bg-sky-600 hover:bg-surface-tint dark:hover:bg-sky-500 text-on-primary dark:text-white rounded-lg text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-sm hover:shadow dark:hover:shadow-sky-500/20 flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Registrando...</>
            ) : (
              'Registrar Dispositivo'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

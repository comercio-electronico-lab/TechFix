'use client';

import React from 'react';
import { Package2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';

interface NewInventoryItemData {
  sku: string; name: string; compatibility: string;
  category: string; supplier: string;
  stock: number; maxStock: number; price: number;
}

interface NewInventoryItemModalProps {
  isOpen: boolean;
  newItem: NewInventoryItemData;
  onClose: () => void;
  onChange: React.Dispatch<React.SetStateAction<NewInventoryItemData>>;
  onSubmit: (e: React.FormEvent) => void;
}

const inputClass = "w-full bg-surface dark:bg-slate-950 border border-outline-variant/70 dark:border-slate-750 rounded px-3 py-2 text-xs text-on-surface dark:text-white placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary dark:focus:border-sky-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-sky-500/20";

export default function NewInventoryItemModal({ isOpen, newItem, onClose, onChange, onSubmit }: NewInventoryItemModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Inventory Item"
      icon={<Package2 className="w-4 h-4 text-primary dark:text-sky-400" />}
    >
      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">SKU Code</label>
            <input type="text" required placeholder="Ej: LCD-OLED-IP14"
              value={newItem.sku} onChange={(e) => onChange(prev => ({ ...prev, sku: e.target.value }))}
              className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Item Name</label>
            <input type="text" required placeholder="Ej: OLED Retina Display"
              value={newItem.name} onChange={(e) => onChange(prev => ({ ...prev, name: e.target.value }))}
              className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Category</label>
            <select value={newItem.category} onChange={(e) => onChange(prev => ({ ...prev, category: e.target.value }))}
              className={`${inputClass} cursor-pointer font-semibold`}>
              <option value="Displays" className="dark:bg-slate-900">Displays</option>
              <option value="Batteries" className="dark:bg-slate-900">Batteries</option>
              <option value="Motherboards" className="dark:bg-slate-900">Motherboards</option>
              <option value="Consumables" className="dark:bg-slate-900">Consumables</option>
              <option value="Storage" className="dark:bg-slate-900">Storage</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Primary Supplier</label>
            <select value={newItem.supplier} onChange={(e) => onChange(prev => ({ ...prev, supplier: e.target.value }))}
              className={`${inputClass} cursor-pointer font-semibold`}>
              <option value="TechParts Global" className="dark:bg-slate-900">TechParts Global</option>
              <option value="PowerCell Inc." className="dark:bg-slate-900">PowerCell Inc.</option>
              <option value="Cupertino OEM" className="dark:bg-slate-900">Cupertino OEM</option>
              <option value="Silicon Valley Dist." className="dark:bg-slate-900">Silicon Valley Dist.</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Compatible Models</label>
          <input type="text" required placeholder="Ej: iPhone 14 Pro, iPhone 14 Pro Max"
            value={newItem.compatibility} onChange={(e) => onChange(prev => ({ ...prev, compatibility: e.target.value }))}
            className={inputClass} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Initial Stock</label>
            <input type="number" required value={newItem.stock}
              onChange={(e) => onChange(prev => ({ ...prev, stock: Number(e.target.value) }))}
              className={`${inputClass} focus:ring-2 focus:ring-primary/20`} />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Max Capacity</label>
            <input type="number" required value={newItem.maxStock}
              onChange={(e) => onChange(prev => ({ ...prev, maxStock: Number(e.target.value) }))}
              className={`${inputClass} focus:ring-2 focus:ring-primary/20`} />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Unit Price ($)</label>
            <input type="number" step="0.01" required value={newItem.price}
              onChange={(e) => onChange(prev => ({ ...prev, price: Number(e.target.value) }))}
              className={`${inputClass} focus:ring-2 focus:ring-primary/20`} />
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant/30 dark:border-slate-800 flex justify-end gap-3">
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest dark:bg-slate-800 dark:hover:bg-slate-750 text-on-surface-variant dark:text-slate-300 rounded-lg text-xs font-semibold transition-all cursor-pointer border border-outline-variant/20">
            Cancel
          </button>
          <button type="submit"
            className="px-5 py-2 bg-primary dark:bg-sky-600 hover:bg-surface-tint dark:hover:bg-sky-500 text-on-primary dark:text-white rounded-lg text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-sm">
            Register Item
          </button>
        </div>
      </form>
    </Modal>
  );
}

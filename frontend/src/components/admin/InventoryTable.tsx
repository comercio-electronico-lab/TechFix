'use client';

import React from 'react';
import { Edit, RefreshCw } from 'lucide-react';
import { InventoryItem } from '@/types';

interface InventoryTableProps {
  paginatedInventory: InventoryItem[];
  filteredInventory: InventoryItem[];
  onRequestPart: (itemId: string) => void;
  onEditItem?: (item: InventoryItem) => void;
}

export default function InventoryTable({
  paginatedInventory,
  filteredInventory,
  onRequestPart,
  onEditItem,
}: InventoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
        <thead>
          <tr className="border-b border-outline-variant/30 dark:border-slate-850 bg-surface-container-low/40 dark:bg-slate-900/30">
            <th className="py-3 px-4 font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider w-24">SKU</th>
            <th className="py-3 px-4 font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Item Details</th>
            <th className="py-3 px-4 font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Category</th>
            <th className="py-3 px-4 font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Supplier</th>
            <th className="py-3 px-4 font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider w-40">Stock</th>
            <th className="py-3 px-4 font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider w-36">Status</th>
            <th className="py-3 px-4 font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider text-right pr-6 w-40">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10 dark:divide-slate-850/40 bg-surface-container-lowest dark:bg-slate-900/10 transition-colors">
          {paginatedInventory.map((item) => {
            const isOut = item.status === 'Out of Stock';
            const isLow = item.status === 'Low Stock';
            const stockPercent = Math.min((item.stock / item.maxStock) * 100, 100);

            return (
              <tr
                key={item.id}
                className={`hover:bg-surface-container-low/40 dark:hover:bg-slate-850/10 transition-colors group ${isOut ? 'bg-red-500/5' : isLow ? 'bg-amber-500/5' : ''}`}
              >
                {/* SKU */}
                <td className="py-3 px-4 font-mono font-bold text-on-surface-variant/80 dark:text-slate-400 select-all uppercase tracking-wider">
                  {item.sku}
                </td>

                {/* Detalles */}
                <td className="py-3 px-4">
                  <div className="font-bold text-on-surface dark:text-slate-200">{item.name}</div>
                  <div className="text-[10px] text-on-surface-variant/60 dark:text-slate-500 mt-0.5">Compatibility: {item.compatibility}</div>
                </td>

                {/* Categoría */}
                <td className="py-3 px-4 font-medium text-on-surface dark:text-slate-350">{item.category}</td>

                {/* Proveedor */}
                <td className="py-3 px-4 text-on-surface dark:text-slate-350">{item.supplier}</td>

                {/* Stock con barra */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <span className={`font-bold font-mono min-w-10 ${isOut ? 'text-error animate-pulse' : isLow ? 'text-amber-500' : 'text-on-surface dark:text-slate-300'}`}>
                      {item.stock} / <span className="text-on-surface-variant/40 dark:text-slate-650">{item.maxStock}</span>
                    </span>
                    <div className="w-16 h-1.5 bg-surface dark:bg-slate-950 rounded-full border border-outline-variant/10 dark:border-slate-800 overflow-hidden hidden sm:block shrink-0">
                      <div
                        className={`h-full rounded-full transition-all ${isOut ? 'bg-error' : isLow ? 'bg-amber-500' : 'bg-primary dark:bg-sky-500'}`}
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Estado */}
                <td className="py-3 px-4">
                  {isOut ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/40 font-bold uppercase tracking-wider text-[9px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />Out of Stock
                    </span>
                  ) : isLow ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 font-bold uppercase tracking-wider text-[9px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />Low Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 font-bold uppercase tracking-wider text-[9px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />In Stock
                    </span>
                  )}
                </td>

                {/* Acciones */}
                <td className="py-3 px-4 text-right pr-6">
                  <div className="flex items-center justify-end gap-2">
                    {isLow && (
                      <button
                        onClick={() => onRequestPart(item.id)}
                        className="flex items-center gap-1 px-2.5 py-1 border border-amber-500/30 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded text-[10px] font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
                      >
                        <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} /> Request Part
                      </button>
                    )}
                    {isOut && (
                      <button
                        onClick={() => onRequestPart(item.id)}
                        className="flex items-center gap-1 px-2.5 py-1 border border-red-500/30 hover:bg-red-500/10 text-error rounded text-[10px] font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
                      >
                        <RefreshCw className="w-3 h-3" /> Reorder OEM
                      </button>
                    )}
                    <button 
                      onClick={() => onEditItem?.(item)}
                      className="p-1 text-on-surface-variant/60 dark:text-slate-500 hover:text-primary dark:hover:text-sky-400 hover:bg-surface-container-low dark:hover:bg-slate-800 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {filteredInventory.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-12 text-on-surface-variant/40 dark:text-slate-600 italic">
                No items match the active filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

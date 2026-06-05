'use client';

import React from 'react';
import { IInventoryTableProps } from '@/interfaces/components';
import { Button, Icon } from '@/components/ui';

export const InventoryTable = ({ products, onEdit, onDelete }: IInventoryTableProps) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
      <table className="w-full text-sm text-left">
        <thead className="bg-[var(--color-background)] text-[var(--color-muted)] uppercase text-xs font-semibold">
          <tr>
            <th className="px-6 py-4">Producto</th>
            <th className="px-6 py-4">Categoría</th>
            <th className="px-6 py-4">Precio</th>
            <th className="px-6 py-4">Stock</th>
            <th className="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)] bg-white">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-[var(--color-accent)] transition-colors">
              <td className="px-6 py-4 font-medium flex items-center gap-3">
                <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover border" />
                {product.name}
              </td>
              <td className="px-6 py-4">{typeof product.category === 'string' ? product.category : product.category?.name}</td>
              <td className="px-6 py-4">${(product.price || 0).toLocaleString()}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  (product.stock || 0) > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {(product.stock || 0)} unidades
                </span>
              </td>
              <td className="px-6 py-4 text-right flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit?.(product)}>
                  <Icon name="Edit" size={16} />
                </Button>
                <Button variant="danger" size="sm" onClick={() => onDelete?.(product.id)}>
                  <Icon name="Trash2" size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

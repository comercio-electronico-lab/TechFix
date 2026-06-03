'use client';

import React from 'react';
import { InventoryTable } from '@/components/features/inventory/InventoryTable';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { IProduct } from '@/interfaces/domain';

interface IInventoryViewProps {
  initialProducts: IProduct[];
}

export const InventoryView = ({ initialProducts }: IInventoryViewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-[var(--color-muted)]">Gestiona el stock de productos y equipos.</p>
        </div>
        <Button leftIcon={<Icon name="Plus" size={20} />}>
          Nuevo Producto
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="p-6 bg-white rounded-xl border border-[var(--color-border)] shadow-sm">
          <p className="text-sm font-medium text-[var(--color-muted)]">Total Productos</p>
          <p className="text-2xl font-bold">{initialProducts.length}</p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-[var(--color-border)] shadow-sm">
          <p className="text-sm font-medium text-[var(--color-muted)]">Bajo Stock</p>
          <p className="text-2xl font-bold text-red-600">
            {initialProducts.filter(p => p.stock < 5).length}
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-[var(--color-border)] shadow-sm">
          <p className="text-sm font-medium text-[var(--color-muted)]">Valor Inventario</p>
          <p className="text-2xl font-bold">
            ${initialProducts.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()}
          </p>
        </div>
      </div>

      <InventoryTable 
        products={initialProducts} 
        onEdit={(p) => console.log('Edit', p)}
        onDelete={(id) => console.log('Delete', id)}
      />
    </div>
  );
};

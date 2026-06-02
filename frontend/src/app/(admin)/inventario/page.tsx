"use client";

import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { mockInventory, InventoryItem } from '@/mock/admin';
import { Edit, Trash2, Plus, Search, Filter } from 'lucide-react';

export default function AdminInventario() {
  const columns = [
    { header: 'SKU', key: 'sku', render: (item: any) => <span className="font-mono text-xs font-bold text-primary">{item.sku}</span> },
    { header: 'Nombre del Producto', key: 'name', render: (item: any) => <span className="font-bold">{item.name}</span> },
    { header: 'Categoría', key: 'category' },
    { header: 'Stock', key: 'stock', render: (item: any) => <span className={item.stock < 10 ? 'text-error font-bold' : ''}>{item.stock}</span> },
    { 
      header: 'Precio', 
      key: 'price',
      render: (item: InventoryItem) => <span className="font-bold text-primary">${item.price}</span>
    },
    { 
      header: 'Estado', 
      key: 'status',
      render: (item: InventoryItem) => {
        const variants = {
          'In Stock': 'success',
          'Low Stock': 'warning',
          'Out of Stock': 'error',
        } as const;
        return <Badge variant={variants[item.status]}>{item.status}</Badge>;
      }
    },
    {
      header: 'Acciones',
      key: 'actions',
      render: (item: InventoryItem) => (
        <div className="flex gap-2">
          <button className="p-2 hover:bg-surface-container rounded-lg text-secondary transition-colors">
            <Edit className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-error/10 rounded-lg text-error transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-stack-lg">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-primary text-[32px] font-bold">Inventario de Productos</h1>
          <p className="text-on-surface-variant mt-2">Control de hardware, componentes y suministros técnicos.</p>
        </div>
        <Button variant="primary" icon={Plus}>Agregar Nuevo Item</Button>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10 bg-surface-container-lowest">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input icon={Search} placeholder="Buscar por SKU, nombre o categoría..." />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <select className="bg-white border border-outline-variant/50 rounded-xl px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-secondary appearance-none font-bold text-sm text-primary transition-all">
                  <option>Todas las categorías</option>
                  <option>Laptops</option>
                  <option>Procesadores</option>
                  <option>Memorias RAM</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
              </div>
              <Button variant="outline" className="px-4">Filtrar</Button>
            </div>
          </div>
        </div>

        <div className="p-2">
          <Table columns={columns} data={mockInventory} />
        </div>

        <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/10 flex justify-between items-center text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
          <span>Mostrando {mockInventory.length} productos en total</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-outline-variant/30 rounded-lg opacity-50">Anterior</button>
            <button className="px-3 py-1 border border-outline-variant/30 rounded-lg hover:bg-white transition-all">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
}

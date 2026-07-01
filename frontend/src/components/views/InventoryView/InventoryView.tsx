'use client';

import React, { useState } from 'react';
import { InventoryTable } from '@/components/features/inventory/InventoryTable';
import { Button, Input, Icon } from '@/components/ui';
import { IProduct } from '@/interfaces/domain';
import Modal from '@/components/ui/Modal';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct, deleteProduct } from '@/actions/catalog';

interface IInventoryViewProps {
  initialProducts: IProduct[];
}

export const InventoryView = ({ initialProducts }: IInventoryViewProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Displays');
  const [image, setImage] = useState('');
  const [sku, setSku] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
    setCategory('Displays');
    setImage('');
    setSku('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: IProduct) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description || '');
    setPrice(String(p.price || 0));
    setStock(String(p.stock || 0));
    setCategory(typeof p.category === 'string' ? p.category : p.category?.name || 'Displays');
    setImage(p.image || '');
    setSku(p.sku || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || stock === '') {
      alert('Por favor, rellene todos los campos requeridos.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          name,
          description,
          price: Number(price),
          stock: Number(stock),
          category,
          image: image || undefined,
          sku: sku || undefined
        });
        alert('Producto actualizado con éxito');
      } else {
        await createProduct({
          name,
          description,
          price: Number(price),
          stock: Number(stock),
          category,
          image: image || undefined,
          sku: sku || undefined
        });
        alert('Producto creado con éxito');
      }
      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error al guardar el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    try {
      await deleteProduct(id);
      alert('Producto eliminado con éxito');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar el producto');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-[var(--color-muted)]">Gestiona el stock de productos y equipos.</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Icon name="Plus" size={20} />
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
            {initialProducts.filter(p => (p.stock ?? 0) < 5).length}
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-[var(--color-border)] shadow-sm">
          <p className="text-sm font-medium text-[var(--color-muted)]">Valor Inventario</p>
          <p className="text-2xl font-bold">
            S/. {initialProducts.reduce((acc, p) => acc + ((p.price ?? 0) * (p.stock ?? 0)), 0).toLocaleString()}
          </p>
        </div>
      </div>

      <InventoryTable 
        products={initialProducts} 
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* Modal para Crear / Editar Producto */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Editar Producto' : 'Registrar Nuevo Producto'}
        icon={<Icon name={editingProduct ? 'Pencil' : 'Plus'} size={18} />}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nombre *</label>
            <Input 
              placeholder="Ej: Pantalla OLED iPhone 14 Pro" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Descripción</label>
            <textarea 
              className="w-full bg-slate-50 border border-outline-variant/60 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary text-sm"
              rows={3}
              placeholder="Detalles de compatibilidad o especificaciones..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Precio de Venta (S/.) *</label>
              <Input 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Stock Inicial *</label>
              <Input 
                type="number" 
                placeholder="0" 
                value={stock} 
                onChange={(e) => setStock(e.target.value)} 
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Categoría</label>
              <select 
                className="w-full bg-slate-50 border border-outline-variant/60 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary text-sm font-medium"
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Baterías">Baterías</option>
                <option value="Displays">Displays</option>
                <option value="Almacenamiento">Almacenamiento</option>
                <option value="Cables y Conectores">Cables y Conectores</option>
                <option value="Componentes">Componentes</option>
                <option value="Servicios">Servicios</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">SKU (Código único)</label>
              <Input 
                placeholder="Ej: COMP-BAT-001" 
                value={sku} 
                onChange={(e) => setSku(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">URL de Imagen</label>
            <Input 
              placeholder="https://ejemplo.com/imagen.jpg" 
              value={image} 
              onChange={(e) => setImage(e.target.value)} 
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant="secondary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Guardar')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

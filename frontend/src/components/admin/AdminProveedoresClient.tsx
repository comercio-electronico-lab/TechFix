"use client";

import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import { Button, Input } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier, createRestockOrder, getRestockOrders, receiveRestockOrder, getProducts } from '@/actions';
import { useAuth } from '@/context/AuthContext';
import { Edit, Plus, Search, Mail, Phone, User, Trash2, AlertTriangle, Truck, ArrowRight, BookOpen, PackageCheck } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import { IProduct } from '@/interfaces/domain';

interface RestockOrder {
  id: string;
  supplierName: string;
  productName: string;
  quantity: number;
  status: string;
  expectedDate?: string;
  orderDate: string;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
}

export default function AdminProveedoresClient() {
  const { isAuthenticated } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'directorio' | 'reabastecimiento'>('directorio');

  // Supplier Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restock Order State
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [restockQuantity, setRestockQuantity] = useState(10);
  const [ordering, setOrdering] = useState(false);
  const [orders, setOrders] = useState<RestockOrder[]>([]);
  const [receivingId, setReceivingId] = useState<string | null>(null);

  async function loadSuppliers() {
    setLoading(true);
    try {
      const data = await getSuppliers();
      setSuppliers(data as Supplier[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadOrders() {
    try {
      const data = await getRestockOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadSuppliers();
    loadProducts();
    loadOrders();
  }, []);

  const handleReceiveOrder = async (order: RestockOrder) => {
    if (!confirm(`¿Confirmas que llegaron ${order.quantity} unidades de "${order.productName}"? Esto sumará el stock automáticamente.`)) return;
    setReceivingId(order.id);
    try {
      await receiveRestockOrder(order.id);
      await Promise.all([loadOrders(), loadProducts()]);
    } catch (err: any) {
      alert(err.message || 'Error al recibir la orden.');
    } finally {
      setReceivingId(null);
    }
  };

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setName('');
    setContact('');
    setPhone('');
    setEmail('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Supplier) => {
    setEditingSupplier(s);
    setName(s.name);
    setContact(s.contact || '');
    setPhone(s.phone || '');
    setEmail(s.email || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('El nombre es requerido.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, {
          nombre: name,
          contacto: contact,
          telefono: phone,
          email: email
        });
        alert('Proveedor actualizado con éxito');
      } else {
        await createSupplier({
          nombre: name,
          contacto: contact,
          telefono: phone,
          email: email
        });
        alert('Proveedor registrado con éxito');
      }
      setIsModalOpen(false);
      loadSuppliers();
    } catch (err: any) {
      alert(err.message || 'Error al guardar el proveedor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (s: Supplier) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar al proveedor ${s.name}?`)) return;
    try {
      await deleteSupplier(s.id);
      alert('Proveedor eliminado con éxito');
      loadSuppliers();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar el proveedor');
    }
  };

  const handleCreateRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Sesión no autorizada');
      return;
    }
    if (!selectedProductId || !selectedSupplierId || restockQuantity <= 0) {
      alert('Por favor selecciona un repuesto, un distribuidor y una cantidad válida.');
      return;
    }
    setOrdering(true);
    try {
      await createRestockOrder({
        proveedor_id: selectedSupplierId,
        producto_id: selectedProductId,
        cantidad: restockQuantity,
      });
      alert('¡Orden de reabastecimiento enviada correctamente a fábrica (ETA: 7 días)!');
      setRestockQuantity(10);
      loadProducts(); // refresh products to check stock levels
      loadOrders();
    } catch (err: any) {
      alert(err.message || 'Error al crear la orden de reabastecimiento.');
    } finally {
      setOrdering(false);
    }
  };

  const columns = [
    {
      header: 'Nombre Proveedor',
      key: 'name',
      render: (item: Supplier) => (
        <div className="font-bold text-primary dark:text-sky-400">{item.name}</div>
      )
    },
    {
      header: 'Contacto',
      key: 'contact',
      render: (item: Supplier) => (
        <div className="flex items-center gap-2 text-sm text-on-surface dark:text-slate-300">
          <User className="w-4 h-4 opacity-50" />
          {item.contact || 'Sin contacto'}
        </div>
      )
    },
    {
      header: 'Teléfono',
      key: 'phone',
      render: (item: Supplier) => (
        <div className="flex items-center gap-2 text-sm text-on-surface dark:text-slate-350">
          <Phone className="w-4 h-4 opacity-50" />
          {item.phone || 'Sin teléfono'}
        </div>
      )
    },
    {
      header: 'Email',
      key: 'email',
      render: (item: Supplier) => (
        <div className="flex items-center gap-2 text-sm text-on-surface dark:text-slate-350">
          <Mail className="w-4 h-4 opacity-50" />
          {item.email || 'Sin correo'}
        </div>
      )
    },
    {
      header: 'Acciones',
      key: 'actions',
      render: (item: Supplier) => (
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => handleOpenEdit(item)}
            title="Editar Proveedor"
            className="p-2 hover:bg-surface-container-high rounded-lg text-secondary transition-colors cursor-pointer"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={() => handleDelete(item)}
            title="Eliminar Proveedor"
            className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-red-500 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = products.filter(p => (p.stock ?? 0) < 5);

  return (
    <div className="space-y-stack-lg">
      <header className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-primary dark:text-white text-[32px] font-bold">Proveedores y Abastecimiento</h1>
          <p className="text-on-surface-variant dark:text-slate-400 mt-2">Monitorea y gestiona los distribuidores de repuestos e insumos del laboratorio.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-outline-variant/30 dark:border-slate-800">
          <button
            onClick={() => setActiveSubTab('directorio')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'directorio'
                ? 'bg-white dark:bg-slate-900 shadow-sm text-primary dark:text-sky-400'
                : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
            }`}
          >
            Directorio Proveedores
          </button>
          <button
            onClick={() => setActiveSubTab('reabastecimiento')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'reabastecimiento'
                ? 'bg-white dark:bg-slate-900 shadow-sm text-primary dark:text-sky-400'
                : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            Reabastecimiento
          </button>
        </div>
      </header>

      {activeSubTab === 'directorio' ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-outline-variant/20 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-on-surface-variant dark:text-slate-400">Proveedores Activos</p>
              <p className="text-2xl font-bold text-primary dark:text-sky-400">{suppliers.length}</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-outline-variant/20 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-on-surface-variant dark:text-slate-400">Contactos de Distribución</p>
              <p className="text-2xl font-bold text-secondary dark:text-sky-400">
                {suppliers.filter(s => !!s.email).length}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-outline-variant/10 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10 dark:border-slate-800 bg-surface-container-lowest dark:bg-slate-950/40 flex justify-between items-center flex-wrap gap-4">
              <div className="max-w-md w-full">
                <Input 
                  leftIcon={<Search className="w-4 h-4" />} 
                  placeholder="Buscar por nombre, contacto o correo..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={handleOpenAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Registrar Proveedor
              </Button>
            </div>

            <div className="p-2">
              {loading ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-6 p-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  ))}
                </div>
              ) : (
                <Table columns={columns} data={filteredSuppliers} />
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Low Stock Alerts */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-outline-variant/10 dark:border-slate-800 p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-outline-variant/10 dark:border-slate-800 pb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-lg text-on-surface dark:text-white">Repuestos Críticos (Bajo Stock)</h2>
            </div>
            
            {lowStockProducts.length === 0 ? (
              <div className="py-12 text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-150 dark:border-emerald-900/50">
                ✓ Todos los productos del catálogo cuentan con stock suficiente (&ge; 5 unidades).
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {lowStockProducts.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950 border border-outline-variant/20 dark:border-slate-800/80 rounded-xl hover:border-amber-400/50 transition-colors">
                    <div>
                      <h3 className="font-bold text-sm text-primary dark:text-sky-400">{p.name}</h3>
                      <p className="text-[10px] text-outline dark:text-slate-500 font-mono mt-0.5">SKU: {p.sku || 'N/A'}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400">
                          Stock: {p.stock ?? 0} unid.
                        </span>
                        <span className="text-[11px] text-on-surface-variant dark:text-slate-400">Categoría: {typeof p.category === 'string' ? p.category : p.category?.name || 'Varios'}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProductId(p.id);
                        if (suppliers.length > 0) {
                          setSelectedSupplierId(suppliers[0].id);
                        }
                      }}
                      className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      Reabastecer
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Order Form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-outline-variant/10 dark:border-slate-800 p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-outline-variant/10 dark:border-slate-800 pb-4">
              <Truck className="w-5 h-5 text-secondary dark:text-sky-450" />
              <h2 className="font-bold text-lg text-on-surface dark:text-white">Generar Orden de Compra</h2>
            </div>

            <form onSubmit={handleCreateRestock} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Repuesto / Producto *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-outline-variant/60 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary text-sm font-medium text-on-surface dark:text-slate-200"
                  required
                >
                  <option value="">-- Seleccionar Repuesto --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.stock ?? 0})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Distribuidor / Proveedor *</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-outline-variant/60 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary text-sm font-medium text-on-surface dark:text-slate-200"
                  required
                >
                  <option value="">-- Seleccionar Proveedor --</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.contact || 'S/C'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Cantidad a Solicitar *</label>
                <Input
                  type="number"
                  min={1}
                  placeholder="Ej: 20"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(Number(e.target.value))}
                  required
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full py-4 text-xs font-black uppercase tracking-wider flex justify-center items-center gap-2 shadow-lg"
                  isLoading={ordering}
                >
                  <Truck className="w-4 h-4" />
                  {ordering ? 'Procesando Orden...' : 'Enviar Orden de Compra'}
                </Button>
              </div>
            </form>
          </div>

          {/* Órdenes de Reabastecimiento en Tránsito */}
          <div className="lg:col-span-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-outline-variant/10 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-outline-variant/10 dark:border-slate-800 pb-4">
              <PackageCheck className="w-5 h-5 text-secondary dark:text-sky-450" />
              <h2 className="font-bold text-lg text-on-surface dark:text-white">Órdenes de Reabastecimiento</h2>
            </div>

            {orders.length === 0 ? (
              <div className="py-8 text-center text-sm font-semibold text-on-surface-variant/60">
                Aún no se han generado órdenes de reabastecimiento.
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950 border border-outline-variant/20 dark:border-slate-800/80 rounded-xl">
                    <div>
                      <h3 className="font-bold text-sm text-primary dark:text-sky-400">{order.productName}</h3>
                      <p className="text-[11px] text-on-surface-variant dark:text-slate-400 mt-0.5">
                        {order.quantity} unid. · {order.supplierName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        order.status === 'recibido'
                          ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400'
                      }`}>
                        {order.status === 'recibido' ? 'Recibido' : 'En tránsito'}
                      </span>
                      {order.status !== 'recibido' && (
                        <button
                          type="button"
                          onClick={() => handleReceiveOrder(order)}
                          disabled={receivingId === order.id}
                          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <PackageCheck className="w-3.5 h-3.5" />
                          {receivingId === order.id ? 'Confirmando...' : 'Marcar Recibido'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Crear / Editar Proveedor */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSupplier ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor'}
        icon={<Edit className="w-5 h-5 text-primary" />}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nombre *</label>
            <Input 
              placeholder="Ej: Distribuidora Tecnológica SAC" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Contacto Personal</label>
            <Input 
              placeholder="Ej: Ing. Jorge Díaz" 
              value={contact} 
              onChange={(e) => setContact(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Teléfono</label>
              <Input 
                placeholder="Ej: +51 987654321" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Correo Electrónico</label>
              <Input 
                type="email"
                placeholder="Ej: contacto@distribuidor.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant="secondary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : (editingSupplier ? 'Actualizar' : 'Guardar')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import { Button, Input } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '@/actions';
import { Edit, Plus, Search, Mail, Phone, User, Trash2 } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
}

export default function AdminProveedoresClient() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    loadSuppliers();
  }, []);

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

  const columns = [
    {
      header: 'Nombre Proveedor',
      key: 'name',
      render: (item: Supplier) => (
        <div className="font-bold text-primary">{item.name}</div>
      )
    },
    {
      header: 'Contacto',
      key: 'contact',
      render: (item: Supplier) => (
        <div className="flex items-center gap-2 text-sm text-on-surface">
          <User className="w-4 h-4 opacity-50" />
          {item.contact || 'Sin contacto'}
        </div>
      )
    },
    {
      header: 'Teléfono',
      key: 'phone',
      render: (item: Supplier) => (
        <div className="flex items-center gap-2 text-sm text-on-surface">
          <Phone className="w-4 h-4 opacity-50" />
          {item.phone || 'Sin teléfono'}
        </div>
      )
    },
    {
      header: 'Email',
      key: 'email',
      render: (item: Supplier) => (
        <div className="flex items-center gap-2 text-sm text-on-surface">
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
            className="p-2 hover:bg-surface-container-high rounded-lg text-secondary transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={() => handleDelete(item)}
            title="Eliminar Proveedor"
            className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
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

  return (
    <div className="space-y-stack-lg">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-primary text-[32px] font-bold">Proveedores</h1>
          <p className="text-on-surface-variant mt-2">Monitorea y gestiona los distribuidores de repuestos e insumos del laboratorio.</p>
        </div>
        <Button onClick={handleOpenAdd} leftIcon={<Plus className="w-5 h-5" />}>
          Nuevo Proveedor
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <div className="p-6 bg-white rounded-xl border border-outline-variant/20 shadow-sm">
          <p className="text-sm font-medium text-on-surface-variant">Proveedores Activos</p>
          <p className="text-2xl font-bold text-primary">{suppliers.length}</p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-outline-variant/20 shadow-sm">
          <p className="text-sm font-medium text-on-surface-variant">Contactos de Distribución</p>
          <p className="text-2xl font-bold text-secondary">
            {suppliers.filter(s => !!s.email).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10 bg-surface-container-lowest">
          <div className="max-w-md">
            <Input 
              leftIcon={<Search className="w-4 h-4" />} 
              placeholder="Buscar por nombre, contacto o correo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="p-2">
          {loading ? (
            <div className="py-12 text-center text-sm font-semibold text-on-surface-variant/60">
              Cargando lista de proveedores...
            </div>
          ) : (
            <Table columns={columns} data={filteredSuppliers} />
          )}
        </div>
      </div>

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

"use client";

import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import { Button, Input, Badge } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { getAllUsers, updateUserRole, updateUserStatus, deleteUser } from '@/actions';
import { Edit, Search, ShieldCheck, Mail, Calendar, Trash2, RefreshCw } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedDate: string;
  status: string;
}

export default function AdminUsuariosClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');

  // Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data as User[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setNewStatus(user.status);
    setIsEditOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      if (newRole !== selectedUser.role) {
        const resRole = await updateUserRole(selectedUser.id, newRole);
        if (!resRole.success) throw new Error(resRole.error);
      }
      if (newStatus !== selectedUser.status) {
        const resStatus = await updateUserStatus(selectedUser.id, newStatus);
        if (!resStatus.success) throw new Error(resStatus.error);
      }
      alert('Cambios guardados con éxito');
      setIsEditOpen(false);
      loadUsers();
    } catch (err: any) {
      alert(err.message || 'Error al guardar los cambios');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente al usuario ${user.name}?`)) return;
    try {
      const res = await deleteUser(user.id);
      if (!res.success) throw new Error(res.error);
      alert('Usuario eliminado con éxito');
      loadUsers();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar el usuario');
    }
  };

  const columns = [
    {
      header: 'Nombre Completo',
      key: 'name',
      render: (item: User) => (
        <div className="font-bold text-primary">{item.name}</div>
      )
    },
    {
      header: 'Email / ID',
      key: 'email',
      render: (item: User) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold flex items-center gap-1.5 text-on-surface">
            <Mail className="w-3.5 h-3.5 opacity-55" />
            {item.email}
          </span>
          <span className="text-[10px] text-on-surface-variant font-mono">{item.id}</span>
        </div>
      )
    },
    {
      header: 'Rol / Permisos',
      key: 'role',
      render: (item: User) => (
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${item.role === 'Admin' ? 'text-secondary' : 'text-on-surface-variant/40'}`} />
          <span className={`text-sm font-bold ${item.role === 'Admin' ? 'text-secondary' : 'text-on-surface-variant'}`}>
            {item.role}
          </span>
        </div>
      )
    },
    {
      header: 'Fecha Registro',
      key: 'joinedDate',
      render: (item: User) => (
        <div className="flex items-center gap-2 text-on-surface-variant text-sm">
          <Calendar className="w-4 h-4 opacity-50" />
          {item.joinedDate}
        </div>
      )
    },
    {
      header: 'Estado',
      key: 'status',
      render: (item: User) => (
        <Badge variant={item.status === 'Activo' ? 'success' : 'neutral'}>{item.status}</Badge>
      )
    },
    {
      header: 'Acciones',
      key: 'actions',
      render: (item: User) => (
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => handleOpenEdit(item)}
            title="Editar Rol / Estado"
            className="p-2 hover:bg-surface-container-high rounded-lg text-secondary transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={() => handleDelete(item)}
            title="Eliminar Usuario"
            className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'Todos' || u.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-stack-lg">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-primary text-[32px] font-bold">Gestión de Usuarios</h1>
          <p className="text-on-surface-variant mt-2">Administra roles de personal técnico y accesos de clientes premium.</p>
        </div>
        <button 
          onClick={loadUsers} 
          className="flex items-center gap-2 px-4 py-2 border border-primary/20 text-primary rounded-xl hover:bg-primary/5 transition-colors font-bold text-xs"
        >
          <RefreshCw className="w-4 h-4" /> Refrescar
        </button>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10 bg-surface-container-lowest">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input 
                leftIcon={<Search className="w-4 h-4" />} 
                placeholder="Buscar por nombre, email o ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary font-bold text-sm text-primary"
              >
                <option value="Todos">Todos los roles</option>
                <option value="Admin">Admin</option>
                <option value="Tecnico">Técnico</option>
                <option value="Cliente">Cliente</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-2">
          {loading ? (
            <div className="py-12 text-center text-sm font-semibold text-on-surface-variant/60">
              Cargando lista de usuarios...
            </div>
          ) : (
            <Table columns={columns} data={filteredUsers} />
          )}
        </div>
      </div>

      {/* Modal Editar Usuario */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Modificar Privilegios de Usuario"
        icon={<Edit className="w-5 h-5 text-secondary" />}
      >
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase">Usuario seleccionado</p>
            <p className="text-base font-bold text-primary">{selectedUser?.name}</p>
            <p className="text-xs text-on-surface-variant">{selectedUser?.email}</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Rol / Permisos</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary font-bold text-sm text-primary"
            >
              <option value="Admin">Admin</option>
              <option value="Tecnico">Técnico</option>
              <option value="Cliente">Cliente</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Estado de Acceso</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary font-bold text-sm text-primary"
            >
              <option value="Activo">Activo (Acceso permitido)</option>
              <option value="Inactivo">Inactivo (Acceso suspendido)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <Button variant="outline" type="button" onClick={() => setIsEditOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant="secondary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

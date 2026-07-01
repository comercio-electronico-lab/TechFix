"use client";

import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import { Button, Input, Badge } from '@/components/ui';
import { getAllUsers, updateUserRole, updateUserStatus, deleteUser } from '@/actions';
import { Edit, UserPlus, Search, ShieldCheck, Mail, Calendar, Trash2, RefreshCw } from 'lucide-react';

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

  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === 'Activo' ? 'Inactivo' : 'Activo';
    if (!confirm(`¿Deseas cambiar el estado de ${user.name} a "${nextStatus}"?`)) return;

    try {
      const res = await updateUserStatus(user.id, nextStatus);
      if (res.success) {
        alert('Estado actualizado con éxito');
        setUsers(users.map(u => u.id === user.id ? { ...u, status: nextStatus } : u));
      } else {
        alert(res.error || 'Error al actualizar el estado');
      }
    } catch (e: any) {
      alert(e.message || 'Error de red');
    }
  };

  const handleToggleRole = async (user: User) => {
    // Rotar roles
    let nextRole = 'Cliente';
    if (user.role === 'Cliente') nextRole = 'Tecnico';
    else if (user.role === 'Tecnico' || user.role === 'Técnico') nextRole = 'Admin';
    else nextRole = 'Cliente';

    if (!confirm(`¿Deseas cambiar el rol de ${user.name} a "${nextRole}"?`)) return;

    try {
      const res = await updateUserRole(user.id, nextRole);
      if (res.success) {
        alert('Rol actualizado con éxito');
        setUsers(users.map(u => u.id === user.id ? { ...u, role: nextRole } : u));
      } else {
        alert(res.error || 'Error al actualizar el rol');
      }
    } catch (e: any) {
      alert(e.message || 'Error de red');
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`¿Deseas eliminar permanentemente al usuario ${user.name}?`)) return;

    try {
      const res = await deleteUser(user.id);
      if (res.success) {
        alert('Usuario eliminado con éxito');
        setUsers(users.filter(u => u.id !== user.id));
      } else {
        alert(res.error || 'Error al eliminar el usuario');
      }
    } catch (e: any) {
      alert(e.message || 'Error de red');
    }
  };

  const columns = [
    {
      header: 'Usuario',
      key: 'name',
      render: (item: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary font-bold">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-primary">{item.name}</p>
            <p className="text-xs text-on-surface-variant flex items-center gap-1">
              <Mail className="w-3 h-3" /> {item.email}
            </p>
          </div>
        </div>
      )
    },
    {
      header: 'Rol / Permisos',
      key: 'role',
      render: (item: User) => (
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${item.role?.toLowerCase() === 'admin' ? 'text-secondary' : 'text-on-surface-variant/40'}`} />
          <span className={`text-sm font-bold ${item.role?.toLowerCase() === 'admin' ? 'text-secondary' : 'text-on-surface-variant'}`}>
            {item.role}
          </span>
        </div>
      )
    },
    {
      header: 'Fecha Registro',
      key: 'joinedDate',
      render: (item: any) => (
        <div className="flex items-center gap-2 text-on-surface-variant text-sm">
          <Calendar className="w-4 h-4 opacity-50" />
          {item.joinedDate || '24 May, 2026'}
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
            onClick={() => handleToggleStatus(item)}
            title="Cambiar Estado (Activo/Inactivo)"
            className="p-2 hover:bg-surface-container-high rounded-lg text-secondary transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleToggleRole(item)}
            title="Cambiar Rol (Rotar)"
            className="p-2 hover:bg-primary/5 rounded-lg text-primary transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
          <button 
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

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data as any[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'Todos' || 
                        u.role?.toLowerCase() === roleFilter.toLowerCase() || 
                        (roleFilter === 'Técnico' && u.role?.toLowerCase() === 'tecnico');
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-stack-lg">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-primary text-[32px] font-bold">Gestión de Usuarios</h1>
          <p className="text-on-surface-variant mt-2">Administra roles de personal técnico y accesos de clientes premium.</p>
        </div>
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
                className="w-full bg-white border border-outline-variant/55 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary font-bold text-sm text-primary"
              >
                <option value="Todos">Todos los roles</option>
                <option value="Admin">Admin</option>
                <option value="Técnico">Técnico</option>
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

        <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/10">
          <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest text-center">
            Seguridad de nivel empresarial activada para la gestión de usuarios
          </p>
        </div>
      </div>
    </div>
  );
}

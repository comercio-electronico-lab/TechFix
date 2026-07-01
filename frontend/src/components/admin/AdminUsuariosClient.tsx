"use client";

import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getAllUsers } from '@/actions';
import { Edit, UserPlus, Search, ShieldCheck, Mail, Calendar } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedDate: string;
  status: string;
}

export default function AdminUsuariosClient() {
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
          <button className="p-2 hover:bg-surface-container-high rounded-lg text-secondary transition-colors">
            <Edit className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-primary/5 rounded-lg text-primary transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getAllUsers();
        setUsers(data as any[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  return (
    <div className="space-y-stack-lg">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-primary text-[32px] font-bold">Gestión de Usuarios</h1>
          <p className="text-on-surface-variant mt-2">Administra roles de personal técnico y accesos de clientes premium.</p>
        </div>
        <Button variant="accent" icon={UserPlus}>Nuevo Usuario</Button>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10 bg-surface-container-lowest">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input icon={Search} placeholder="Buscar por nombre, email o ID..." />
            </div>
            <div className="w-full md:w-48">
              <select className="w-full bg-white border border-outline-variant/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary font-bold text-sm text-primary">
                <option>Todos los roles</option>
                <option>Admin</option>
                <option>Técnico</option>
                <option>Cliente</option>
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
            <Table columns={columns} data={users} />
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

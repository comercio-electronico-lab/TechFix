"use client";

import { useState } from 'react';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import AdminHeader from '@/components/admin/AdminHeader';
import UserFiltersBar from '@/components/admin/UserFiltersBar';
import { mockUsers, User } from '@/mock/users';
import { Edit, UserPlus, ShieldCheck, Mail, Calendar } from 'lucide-react';

export default function AdminUsuarios() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedRole, setSelectedRole] = useState('Todos los roles');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.id.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesRole = 
      selectedRole === 'Todos los roles' || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const columns = [
    { 
      header: 'Usuario', 
      key: 'name',
      render: (item: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary dark:text-sky-400 font-bold">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-primary dark:text-white transition-colors">{item.name}</p>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 flex items-center gap-1 transition-colors">
              <Mail className="w-3 h-3 text-on-surface-variant/70 dark:text-slate-500" /> {item.email}
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
          <ShieldCheck className={`w-4 h-4 transition-colors ${item.role === 'Admin' ? 'text-secondary dark:text-sky-400' : 'text-on-surface-variant/40 dark:text-slate-600'}`} />
          <span className={`text-sm font-bold transition-colors ${item.role === 'Admin' ? 'text-secondary dark:text-sky-400' : 'text-on-surface-variant dark:text-slate-300'}`}>
            {item.role}
          </span>
        </div>
      )
    },
    { 
      header: 'Fecha Registro', 
      key: 'joinedDate',
      render: (item: any) => (
        <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400 text-sm transition-colors">
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
          <button className="p-2 hover:bg-surface-container-high dark:hover:bg-slate-800 rounded-lg text-secondary dark:text-sky-400 transition-colors">
            <Edit className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-primary/5 dark:hover:bg-sky-500/10 rounded-lg text-primary dark:text-sky-400 transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-stack-lg">
      <AdminHeader
        title="Gestión de Usuarios"
        description="Administra roles de personal técnico y accesos de clientes premium."
      >
        <Button variant="accent" icon={UserPlus}>Nuevo Usuario</Button>
      </AdminHeader>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-outline-variant/10 dark:border-slate-800/80 overflow-hidden transition-colors duration-300">
        <UserFiltersBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
        />

        <div className="p-2 dark:bg-slate-900/50 transition-colors">
          <Table columns={columns} data={filteredUsers} />
        </div>
        
        <div className="p-4 bg-surface-container-lowest dark:bg-slate-950/40 border-t border-outline-variant/10 dark:border-slate-800/80 transition-colors">
          <p className="text-[10px] font-bold text-on-surface-variant/60 dark:text-slate-500 uppercase tracking-widest text-center transition-colors">
            Seguridad de nivel empresarial activada para la gestión de usuarios
          </p>
        </div>
      </div>
    </div>
  );
}

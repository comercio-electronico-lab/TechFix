import React from 'react';
import Input from '@/components/ui/Input';
import { Search } from 'lucide-react';

interface UserFiltersBarProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  roles?: string[];
}

export default function UserFiltersBar({
  searchValue,
  onSearchChange,
  selectedRole,
  onRoleChange,
  roles = ['Todos los roles', 'Admin', 'Técnico', 'Cliente']
}: UserFiltersBarProps) {
  return (
    <div className="p-6 border-b border-outline-variant/10 bg-surface-container-lowest transition-colors">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input 
            icon={Search} 
            placeholder="Buscar por nombre, email o ID..." 
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <select 
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full bg-white dark:bg-slate-950 border border-outline-variant/50 dark:border-slate-850 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-sky-500/50 font-bold text-sm text-primary dark:text-sky-400 cursor-pointer"
          >
            {roles.map((role) => (
              <option key={role} value={role} className="dark:bg-slate-900">
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

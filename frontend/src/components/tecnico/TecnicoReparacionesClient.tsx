'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAdminRepairsAction, updateRepairStatusAction } from '@/actions';
import { Search, Wrench, CheckCircle2, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export default function TecnicoReparacionesClient() {
  const { token } = useAuth();
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadRepairs();
  }, [token]);

  const loadRepairs = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAdminRepairsAction();
      setRepairs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = repairs.filter(r =>
    !search || r.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    r.deviceName?.toLowerCase().includes(search.toLowerCase()) ||
    r.id?.toLowerCase().includes(search.toLowerCase())
  );

  const pending = filtered.filter(r => r.status === 'pending' || r.status === 'agendado');
  const inProgress = filtered.filter(r => r.status === 'en_reparacion');
  const completed = filtered.filter(r => r.status === 'reparado' || r.status === 'completado');

  const handleStart = async (id: string) => {
    if (!token) return;
    await updateRepairStatusAction(token, id, 'en_reparacion', 'Iniciando diagnóstico');
    loadRepairs();
  };

  const handleComplete = async (id: string) => {
    if (!token) return;
    await updateRepairStatusAction(token, id, 'reparado', 'Reparación completada');
    loadRepairs();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const KanbanColumn = ({ title, icon: Icon, items, badge, action }: any) => (
    <div className="bg-surface-container-low dark:bg-slate-900/60 rounded-2xl border border-outline-variant/20 p-4 min-h-[400px]">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-on-surface-variant" />
          <h3 className="font-bold text-sm text-on-background">{title}</h3>
        </div>
        <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">{items.length}</span>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-xs text-on-surface-variant/60 text-center py-8">Sin órdenes</p>
        ) : items.map((job: any) => (
          <div key={job.id} className="bg-white dark:bg-slate-800/60 rounded-xl p-4 border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow space-y-2">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-mono font-bold text-primary/70 truncate">{job.id?.slice(0, 13)}</span>
              {badge && badge(job.status)}
            </div>
            <p className="font-bold text-sm text-on-background leading-tight">{job.deviceName || 'Dispositivo'}</p>
            <p className="text-[10px] text-on-surface-variant">{job.customerName || 'Cliente'}</p>
            {job.notes && (
              <div className="flex items-start gap-1.5 text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{job.notes}</span>
              </div>
            )}
            <div className="flex gap-2 pt-1">
              {action && action(job.id)}
              <Link
                href={`/tecnico/reparaciones/${job.id}`}
                className="text-[10px] font-bold text-secondary hover:text-secondary/80 p-1.5 rounded-lg hover:bg-secondary/5 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight">Reparaciones</h1>
          <p className="text-sm text-on-surface-variant">Gestiona todas las órdenes de reparación del taller.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
          <input
            type="text"
            placeholder="Buscar por cliente, equipo o ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <KanbanColumn
          title="Por Diagnosticar"
          icon={Clock}
          items={pending}
          badge={() => <Badge variant="pending">Pendiente</Badge>}
          action={(id: string) => (
            <button
              onClick={() => handleStart(id)}
              className="flex-1 text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Wrench className="w-3 h-3" /> Iniciar
            </button>
          )}
        />
        <KanbanColumn
          title="En Reparación"
          icon={Wrench}
          items={inProgress}
          badge={() => <Badge variant="info">En Curso</Badge>}
          action={(id: string) => (
            <button
              onClick={() => handleComplete(id)}
              className="flex-1 text-[10px] font-bold bg-green-600 hover:bg-green-500 text-white py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" /> Completar
            </button>
          )}
        />
        <KanbanColumn
          title="Terminadas"
          icon={CheckCircle2}
          items={completed}
          badge={(s: string) => <Badge variant={s === 'completado' ? 'success' : 'info'}>Listo</Badge>}
          action={null}
        />
      </div>
    </div>
  );
}

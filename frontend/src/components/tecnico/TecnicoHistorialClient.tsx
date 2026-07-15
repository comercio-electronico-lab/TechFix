'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAdminRepairsAction } from '@/actions';
import { Search, Clock, CheckCircle2, DollarSign } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export default function TecnicoHistorialClient() {
  const { isAuthenticated } = useAuth();
  const [repairs, setRepairs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRepairs();
  }, [isAuthenticated]);

  const loadRepairs = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await getAdminRepairsAction();
      setRepairs(data.filter((r: any) => r.status === 'reparado' || r.status === 'completado'));
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight">Historial</h1>
          <p className="text-sm text-on-surface-variant">Reparaciones completadas y entregadas.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white/70 dark:bg-slate-900/40 border border-dashed border-outline-variant/30 p-12 text-center rounded-2xl">
          <Clock className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-3" />
          <p className="font-bold text-on-surface-variant">No hay reparaciones completadas aún</p>
        </div>
      ) : (
        <div className="bg-white/70 dark:bg-slate-900/40 rounded-2xl border border-outline-variant/20 overflow-hidden">
          <div className="divide-y divide-outline-variant/10">
            {filtered.map((r: any) => (
              <Link
                key={r.id}
                href={`/tecnico/reparaciones/${r.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-surface-container-low dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-on-background truncate">{r.deviceName || 'Dispositivo'}</p>
                    <p className="text-xs text-on-surface-variant truncate">{r.customerName || 'Cliente'} • {r.id?.slice(0, 13)}</p>
                    {r.created_at && (
                      <p className="text-[10px] text-on-surface-variant/60 mt-0.5">
                        {new Date(r.created_at).toLocaleDateString('es-ES', { dateStyle: 'long' })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {r.final_price ? (
                    <span className="text-sm font-mono font-bold text-primary"><DollarSign className="w-3.5 h-3.5 inline" />{r.final_price.toFixed(2)}</span>
                  ) : null}
                  <Badge variant={r.status === 'completado' ? 'success' : 'info'}>
                    {r.status === 'completado' ? 'Entregado' : 'Reparado'}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

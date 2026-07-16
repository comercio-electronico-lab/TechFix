'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import TecnicoStats from '@/components/tecnico/TecnicoStats';
import AssignedJobs from '@/components/tecnico/AssignedJobs';
import {
  getAdminRepairsAction,
  updateRepairStatusAction,
  getAdminProductsAction,
  addPartToRepairAction
} from '@/actions';
import { Search } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';

export default function TecnicoDashboardClient() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [repairsData, productsData] = await Promise.all([
        getAdminRepairsAction(),
        getAdminProductsAction()
      ]);

      const adaptedRepairs = repairsData.map((r: any) => ({
        ...r,
        status: r.status === 'en_reparacion' ? 'in_progress' :
                r.status === 'reparado' || r.status === 'completado' ? 'completed' : 'pending'
      }));

      setJobs(adaptedRepairs);
      setProducts(productsData);
    } catch (error) {
      console.error('Error al cargar datos del técnico:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleUpdateStatus = async (jobId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    if (!user) return;
    const mappedStatus = newStatus === 'in_progress' ? 'en_reparacion' :
                         newStatus === 'completed' ? 'reparado' : 'pending';

    const notes = newStatus === 'in_progress' ? 'Técnico inició el diagnóstico' :
                  newStatus === 'completed' ? 'Reparación completada por el técnico' : '';
    const result = await updateRepairStatusAction(jobId, mappedStatus, notes);
    if (!result.success) {
      alert('Error al actualizar estado: ' + result.error);
      return;
    }
    await loadData();
  };

  const handleAddPartToJob = async (jobId: string, productId: string) => {
    if (!user) return;
    const selectedProd = products.find(p => p.id === productId);
    if (!selectedProd) return;
    if (selectedProd.stock_actual <= 0) {
      alert('No hay stock disponible para este repuesto.');
      return;
    }

    try {
      await addPartToRepairAction(jobId, productId, 1);
      alert(`Repuesto "${selectedProd.nombre}" vinculado exitosamente`);
      await loadData();
    } catch (err: any) {
      alert('Error al vincular repuesto: ' + err.message);
    }
  };

  const filteredJobs = jobs.filter(j =>
    !searchQuery ||
    j.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.deviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-full sm:w-72 rounded-xl" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>

        <div className="bg-white/70 dark:bg-white/5 border border-outline-variant/10 dark:border-outline/20 p-8 rounded-2xl shadow-sm space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center gap-4 pb-6 border-b border-outline-variant/10 last:border-0 last:pb-0">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight">Panel Técnico</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Bienvenido, {user?.nombre}. {jobs.filter(j => j.status !== 'completed').length} trabajos activos.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
          <input
            type="text"
            placeholder="Buscar por cliente, equipo o ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
          />
        </div>
      </div>

      <TecnicoStats jobs={filteredJobs} />

      <AssignedJobs
        jobs={filteredJobs}
        products={products}
        onUpdateStatus={handleUpdateStatus}
        onAddPart={handleAddPartToJob}
      />
    </div>
  );
}

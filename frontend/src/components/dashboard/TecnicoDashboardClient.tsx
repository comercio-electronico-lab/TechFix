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

export default function TecnicoDashboardClient() {
  const { token, user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    if (!token) return;
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
  }, [token]);

  const handleUpdateStatus = async (jobId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    if (!token) return;
    const mappedStatus = newStatus === 'in_progress' ? 'en_reparacion' :
                         newStatus === 'completed' ? 'reparado' : 'pending';

    try {
      const notes = newStatus === 'in_progress' ? 'Técnico inició el diagnóstico' :
                    newStatus === 'completed' ? 'Reparación completada por el técnico' : '';
      await updateRepairStatusAction(token, jobId, mappedStatus, notes);
      await loadData();
    } catch (err: any) {
      alert('Error al actualizar estado: ' + err.message);
    }
  };

  const handleAddPartToJob = async (jobId: string, productId: string) => {
    if (!token) return;
    const selectedProd = products.find(p => p.id === productId);
    if (!selectedProd) return;
    if (selectedProd.stock_actual <= 0) {
      alert('No hay stock disponible para este repuesto.');
      return;
    }

    try {
      await addPartToRepairAction(token, jobId, productId, 1);
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
      <div className="min-h-[calc(100vh-180px)] flex items-center justify-center bg-background text-on-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin text-secondary" />
          <p className="text-xs text-on-surface-variant font-semibold animate-pulse">Cargando cola de reparaciones...</p>
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

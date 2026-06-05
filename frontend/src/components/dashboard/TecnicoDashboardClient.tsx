'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import TecnicoStats from '@/components/tecnico/TecnicoStats';
import AssignedJobs from '@/components/tecnico/AssignedJobs';
import {
  getAdminRepairsAction,
  updateRepairStatusAction,
  getAdminProductsAction,
  addPartToRepairAction,
  updateProductAction
} from '@/actions';

export default function TecnicoDashboardClient() {
  const { token, user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const repairsData = await getAdminRepairsAction();
      const productsData = await getAdminProductsAction();

      const adaptedRepairs = repairsData.map((r: any) => ({
        ...r,
        status: r.status === 'in_review' || r.status === 'repairing' ? 'in_progress' :
                r.status === 'ready' || r.status === 'delivered' ? 'completed' : 'pending'
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
    const mappedStatus = newStatus === 'in_progress' ? 'repairing' :
                         newStatus === 'completed' ? 'ready' : 'pending';

    try {
      await updateRepairStatusAction(token, jobId, mappedStatus, `Estado actualizado por técnico: ${newStatus}`);
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
      alert('¡Error! No hay stock disponible para este repuesto.');
      return;
    }

    try {
      await addPartToRepairAction(token, jobId, productId, 1);

      const newStock = selectedProd.stock_actual - 1;
      await updateProductAction(token, productId, {
        stock_actual: newStock
      });

      alert(`Se vinculó con éxito el repuesto: ${selectedProd.nombre} y se descontó del inventario.`);
      await loadData();
    } catch (err: any) {
      alert('Error al vincular el repuesto: ' + err.message);
    }
  };

  const activeJobsCount = jobs.filter(j => j.status !== 'completed').length;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-background text-on-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin text-secondary" />
          <p className="text-xs text-on-surface-variant font-semibold animate-pulse">Cargando cola de reparaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-primary dark:text-white font-h1 font-bold">Panel Técnico</h1>
        <p className="text-sm text-on-surface-variant">
          Bienvenido al laboratorio, {user?.nombre}. Tienes {activeJobsCount} trabajos de reparación asignados hoy.
        </p>
      </div>

      <TecnicoStats jobs={jobs} />

      <AssignedJobs
        jobs={jobs}
        products={products}
        onUpdateStatus={handleUpdateStatus}
        onAddPart={handleAddPartToJob}
      />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getRepairTrackingAction, updateRepairStatusAction, getAdminProductsAction, addPartToRepairAction } from '@/actions';
import { ArrowLeft, Wrench, CheckCircle2, AlertCircle, Cpu, Plus, DollarSign, Calendar, User, Smartphone, MapPin, Camera } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export default function TecnicoReparacionDetailClient({ ticketId }: { ticketId: string }) {
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [tracking, setTracking] = useState<any[]>([]);
  const [warranty, setWarranty] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedPart, setSelectedPart] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [isAuthenticated, ticketId]);

  const loadData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [trackingData, productsData] = await Promise.all([
        getRepairTrackingAction(ticketId),
        getAdminProductsAction()
      ]);
      setOrder(trackingData.order);
      setTracking(trackingData.tracking);
      setWarranty(trackingData.warranty);
      setProducts(productsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!isAuthenticated) return;
    const notes = newStatus === 'en_reparacion' ? 'Técnico inició diagnóstico' :
                  newStatus === 'reparado' ? 'Reparación completada' : '';
    const result = await updateRepairStatusAction(ticketId, newStatus, notes);
    if (!result.success) {
      alert('Error al actualizar estado: ' + result.error);
      return;
    }
    loadData();
  };

  const handleAddPart = async () => {
    if (!isAuthenticated || !selectedPart) return;
    const prod = products.find(p => p.id === selectedPart);
    if (!prod || prod.stock <= 0) return alert('Stock insuficiente');

    try {
      await addPartToRepairAction(ticketId, selectedPart, 1);
      alert(`Repuesto "${prod.name}" vinculado exitosamente`);
      setSelectedPart('');
      loadData();
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-on-surface-variant font-bold">No se encontró la reparación</p>
        <Link href="/tecnico/reparaciones" className="text-secondary text-sm mt-2 inline-block">Volver</Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: any }> = {
      pending: { label: 'Pendiente', variant: 'pending' },
      agendado: { label: 'Agendado', variant: 'info' },
      en_reparacion: { label: 'En Reparación', variant: 'info' },
      reparado: { label: 'Reparado', variant: 'success' },
      completado: { label: 'Completado', variant: 'success' },
    };
    const s = map[status] || { label: status, variant: 'pending' };
    return <Badge variant={s.variant as any}>{s.label}</Badge>;
  };

  const isPending = order.status === 'pending' || order.status === 'agendado';
  const isInProgress = order.status === 'en_reparacion';
  const isCompleted = order.status === 'reparado' || order.status === 'completado';

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/tecnico/reparaciones" className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-secondary/80 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a Reparaciones
      </Link>

      <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-outline-variant/20 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-primary/70 bg-primary/5 px-3 py-1 rounded-lg">{order.id}</span>
              {getStatusBadge(order.status)}
            </div>
            <h1 className="text-xl font-black text-on-background">{order.device?.brand} {order.device?.model}</h1>
          </div>
          <div className="flex gap-2">
            {isPending && (
              <button onClick={() => handleUpdateStatus('en_reparacion')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5">
                <Wrench className="w-4 h-4" /> Iniciar Reparación
              </button>
            )}
            {isInProgress && (
              <button onClick={() => handleUpdateStatus('reparado')} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Marcar Completado
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-surface-container-low dark:bg-slate-800/30 rounded-xl">
          <div className="flex items-center gap-3 text-sm">
            <Smartphone className="w-5 h-5 text-on-surface-variant/60" />
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase">Dispositivo</p>
              <p className="font-semibold">{order.device?.brand} {order.device?.model}</p>
              <p className="text-xs text-on-surface-variant">S/N: {order.device?.serial_number}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-5 h-5 text-on-surface-variant/60" />
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase">Cita</p>
              <p className="font-semibold">{order.appointment_datetime ? new Date(order.appointment_datetime).toLocaleDateString('es-ES', { dateStyle: 'long' }) : 'No agendada'}</p>
            </div>
          </div>
          {order.sucursal && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-5 h-5 text-on-surface-variant/60" />
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">Sucursal</p>
                <p className="font-semibold">{order.sucursal}</p>
              </div>
            </div>
          )}
        </div>

        {order.failure_photo && (
          <div className="p-4 bg-surface-container-low dark:bg-slate-800/30 rounded-xl">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-2 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" /> Evidencia fotográfica del cliente
            </p>
            <img src={order.failure_photo} alt="Evidencia de la falla" className="max-h-48 rounded-lg border border-outline-variant/20" />
          </div>
        )}

        {order.notes && (
          <div className="flex items-start gap-2 text-sm bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-4 rounded-xl border border-amber-200/30">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs uppercase">Sintomatología</p>
              <p>{order.notes}</p>
            </div>
          </div>
        )}

        {isInProgress && (
          <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-outline-variant/20 space-y-3">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" /> Vincular Repuesto
            </h4>
            <div className="flex gap-3">
              <select
                className="flex-1 bg-white dark:bg-slate-900 border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-secondary/30"
                value={selectedPart}
                onChange={e => setSelectedPart(e.target.value)}
              >
                <option value="">Seleccionar repuesto...</option>
                {products.filter(p => p.stock > 0).map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                ))}
              </select>
              <button
                onClick={handleAddPart}
                disabled={!selectedPart}
                className="bg-secondary hover:bg-secondary/95 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Vincular
              </button>
            </div>
          </div>
        )}

        <div className="border-t border-outline-variant/10 pt-4">
          <h4 className="font-bold text-sm mb-3 text-on-background">Línea de Tiempo</h4>
          <div className="space-y-3">
            {tracking.map((t: any, i: number) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${i === tracking.length - 1 ? 'bg-secondary' : 'bg-outline-variant/40'}`} />
                  {i < tracking.length - 1 && <div className="w-px flex-1 bg-outline-variant/20 my-1" />}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-semibold text-on-background">
                    {t.new_status === 'pending' ? 'Creada' :
                     t.new_status === 'agendado' ? 'Cliente confirmó' :
                     t.new_status === 'en_reparacion' ? 'En reparación' :
                     t.new_status === 'reparado' ? 'Reparada' :
                     t.new_status === 'completado' ? 'Entregada' : t.new_status}
                  </p>
                  <p className="text-xs text-on-surface-variant">{t.notes}</p>
                  {t.created_at && (
                    <p className="text-[10px] text-on-surface-variant/60 mt-1">{new Date(t.created_at).toLocaleString('es-ES')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {warranty && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 p-4 rounded-xl">
            <p className="font-bold text-sm text-green-800 dark:text-green-200">Garantía Activa</p>
            <p className="text-xs text-green-700 dark:text-green-300">
              Token: {warranty.warranty_token} | Vence: {new Date(warranty.end_date).toLocaleDateString('es-ES')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

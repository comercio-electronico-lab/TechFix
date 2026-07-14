"use client";

import React, { useState, useEffect } from 'react';
import AdminMetricCard from '@/components/admin/AdminMetricCard';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { getRepairTickets, getAllUsers, getProducts } from '@/actions';
import { CircleDollarSign, Wrench, UserPlus, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Appointment {
  id: string;
  customer: string;
  device: string;
  service: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}

export default function AdminDashboardClient() {
  const columns = [
    { header: 'ID Ticket', key: 'id', render: (item: any) => <span className="font-bold text-primary">{item.id}</span> },
    { header: 'Cliente', key: 'customer' },
    { header: 'Dispositivo', key: 'device' },
    { header: 'Servicio', key: 'service' },
    {
      header: 'Estado',
      key: 'status',
      render: (item: Appointment) => {
        const variants = {
          'Pending': 'warning',
          'In Progress': 'info',
          'Completed': 'success',
          'Cancelled': 'error',
        } as const;
        return <Badge variant={variants[item.status]}>{item.status}</Badge>;
      }
    },
  ];

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    ventasTotales: 0,
    reparacionesActivas: 0,
    clientesNuevos: 0,
    bajoStock: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [repairs, users, products] = await Promise.all([
          getRepairTickets(),
          getAllUsers(),
          getProducts()
        ]);

        const totalSales = repairs
          .filter((r: any) => r.payment_status === 'approved' || r.status === 'reparado' || r.status === 'entregado')
          .reduce((sum: number, r: any) => sum + (r.final_price || r.estimated_price_min || 0), 0);

        const activeRepairs = repairs.filter((r: any) => 
          r.status === 'pending' || r.status === 'agendado' || r.status === 'en_reparacion'
        ).length;

        const totalClients = users.filter((u: any) => u.role?.toLowerCase() === 'cliente').length;

        const lowStock = products.filter((p: any) => (p.stock || p.stock_actual || 0) < 5).length;

        const recentAppts: Appointment[] = repairs.slice(0, 5).map((r: any) => {
          const user = users.find((u: any) => u.email?.toLowerCase() === r.customerEmail?.toLowerCase());
          const customerName = user ? user.name : (r.customerEmail || 'Cliente Anónimo');

          let status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' = 'Pending';
          if (r.status === 'en_reparacion') {
            status = 'In Progress';
          } else if (r.status === 'reparado' || r.status === 'entregado' || r.status === 'completado') {
            status = 'Completed';
          } else if (r.status === 'cancelado') {
            status = 'Cancelled';
          }

          return {
            id: r.id,
            customer: customerName,
            device: r.device ? `${r.device.brand} ${r.device.model}` : (r.deviceName || 'Dispositivo N/A'),
            service: r.notes || r.diagnosis_final || 'Mantenimiento General',
            status
          };
        });

        setStats({
          ventasTotales: totalSales,
          reparacionesActivas: activeRepairs,
          clientesNuevos: totalClients,
          bajoStock: lowStock
        });
        setAppointments(recentAppts);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-stack-lg">
      <header>
        <h1 className="text-primary text-[32px] font-bold">Resumen General</h1>
        <p className="text-on-surface-variant">Bienvenido de nuevo al centro de comando técnico.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <AdminMetricCard
          label="Ventas Totales"
          value={loading ? "..." : `S/. ${stats.ventasTotales.toLocaleString()}`}
          trend={{ value: 12, isUpward: true }}
          icon={CircleDollarSign}
          color="secondary"
        />
        <AdminMetricCard
          label="Reparaciones Activas"
          value={loading ? "..." : stats.reparacionesActivas.toString()}
          icon={Wrench}
          color="primary"
          progress={65}
        />
        <AdminMetricCard
          label="Clientes Nuevos"
          value={loading ? "..." : stats.clientesNuevos.toString()}
          trend={{ value: 8, isUpward: true }}
          icon={UserPlus}
          color="accent"
        />
        <AdminMetricCard
          label="Bajo Stock"
          value={loading ? "..." : stats.bajoStock.toString()}
          icon={Package}
          color="accent"
          description="Requiere atención inmediata"
        />
      </div>

      {/* Recent Activity Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest">
          <h2 className="text-xl font-bold text-primary">Citas Recientes</h2>
          <Link href="/admin/citas" className="text-secondary font-bold text-sm flex items-center gap-2 hover:underline">
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="p-2">
          {loading ? (
            <div className="py-12 text-center text-sm font-semibold text-on-surface-variant/60">
              Cargando resumen...
            </div>
          ) : (
            <Table columns={columns} data={appointments} />
          )}
        </div>
      </section>
    </div>
  );
}

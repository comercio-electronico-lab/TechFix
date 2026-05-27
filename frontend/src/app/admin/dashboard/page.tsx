"use client";

import AdminMetricCard from '@/components/admin/AdminMetricCard';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { mockAppointments, Appointment } from '@/mock/admin';
import { CircleDollarSign, Wrench, UserPlus, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
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
          value="$42,500" 
          trend={{ value: 12, isUpward: true }} 
          icon={CircleDollarSign} 
          color="secondary"
        />
        <AdminMetricCard 
          label="Reparaciones Activas" 
          value="18" 
          icon={Wrench} 
          color="primary"
          progress={65}
        />
        <AdminMetricCard 
          label="Clientes Nuevos" 
          value="125" 
          trend={{ value: 8, isUpward: true }} 
          icon={UserPlus} 
          color="accent"
        />
        <AdminMetricCard 
          label="Bajo Stock" 
          value="4" 
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
          <Table columns={columns} data={mockAppointments.slice(0, 5)} />
        </div>
      </section>
    </div>
  );
}

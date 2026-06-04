"use client";

import AdminMetricCard from '@/components/admin/AdminMetricCard';
import AdminChartCard from '@/components/admin/AdminChartCard';
import SalesBarChart from '@/components/admin/SalesBarChart';
import RepairAreaChart from '@/components/admin/RepairAreaChart';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import {
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  FileDown,
  FileText,
  Calendar,
  Filter
} from 'lucide-react';

export default function AdminReportesClient() {
  const categories = [
    { name: 'Pantallas Mobile', volume: 482, price: '$189.00', margin: 45, sla: 98, trend: 'up' },
    { name: 'Baterías Laptop', volume: 215, price: '$120.00', margin: 32, sla: 92, trend: 'up' },
    { name: 'Microsoldadura', volume: 84, price: '$349.00', margin: 68, sla: 76, trend: 'down' },
    { name: 'Recuperación de Datos', volume: 122, price: '$450.00', margin: 82, sla: 95, trend: 'stable' },
  ];

  const columns = [
    { header: 'Categoría de Servicio', key: 'name', render: (item: any) => <span className="font-bold text-primary">{item.name}</span> },
    { header: 'Volumen', key: 'volume' },
    { header: 'Precio Prom.', key: 'price' },
    {
      header: 'Margen Bruto',
      key: 'margin',
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-16 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: `${item.margin}%` }}></div>
          </div>
          <span className="text-xs font-bold">{item.margin}%</span>
        </div>
      )
    },
    {
      header: 'Éxito SLA',
      key: 'sla',
      render: (item: any) => (
        <Badge variant={item.sla > 90 ? 'success' : 'error'}>{item.sla}%</Badge>
      )
    },
    {
      header: 'Tendencia',
      key: 'trend',
      render: (item: any) => (
        <div className="flex justify-end">
          {item.trend === 'up' && <TrendingUp className="text-green-500 w-5 h-5" />}
          {item.trend === 'down' && <TrendingDown className="text-error w-5 h-5" />}
          {item.trend === 'stable' && <ArrowRightLeft className="text-on-surface-variant/40 w-5 h-5" />}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-stack-lg">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
        <div>
          <h1 className="text-[32px] font-bold text-primary leading-tight">Reportes y Analíticas</h1>
          <p className="text-on-surface-variant mt-2 max-w-2xl">
            Monitorea el rendimiento de ventas, tiempos de respuesta y métricas de productividad técnica.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl font-bold text-sm text-primary border border-outline-variant/30 hover:bg-surface-container-low transition-all">
            <FileText className="w-4 h-4" /> Exportar Excel
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md">
            <FileDown className="w-4 h-4" /> Exportar PDF
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/30 px-4 py-2 rounded-xl">
          <Calendar className="w-5 h-5 text-primary/50" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Periodo</span>
            <span className="text-sm font-bold text-primary">01 Oct - 31 Oct, 2023</span>
          </div>
        </div>
        <div className="h-8 w-px bg-outline-variant/20 hidden lg:block"></div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mr-2">Rangos Rápidos:</span>
          <button className="px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold hover:bg-primary/10 transition-colors">7 DÍAS</button>
          <button className="px-3 py-1 bg-secondary text-white rounded-full text-[10px] font-bold shadow-md shadow-secondary/20">30 DÍAS</button>
          <button className="px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold hover:bg-primary/10 transition-colors">TRIMESTRE</button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <AdminMetricCard
          label="Ingresos Totales"
          value="$142,580.00"
          trend={{ value: 12.4, isUpward: true }}
          icon={TrendingUp}
          color="secondary"
          description="65% Hardware | 35% Servicios"
        />
        <AdminMetricCard
          label="Reparaciones Listas"
          value="1,248"
          icon={TrendingUp}
          color="primary"
          progress={94}
          description="Promedio 1.4 días por ticket"
        />
        <AdminMetricCard
          label="Valor Inventario"
          value="$52,300"
          icon={TrendingUp}
          color="accent"
          description="18 alertas de stock bajo"
        />
        <AdminMetricCard
          label="Satisfacción"
          value="4.8/5"
          trend={{ value: 0.5, isUpward: true }}
          icon={TrendingUp}
          color="tertiary"
          description="Basado en 850 reseñas"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        <AdminChartCard
          title="Tendencia de Ventas"
          subtitle="Comparativa de Ingresos vs Costos mensuales"
        >
          <SalesBarChart />
        </AdminChartCard>
        <AdminChartCard
          title="Volumen de Tickets"
          subtitle="Flujo de reparaciones por semana"
          extra={
            <select className="bg-surface-container-low border border-outline-variant/30 rounded-lg text-[10px] font-bold px-2 py-1 outline-none uppercase tracking-tighter">
              <option>Todas las sedes</option>
              <option>Sede Central</option>
              <option>Sede Norte</option>
            </select>
          }
        >
          <RepairAreaChart />
        </AdminChartCard>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
          <h3 className="text-xl font-bold text-primary">Resumen por Categoría</h3>
          <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors border border-outline-variant/20">
            <Filter className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>
        <Table columns={columns} data={categories} />
        <div className="p-4 bg-surface-container-lowest flex items-center justify-between border-t border-outline-variant/10">
          <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Mostrando 4 de 12 categorías</p>
          <div className="flex gap-2">
            <button className="p-2 border border-outline-variant/30 rounded-lg opacity-50 cursor-not-allowed"><TrendingUp className="w-4 h-4 rotate-180" /></button>
            <button className="p-2 border border-outline-variant/30 rounded-lg hover:bg-white transition-all"><TrendingUp className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

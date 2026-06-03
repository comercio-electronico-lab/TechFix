export interface SalesMonth {
  name: string;
  repairs: number;
  sales: number;
  total: number;
}

export interface RepairStatusMetric {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TechnicianMetric {
  name: string;
  completed: number;
  rating: number;
  active: number;
}

export interface SummaryCardsData {
  totalRevenue: { value: number; change: string; trend: 'up' | 'down' };
  activeRepairs: { value: number; change: string; trend: 'up' | 'down' };
  clientSatisfaction: { value: number; change: string; trend: 'up' };
  pendingOrders: { value: number; change: string; trend: 'down' };
}

export const mockMonthlySales: SalesMonth[] = [
  { name: 'Ene', repairs: 2400, sales: 1200, total: 3600 },
  { name: 'Feb', repairs: 2900, sales: 1800, total: 4700 },
  { name: 'Mar', repairs: 3100, sales: 2400, total: 5500 },
  { name: 'Abr', repairs: 2700, sales: 2100, total: 4800 },
  { name: 'May', repairs: 4200, sales: 3800, total: 8000 },
  { name: 'Jun', repairs: 4800, sales: 4100, total: 8900 },
];

export const mockRepairStatusDistribution: RepairStatusMetric[] = [
  { status: 'Entregados', count: 145, percentage: 58, color: '#10B981' }, // emerald-500
  { status: 'En Reparación', count: 42, percentage: 17, color: '#3B82F6' }, // blue-500
  { status: 'Esperando Repuestos', count: 28, percentage: 11, color: '#F59E0B' }, // amber-500
  { status: 'En Diagnóstico', count: 20, percentage: 8, color: '#8B5CF6' }, // purple-500
  { status: 'Pendientes', count: 15, percentage: 6, color: '#EF4444' }, // red-500
];

export const mockTechniciansPerformance: TechnicianMetric[] = [
  { name: 'Laura Martinez', completed: 48, rating: 4.9, active: 5 },
  { name: 'Sofia Lopez', completed: 37, rating: 4.7, active: 8 },
  { name: 'Carlos Pérez (Ing.)', completed: 52, rating: 4.8, active: 3 },
  { name: 'Juan Torres', completed: 18, rating: 4.5, active: 6 },
];

export const mockSummaryMetrics: SummaryCardsData = {
  totalRevenue: {
    value: 12890.50,
    change: '+14.2% vs mes anterior',
    trend: 'up',
  },
  activeRepairs: {
    value: 42,
    change: '+3 nuevas hoy',
    trend: 'up',
  },
  clientSatisfaction: {
    value: 4.8,
    change: '+0.1% vs mes anterior',
    trend: 'up',
  },
  pendingOrders: {
    value: 15,
    change: '-5 completadas hoy',
    trend: 'down',
  },
};

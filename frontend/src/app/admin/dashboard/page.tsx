import { AdminDashboardView } from '@/components/views/AdminDashboardView/AdminDashboardView';
import { Metadata } from 'next';
import { IDashboardStats, IActivityLog } from '@/interfaces/domain';

export const metadata: Metadata = {
  title: 'Dashboard | Admin',
};

const mockStats: IDashboardStats[] = [
  { label: 'Ventas Totales', value: '$12,450', change: 12, icon: 'DollarSign', trend: 'up' },
  { label: 'Reparaciones Activas', value: '24', change: -5, icon: 'Tool', trend: 'down' },
  { label: 'Citas Hoy', value: '8', icon: 'Calendar', trend: 'neutral' },
  { label: 'Nuevos Clientes', value: '45', change: 25, icon: 'Users', trend: 'up' },
];

const mockActivities: IActivityLog[] = [
  { id: '1', user: 'Admin', action: 'Actualizó stock de iPhone 14', timestamp: 'Hace 5 min', type: 'info' },
  { id: '2', user: 'Tecnico Juan', action: 'Finalizó reparación #1024', timestamp: 'Hace 20 min', type: 'success' },
  { id: '3', user: 'Sistema', action: 'Nueva cita agendada por Cliente', timestamp: 'Hace 1 hora', type: 'warning' },
];

export default function AdminDashboardPage() {
  return <AdminDashboardView stats={mockStats} activities={mockActivities} />;
}

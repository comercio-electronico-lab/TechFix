import { AdminDashboardView } from '@/components/views/AdminDashboardView/AdminDashboardView';
import { Metadata } from 'next';
import { IDashboardStats, IActivityLog } from '@/interfaces/domain';
import { getUsers, getRepairs, initializeData } from '@/actions/data';

export const metadata: Metadata = {
  title: 'Dashboard | Admin',
};

export default async function AdminDashboardPage() {
  // Inicializar base de datos local en memoria
  await initializeData();

  // Obtener colecciones
  const users = await getUsers();
  const repairs = await getRepairs();

  // 1. Ventas Totales: suma de final_price de todas las reparaciones registradas
  const totalIngresos = repairs.reduce((acc, r) => acc + (r.final_price || 0), 0);

  // 2. Reparaciones Activas: status que no sea completed, delivered ni finalizado
  const activeRepairsCount = repairs.filter(r => 
    r.status !== 'completed' && 
    r.status !== 'delivered' && 
    r.status !== 'finalizado'
  ).length;

  // 3. Citas Hoy: citas que coinciden con el día actual (con un fallback para fines demostrativos)
  const todayStr = new Date().toISOString().split('T')[0];
  const appointmentsTodayCount = repairs.filter(r => {
    if (!r.appointment_datetime) return false;
    return r.appointment_datetime.startsWith(todayStr);
  }).length;

  // 4. Clientes Totales: usuarios con rol "Cliente"
  const totalClientsCount = users.filter(u => u.role.toLowerCase() === 'cliente').length;

  const stats: IDashboardStats[] = [
    { 
      label: 'Ventas Totales', 
      value: `$${totalIngresos.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, 
      change: 14, 
      icon: 'DollarSign', 
      trend: 'up' 
    },
    { 
      label: 'Reparaciones Activas', 
      value: String(activeRepairsCount), 
      change: -4, 
      icon: 'Wrench', 
      trend: 'down' 
    },
    { 
      label: 'Citas Hoy', 
      value: String(appointmentsTodayCount || 5), // Muestra la cuenta o un fallback realista
      icon: 'Calendar', 
      trend: 'neutral' 
    },
    { 
      label: 'Nuevos Clientes', 
      value: String(totalClientsCount), 
      change: 18, 
      icon: 'Users', 
      trend: 'up' 
    },
  ];

  // Actividades Recientes: últimas 4 reparaciones registradas
  const activities: IActivityLog[] = repairs.slice(-4).reverse().map((r) => {
    let activityType: 'info' | 'success' | 'warning' = 'info';
    if (r.status === 'completed' || r.status === 'delivered') activityType = 'success';
    else if (r.status === 'pending') activityType = 'warning';

    const customerName = r.customerEmail ? r.customerEmail.split('@')[0] : 'Cliente';
    const cleanId = r.id.split('-').pop() || r.id.substring(0, 5);

    return {
      id: r.id,
      user: customerName.charAt(0).toUpperCase() + customerName.slice(1),
      action: `Registró reparación #${cleanId} (${r.device.brand} ${r.device.model})`,
      timestamp: 'Reciente',
      type: activityType,
    };
  });

  return <AdminDashboardView stats={stats} activities={activities} />;
}

import AdminReportesClient from '@/components/admin/AdminReportesClient';
import { getRepairTickets, getAllUsers } from '@/actions';
import { getProducts } from '@/actions/catalog';

export default async function AdminReportes() {
  const [repairs, users, products] = await Promise.all([
    getRepairTickets(),
    getAllUsers(),
    getProducts()
  ]);

  return <AdminReportesClient repairs={repairs} users={users} products={products} />;
}

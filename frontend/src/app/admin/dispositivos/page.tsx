import AdminDispositivosClient from '@/components/admin/AdminDispositivosClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Equipos Registrados | Admin',
};

export default function AdminDispositivosPage() {
  return <AdminDispositivosClient />;
}

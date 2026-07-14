import AdminProveedoresClient from '@/components/admin/AdminProveedoresClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proveedores | Admin',
};

export default function AdminProveedoresPage() {
  return <AdminProveedoresClient />;
}

import { InventoryView } from '@/components/views/InventoryView';
import { Metadata } from 'next';
import { getProducts } from '@/actions/catalog';

export const metadata: Metadata = {
  title: 'Gestión de Inventario | Admin',
};

export default async function InventarioPage() {
  const products = await getProducts();
  return <InventoryView initialProducts={products} />;
}

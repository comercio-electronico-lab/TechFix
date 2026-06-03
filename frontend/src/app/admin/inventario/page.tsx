import { InventoryView } from '@/components/views/InventoryView';
import { Metadata } from 'next';
import { IProduct } from '@/interfaces/domain';

export const metadata: Metadata = {
  title: 'Gestión de Inventario | Admin',
};

// Mock data (En un escenario real, esto vendría de una API o Server Action)
const mockProducts: IProduct[] = [
  {
    id: '1',
    name: 'MacBook Pro M2',
    description: 'Laptop de alto rendimiento',
    price: 2500,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400',
    category: { id: '1', name: 'Laptops', slug: 'laptops' },
    status: 'active'
  },
  {
    id: '2',
    name: 'iPhone 14 Pro',
    description: 'Smartphone insignia',
    price: 1200,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&q=80&w=400',
    category: { id: '2', name: 'Smartphones', slug: 'smartphones' },
    status: 'active'
  }
];

export default function InventarioPage() {
  return <InventoryView initialProducts={mockProducts} />;
}

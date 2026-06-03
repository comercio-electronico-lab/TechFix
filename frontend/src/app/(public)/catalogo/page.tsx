import { CatalogView } from '@/components/views/CatalogView';
import { Metadata } from 'next';
import { IProduct } from '@/interfaces/domain';

export const metadata: Metadata = {
  title: 'Catálogo de Productos | Laboratorio L1',
  description: 'Encuentra los mejores productos tecnológicos y repuestos.',
};

const mockProducts: IProduct[] = [
  {
    id: '1',
    name: 'MacBook Pro M2',
    description: 'La laptop más potente para profesionales. Con chip M2 Pro y batería de larga duración.',
    price: 2500,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400',
    category: { id: '1', name: 'Laptops', slug: 'laptops' },
    status: 'active'
  },
  {
    id: '2',
    name: 'iPhone 14 Pro',
    description: 'Sistema de cámara Pro, Dynamic Island y pantalla siempre activa.',
    price: 1200,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&q=80&w=400',
    category: { id: '2', name: 'Smartphones', slug: 'smartphones' },
    status: 'active'
  },
  {
    id: '3',
    name: 'Logitech MX Master 3S',
    description: 'Mouse inalámbrico de alto desempeño para productividad.',
    price: 99,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=400',
    category: { id: '3', name: 'Accesorios', slug: 'accesorios' },
    status: 'active'
  }
];

export default function CatalogoPage() {
  return <CatalogView initialProducts={mockProducts} />;
}

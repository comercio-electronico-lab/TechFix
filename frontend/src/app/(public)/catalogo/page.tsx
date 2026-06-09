import CatalogoClient from '@/components/sections/CatalogoClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catálogo de Productos | Laboratorio L1',
  description: 'Encuentra los mejores productos tecnológicos y repuestos.',
};

export default function CatalogoPage() {
  return <CatalogoClient />;
}

'use server';

import { IProduct } from '@/interfaces/domain';
import { initializeData, getProducts as getProductsData } from './data';

export async function getProducts(): Promise<IProduct[]> {
  await initializeData();
  const products = await getProductsData();
  return products.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: (p as any).stock_actual || 10,
    image: p.image,
    category: { id: '1', name: p.category, slug: p.category.toLowerCase() },
    status: 'active'
  }));
}

export async function getAdminProductsAction() {
  return getProducts();
}

export async function createProduct(input: any) {
  await initializeData();
  const products = await getProductsData();
  const newProd = { id: Date.now().toString(), ...input };
  products.push(newProd as any);
  return newProd;
}

export async function updateProduct(id: string, input: any) {
  await initializeData();
  const products = await getProductsData();
  const idx = products.findIndex((p: any) => p.id === id);
  if (idx !== -1) products[idx] = { ...products[idx], ...input };
  return products[idx];
}

export async function updateProductAction(_token: string, id: string, input: any) {
  return updateProduct(id, input);
}

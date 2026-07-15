'use server';

import { IProduct } from '@/interfaces/domain';
import { getAuthToken } from '@/lib/auth-token';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function getProducts(): Promise<IProduct[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/products/search`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Error al obtener productos del backend');
    }

    const data = await response.json();
    return (data.products || []).map((p: any) => ({
      id: p.id,
      name: p.nombre,
      description: p.descripcion,
      price: p.precio_venta,
      stock: p.stock_actual || 0,
      image: (p.imagen_url || 'https://placehold.co/300').replace('via.placeholder.com', 'placehold.co'),
      category: { id: p.categoria, name: p.categoria, slug: p.categoria.toLowerCase() },
      status: p.stock_actual > 0 ? 'active' : 'out_of_stock',
      sku: p.sku || ''
    }));
  } catch (error) {
    console.error('Error in getProducts action:', error);
    return [];
  }
}

export async function getAdminProductsAction() {
  return getProducts();
}

export async function createProduct(input: any) {
  try {
    const token = await getAuthToken();
    const body = {
      nombre: input.name,
      descripcion: input.compatibility || input.description || 'Sin descripción',
      sku: input.sku || `SKU-${Date.now()}`,
      precio_venta: Number(input.price),
      precio_costo: Number(input.price) * 0.5,
      stock_actual: Number(input.stock || 0),
      stock_minimo: 5,
      categoria: input.category || 'Displays',
      imagen_url: input.image || 'https://placehold.co/300',
      status: 'Activo'
    };

    const response = await fetch(`${BACKEND_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al crear producto en el backend');
    }

    const data = await response.json();
    return {
      id: data.id,
      name: data.nombre,
      description: data.descripcion,
      price: data.precio_venta,
      stock: data.stock_actual,
      image: (data.imagen_url || 'https://placehold.co/300').replace('via.placeholder.com', 'placehold.co'),
      category: { id: data.categoria, name: data.categoria, slug: data.categoria.toLowerCase() }
    };
  } catch (error) {
    console.error('Error in createProduct action:', error);
    throw error;
  }
}

export async function updateProduct(id: string, input: any) {
  try {
    const token = await getAuthToken();
    const body = {
      id: id,
      nombre: input.name,
      descripcion: input.compatibility || input.description || 'Sin descripción',
      sku: input.sku,
      precio_venta: Number(input.price),
      precio_costo: Number(input.price) * 0.5,
      stock_actual: Number(input.stock || 0),
      stock_minimo: 5,
      categoria: input.category || 'Displays',
      imagen_url: input.image || 'https://placehold.co/300',
      status: 'Activo'
    };

    const response = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al actualizar producto en el backend');
    }

    const data = await response.json();
    return {
      id: data.id,
      name: data.nombre,
      description: data.descripcion,
      price: data.precio_venta,
      stock: data.stock_actual,
      image: (data.imagen_url || 'https://placehold.co/300').replace('via.placeholder.com', 'placehold.co'),
      category: { id: data.categoria, name: data.categoria, slug: data.categoria.toLowerCase() }
    };
  } catch (error) {
    console.error('Error in updateProduct action:', error);
    throw error;
  }
}

export async function deleteProduct(id: string) {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al eliminar producto en el backend');
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteProduct action:', error);
    throw error;
  }
}

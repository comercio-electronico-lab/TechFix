'use server';

import { getCurrentUser } from './auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function getSuppliers() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/suppliers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Error al obtener proveedores');
    }

    const data = await response.json();
    return data.map((s: any) => ({
      id: s.id,
      name: s.nombre,
      contact: s.contacto,
      phone: s.telefono,
      email: s.email
    }));
  } catch (error) {
    console.error('Error in getSuppliers action:', error);
    return [];
  }
}

export async function createRestockOrder(token: string, orderInput: { proveedor_id: string; producto_id: string; cantidad: number }) {
  try {
    // Validamos la sesión
    await getCurrentUser(token);

    const response = await fetch(`${BACKEND_URL}/api/suppliers/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        proveedor_id: orderInput.proveedor_id,
        producto_id: orderInput.producto_id,
        cantidad: Number(orderInput.cantidad)
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al crear la orden de reabastecimiento');
    }

    const data = await response.json();
    return {
      id: data.id,
      supplierId: data.proveedor_id,
      productId: data.producto_id,
      quantity: data.cantidad,
      status: data.estado,
      orderDate: data.created_at || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in createRestockOrder action:', error);
    throw error;
  }
}

'use server';

import { getCurrentUser } from './auth';
import { getAuthToken } from '@/lib/auth-token';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function getSuppliers() {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${BACKEND_URL}/api/suppliers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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

export async function createRestockOrder(orderInput: { proveedor_id: string; producto_id: string; cantidad: number }) {
  try {
    // Validamos la sesión
    await getCurrentUser();
    const token = await getAuthToken();

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

export async function getRestockOrders() {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${BACKEND_URL}/api/suppliers/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Error al obtener las órdenes de reabastecimiento');
    }

    const data = await response.json();
    return data.map((o: any) => ({
      id: o.id,
      supplierName: o.proveedor?.nombre || 'N/D',
      productName: o.producto?.nombre || 'N/D',
      quantity: o.cantidad,
      status: o.estado,
      expectedDate: o.fecha_llegada,
      orderDate: o.created_at,
    }));
  } catch (error) {
    console.error('Error in getRestockOrders action:', error);
    return [];
  }
}

export async function receiveRestockOrder(orderId: string) {
  const token = await getAuthToken();

  const response = await fetch(`${BACKEND_URL}/api/suppliers/orders/${orderId}/receive`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Error al recibir la orden de reabastecimiento');
  }

  return await response.json();
}

export async function createSupplier(supplierInput: { nombre: string; contacto?: string; telefono?: string; email?: string }) {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${BACKEND_URL}/api/suppliers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: supplierInput.nombre,
        contacto: supplierInput.contacto || '',
        telefono: supplierInput.telefono || '',
        email: supplierInput.email || ''
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Error al crear el proveedor');
    }

    const s = await response.json();
    return {
      id: s.id,
      name: s.nombre,
      contact: s.contacto,
      phone: s.telefono,
      email: s.email
    };
  } catch (e: any) {
    console.error(e);
    throw e;
  }
}

export async function updateSupplier(id: string, supplierInput: { nombre: string; contacto?: string; telefono?: string; email?: string }) {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${BACKEND_URL}/api/suppliers/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: supplierInput.nombre,
        contacto: supplierInput.contacto || '',
        telefono: supplierInput.telefono || '',
        email: supplierInput.email || ''
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Error al actualizar el proveedor');
    }

    const s = await response.json();
    return {
      id: s.id,
      name: s.nombre,
      contact: s.contacto,
      phone: s.telefono,
      email: s.email
    };
  } catch (e: any) {
    console.error(e);
    throw e;
  }
}

export async function deleteSupplier(id: string) {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${BACKEND_URL}/api/suppliers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Error al eliminar el proveedor');
    }

    return { success: true };
  } catch (e: any) {
    console.error(e);
    throw e;
  }
}

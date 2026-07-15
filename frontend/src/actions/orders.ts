'use server';

import { getAuthToken } from '@/lib/auth-token';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface OrderItemInput {
  producto_id: string;
  cantidad: number;
}

export async function createOrderAction(orderData: {
  payment_id: string;
  items: OrderItemInput[];
  nombre_envio?: string;
  direccion_envio?: string;
  ciudad_envio?: string;
  telefono_envio?: string;
  envio?: number;
  impuestos?: number;
}) {
  const token = await getAuthToken();
  const response = await fetch(`${BACKEND_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al registrar el pedido');
  }

  return await response.json();
}

export async function getUserOrdersAction() {
  const token = await getAuthToken();
  const response = await fetch(`${BACKEND_URL}/api/orders/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el historial de pedidos');
  }

  return await response.json();
}

export async function getOrderByIdAction(orderId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el pedido');
  }

  return await response.json();
}

'use server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface OrderItemInput {
  producto_id: string;
  cantidad: number;
}

export async function createOrderAction(token: string, orderData: {
  payment_id: string;
  items: OrderItemInput[];
  nombre_envio?: string;
  direccion_envio?: string;
  ciudad_envio?: string;
  telefono_envio?: string;
  envio?: number;
  impuestos?: number;
}) {
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

export async function getUserOrdersAction(token: string) {
  const response = await fetch(`${BACKEND_URL}/api/orders/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el historial de pedidos');
  }

  return await response.json();
}

export async function getOrderByIdAction(token: string, orderId: string) {
  const response = await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Error al obtener el pedido');
  }

  return await response.json();
}

'use server';

import { initializeData, getSuppliers as getSuppliersData, getSupplierOrders } from './data';
import { getCurrentUser } from './auth';

export async function getSuppliers() {
  await initializeData();
  return await getSuppliersData();
}

export async function createRestockOrder(token: string, orderInput: { proveedor_id: string; producto_id: string; cantidad: number }) {
  await initializeData();
  await getCurrentUser(token);
  const newOrder = { id: `SO-${Date.now()}`, supplierId: orderInput.proveedor_id, productId: orderInput.producto_id, quantity: orderInput.cantidad, status: 'pending', orderDate: new Date().toISOString() };
  const orders = await getSupplierOrders();
  orders.unshift(newOrder as any);
  return newOrder;
}

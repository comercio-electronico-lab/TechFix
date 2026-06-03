'use server';

import usersData from '../data/users.json';
import productsData from '../data/products.json';
import repairsData from '../data/repairs.json';
import suppliersData from '../data/suppliers.json';
import devicesData from '../data/devices.json';
import diagnosticTreeData from '../data/diagnosticTree.json';
import { IUser, IAuthResponse, RepairStatus, IProduct, IDiagnosticNode } from '@/interfaces/domain';

// --- ESTADO EN MEMORIA ---
let users = [...usersData];
let products = [...productsData];
let repairs = [...repairsData];
let devices = [...devicesData];
let suppliers = suppliersData.suppliers;
let supplierOrders = [...suppliersData.orders];

// --- AUTHENTICATION ---

export async function authenticate(email: string, _password?: string): Promise<IAuthResponse> {
  await new Promise(r => setTimeout(r, 400));
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!found) throw new Error('Credenciales inválidas');
  const user: IUser = {
    id: found.id,
    email: found.email,
    name: found.name,
    role: (found.role.toLowerCase() as 'admin' | 'tecnico' | 'cliente'),
    createdAt: found.joinedDate
  };
  return { user, token: `jwt-token-${user.id}` };
}

export async function register(name: string, email: string): Promise<IAuthResponse> {
  const newUser: IUser = { id: `USR-${Date.now()}`, email, name, role: 'cliente', createdAt: new Date().toISOString() };
  users.push({ ...newUser, role: 'Cliente', joinedDate: newUser.createdAt, status: 'Activo' } as any);
  return { user: newUser, token: `jwt-token-${newUser.id}` };
}

export async function getCurrentUser(token: string): Promise<IUser> {
  const userId = token.replace('jwt-token-', '');
  const found = users.find(u => u.id === userId);
  if (!found) throw new Error('Sesión expirada');
  return {
    id: found.id,
    email: found.email,
    name: found.name,
    role: (found.role.toLowerCase() as 'admin' | 'tecnico' | 'cliente'),
    createdAt: found.joinedDate
  };
}

// --- CATALOG & INVENTORY ---

export async function getProducts(): Promise<IProduct[]> {
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

export async function createProduct(input: any) {
  const newProd = { id: Date.now().toString(), ...input };
  products.push(newProd as any);
  return newProd;
}

export async function updateProduct(id: string, input: any) {
  const idx = products.findIndex(p => p.id === id);
  if (idx !== -1) products[idx] = { ...products[idx], ...input };
  return products[idx];
}

// --- REPAIRS & DEVICES ---

export async function getCustomerRepairs(token: string) {
  const user = await getCurrentUser(token);
  return repairs.filter(r => (r as any).customerEmail === user.email);
}

export async function getCustomerDevicesList(token: string) {
  await getCurrentUser(token);
  return devices;
}

export async function getRepairTickets() {
  return repairs;
}

export async function updateRepairStatus(id: string, status: RepairStatus, notes?: string) {
  const idx = repairs.findIndex(r => r.id === id);
  if (idx !== -1) repairs[idx] = { ...repairs[idx], status, notes: notes || (repairs[idx] as any).notes };
  return { success: true };
}

// --- DIAGNOSTIC ---

export async function getDiagnosticNodeById(id: string): Promise<IDiagnosticNode | null> {
  const node = (diagnosticTreeData as any)[id];
  if (!node) return null;
  return {
    ...node,
    options: node.options || (node.children || []).map((childId: string) => {
      const child = (diagnosticTreeData as any)[childId];
      return { id: childId, label: child.question, nextStepId: childId };
    })
  };
}

// --- SUPPLIERS ---

export async function getSuppliers() {
  return suppliers;
}

export async function createRestockOrder(token: string, orderInput: { proveedor_id: string; producto_id: string; cantidad: number }) {
  await getCurrentUser(token);
  const newOrder = { id: `SO-${Date.now()}`, supplierId: orderInput.proveedor_id, productId: orderInput.producto_id, quantity: orderInput.cantidad, status: 'pending', orderDate: new Date().toISOString() };
  supplierOrders.unshift(newOrder as any);
  return newOrder;
}

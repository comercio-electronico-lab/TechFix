'use server';

import { RepairStatus } from '@/interfaces/domain';
import { initializeData, getRepairs as getRepairsData } from './data';
import { getCurrentUser } from './auth';

export async function getCustomerRepairs(token: string) {
  await initializeData();
  const user = await getCurrentUser(token);
  const repairs = await getRepairsData();
  return repairs.filter(r => (r as any).customerEmail === user.email);
}

export async function getClientRepairsAction(token: string) {
  await initializeData();
  const user = await getCurrentUser(token);
  const repairs = await getRepairsData();
  return repairs.filter(r => (r as any).customerEmail === user.email);
}

export async function getRepairTickets() {
  await initializeData();
  return await getRepairsData();
}

export async function getAdminRepairsAction() {
  await initializeData();
  return await getRepairsData();
}

export async function updateRepairStatus(id: string, status: RepairStatus, notes?: string) {
  await initializeData();
  const repairs = await getRepairsData();
  const idx = repairs.findIndex((r: any) => r.id === id);
  if (idx !== -1) repairs[idx] = { ...repairs[idx], status, notes: notes || (repairs[idx] as any).notes };
  return { success: true };
}

export async function updateRepairStatusAction(_token: string, id: string, status: RepairStatus, notes?: string) {
  return updateRepairStatus(id, status, notes);
}

export async function scheduleRepairAction(token: string, repairData: any) {
  await initializeData();
  const user = await getCurrentUser(token);
  const repairs = await getRepairsData();
  const newRepair = {
    id: `TKT-${Date.now()}`,
    deviceName: repairData.deviceName || `Equipo ${repairData.device_id || 'N/A'}`,
    notes: repairData.notes || '',
    deviceSerial: repairData.deviceSerial || repairData.device_id || 'N/A',
    status: 'pending' as const,
    customerEmail: user.email,
    createdAt: new Date().toISOString(),
    appointment_datetime: repairData.appointment_datetime,
    estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };
  repairs.unshift(newRepair as any);
  return newRepair;
}

export async function getClientWarrantiesAction(token: string) {
  await initializeData();
  const user = await getCurrentUser(token);
  const repairs = await getRepairsData();
  const clientRepairs = repairs.filter(r => (r as any).customerEmail === user.email);
  return clientRepairs
    .filter(r => (r as any).status === 'completado' || (r as any).status === 'reparado' || (r as any).status === 'ready' || (r as any).status === 'delivered')
    .map(r => ({
      id: `WAR-${(r as any).id}`,
      repair_id: (r as any).id,
      device_id: (r as any).device?.serial_number || 'N/A',
      device: (r as any).device,
      warranty_token: `W-TKN-${(r as any).id}`,
      start_date: (r as any).createdAt || new Date().toISOString(),
      end_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      warranty_days: 180,
      is_active: true,
      status: 'activa'
    }));
}

export async function getRepairTrackingAction(ticketId: string) {
  await initializeData();
  const repairs = await getRepairsData();
  const repair = repairs.find(r => (r as any).id === ticketId);

  if (!repair) {
    throw new Error('Ticket no encontrado');
  }

  return {
    order: repair,
    tracking: [
      {
        status: (repair as any).status,
        timestamp: (repair as any).createdAt,
        notes: 'Dispositivo recibido en el laboratorio'
      }
    ],
    warranty: {
      id: `WAR-${(repair as any).id}`,
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()
    }
  };
}

export async function addPartToRepairAction(_token: string, repairId: string, productId: string, quantity: number) {
  await initializeData();
  const repairs = await getRepairsData();
  const idx = repairs.findIndex((r: any) => r.id === repairId);
  if (idx !== -1) {
    const repair = repairs[idx] as any;
    repair.parts = repair.parts || [];
    repair.parts.push({ productId, quantity, addedAt: new Date().toISOString() });
  }
  return { success: true };
}

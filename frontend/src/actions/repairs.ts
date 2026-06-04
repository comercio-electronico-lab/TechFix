'use server';

import { RepairStatus } from '@/interfaces/domain';
import { initializeData, getRepairs as getRepairsData } from './data';
import { getCurrentUser } from './auth';

export async function getCustomerRepairs(token: string) {
  await initializeData();
  const user = await getCurrentUser(token);
  const repairs = getRepairsData();
  return repairs.filter(r => (r as any).customerEmail === user.email);
}

export async function getClientRepairsAction(token: string) {
  await initializeData();
  const user = await getCurrentUser(token);
  const repairs = getRepairsData();
  return repairs.filter(r => (r as any).customerEmail === user.email);
}

export async function getRepairTickets() {
  await initializeData();
  return getRepairsData();
}

export async function updateRepairStatus(id: string, status: RepairStatus, notes?: string) {
  await initializeData();
  const repairs = getRepairsData();
  const idx = repairs.findIndex((r: any) => r.id === id);
  if (idx !== -1) repairs[idx] = { ...repairs[idx], status, notes: notes || (repairs[idx] as any).notes };
  return { success: true };
}

export async function scheduleRepairAction(token: string, repairData: { deviceName: string; notes: string; deviceSerial: string }) {
  await initializeData();
  const user = await getCurrentUser(token);
  const repairs = getRepairsData();
  const newRepair = {
    id: `TKT-${Date.now()}`,
    deviceName: repairData.deviceName,
    notes: repairData.notes,
    deviceSerial: repairData.deviceSerial,
    status: 'pending' as const,
    customerEmail: user.email,
    createdAt: new Date().toISOString(),
    estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };
  repairs.unshift(newRepair as any);
  return newRepair;
}

export async function getClientWarrantiesAction(token: string) {
  await initializeData();
  const user = await getCurrentUser(token);
  const repairs = getRepairsData();
  const clientRepairs = repairs.filter(r => (r as any).customerEmail === user.email);
  return clientRepairs
    .filter(r => (r as any).status === 'completado' || (r as any).status === 'reparado')
    .map(r => ({
      id: `WAR-${(r as any).id}`,
      repairId: (r as any).id,
      device: (r as any).device,
      warrantyType: 'reparación',
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'activa'
    }));
}

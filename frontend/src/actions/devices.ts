'use server';

import { initializeData, getDevices } from './data';
import { getCurrentUser } from './auth';

export async function getCustomerDevicesList(token: string) {
  await initializeData();
  await getCurrentUser(token);
  return await getDevices();
}

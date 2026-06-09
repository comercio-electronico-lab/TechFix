'use server';

import { initializeData, getDevices } from './data';
import { getCurrentUser } from './auth';

export async function getCustomerDevicesList(token: string) {
  await initializeData();
  await getCurrentUser(token);
  const devices = await getDevices();
  return devices.map((d: any) => {
    const modelLower = d.model.toLowerCase();
    let device_type = 'Smartphone';
    if (modelLower.includes('macbook') || modelLower.includes('xps') || modelLower.includes('laptop')) {
      device_type = 'Laptop';
    } else if (modelLower.includes('imac') || modelLower.includes('desktop') || modelLower.includes('pc') || modelLower.includes('pantalla')) {
      device_type = 'PC';
    }

    return {
      id: d.id,
      brand: d.brand,
      model: d.model,
      serial_number: d.serialNumber || d.serial_number || '',
      device_type,
      purchase_date: d.purchaseDate || d.purchase_date || null
    };
  });
}

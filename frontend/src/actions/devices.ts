'use server';

import { ICustomerDevice } from '@/interfaces/domain';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function getCustomerDevicesList(token: string): Promise<ICustomerDevice[]> {
  const response = await fetch(`${BACKEND_URL}/api/user/devices`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Error al obtener la lista de dispositivos');
  }

  const data = await response.json();

  return data.map((d: any) => {
    // Determinar tipo de dispositivo para asignarle un tipo coherente
    const modelLower = d.model.toLowerCase();
    let device_type = d.device_type || 'Smartphone';
    if (modelLower.includes('macbook') || modelLower.includes('xps') || modelLower.includes('laptop')) {
      device_type = 'Laptop';
    } else if (modelLower.includes('imac') || modelLower.includes('desktop') || modelLower.includes('pc')) {
      device_type = 'PC';
    }

    return {
      id: d.id,
      brand: d.brand,
      model: d.model,
      specs: `Equipo registrado (${device_type})`,
      serialNumber: d.serial_number || '',
      serial_number: d.serial_number || '',
      device_type: device_type,
      purchaseDate: d.purchase_date ? new Date(d.purchase_date).toISOString().split('T')[0] : '',
      purchase_date: d.purchase_date ? new Date(d.purchase_date).toISOString().split('T')[0] : '',
      status: 'Active Warranty' as const, // Puedes cambiarlo dinámicamente si calculas la garantía
      inService: false,
      image: device_type === 'Laptop' 
        ? 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60'
        : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60'
    };
  });
}

export async function registerDeviceAction(token: string, deviceData: {
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate?: string;
  device_type?: string;
}): Promise<any> {
  // Construir tipo si no se provee
  const modelLower = deviceData.model.toLowerCase();
  let device_type = deviceData.device_type || 'Smartphone';
  if (modelLower.includes('macbook') || modelLower.includes('xps') || modelLower.includes('laptop')) {
    device_type = 'Laptop';
  } else if (modelLower.includes('imac') || modelLower.includes('desktop') || modelLower.includes('pc')) {
    device_type = 'PC';
  }

  const response = await fetch(`${BACKEND_URL}/api/user/devices`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      brand: deviceData.brand,
      model: deviceData.model,
      serial_number: deviceData.serialNumber,
      device_type: device_type,
      purchase_date: deviceData.purchaseDate || ''
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al registrar el dispositivo');
  }

  return await response.json();
}

export async function getAllDevices(): Promise<any[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('techfix_token')?.value;
    if (!token) throw new Error('Token requerido');

    const response = await fetch(`${BACKEND_URL}/api/user/all-devices`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Error al obtener la lista de todos los dispositivos');
    }

    const data = await response.json();
    return data.map((d: any) => ({
      id: d.id,
      brand: d.brand,
      model: d.model,
      serialNumber: d.serial_number,
      deviceType: d.device_type,
      purchaseDate: d.purchase_date ? new Date(d.purchase_date).toISOString().split('T')[0] : '',
      ownerName: d.user?.nombre || 'Cliente Anónimo',
      ownerEmail: d.user?.email || 'N/A'
    }));
  } catch (error) {
    console.error('Error in getAllDevices action:', error);
    return [];
  }
}

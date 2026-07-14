'use server';

import { RepairStatus } from '@/interfaces/domain';
import { getCurrentUser } from './auth';
import { cookies } from 'next/headers';
import { registerDeviceAction } from './devices';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function getCustomerRepairs(token: string) {
  try {
    const user = await getCurrentUser(token);
    
    const response = await fetch(`${BACKEND_URL}/api/repairs/user/${user.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Error al obtener reparaciones del servidor');
    }

    const data = await response.json();
    return data.map((r: any) => {
      const hasApprovedPayment = r.payments?.some((p: any) => p.status === 'approved');
      const paymentStatus = hasApprovedPayment ? 'approved' : (r.payments?.length > 0 ? 'pending' : undefined);

      return {
        id: r.id,
        customerName: r.user?.nombre || user.nombre,
        customerEmail: r.user?.email || user.email,
        deviceName: r.device ? `${r.device.brand} ${r.device.model}` : 'Dispositivo Desconocido',
        deviceSerial: r.device?.serial_number || '',
        status: r.status as RepairStatus,
        createdAt: r.created_at,
        appointment_datetime: r.appointment_datetime,
        notes: r.notes || '',
        estimated_price_min: r.estimated_price_min,
        estimated_price_max: r.estimated_price_max,
        final_price: r.final_price || 0,
        diagnosis_final: r.diagnosis_final || 'Pendiente de diagnóstico técnico presencial',
        payment_status: paymentStatus,
        payments: r.payments || []
      };
    });
  } catch (e: any) {
    console.error('Error fetching customer repairs:', e);
    return [];
  }
}

export async function getClientRepairsAction(token: string) {
  return getCustomerRepairs(token);
}

export async function getRepairTickets() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('techfix_token')?.value;

    if (!token) {
      return [];
    }

    const response = await fetch(`${BACKEND_URL}/api/repairs`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Error al obtener tickets de reparación');
    }

    const data = await response.json();
    return data.map((r: any) => ({
      id: r.id,
      customerName: r.user?.nombre || 'Cliente Anónimo',
      customerEmail: r.user?.email || '',
      deviceName: r.device ? `${r.device.brand} ${r.device.model}` : 'Dispositivo Desconocido',
      deviceSerial: r.device?.serial_number || '',
      device: r.device ? {
        brand: r.device.brand,
        model: r.device.model,
        serial_number: r.device.serial_number
      } : null,
      status: r.status as RepairStatus,
      createdAt: r.created_at,
      appointment_datetime: r.appointment_datetime,
      appointmentDatetime: r.appointment_datetime,
      notes: r.notes || '',
      estimated_price_min: r.estimated_price_min,
      estimated_price_max: r.estimated_price_max,
      final_price: r.final_price || 0,
      finalPrice: r.final_price || 0,
      diagnosis_final: r.diagnosis_final || 'Pendiente de diagnóstico técnico',
      technicianName: r.technician?.nombre || null,
      technicianId: r.technician_id || null
    }));
  } catch (error) {
    console.error('Error in getRepairTickets action:', error);
    return [];
  }
}

export async function getAdminRepairsAction() {
  return getRepairTickets();
}

export async function updateRepairStatus(id: string, status: any, notes?: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('techfix_token')?.value;
    if (!token) {
      return { success: false, error: 'Token requerido para actualizar estado' };
    }
    return await updateRepairStatusAction(token, id, status, notes);
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateRepairStatusAction(token: string, id: string, status: any, notes?: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/repairs/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: status,
        notes: notes || 'Estado actualizado desde el panel técnico.'
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Error al actualizar el estado de la reparación');
    }

    return { success: true };
  } catch (e: any) {
    console.error('Error updating repair status:', e);
    return { success: false, error: e.message };
  }
}

export async function scheduleRepairAction(token: string, repairData: any) {
  let deviceId = repairData.device_id;

  if (!deviceId) {
    // Registrar el dispositivo automáticamente
    try {
      const brand = repairData.brand || 'Genérico';
      const model = repairData.deviceName || 'Dispositivo';
      const serialNumber = repairData.deviceSerial || `SN-${Math.floor(Math.random() * 1000000)}`;
      const deviceType = repairData.deviceType || 'Smartphone';

      const device = await registerDeviceAction(token, {
        brand,
        model,
        serialNumber,
        device_type: deviceType
      });
      deviceId = device.id;
    } catch (err: any) {
      console.error("Error al registrar dispositivo automático:", err);
      throw new Error("No se pudo registrar el dispositivo para la reparación: " + err.message);
    }
  }

  let appointmentDatetime = repairData.appointment_datetime;
  if (!appointmentDatetime && repairData.appointmentDate && repairData.appointmentTime) {
    appointmentDatetime = `${repairData.appointmentDate}T${repairData.appointmentTime}:00Z`;
  } else if (!appointmentDatetime) {
    // Default: 3 días a las 9 AM
    const d = new Date();
    d.setDate(d.getDate() + 3);
    appointmentDatetime = `${d.toISOString().split('T')[0]}T09:00:00Z`;
  }

  const response = await fetch(`${BACKEND_URL}/api/repairs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      device_id: deviceId,
      pig_session_id: repairData.pig_session_id || '',
      appointment_datetime: appointmentDatetime,
      notes: repairData.notes || 'Cita de servicio agendada desde el portal.'
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Error al agendar el servicio técnico');
  }

  const data = await response.json();
  return {
    id: data.id,
    deviceName: repairData.deviceName || 'Dispositivo',
    status: data.status,
    createdAt: data.created_at,
    appointment_datetime: data.appointment_datetime,
    notes: data.notes
  };
}

export async function getClientWarrantiesAction(token: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/warranties`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Error al obtener garantías del servidor');
    }

    const data = await response.json();
    return data.map((w: any) => ({
      id: w.id,
      repair_id: w.repair_id,
      device_id: w.device_id,
      device: w.device ? {
        brand: w.device.brand,
        model: w.device.model,
        serial_number: w.device.serial_number
      } : { brand: 'Dispositivo', model: '', serial_number: '' },
      warranty_token: w.warranty_token,
      start_date: w.start_date,
      end_date: w.end_date,
      warranty_days: w.warranty_days,
      is_active: w.is_active,
      status: w.is_active ? 'activa' : 'vencida'
    }));
  } catch (e) {
    console.error('Error fetching client warranties:', e);
    return [];
  }
}

export async function claimWarrantyAction(token: string, warrantyId: string, notes: string) {
  const response = await fetch(`${BACKEND_URL}/api/repairs/warranty-claim`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ warranty_id: warrantyId, notes }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Error al procesar la reclamación de garantía');
  }

  return await response.json();
}

export async function getRepairTrackingAction(token: string, ticketId: string) {
  const response = await fetch(`${BACKEND_URL}/api/repairs/${ticketId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('No se pudo encontrar el ticket de reparación');
  }

  const data = await response.json();
  
  // Mapear los estados del log
  const trackingLogs = [
    {
      new_status: 'pending',
      created_at: data.created_at,
      notes: 'Dispositivo ingresado al laboratorio central.'
    }
  ];

  if (data.status !== 'pending') {
    trackingLogs.push({
      new_status: data.status,
      created_at: data.updated_at || data.created_at,
      notes: data.notes || `El estado del dispositivo cambió a ${data.status}.`
    });
  }

  // Generar objeto de garantía si está en estado final
  let warranty = null;
  if (data.status === 'reparado' || data.status === 'delivered' || data.status === 'ready') {
    warranty = {
      id: `WAR-${data.id.slice(0, 8)}`,
      warranty_token: `WARR-${data.id.slice(0, 8)}-ACTIVE`,
      start_date: data.updated_at || data.created_at,
      end_date: new Date(new Date(data.updated_at || Date.now()).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  return {
    order: {
      id: data.id,
      device: data.device ? {
        brand: data.device.brand,
        model: data.device.model,
        serial_number: data.device.serial_number,
        specs: 'Equipo registrado'
      } : null,
      status: data.status,
      created_at: data.created_at,
      appointment_datetime: data.appointment_datetime,
      notes: data.notes
    },
    tracking: trackingLogs,
    warranty: warranty
  };
}

export async function addPartToRepairAction(token: string, repairId: string, productId: string, quantity: number) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/repairs/${repairId}/parts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        cantidad: quantity
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Error al vincular el repuesto en el servidor');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in addPartToRepairAction:', error);
    throw error;
  }
}

export async function assignTechnicianAction(repairId: string, technicianId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('techfix_token')?.value;
    if (!token) throw new Error('Token requerido');

    const response = await fetch(`${BACKEND_URL}/api/repairs/${repairId}/assign`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ technician_id: technicianId }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Error al asignar el técnico');
    }

    return { success: true };
  } catch (e: any) {
    console.error('Error assigning technician:', e);
    return { success: false, error: e.message };
  }
}

export async function confirmRepairAction(token: string, repairId: string, partType: string) {
  const response = await fetch(`${BACKEND_URL}/api/repairs/${repairId}/confirm`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ part_type: partType }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Error al confirmar la reparación');
  }

  return await response.json();
}

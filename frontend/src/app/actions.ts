'use server';

import { mockUsers } from '../mock/users';
import { mockRepairTickets } from '../mock/repairs';

// Mapeador para adaptar los tipos del archivo mock al formato esperado por el frontend
function mapMockUser(user: any) {
  return {
    id: user.id,
    nombre: user.name,
    login: user.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
    email: user.email,
    rol: user.role,
    estado: user.status,
    joined_date: user.joinedDate,
  };
}

export async function loginAction(email: string, password?: string) {
  // Simular retraso de red en el servidor
  await new Promise((resolve) => setTimeout(resolve, 800));

  const found = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!found) {
    throw new Error('Credenciales inválidas (Usuario no registrado)');
  }

  const user = mapMockUser(found);
  const token = `mock-jwt-token-${user.id}`;

  return { user, token };
}

export async function registerAction(nombre: string, login: string, email: string) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const existing = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('El correo electrónico ya está registrado');
  }

  const newUser = {
    id: `USR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    nombre,
    login,
    email,
    rol: 'Cliente',
    estado: 'Activo',
    joined_date: new Date().toISOString().split('T')[0],
  };

  const token = `mock-jwt-token-${newUser.id}`;

  return { user: newUser, token };
}

export async function meAction(token: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!token.startsWith('mock-jwt-token-')) {
    throw new Error('Token inválido');
  }

  const userId = token.replace('mock-jwt-token-', '');
  const found = mockUsers.find((u) => u.id === userId);

  if (!found) {
    throw new Error('Usuario no encontrado');
  }

  return mapMockUser(found);
}

export async function getRepairTrackingAction(ticketId: string) {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const foundTicket = mockRepairTickets.find(
    (t) => t.id.toLowerCase() === ticketId.toLowerCase()
  );

  if (!foundTicket) {
    throw new Error('No se pudo encontrar el ticket de reparación.');
  }

  // Generamos un estado completo e historial de trazabilidad simulado para el ticket
  return {
    order: {
      id: foundTicket.id,
      status: foundTicket.status,
      notes: foundTicket.notes,
      finalPrice: foundTicket.finalPrice,
      description: foundTicket.description,
      customerName: foundTicket.customerName,
      deviceName: foundTicket.deviceName,
      deviceSerial: foundTicket.deviceSerial,
    },
    tracking: [
      {
        id: '1',
        new_status: 'pending',
        notes: 'Solicitud de asistencia técnica agendada en línea.',
        created_at: foundTicket.createdAt,
      },
      {
        id: '2',
        new_status: 'in_review',
        notes: 'Dispositivo recibido físicamente en el laboratorio central. Se inicia diagnóstico.',
        created_at: foundTicket.createdAt,
      },
      ...(foundTicket.status === 'waiting_parts' || foundTicket.status === 'repairing' || foundTicket.status === 'ready' || foundTicket.status === 'delivered'
        ? [
            {
              id: '3',
              new_status: foundTicket.status === 'waiting_parts' ? 'waiting_parts' : 'repairing',
              notes: foundTicket.status === 'waiting_parts' 
                ? 'Esperando repuestos del fabricante.' 
                : 'Iniciando reparaciones en el laboratorio.',
              created_at: foundTicket.createdAt,
            }
          ]
        : []),
      ...(foundTicket.status === 'ready' || foundTicket.status === 'delivered'
        ? [
            {
              id: '4',
              new_status: 'ready',
              notes: 'Reparaciones concluidas y pruebas de rendimiento superadas al 100%.',
              created_at: foundTicket.createdAt,
            }
          ]
        : []),
    ],
    warranty: foundTicket.status === 'delivered' ? {
      id: 'WARR-001',
      warrantyDays: 90,
      startDate: foundTicket.createdAt,
      endDate: new Date(new Date(foundTicket.createdAt).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      warrantyToken: `WARR-${foundTicket.id}-OK`,
    } : null,
  };
}

// Estado en memoria para persistencia de modificaciones en la cola de reparaciones
let repairsState = [...mockRepairTickets];

export async function getClientRepairsAction(token: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const currentUser = await meAction(token);

  // Filtrar reparaciones que correspondan al email del usuario autenticado
  const userRepairs = repairsState.filter(
    (r) => r.customerEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  return userRepairs.map((o) => ({
    id: o.id,
    user_id: currentUser.id,
    device_id: 'DEV-' + o.id,
    device: {
      id: 'DEV-' + o.id,
      brand: o.deviceName.split(' ')[0],
      model: o.deviceName.split(' ').slice(1).join(' '),
      serial_number: o.deviceSerial,
      specs: 'Equipo de diagnóstico',
      status: o.status === 'delivered' ? 'Ready' : 'In Service',
    },
    appointment_datetime: o.createdAt + 'T10:00:00Z',
    status: o.status,
    diagnosis_final: o.notes,
    final_price: o.finalPrice,
    notes: o.description,
    created_at: o.createdAt,
  }));
}

export async function getClientWarrantiesAction(token: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const currentUser = await meAction(token);

  // Obtener reparaciones completadas y entregadas
  const userRepairs = repairsState.filter(
    (r) =>
      r.customerEmail.toLowerCase() === currentUser.email.toLowerCase() &&
      (r.status === 'ready' || r.status === 'delivered')
  );

  return userRepairs.map((o) => ({
    id: 'WARR-' + o.id,
    repair_id: o.id,
    user_id: currentUser.id,
    device_id: 'DEV-' + o.id,
    device: {
      brand: o.deviceName.split(' ')[0],
      model: o.deviceName.split(' ').slice(1).join(' '),
      serial_number: o.deviceSerial,
    },
    warranty_days: 90,
    start_date: o.createdAt,
    end_date: new Date(new Date(o.createdAt).getTime() + 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    is_active: true,
    warranty_token: `WARR-${o.id}-OK`,
  }));
}

export async function scheduleRepairAction(token: string, input: any) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const currentUser = await meAction(token);

  const newId = `WO-2026-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(4, '0')}`;
  const newOrder = {
    id: newId,
    customerName: currentUser.nombre,
    customerEmail: currentUser.email,
    deviceName: 'Dispositivo Agendado',
    deviceSerial: 'SN-' + Math.floor(Math.random() * 1000000).toString(),
    description: input.notes || 'Reparación agendada desde el portal.',
    status: 'pending',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    finalPrice: 50,
    notes: '',
    createdAt: new Date().toISOString().split('T')[0],
  };

  repairsState.unshift(newOrder);
  return newOrder;
}

export async function getAdminRepairsAction(token: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Validamos el token
  await meAction(token);

  // Mapeamos al formato GORM esperado por useRepairQueue
  return repairsState.map((o) => ({
    id: o.id,
    user: {
      nombre: o.customerName,
      email: o.customerEmail,
    },
    device: {
      brand: o.deviceName.split(' ')[0],
      model: o.deviceName.split(' ').slice(1).join(' '),
      serial_number: o.deviceSerial,
    },
    notes: o.description,
    status: o.status,
    final_price: o.finalPrice,
    diagnosis_final: o.notes,
    created_at: o.createdAt,
  }));
}

export async function updateRepairStatusAction(
  token: string,
  ticketId: string,
  status: string,
  notes?: string
) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  await meAction(token);

  const ticket = repairsState.find((t) => t.id === ticketId);
  if (ticket) {
    ticket.status = status;
    if (notes) {
      ticket.notes = notes;
    }
  }

  return { success: true };
}

export async function addPartToRepairAction(
  token: string,
  ticketId: string,
  productId: string,
  quantity: number
) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  await meAction(token);

  const ticket = repairsState.find((t) => t.id === ticketId);
  if (ticket) {
    // Simulamos un incremento del precio según la cantidad
    ticket.finalPrice += 45.0 * quantity;
    if (!ticket.notes) {
      ticket.notes = 'Repuesto vinculado: ' + productId;
    } else {
      ticket.notes += ', Repuesto vinculado: ' + productId;
    }
  }

  return { success: true };
}

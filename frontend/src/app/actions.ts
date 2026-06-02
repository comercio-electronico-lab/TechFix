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

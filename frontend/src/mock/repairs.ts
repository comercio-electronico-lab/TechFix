import { AdminRepairTicket } from '@/hooks/useRepairQueue';

export const mockRepairTickets: AdminRepairTicket[] = [
  {
    id: 'WO-2026-0041',
    customerName: 'Carlos González',
    customerEmail: 'c.gonzalez@example.com',
    deviceName: 'Asus ROG Strix G15',
    deviceSerial: 'SN-ASUS-9912',
    description: 'Recalentamiento severo y apagados repentinos',
    status: 'repairing',
    priority: 'High',
    finalPrice: 120.00,
    notes: 'Limpieza de ventiladores y cambio de pasta térmica (Metal Líquido).',
    createdAt: '2026-06-02'
  },
  {
    id: 'WO-2026-0089',
    customerName: 'Ana Martínez',
    customerEmail: 'ana.mtz@example.com',
    deviceName: 'iPhone 14 Pro Max',
    deviceSerial: 'SN-APPL-7721',
    description: 'La batería dura menos de 4 horas',
    status: 'pending',
    priority: 'Medium',
    finalPrice: 85.00,
    notes: 'Diagnóstico inicial de salud de batería (82%).',
    createdAt: '2026-06-03'
  },
  {
    id: 'WO-2026-0012',
    customerName: 'Luis Sánchez',
    customerEmail: 'l.sanchez@example.com',
    deviceName: 'Dell XPS 13',
    deviceSerial: 'SN-DELL-5521',
    description: 'Pantalla azul al cargar el sistema operativo',
    status: 'ready',
    priority: 'Low',
    finalPrice: 45.00,
    notes: 'Reinstalación de controladores y actualización de BIOS.',
    createdAt: '2026-05-30'
  },
  {
    id: 'WO-2026-0055',
    customerName: 'Sofia Ruiz',
    customerEmail: 's.ruiz@example.com',
    deviceName: 'MacBook Air M1',
    deviceSerial: 'SN-APPL-3344',
    description: 'No funcionan algunas teclas del teclado',
    status: 'waiting_parts',
    priority: 'High',
    finalPrice: 180.00,
    notes: 'Solicitando teclado original de reemplazo.',
    createdAt: '2026-06-01'
  }
];

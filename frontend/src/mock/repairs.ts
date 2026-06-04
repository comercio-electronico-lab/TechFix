export interface RepairOrderProduct {
  id: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface ClientRepair {
  id: string;
  device?: {
    brand: string;
    model: string;
    serial_number: string;
  };
  status: 'pending' | 'agendado' | 'en_reparacion' | 'reparado' | 'completado';
  diagnosis_final: string;
  created_at: string;
  appointment_datetime?: string;
  final_price: number;
  estimated_price_min?: number;
  estimated_price_max?: number;
  productos?: RepairOrderProduct[];
  notes?: string;
  warranty?: {
    warranty_days: number;
    start_date?: string;
    end_date?: string;
    is_active: boolean;
  };
  payment_status?: 'pending' | 'approved' | 'failed';
}

export const mockClientRepairs: ClientRepair[] = [
  // Estado: pending - Diagnóstico hecho, sabe el costo aprox, esperando confirmación
  // Usuario: ana@example.com (USR-006)
  {
    id: 'TKT-1780497224796-2NBC6',
    device: {
      brand: 'iPhone',
      model: '14 Pro Max',
      serial_number: 'SN-APPL-7721'
    },
    status: 'pending',
    diagnosis_final: 'Batería degradada. Capacidad actual: 78%. Recomendación: cambio de batería original.',
    created_at: '2026-06-03T10:30:00Z',
    estimated_price_min: 65.00,
    estimated_price_max: 95.00,
    final_price: 85.00,
    notes: 'Diagnóstico inicial completado. Cliente debe confirmar para agendar reparación.',
    productos: [],
    payment_status: 'pending'
  },

  // Estado: agendado - Cita reservada, esperando pago
  // Usuario: carlos@example.com (USR-005)
  {
    id: 'TKT-1780485720123-5XYZ7',
    device: {
      brand: 'Dell',
      model: 'XPS 15',
      serial_number: 'C02XT5CQT49H'
    },
    status: 'agendado',
    diagnosis_final: 'Problemas de pantalla: Cristal exterior roto. Se recomienda reemplazo de pantalla completa.',
    created_at: '2026-06-02T14:15:00Z',
    appointment_datetime: '2026-06-05T09:00:00Z',
    final_price: 250.00,
    estimated_price_min: 240.00,
    estimated_price_max: 280.00,
    notes: 'Cita reservada para 2026-06-05 09:00 AM - 11:00 AM en Laboratorio Central - Miraflores',
    productos: [
      {
        id: 'PROD-001',
        nombre: 'Pantalla LCD para Dell XPS 15',
        cantidad: 1,
        precio_unitario: 180.00,
        subtotal: 180.00
      },
      {
        id: 'PROD-002',
        nombre: 'Mano de obra - Reemplazo de pantalla',
        cantidad: 1,
        precio_unitario: 70.00,
        subtotal: 70.00
      }
    ],
    payment_status: 'pending'
  },

  // Estado: en_reparacion - Técnico tiene el equipo, pago aprobado
  // Usuario: lucia.vargas@gmail.com (USR-012)
  {
    id: 'TKT-1780456890234-9ABC1',
    device: {
      brand: 'MacBook',
      model: 'Air M1',
      serial_number: 'SN-APPL-3344'
    },
    status: 'en_reparacion',
    diagnosis_final: 'Teclado defectuoso. Se están reemplazando las teclas dañadas.',
    created_at: '2026-06-01T11:45:00Z',
    appointment_datetime: '2026-06-03T10:00:00Z',
    final_price: 180.00,
    notes: 'Técnico: Leonardo - Cambio de teclas en progreso',
    productos: [
      {
        id: 'PROD-003',
        nombre: 'Kit de teclas original MacBook Air',
        cantidad: 3,
        precio_unitario: 45.00,
        subtotal: 135.00
      },
      {
        id: 'PROD-004',
        nombre: 'Mano de obra - Reemplazo de teclado',
        cantidad: 1,
        precio_unitario: 45.00,
        subtotal: 45.00
      }
    ],
    payment_status: 'approved'
  },

  // Estado: reparado - Listo para retirar, incluye warranty
  // Usuario: juan.perez@gmail.com (USR-003)
  {
    id: 'TKT-1780398765432-7DEF3',
    device: {
      brand: 'Asus',
      model: 'ROG Strix G15',
      serial_number: 'SN-ASUS-9912'
    },
    status: 'reparado',
    diagnosis_final: 'Limpieza de disipadores y cambio de pasta térmica (Metal Líquido). Sistema probado sin recalentamiento.',
    created_at: '2026-05-30T09:20:00Z',
    appointment_datetime: '2026-06-02T14:30:00Z',
    final_price: 120.00,
    notes: 'Reparación completada. Equipo listo para retirar. Incluye 30 días de garantía.',
    productos: [
      {
        id: 'PROD-005',
        nombre: 'Pasta térmica Metal Líquido',
        cantidad: 1,
        precio_unitario: 25.00,
        subtotal: 25.00
      },
      {
        id: 'PROD-006',
        nombre: 'Mano de obra - Limpieza y cambio de pasta',
        cantidad: 1,
        precio_unitario: 95.00,
        subtotal: 95.00
      }
    ],
    warranty: {
      warranty_days: 30,
      start_date: '2026-06-04T14:30:00Z',
      end_date: '2026-07-04T14:30:00Z',
      is_active: true
    },
    payment_status: 'approved'
  },

  // Estado: completado - Usuario retiró el equipo
  // Usuario: luis@example.com (USR-007)
  {
    id: 'TKT-1780245123456-6GHI5',
    device: {
      brand: 'Lenovo',
      model: 'ThinkPad X1 Carbon',
      serial_number: 'SN-LNVO-5566'
    },
    status: 'completado',
    diagnosis_final: 'Cambio de SSD. Equipo con mejor rendimiento. Usuario satisfecho.',
    created_at: '2026-05-20T08:00:00Z',
    appointment_datetime: '2026-05-28T15:00:00Z',
    final_price: 95.00,
    notes: 'Reparación completada y retirada por cliente. Garantía activa hasta 2026-06-27.',
    productos: [
      {
        id: 'PROD-007',
        nombre: 'SSD Samsung 512GB',
        cantidad: 1,
        precio_unitario: 65.00,
        subtotal: 65.00
      },
      {
        id: 'PROD-008',
        nombre: 'Mano de obra - Instalación de SSD',
        cantidad: 1,
        precio_unitario: 30.00,
        subtotal: 30.00
      }
    ],
    warranty: {
      warranty_days: 30,
      start_date: '2026-05-28T15:00:00Z',
      end_date: '2026-06-27T15:00:00Z',
      is_active: true
    },
    payment_status: 'approved'
  }
];

// Mantener compatibilidad con AdminRepairTicket para taller
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

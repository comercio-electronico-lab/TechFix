export interface User {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  role: 'Admin' | 'Técnico' | 'Cliente';
  joinedDate: string;
  status: 'Activo' | 'Inactivo';
  phone?: string;
  documentType?: 'DNI' | 'RUT' | 'PASAPORTE';
  documentId?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  avatar?: string;
}

export const mockUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Marcos',
    lastName: 'Rodriguez',
    email: 'admin@techfix.com',
    role: 'Admin',
    joinedDate: '2024-01-10',
    status: 'Activo',
    phone: '+51 987 654 321',
    documentType: 'DNI',
    documentId: '12345678',
    address: 'Av. Principal 123',
    city: 'Lima',
    postalCode: '15001',
    country: 'Perú',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'USR-002',
    name: 'Laura',
    lastName: 'Martinez',
    email: 'tecnico@techfix.com',
    role: 'Técnico',
    joinedDate: '2024-03-15',
    status: 'Activo',
    phone: '+51 999 888 777',
    documentType: 'DNI',
    documentId: '87654321',
    address: 'Calle Técnicos 456',
    city: 'Lima',
    postalCode: '15002',
    country: 'Perú',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'USR-003',
    name: 'Juan',
    lastName: 'Perez',
    email: 'juan.perez@gmail.com',
    role: 'Cliente',
    joinedDate: '2025-11-20',
    status: 'Activo',
    phone: '+51 912 345 678',
    documentType: 'DNI',
    documentId: '45678901',
    address: 'Av. Clientes 789',
    city: 'Lima',
    postalCode: '15003',
    country: 'Perú',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'USR-004',
    name: 'Sofia',
    lastName: 'Lopez',
    email: 's.lopez@techfix.com',
    role: 'Técnico',
    joinedDate: '2025-02-05',
    status: 'Inactivo',
    phone: '+51 955 444 333',
    documentType: 'DNI',
    documentId: '34567890',
    address: 'Calle Técnicos 234',
    city: 'Arequipa',
    postalCode: '04001',
    country: 'Perú',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'USR-005',
    name: 'Carlos',
    lastName: 'Pérez',
    email: 'carlos@example.com',
    role: 'Cliente',
    joinedDate: '2025-08-12',
    status: 'Activo',
    phone: '+51 922 888 111',
    documentType: 'DNI',
    documentId: '23456789',
    address: 'Av. Comercio 321',
    city: 'Cusco',
    postalCode: '08001',
    country: 'Perú',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'USR-006',
    name: 'Ana',
    lastName: 'Martínez',
    email: 'ana@example.com',
    role: 'Cliente',
    joinedDate: '2025-09-01',
    status: 'Activo',
    phone: '+51 933 777 222',
    documentType: 'DNI',
    documentId: '56789012',
    address: 'Calle Principal 567',
    city: 'Trujillo',
    postalCode: '13001',
    country: 'Perú',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'USR-007',
    name: 'Luis',
    lastName: 'Sánchez',
    email: 'luis@example.com',
    role: 'Cliente',
    joinedDate: '2025-10-10',
    status: 'Activo',
    phone: '+51 944 666 333',
    documentType: 'RUT',
    documentId: '67890123-4',
    address: 'Paseo Tecnología 890',
    city: 'Valparaíso',
    postalCode: '2340000',
    country: 'Chile',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'USR-008',
    name: 'Roberto',
    lastName: 'Díaz',
    email: 'roberto@example.com',
    role: 'Cliente',
    joinedDate: '2025-12-01',
    status: 'Activo',
    phone: '+51 988 555 444',
    documentType: 'DNI',
    documentId: '78901234',
    address: 'Avenida Central 654',
    city: 'Lima',
    postalCode: '15004',
    country: 'Perú',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'USR-009',
    name: 'Juan',
    lastName: 'Torres',
    email: 'j.torres@techfix.com',
    role: 'Técnico',
    joinedDate: '2026-01-20',
    status: 'Activo',
    phone: '+51 977 111 222',
    documentType: 'DNI',
    documentId: '89012345',
    address: 'Calle Taller 111',
    city: 'Lima',
    postalCode: '15005',
    country: 'Perú',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'USR-010',
    name: 'Gabriela',
    lastName: 'Soto',
    email: 'g.soto@techfix.com',
    role: 'Admin',
    joinedDate: '2024-05-18',
    status: 'Activo',
    phone: '+51 966 222 333',
    documentType: 'DNI',
    documentId: '90123456',
    address: 'Oficina Ejecutiva 222',
    city: 'Lima',
    postalCode: '15006',
    country: 'Perú',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'USR-011',
    name: 'Miguel',
    lastName: 'Ángel',
    email: 'm.angel@gmail.com',
    role: 'Cliente',
    joinedDate: '2026-03-02',
    status: 'Inactivo',
    phone: '+51 955 888 999',
    documentType: 'DNI',
    documentId: '01234567',
    address: 'Calle Olvidada 333',
    city: 'Callao',
    postalCode: '07001',
    country: 'Perú',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'USR-012',
    name: 'Lucía',
    lastName: 'Vargas',
    email: 'lucia.vargas@gmail.com',
    role: 'Cliente',
    joinedDate: '2026-04-18',
    status: 'Activo',
    phone: '+51 999 555 222',
    documentType: 'DNI',
    documentId: '12345670',
    address: 'Calle Activa 444',
    city: 'Lima',
    postalCode: '15007',
    country: 'Perú',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80'
  }
];

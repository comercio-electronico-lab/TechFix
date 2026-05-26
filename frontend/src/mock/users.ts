export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Técnico' | 'Cliente';
  joinedDate: string;
  status: 'Activo' | 'Inactivo';
}

export const mockUsers: User[] = [
  { id: 'USR-001', name: 'Marcos Rodriguez', email: 'm.rodriguez@techfix.com', role: 'Admin', joinedDate: '2024-01-10', status: 'Activo' },
  { id: 'USR-002', name: 'Laura Martinez', email: 'l.martinez@techfix.com', role: 'Técnico', joinedDate: '2024-03-15', status: 'Activo' },
  { id: 'USR-003', name: 'Juan Perez', email: 'juan.perez@gmail.com', role: 'Cliente', joinedDate: '2025-11-20', status: 'Activo' },
  { id: 'USR-004', name: 'Sofia Lopez', email: 's.lopez@techfix.com', role: 'Técnico', joinedDate: '2025-02-05', status: 'Inactivo' },
];

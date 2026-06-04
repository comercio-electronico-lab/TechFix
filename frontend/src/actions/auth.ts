'use server';

import { IUser, IAuthResponse } from '@/interfaces/domain';
import { initializeData, getUsers, setUsers } from './data';

export async function authenticate(email: string, _password?: string): Promise<IAuthResponse> {
  await initializeData();
  await new Promise(r => setTimeout(r, 400));
  const users = getUsers();
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!found) throw new Error('Credenciales inválidas');
  const user: IUser = {
    id: found.id,
    email: found.email,
    name: found.name,
    role: (found.role.toLowerCase() as 'admin' | 'tecnico' | 'cliente'),
    createdAt: found.joinedDate
  };
  return { user, token: `jwt-token-${user.id}` };
}

export async function register(name: string, email: string): Promise<IAuthResponse> {
  await initializeData();
  const users = getUsers();
  const newUser: IUser = { id: `USR-${Date.now()}`, email, name, role: 'cliente', createdAt: new Date().toISOString() };
  users.push({ ...newUser, role: 'Cliente', joinedDate: newUser.createdAt, status: 'Activo' } as any);
  return { user: newUser, token: `jwt-token-${newUser.id}` };
}

export async function getCurrentUser(token: string): Promise<IUser> {
  await initializeData();
  const users = getUsers();
  const userId = token.replace('jwt-token-', '');
  const found = users.find(u => u.id === userId);
  if (!found) throw new Error('Sesión expirada');
  return {
    id: found.id,
    email: found.email,
    name: found.name,
    role: (found.role.toLowerCase() as 'admin' | 'tecnico' | 'cliente'),
    createdAt: found.joinedDate
  };
}

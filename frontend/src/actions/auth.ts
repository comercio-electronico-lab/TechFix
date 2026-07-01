'use server';

import { IUser, IAuthResponse } from '@/interfaces/domain';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function authenticate(email: string, password?: string): Promise<IAuthResponse> {
  const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Credenciales inválidas');
  }

  const data = await response.json();
  const user: IUser = {
    id: data.usuario.id,
    email: data.usuario.email,
    nombre: data.usuario.nombre,
    role: (data.usuario.rol.toLowerCase() as 'admin' | 'tecnico' | 'cliente'),
    createdAt: new Date().toISOString(),
  };

  // Guardar token en cookies
  const cookieStore = await cookies();
  cookieStore.set('techfix_token', data.token, {
    httpOnly: false, // Permitir leer desde cliente si es necesario
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 día
    path: '/'
  });

  return { user, token: data.token };
}

export async function register(nombre: string, email: string, password?: string): Promise<IAuthResponse> {
  const login = email.split('@')[0] || `user_${Date.now()}`;
  
  const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nombre, email, login, password }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al registrar el usuario');
  }

  return authenticate(email, password);
}

export async function getCurrentUser(token?: string): Promise<IUser> {
  let activeToken = token;
  
  if (!activeToken) {
    const cookieStore = await cookies();
    activeToken = cookieStore.get('techfix_token')?.value;
  }

  if (!activeToken) {
    throw new Error('Sesión no encontrada');
  }

  const response = await fetch(`${BACKEND_URL}/api/user/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${activeToken}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Sesión expirada');
  }

  const data = await response.json();
  return {
    id: data.id,
    email: data.email,
    nombre: data.nombre,
    role: (data.rol.toLowerCase() as 'admin' | 'tecnico' | 'cliente'),
    createdAt: data.joined_date || new Date().toISOString(),
  };
}

export async function getAllUsers(): Promise<any[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('techfix_token')?.value;

    if (!token) {
      throw new Error('No autorizado (Token faltante)');
    }

    const response = await fetch(`${BACKEND_URL}/api/user/all`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Error al obtener lista de usuarios');
    }

    const data = await response.json();
    return data.map((u: any) => ({
      id: u.id,
      name: u.nombre,
      email: u.email,
      role: u.rol,
      joinedDate: u.joined_date ? new Date(u.joined_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      status: u.estado || 'Activo'
    }));
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return [];
  }
}

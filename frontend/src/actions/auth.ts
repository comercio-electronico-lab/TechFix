'use server';

import { IUser } from '@/interfaces/domain';
import { cookies } from 'next/headers';
import { getAuthToken, getOptionalAuthToken } from '@/lib/auth-token';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const TOKEN_COOKIE = 'techfix_token';

function normalizeRole(rol: string): 'admin' | 'tecnico' | 'cliente' {
  const r = rol?.toLowerCase() || '';
  if (r === 'admin') return 'admin';
  if (r === 'tecnico' || r === 'técnico') return 'tecnico';
  return 'cliente';
}

export async function authenticate(email: string, password?: string): Promise<IUser> {
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
    role: normalizeRole(data.usuario.rol),
    createdAt: new Date().toISOString(),
    teléfono: data.usuario.teléfono || data.usuario.telefono || '',
    dirección: data.usuario.dirección || data.usuario.direccion || '',
    ciudad: data.usuario.ciudad || '',
    documentId: data.usuario.documentId || '',
  };

  // El JWT vive únicamente en una cookie httpOnly: nunca se devuelve al
  // cliente, para que un script inyectado por XSS no pueda leerlo.
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE, data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 día
    path: '/'
  });

  return user;
}

export async function register(
  nombre: string,
  email: string,
  password?: string,
  teléfono?: string,
  dirección?: string,
  ciudad?: string,
  documentId?: string
): Promise<IUser> {
  const login = email.split('@')[0] || `user_${Date.now()}`;

  const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nombre,
      email,
      login,
      password,
      teléfono: teléfono || '',
      dirección: dirección || '',
      ciudad: ciudad || '',
      documentId: documentId || '',
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al registrar el usuario');
  }

  return authenticate(email, password);
}

export async function logoutAction(): Promise<void> {
  // El cliente no puede borrar una cookie httpOnly con document.cookie;
  // hay que hacerlo desde el servidor.
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
}

/**
 * Indica si existe una cookie de sesión, sin validarla contra el backend ni
 * lanzar si falta. Pensado para que el cliente decida si vale la pena llamar
 * a getCurrentUser() al arrancar, en vez de intentarlo siempre y descartar el
 * error esperado de "sin sesión" (que Next.js igual loguea en el servidor
 * aunque el llamador lo capture).
 */
export async function hasSessionAction(): Promise<boolean> {
  const token = await getOptionalAuthToken();
  return !!token;
}

export async function getCurrentUser(): Promise<IUser> {
  const token = await getAuthToken();

  const response = await fetch(`${BACKEND_URL}/api/user/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
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
    role: normalizeRole(data.rol),
    createdAt: data.joined_date || new Date().toISOString(),
    teléfono: data.teléfono || data.telefono || '',
    dirección: data.dirección || data.direccion || '',
    ciudad: data.ciudad || '',
    documentId: data.documentId || '',
  };
}

export async function getAllUsers(): Promise<any[]> {
  try {
    const token = await getAuthToken();

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

export async function updateUserRole(id: string, role: string): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${BACKEND_URL}/api/user/${id}/role`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rol: role }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Error al actualizar el rol');
    }

    return { success: true };
  } catch (e: any) {
    console.error(e);
    return { success: false, error: e.message };
  }
}

export async function updateUserStatus(id: string, status: string): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${BACKEND_URL}/api/user/${id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado: status }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Error al actualizar el estado');
    }

    return { success: true };
  } catch (e: any) {
    console.error(e);
    return { success: false, error: e.message };
  }
}

export async function deleteUser(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${BACKEND_URL}/api/user/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Error al eliminar el usuario');
    }

    return { success: true };
  } catch (e: any) {
    console.error(e);
    return { success: false, error: e.message };
  }
}

export async function updateProfileAction(profileData: {
  nombre: string;
  teléfono?: string;
  dirección?: string;
  ciudad?: string;
  documentId?: string;
}): Promise<IUser> {
  const token = await getAuthToken();
  const response = await fetch(`${BACKEND_URL}/api/user/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nombre: profileData.nombre,
      teléfono: profileData.teléfono || '',
      dirección: profileData.dirección || '',
      ciudad: profileData.ciudad || '',
      documentId: profileData.documentId || '',
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al actualizar el perfil');
  }

  const data = await response.json();
  return {
    id: data.id,
    email: data.email,
    nombre: data.nombre,
    role: normalizeRole(data.rol),
    createdAt: data.joined_date || new Date().toISOString(),
    teléfono: data.teléfono || data.telefono || '',
    dirección: data.dirección || data.direccion || '',
    ciudad: data.ciudad || '',
    documentId: data.documentId || '',
  };
}

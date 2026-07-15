import { cookies } from 'next/headers';

const TOKEN_COOKIE = 'techfix_token';

/**
 * Lee el JWT de la cookie httpOnly. Solo se puede llamar desde Server
 * Actions / Route Handlers (nunca desde el cliente, que no tiene acceso
 * a cookies httpOnly).
 */
export async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  if (!token) {
    throw new Error('No autorizado: sesión no encontrada');
  }
  return token;
}

/** Igual que getAuthToken pero sin lanzar si no hay sesión. */
export async function getOptionalAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value;
}

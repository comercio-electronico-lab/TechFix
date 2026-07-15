import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGet = vi.fn();
vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: mockGet }),
}));

const { getAuthToken, getOptionalAuthToken } = await import('./auth-token');

describe('getAuthToken', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('devuelve el token cuando la cookie existe', async () => {
    mockGet.mockReturnValue({ value: 'abc123' });
    await expect(getAuthToken()).resolves.toBe('abc123');
  });

  it('lanza un error cuando no hay sesión', async () => {
    mockGet.mockReturnValue(undefined);
    await expect(getAuthToken()).rejects.toThrow('No autorizado');
  });
});

describe('getOptionalAuthToken', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('devuelve el token cuando la cookie existe', async () => {
    mockGet.mockReturnValue({ value: 'abc123' });
    await expect(getOptionalAuthToken()).resolves.toBe('abc123');
  });

  it('devuelve undefined sin lanzar cuando no hay cookie', async () => {
    mockGet.mockReturnValue(undefined);
    await expect(getOptionalAuthToken()).resolves.toBeUndefined();
  });
});

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authenticate, register, getCurrentUser } from '@/app/actions';
import { IUser } from '@/interfaces/domain';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<IUser>;
  register: (name: string, email: string, password: string) => Promise<IUser>;
  logout: () => void;
  updateProfile: (name: string) => Promise<{ success: boolean; error?: string }>;
  error: string | null;
  setError: (err: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = useCallback(() => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('techfix_token');
      localStorage.removeItem('techfix_user');
    }
    setError(null);
  }, []);

  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const storedToken = localStorage.getItem('techfix_token');
        const storedUser = localStorage.getItem('techfix_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          try {
            const userData = await getCurrentUser(storedToken);
            setUser(userData);
            localStorage.setItem('techfix_user', JSON.stringify(userData));
          } catch (e) {
            console.error('Sesión inválida:', e);
            handleLogout();
          }
        }
      } catch (e) {
        console.error('Error cargando sesión:', e);
      } finally {
        setLoading(false);
      }
    }
    loadStoredAuth();
  }, [handleLogout]);

  const handleLogin = async (email: string, password: string): Promise<IUser> => {
    setError(null);
    try {
      const { user: userData, token: userToken } = await authenticate(email, password);
      setToken(userToken);
      setUser(userData);
      localStorage.setItem('techfix_token', userToken);
      localStorage.setItem('techfix_user', JSON.stringify(userData));
      return userData;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al iniciar sesión';
      setError(msg);
      throw e;
    }
  };

  const handleRegister = async (name: string, email: string, _password?: string): Promise<IUser> => {
    setError(null);
    try {
      const { user: userData, token: userToken } = await register(name, email);
      setToken(userToken);
      setUser(userData);
      localStorage.setItem('techfix_token', userToken);
      localStorage.setItem('techfix_user', JSON.stringify(userData));
      return userData;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al registrarse';
      setError(msg);
      throw e;
    }
  };

  const updateProfile = async (name: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'No autenticado' };
    const updatedUser = { ...user, name };
    setUser(updatedUser);
    localStorage.setItem('techfix_user', JSON.stringify(updatedUser));
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateProfile,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  return context;
}

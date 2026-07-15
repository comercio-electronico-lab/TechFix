'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authenticate, register, getCurrentUser, updateProfileAction, logoutAction } from '@/actions';
import { IUser } from '@/interfaces/domain';

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<IUser>;
  register: (
    name: string,
    email: string,
    password?: string,
    teléfono?: string,
    dirección?: string,
    ciudad?: string,
    documentId?: string
  ) => Promise<IUser>;
  logout: () => Promise<void>;
  updateProfile: (profileData: {
    nombre: string;
    teléfono?: string;
    dirección?: string;
    ciudad?: string;
    documentId?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  error: string | null;
  setError: (err: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = useCallback(async () => {
    setUser(null);
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('techfix_user');
    }
    // El JWT vive en una cookie httpOnly: solo el servidor puede borrarla.
    await logoutAction();
  }, []);

  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const storedUser = localStorage.getItem('techfix_user');
        if (storedUser) {
          // Render optimista mientras se valida la sesión contra el servidor.
          setUser(JSON.parse(storedUser));
        }

        try {
          const userData = await getCurrentUser();
          setUser(userData);
          localStorage.setItem('techfix_user', JSON.stringify(userData));
        } catch {
          if (storedUser) await handleLogout();
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
      const userData = await authenticate(email, password);
      setUser(userData);
      localStorage.setItem('techfix_user', JSON.stringify(userData));
      return userData;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al iniciar sesión';
      setError(msg);
      throw e;
    }
  };

  const handleRegister = async (
    name: string,
    email: string,
    password?: string,
    teléfono?: string,
    dirección?: string,
    ciudad?: string,
    documentId?: string
  ): Promise<IUser> => {
    setError(null);
    try {
      const userData = await register(
        name,
        email,
        password,
        teléfono,
        dirección,
        ciudad,
        documentId
      );
      setUser(userData);
      localStorage.setItem('techfix_user', JSON.stringify(userData));
      return userData;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al registrarse';
      setError(msg);
      throw e;
    }
  };

  const updateProfile = async (profileData: {
    nombre: string;
    teléfono?: string;
    dirección?: string;
    ciudad?: string;
    documentId?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'No autenticado' };
    try {
      const updatedUser = await updateProfileAction(profileData);
      setUser(updatedUser);
      localStorage.setItem('techfix_user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message || 'Error al actualizar el perfil' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
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

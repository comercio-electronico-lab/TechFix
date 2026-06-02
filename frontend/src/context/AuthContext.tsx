'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAction, registerAction, meAction } from '@/app/actions';

interface User {
  id: string;
  nombre: string;
  login: string;
  email: string;
  rol: string;
  estado: string;
  joined_date: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (nombre: string, login: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  updateProfile: (nombre: string, login: string) => Promise<{ success: boolean; error?: string }>;
  error: string | null;
  setError: (err: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar auth desde localStorage
  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const storedToken = localStorage.getItem('techfix_token');
        const storedUser = localStorage.getItem('techfix_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verificar si el token sigue siendo válido con Server Action
          try {
            const userData = await meAction(storedToken);
            setUser(userData);
            localStorage.setItem('techfix_user', JSON.stringify(userData));
          } catch (e) {
            console.error('Error al verificar sesión:', e);
            handleLogout();
          }
        }
      } catch (e) {
        console.error('Error al cargar sesión desde almacenamiento local:', e);
      } finally {
        setLoading(false);
      }
    }

    loadStoredAuth();
  }, []);

  const handleLogin = async (email: string, password: string): Promise<User> => {
    setError(null);
    try {
      const { user: userData, token: userToken } = await loginAction(email, password);

      setToken(userToken);
      setUser(userData);
      localStorage.setItem('techfix_token', userToken);
      localStorage.setItem('techfix_user', JSON.stringify(userData));

      return userData;
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  };

  const handleRegister = async (
    nombre: string,
    login: string,
    email: string,
    password: string
  ): Promise<User> => {
    setError(null);
    try {
      const { user: userData, token: userToken } = await registerAction(nombre, login, email);

      setToken(userToken);
      setUser(userData);
      localStorage.setItem('techfix_token', userToken);
      localStorage.setItem('techfix_user', JSON.stringify(userData));

      return userData;
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('techfix_token');
    localStorage.removeItem('techfix_user');
    setError(null);
  };

  const updateProfile = async (nombre: string, login: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'No has iniciado sesión' };
    const updatedUser = { ...user, nombre, login };
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
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

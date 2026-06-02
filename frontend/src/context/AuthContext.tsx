'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
  error: string | null;
  setError: (err: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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

          // Verificar si el token sigue siendo válido
          try {
            const res = await fetch(`${API_URL}/api/auth/me`, {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            });

            if (res.ok) {
              const userData = await res.json();
              setUser(userData);
              localStorage.setItem('techfix_user', JSON.stringify(userData));
            } else {
              // Token vencido o inválido
              handleLogout();
            }
          } catch (e) {
            console.error('Error al verificar sesión con el servidor:', e);
            // Si hay un error de red, mantenemos la sesión local por ahora
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
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Credenciales de acceso incorrectas');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('techfix_token', data.token);
      localStorage.setItem('techfix_user', JSON.stringify(data.user));

      return data.user;
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
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, login, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al crear la cuenta. Por favor intente de nuevo.');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('techfix_token', data.token);
      localStorage.setItem('techfix_user', JSON.stringify(data.user));

      return data.user;
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

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  nombre: string;
  email: string;
  login: string;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (nombre: string, email: string, login: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (nombre: string, login: string) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // Cargar sesión del localStorage al montar el componente
  useEffect(() => {
    const savedToken = localStorage.getItem('techfix_token');
    const savedUser = localStorage.getItem('techfix_user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing saved user", e);
        // Limpiar en caso de datos corruptos
        localStorage.removeItem('techfix_token');
        localStorage.removeItem('techfix_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Credenciales incorrectas' };
      }

      setToken(data.token);
      setUser(data.usuario);
      localStorage.setItem('techfix_token', data.token);
      localStorage.setItem('techfix_user', JSON.stringify(data.usuario));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'No se pudo conectar al servidor de la API' };
    }
  };

  const register = async (nombre: string, email: string, login: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, login, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Error al registrarse' };
      }

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'No se pudo conectar al servidor de la API' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('techfix_token');
    localStorage.removeItem('techfix_user');
  };

  const updateProfile = async (nombre: string, login: string) => {
    if (!token) return { success: false, error: 'No has iniciado sesión' };
    
    try {
      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, login }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Error al actualizar el perfil' };
      }

      // El backend retorna el objeto models.Usuario. Mapeamos a nuestro User struct
      const updatedUser: User = {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        login: data.login,
        rol: data.rol
      };

      setUser(updatedUser);
      localStorage.setItem('techfix_user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'No se pudo conectar al servidor de la API' };
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

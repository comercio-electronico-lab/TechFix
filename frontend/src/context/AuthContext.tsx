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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (nombre: string, email: string, login: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (nombre: string, login: string) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Users for simulation
const MOCK_USERS: User[] = [
  { id: 'USR-001', nombre: 'Marcos Rodriguez', email: 'admin@techfix.com', login: 'admin', rol: 'Admin' },
  { id: 'USR-002', nombre: 'Laura Martinez', email: 'tecnico@techfix.com', login: 'tecnico', rol: 'Técnico' },
  { id: 'USR-003', nombre: 'Juan Perez', email: 'juan.perez@gmail.com', login: 'juanperez', rol: 'Cliente' },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
        localStorage.removeItem('techfix_token');
        localStorage.removeItem('techfix_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simular retraso de red
    return new Promise<{ success: boolean; error?: string; user?: User }>((resolve) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(u => u.email === email);
        
        // Simular que cualquier contraseña funciona para el mock si el usuario existe
        if (foundUser && password.length >= 4) {
          const mockToken = `mock-jwt-token-${foundUser.id}`;
          setToken(mockToken);
          setUser(foundUser);
          localStorage.setItem('techfix_token', mockToken);
          localStorage.setItem('techfix_user', JSON.stringify(foundUser));
          resolve({ success: true, user: foundUser });
        } else {
          resolve({ success: false, error: 'Credenciales incorrectas (Usa admin@techfix.com, tecnico@techfix.com o juan.perez@gmail.com)' });
        }
      }, 1000);
    });
  };

  const register = async (nombre: string, email: string, login: string, password: string) => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      setTimeout(() => {
        // En un mock, siempre aceptamos el registro
        console.log("Mock Register:", { nombre, email, login, password });
        resolve({ success: true });
      }, 1000);
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('techfix_token');
    localStorage.removeItem('techfix_user');
  };

  const updateProfile = async (nombre: string, login: string) => {
    if (!user) return { success: false, error: 'No has iniciado sesión' };
    
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      setTimeout(() => {
        const updatedUser = { ...user, nombre, login };
        setUser(updatedUser);
        localStorage.setItem('techfix_user', JSON.stringify(updatedUser));
        resolve({ success: true });
      }, 800);
    });
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

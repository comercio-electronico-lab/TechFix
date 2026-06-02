"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const RegisterForm = () => {
  const router = useRouter();
  const { register } = useAuth();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    if (!nombre || !email || !loginUsername || !password) {
      setErrorMsg('Todos los campos son requeridos');
      setSubmitting(false);
      return;
    }
    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres');
      setSubmitting(false);
      return;
    }

    try {
      await register(nombre, loginUsername, email, password);
      setSuccessMsg('¡Registro exitoso! Ya puedes iniciar sesión.');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (e: any) {
      setErrorMsg(e.message || 'Ocurrió un error en el registro');
    }

    setSubmitting(false);
  };

  return (
    <>
      {errorMsg && (
        <div className="bg-error-container/20 border border-error/30 text-error rounded-xl p-4 mb-6 text-sm">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-secondary-container/20 border border-secondary/30 text-secondary dark:text-secondary-container rounded-xl p-4 mb-6 text-sm">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nombre Completo"
          placeholder="Juan Pérez García"
          icon={User}
          iconPosition="left"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <Input
          label="Nombre de Usuario (Login)"
          placeholder="juan_perez"
          icon={User}
          iconPosition="left"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
        />

        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="ejemplo@correo.com"
          icon={Mail}
          iconPosition="left"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          iconPosition="left"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          isLoading={submitting}
          icon={ArrowRight}
          className="w-full rounded-xl py-3.5 mt-2"
        >
          Registrarme
        </Button>
      </form>
    </>
  );
};

export default RegisterForm;

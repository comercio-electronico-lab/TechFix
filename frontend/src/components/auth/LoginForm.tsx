"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    if (!email || !password) {
      setErrorMsg('Por favor completa todos los campos');
      setSubmitting(false);
      return;
    }

    try {
      const user = await login(email, password);
      if (user.rol === 'Admin') {
        router.push('/admin/dashboard');
      } else if (user.rol === 'Técnico') {
        router.push('/tecnico/dashboard');
      } else {
        router.push('/cliente/dashboard');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Correo o contraseña incorrectos');
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
          Iniciar Sesión
        </Button>
      </form>
    </>
  );
};

export default LoginForm;

'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { ILoginFormProps } from '@/interfaces/components';
import { Button, Input, Icon } from '@/components/ui';

export const LoginForm = ({ onSuccess }: ILoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Logging in with:', { email, password });
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <Input
        label="Correo Electrónico"
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        leftIcon={<Icon name="Mail" size={18} />}
        required
      />
      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        leftIcon={<Icon name="Lock" size={18} />}
        required
      />
      <Button 
        type="submit" 
        className="w-full" 
        isLoading={isLoading}
      >
        Iniciar Sesión
      </Button>
    </form>
  );
};

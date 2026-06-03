"use client";

import React from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface ProfileFormProps {
  nombre: string;
  teléfono: string;
  dirección: string;
  ciudad: string;
  documentId: string;
  email: string;
  submitting: boolean;
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProfileForm = ({
  nombre,
  teléfono,
  dirección,
  ciudad,
  documentId,
  email,
  submitting,
  onChange,
  onSubmit
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-xl">
      <Input
        label="Nombre Completo"
        type="text"
        value={nombre}
        onChange={(e) => onChange('nombre', e.target.value)}
        placeholder="Tu nombre completo"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Documento"
          type="text"
          value={documentId}
          onChange={(e) => onChange('documentId', e.target.value)}
          placeholder="12345678"
        />
        <Input
          label="Teléfono"
          type="tel"
          value={teléfono}
          onChange={(e) => onChange('teléfono', e.target.value)}
          placeholder="+51 999 888 777"
        />
      </div>

      <Input
        label="Dirección"
        type="text"
        value={dirección}
        onChange={(e) => onChange('dirección', e.target.value)}
        placeholder="Av. Principal 123"
      />

      <Input
        label="Ciudad"
        type="text"
        value={ciudad}
        onChange={(e) => onChange('ciudad', e.target.value)}
        placeholder="Lima"
      />

      <div>
        <Input
          label="Correo Electrónico"
          type="email"
          disabled
          value={email}
          className="cursor-not-allowed opacity-80"
        />
        <span className="text-[11px] text-on-surface-variant/70 mt-1 block">
          El correo electrónico no puede ser modificado por seguridad.
        </span>
      </div>

      <Button
        type="submit"
        isLoading={submitting}
        variant="primary"
        className="w-full sm:w-auto"
      >
        Guardar Cambios
      </Button>
    </form>
  );
};

export default ProfileForm;

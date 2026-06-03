"use client";

import React from 'react';
import ProfileHeader from './profile/ProfileHeader';
import ProfileMessages from './profile/ProfileMessages';
import ProfileForm from './profile/ProfileForm';

interface ProfileSectionProps {
  nombre: string;
  teléfono: string;
  dirección: string;
  ciudad: string;
  documentId: string;
  email: string;
  success: string;
  error: string;
  submitting: boolean;
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProfileSection = ({
  nombre,
  teléfono,
  dirección,
  ciudad,
  documentId,
  email,
  success,
  error,
  submitting,
  onChange,
  onSubmit
}: ProfileSectionProps) => {
  return (
    <div className="bg-white/70 dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 p-8 rounded-3xl shadow-md space-y-6">
      <ProfileHeader />

      <ProfileMessages success={success} error={error} />

      <ProfileForm
        nombre={nombre}
        teléfono={teléfono}
        dirección={dirección}
        ciudad={ciudad}
        documentId={documentId}
        email={email}
        submitting={submitting}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ProfileSection;

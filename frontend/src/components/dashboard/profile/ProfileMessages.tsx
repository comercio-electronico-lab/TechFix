"use client";

import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';

interface ProfileMessagesProps {
  success?: string;
  error?: string;
}

const ProfileMessages = ({ success, error }: ProfileMessagesProps) => {
  return (
    <>
      {success && (
        <div className="bg-secondary-container/20 border border-secondary/30 text-secondary dark:text-secondary-container rounded-xl p-4 mb-6 text-sm flex items-center gap-2">
          <Check className="w-5 h-5 shrink-0" />
          {success}
        </div>
      )}

      {error && (
        <div className="bg-error-container/20 border border-error/30 text-error rounded-xl p-4 mb-6 text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}
    </>
  );
};

export default ProfileMessages;

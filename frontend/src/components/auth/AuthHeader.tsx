import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AuthHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex p-3 bg-secondary-container/10 rounded-2xl mb-4 border border-secondary-container/20">
        <Icon className="w-8 h-8 text-secondary" />
      </div>
      <h2 className="text-primary dark:text-white font-h2 mb-2">
        {title}
      </h2>
      <p className="text-sm text-on-surface-variant/80 dark:text-on-surface-variant">
        {description}
      </p>
    </div>
  );
};

export default AuthHeader;

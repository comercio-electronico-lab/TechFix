import React from 'react';

interface TeamMemberCardProps {
  name: string;
  role: string;
  initials: string;
  bgGradient?: string;
  bio: string;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  name,
  role,
  initials,
  bgGradient = 'bg-gradient-to-br from-sky-400 to-indigo-600',
  bio
}) => {
  return (
    <div className="group bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-3xl p-8 hover:-translate-y-1 transition-all duration-300 shadow-md flex flex-col items-center text-center space-y-6">
      {/* Initials Avatar Showcase */}
      <div className={`w-20 h-20 rounded-full ${bgGradient} flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover:scale-105 transition-transform duration-300`}>
        {memberInitials(initials || name)}
      </div>

      <div className="space-y-2 w-full">
        <h3 className="text-lg font-bold text-on-surface dark:text-white">
          {name}
        </h3>
        <span className="block text-xs font-semibold uppercase tracking-wider text-sky-500 dark:text-sky-400">
          {role}
        </span>
        <p className="text-xs md:text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed pt-2">
          {bio}
        </p>
      </div>
    </div>
  );
};

// Helper to resolve initials safely if not explicitly provided
function memberInitials(input: string): string {
  if (input.length <= 2) return input.toUpperCase();
  const parts = input.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return input.slice(0, 2).toUpperCase();
}

export default TeamMemberCard;

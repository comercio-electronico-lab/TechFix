import React from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle } from 'lucide-react';

const SecurityBadges = () => {
  const badges = [
    { icon: ShieldCheck, text: 'ENCRIPTACIÓN SSL 256-BIT' },
    { icon: CheckCircle, text: 'CUMPLIMIENTO PCI-DSS' },
    { icon: ShieldAlert, text: 'PROTECCIÓN CONTRA FRAUDE' },
  ];

  return (
    <div className="mt-stack-lg flex flex-wrap justify-center items-center gap-stack-lg opacity-60 grayscale hover:grayscale-0 transition-all">
      {badges.map((badge, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <badge.icon className="w-8 h-8" />
          <span className="text-[10px] font-bold uppercase tracking-widest">{badge.text}</span>
        </div>
      ))}
    </div>
  );
};

export default SecurityBadges;

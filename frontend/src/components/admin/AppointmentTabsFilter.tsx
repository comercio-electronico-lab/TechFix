import React from 'react';

interface AppointmentTabsFilterProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  pendingCount?: number;
}

export default function AppointmentTabsFilter({ 
  tabs, 
  activeTab, 
  onTabChange, 
  pendingCount = 4 
}: AppointmentTabsFilterProps) {
  return (
    <div className="flex gap-6 border-b border-outline-variant/10">
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <button 
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`pb-4 text-sm font-bold transition-all relative cursor-pointer ${
              isActive ? 'text-secondary border-b-2 border-secondary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {tab}
            {tab === 'Pendientes' && pendingCount > 0 && (
              <span className="ml-2 bg-error text-white text-[10px] px-1.5 rounded-full font-mono font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

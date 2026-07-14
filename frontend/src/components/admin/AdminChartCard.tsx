"use client";

import React from 'react';

interface AdminChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
}

const AdminChartCard: React.FC<AdminChartCardProps> = ({ title, subtitle, children, extra }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10 h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold text-primary">{title}</h3>
          {subtitle && <p className="text-sm text-on-surface-variant mt-1">{subtitle}</p>}
        </div>
        {extra && <div>{extra}</div>}
      </div>
      <div className="h-80 w-full">
        {children}
      </div>
    </div>
  );
};

export default AdminChartCard;

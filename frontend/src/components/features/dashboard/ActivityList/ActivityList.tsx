'use client';

import React from 'react';
import { IActivityListProps } from '@/interfaces/components';
import { Card, Icon, Badge } from '@/components/ui';

export const ActivityList = ({ activities }: IActivityListProps) => {
  return (
    <Card title="Actividad Reciente">
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 items-start relative pb-6 last:pb-0">
            <div className={`p-2 rounded-full border-2 ${
              activity.type === 'success' ? 'bg-green-50 border-green-200 text-green-600' :
              activity.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-600' :
              'bg-blue-50 border-blue-200 text-blue-600'
            }`}>
              <Icon name={
                activity.type === 'success' ? 'Check' :
                activity.type === 'warning' ? 'AlertTriangle' : 'Info'
              } size={16} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="font-semibold text-sm">{activity.user}</p>
                <span className="text-xs text-[var(--color-muted)]">{activity.timestamp}</span>
              </div>
              <p className="text-sm text-[var(--color-muted)] mt-0.5">{activity.action}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

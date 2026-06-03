"use client";

import React from 'react';
import DeviceCard from '@/components/cards/DeviceCard';
import { Device } from '@/mock/devices';

interface DevicesListProps {
  devices: Device[];
  onEdit: (device: Device) => void;
  onDelete: (id: string) => void;
}

const DevicesList = ({ devices, onEdit, onDelete }: DevicesListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {devices.map((device) => (
        <DeviceCard
          key={device.id}
          device={device}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DevicesList;

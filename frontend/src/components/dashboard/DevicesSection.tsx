"use client";

import React from 'react';
import DevicesHeader from './devices/DevicesHeader';
import DevicesLoading from './devices/DevicesLoading';
import DevicesEmpty from './devices/DevicesEmpty';
import DevicesList from './devices/DevicesList';
import { Device } from '@/mock/devices';

interface DevicesSectionProps {
  devices: Device[];
  loading: boolean;
  onCreateClick: () => void;
  onEditClick: (device: Device) => void;
  onDeleteClick: (id: string) => void;
}

const DevicesSection = ({
  devices,
  loading,
  onCreateClick,
  onEditClick,
  onDeleteClick
}: DevicesSectionProps) => {
  return (
    <div className="space-y-6">
      <DevicesHeader onCreateClick={onCreateClick} />

      {loading && <DevicesLoading />}

      {!loading && devices.length === 0 && <DevicesEmpty onCreateClick={onCreateClick} />}

      {!loading && devices.length > 0 && (
        <DevicesList devices={devices} onEdit={onEditClick} onDelete={onDeleteClick} />
      )}
    </div>
  );
};

export default DevicesSection;

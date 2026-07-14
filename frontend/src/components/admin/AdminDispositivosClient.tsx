"use client";

import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import { Input } from '@/components/ui';
import { getAllDevices } from '@/actions';
import { Search, Tablet, Laptop, Smartphone, Monitor, Calendar, User, ShieldAlert } from 'lucide-react';

interface Device {
  id: string;
  brand: string;
  model: string;
  serialNumber: string;
  deviceType: string;
  purchaseDate: string;
  ownerName: string;
  ownerEmail: string;
}

export default function AdminDispositivosClient() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');

  async function loadDevices() {
    setLoading(true);
    try {
      const data = await getAllDevices();
      setDevices(data as Device[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDevices();
  }, []);

  const getDeviceIcon = (type: string) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('laptop')) return <Laptop className="w-5 h-5 text-secondary" />;
    if (t.includes('tablet')) return <Tablet className="w-5 h-5 text-accent" />;
    if (t.includes('monitor') || t.includes('pc') || t.includes('desktop')) return <Monitor className="w-5 h-5 text-tertiary" />;
    return <Smartphone className="w-5 h-5 text-primary" />;
  };

  const columns = [
    {
      header: 'Equipo / Dispositivo',
      key: 'model',
      render: (item: Device) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 border rounded-lg flex items-center justify-center">
            {getDeviceIcon(item.deviceType)}
          </div>
          <div>
            <p className="font-bold text-primary">{item.brand} {item.model}</p>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-wider">
              {item.deviceType || 'Dispositivo'}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Número de Serie',
      key: 'serialNumber',
      render: (item: Device) => (
        <code className="text-xs font-mono font-bold bg-slate-100 px-2 py-1 rounded text-primary">
          {item.serialNumber}
        </code>
      )
    },
    {
      header: 'Propietario',
      key: 'ownerName',
      render: (item: Device) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-on-surface flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 opacity-50" /> {item.ownerName}
          </span>
          <span className="text-xs text-on-surface-variant/80">{item.ownerEmail}</span>
        </div>
      )
    },
    {
      header: 'Fecha Registro',
      key: 'purchaseDate',
      render: (item: Device) => (
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <Calendar className="w-4 h-4 opacity-50" />
          {item.purchaseDate || 'Sin fecha'}
        </div>
      )
    }
  ];

  const filteredDevices = devices.filter(d => {
    const matchesSearch = d.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'Todos' || d.deviceType?.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-stack-lg">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-primary text-[32px] font-bold">Equipos Registrados</h1>
          <p className="text-on-surface-variant mt-2">Monitorea todos los dispositivos ingresados por los clientes en la plataforma.</p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="p-6 bg-white rounded-xl border border-outline-variant/20 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/5 rounded-lg text-primary">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface-variant">Smartphones</p>
            <p className="text-2xl font-bold text-primary">
              {devices.filter(d => d.deviceType?.toLowerCase() === 'smartphone').length}
            </p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl border border-outline-variant/20 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-secondary/5 rounded-lg text-secondary">
            <Laptop className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface-variant">Laptops</p>
            <p className="text-2xl font-bold text-secondary">
              {devices.filter(d => d.deviceType?.toLowerCase() === 'laptop').length}
            </p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl border border-outline-variant/20 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-accent/5 rounded-lg text-accent">
            <Tablet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface-variant">Otros Equipos</p>
            <p className="text-2xl font-bold text-accent">
              {devices.filter(d => d.deviceType?.toLowerCase() !== 'smartphone' && d.deviceType?.toLowerCase() !== 'laptop').length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10 bg-surface-container-lowest">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input 
                leftIcon={<Search className="w-4 h-4" />} 
                placeholder="Buscar por marca, modelo, serie o propietario..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full bg-white border border-outline-variant/55 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary font-bold text-sm text-primary"
              >
                <option value="Todos">Todos los tipos</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Laptop">Laptop</option>
                <option value="Tablet">Tablet</option>
                <option value="PC">PC</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-2">
          {loading ? (
            <div className="py-12 text-center text-sm font-semibold text-on-surface-variant/60">
              Cargando lista de equipos...
            </div>
          ) : devices.length === 0 ? (
            <div className="py-12 text-center text-sm text-on-surface-variant/60 flex flex-col items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-on-surface-variant/40" />
              No hay dispositivos registrados en el sistema.
            </div>
          ) : (
            <Table columns={columns} data={filteredDevices} />
          )}
        </div>
      </div>
    </div>
  );
}

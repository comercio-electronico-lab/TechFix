"use client";

import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Device {
  id: string;
  brand: string;
  model: string;
  serial_number: string;
  device_type: string;
  purchase_date: string | null;
}

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    brand: string;
    model: string;
    serial_number: string;
    device_type: string;
    purchase_date: string;
  }) => Promise<void>;
  editingDevice: Device | null;
  error: string;
  isLoading: boolean;
}

const DeviceModal: React.FC<DeviceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingDevice,
  error,
  isLoading
}) => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [deviceType, setDeviceType] = useState('Laptop');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [validationError, setValidationError] = useState('');

  // Sync with editing device
  useEffect(() => {
    if (editingDevice) {
      setBrand(editingDevice.brand);
      setModel(editingDevice.model);
      setSerialNumber(editingDevice.serial_number);
      setDeviceType(editingDevice.device_type);
      if (editingDevice.purchase_date) {
        setPurchaseDate(editingDevice.purchase_date.substring(0, 10));
      } else {
        setPurchaseDate('');
      }
    } else {
      setBrand('');
      setModel('');
      setSerialNumber('');
      setDeviceType('Laptop');
      setPurchaseDate('');
    }
    setValidationError('');
  }, [editingDevice, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!brand || !model || !serialNumber || !deviceType) {
      setValidationError('Todos los campos excepto la fecha son obligatorios');
      return;
    }

    await onSave({
      brand,
      model,
      serial_number: serialNumber,
      device_type: deviceType,
      purchase_date: purchaseDate
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-outline/20 p-8 rounded-2xl shadow-2xl relative">
        <h3 className="text-primary dark:text-white mb-6 font-h3 font-bold">
          {editingDevice ? 'Editar Dispositivo' : 'Registrar Nuevo Equipo'}
        </h3>

        {(error || validationError) && (
          <div className="bg-error-container/20 border border-error/30 text-error rounded-xl p-4 mb-6 text-sm flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{validationError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-on-surface-variant">
                Marca
              </label>
              <input
                type="text"
                required
                className="w-full bg-white dark:bg-slate-950 border border-outline-variant/50 dark:border-outline/20 rounded-xl px-4 py-3 text-on-background focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all placeholder:text-on-surface-variant/40"
                placeholder="Ej. Apple, Asus, Samsung"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-on-surface-variant">
                Modelo
              </label>
              <input
                type="text"
                required
                className="w-full bg-white dark:bg-slate-950 border border-outline-variant/50 dark:border-outline/20 rounded-xl px-4 py-3 text-on-background focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all placeholder:text-on-surface-variant/40"
                placeholder="Ej. MacBook Pro M2, ROG Strix"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-on-surface-variant">
                Tipo de Equipo
              </label>
              <select
                className="w-full bg-white dark:bg-slate-950 border border-outline-variant/50 dark:border-outline/20 rounded-xl px-4 py-3 text-on-background focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all cursor-pointer"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
              >
                <option value="Laptop">Laptop</option>
                <option value="Desktop">Computadora de Escritorio (PC)</option>
                <option value="Smartphone">Smartphone / Celular</option>
                <option value="Tablet">Tablet</option>
                <option value="Console">Consola de Videojuegos</option>
                <option value="Other">Otro / Componente</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-on-surface-variant">
                Número de Serie (S/N)
              </label>
              <input
                type="text"
                required
                className="w-full bg-white dark:bg-slate-950 border border-outline-variant/50 dark:border-outline/20 rounded-xl px-4 py-3 text-on-background focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all placeholder:text-on-surface-variant/40"
                placeholder="S/N Único del equipo"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-on-surface-variant">
              Fecha de Compra (Opcional)
            </label>
            <input
              type="date"
              className="w-full bg-white dark:bg-slate-950 border border-outline-variant/50 dark:border-outline/20 rounded-xl px-4 py-3 text-on-background focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all cursor-pointer"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/10 dark:border-outline/10 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 border border-outline-variant/40 hover:bg-surface-container-low dark:hover:bg-white/5 font-bold rounded-xl transition-all cursor-pointer text-on-surface-variant animate-pulse-subtle"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-secondary hover:bg-secondary/95 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Guardar Equipo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceModal;

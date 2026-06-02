'use client';

import React from 'react';
import Link from 'next/link';
import { Edit2, Wrench, ArrowUpRight, Plus } from 'lucide-react';
import { CustomerDevice } from '@/types';

interface DeviceCardProps {
  device: CustomerDevice;
}

function DeviceCard({ device }: DeviceCardProps) {
  const isActiveWarranty = device.status === 'Active Warranty';

  return (
    <div className="group flex flex-col bg-surface dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-850 rounded-xl overflow-hidden hover:border-primary dark:hover:border-sky-500 hover:shadow-md transition-all duration-300 relative cursor-default">

      {/* Imagen */}
      <div className="h-48 bg-surface-container-lowest dark:bg-slate-950/40 border-b border-outline-variant/20 dark:border-slate-850 p-4 flex items-center justify-center relative">
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button
            onClick={(e) => { e.stopPropagation(); alert('Edit device mock action...'); }}
            className="w-8 h-8 rounded-full bg-surface dark:bg-slate-800 flex items-center justify-center text-on-surface-variant hover:text-primary dark:hover:text-sky-400 hover:bg-primary/10 dark:hover:bg-sky-500/10 transition-colors border border-outline-variant/30 cursor-pointer"
            title="Edit Device"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {device.inService && (
          <div className="absolute top-3 left-3 z-20">
            <span className="px-2.5 py-1 bg-tertiary-container/10 dark:bg-amber-950/30 text-tertiary-container dark:text-amber-400 font-semibold text-[10px] rounded-xl flex items-center gap-1 border border-tertiary-container/30 dark:border-amber-900/30 uppercase tracking-wider">
              <Wrench className="w-3 h-3 text-amber-500 shrink-0" /> In Service
            </span>
          </div>
        )}

        <img
          src={device.image}
          alt={device.model}
          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:filter dark:brightness-95 select-none transition-transform group-hover:scale-[1.02] duration-350"
        />
      </div>

      {/* Especificaciones */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="text-[10px] font-bold text-on-surface-variant/60 dark:text-slate-500 uppercase tracking-wider">{device.brand}</span>
            <h3 className="font-bold text-sm text-on-surface dark:text-slate-200 mt-0.5">{device.model}</h3>
          </div>
          <span className="px-2 py-0.5 bg-surface-container-high dark:bg-slate-800 text-on-surface dark:text-slate-350 font-bold text-[9px] rounded uppercase tracking-wider shrink-0 border border-outline-variant/10">
            {device.specs}
          </span>
        </div>

        <div className="space-y-1.5 mt-auto pt-2 border-t border-outline-variant/10 dark:border-slate-850/50">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-on-surface-variant/75 dark:text-slate-450">Serial Number</span>
            <span className="font-bold text-on-surface dark:text-slate-350 font-mono select-all text-xs">{device.serialNumber}</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-on-surface-variant/75 dark:text-slate-450">Purchase Date</span>
            <span className="font-semibold text-on-surface dark:text-slate-350">{device.purchaseDate}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] pt-1">
            <span className="text-on-surface-variant/75 dark:text-slate-450">Status</span>
            {isActiveWarranty ? (
              <span className="flex items-center gap-1 text-primary dark:text-sky-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-sky-450 inline-block animate-pulse" />
                Active Warranty
              </span>
            ) : (
              <span className="flex items-center gap-1 text-on-surface-variant/60 dark:text-slate-500 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-650 inline-block" />
                Out of Warranty
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="p-4 bg-surface-container-low dark:bg-slate-900/40 border-t border-outline-variant/10 dark:border-slate-850 flex gap-3">
        {device.inService ? (
          <Link
            href={`/reparaciones/seguimiento?ticket=TFX-8924-M&brand=${device.brand}&device=${device.model}&specs=${device.specs}&serial=${device.serialNumber}`}
            className="flex-grow"
          >
            <button className="w-full py-2 bg-surface-container-high hover:bg-surface-container-highest dark:bg-slate-800 dark:hover:bg-slate-750 text-on-surface dark:text-slate-200 border border-outline-variant/60 dark:border-slate-750 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm">
              View Status <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        ) : (
          <Link href="/reparaciones" className="flex-grow">
            <button className="w-full py-2 bg-transparent border border-primary dark:border-sky-500 text-primary dark:text-sky-400 hover:bg-primary/5 dark:hover:bg-sky-500/10 rounded-lg text-xs font-semibold cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5">
              Request Repair <Wrench className="w-3.5 h-3.5" />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

/** ─── Devices Tab ──────────────────────────────────────────── */
interface DevicesTabProps {
  devices: CustomerDevice[];
  onAddDevice: () => void;
}

export default function DevicesTab({ devices, onAddDevice }: DevicesTabProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {devices.map((device) => (
        <DeviceCard key={device.id} device={device} />
      ))}

      {/* Add device placeholder card */}
      <button
        onClick={onAddDevice}
        className="group flex flex-col items-center justify-center bg-surface-container-lowest dark:bg-slate-900 border-2 border-dashed border-outline-variant/60 dark:border-slate-800 hover:border-primary dark:hover:border-sky-500 hover:bg-primary/5 dark:hover:bg-sky-500/5 transition-all duration-300 rounded-xl min-h-[390px] p-6 text-center cursor-pointer"
      >
        <div className="w-14 h-14 rounded-full bg-surface dark:bg-slate-950 flex items-center justify-center mb-4 text-primary dark:text-sky-400 group-hover:scale-110 transition-transform border border-outline-variant/10">
          <Plus className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-sm text-on-surface dark:text-slate-200 group-hover:text-primary dark:group-hover:text-sky-400 transition-colors">
          Register Hardware
        </h3>
        <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-2 max-w-xs leading-normal">
          Add a new device to your account to track warranty and request services.
        </p>
      </button>
    </div>
  );
}

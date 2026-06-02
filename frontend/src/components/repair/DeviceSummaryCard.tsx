import React from 'react';

interface DeviceSummaryCardProps {
  deviceModel: string;
  deviceSpecs: string;
  serialNumber: string;
}

export default function DeviceSummaryCard({ deviceModel, deviceSpecs, serialNumber }: DeviceSummaryCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all duration-300">
      <div className="h-40 bg-slate-50 dark:bg-slate-950/60 relative w-full overflow-hidden border-b border-outline-variant/30 dark:border-slate-850">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-200/25 dark:from-slate-950/30 to-transparent z-10"></div>
        <img 
          alt="Dispositivo en Taller" 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4ZpBupfXu7VTPUUiFwAV5yPa_W81Zh7-t0T8CD0tRbZa5FL9F6kZE5gWjg22V-2EiGKycoTSTN3wT2c4EZcs0mXcIG1gJrv8Gyvk0qnvekQ4KKyt5Kd554jlvNiZSQkf-eCW76YBaxeSFeuVDiGwYIOxcCLKXKrU3u5HKTiuSk-VSsUTd9g8ZZ-oXBWsGKhszo-mDcWoqIMc9vC74kzfkUOsUvJoduI6DHy-l8u_zLg8h2hiiHJjJmla74Eo95yYvs3ftwmC80Nwu" 
        />
      </div>
      <div className="p-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-outline dark:text-slate-500 block mb-1">
          INFORMACIÓN DEL EQUIPO
        </span>
        <h3 className="font-bold text-lg text-on-surface dark:text-slate-200">
          {deviceModel}
        </h3>
        <p className="text-xs text-on-surface-variant dark:text-slate-450 mt-0.5">
          {deviceSpecs}
        </p>
        
        <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/10 dark:border-slate-800 pt-4 mt-4">
          <div>
            <span className="text-[10px] font-bold text-outline dark:text-slate-500 uppercase tracking-wide block mb-0.5">Nº de Serie</span>
            <span className="font-mono text-xs font-semibold text-on-surface dark:text-slate-300 select-all block">
              {serialNumber}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-outline dark:text-slate-500 uppercase tracking-wide block mb-0.5">Estado Estético</span>
            <span className="text-xs font-semibold text-on-surface dark:text-slate-300 block">
              Bueno (Detalles Leves)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

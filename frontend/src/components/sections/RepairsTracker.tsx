'use client';

import React, { useState } from 'react';
import { Search, SearchCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';

import Container from '../ui/Container';

const RepairsTracker = () => {
  const router = useRouter();
  const [ticketSearchId, setTicketSearchId] = useState('');

  const handleTicketSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSearchId.trim()) return;
    router.push(`/portal?tab=Repairs&search=${encodeURIComponent(ticketSearchId.trim())}`);
  };

  return (
    <Container as="section">
      <div className="bg-gradient-to-br from-primary-container to-slate-900 dark:from-slate-900/40 dark:to-slate-950 border border-outline-variant/10 dark:border-slate-850 p-8 md:p-12 rounded-3xl shadow-xl flex flex-col lg:flex-row justify-between items-center gap-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="space-y-4 max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-secondary-container">
            <SearchCode className="w-3.5 h-3.5" /> Estado del Dispositivo
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
            ¿Tu equipo ya está en nuestro laboratorio técnico?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Introduce el número de ticket (ej: WO-2026-0001) para comprobar la fase actual de calibración, pruebas de calidad o disponibilidad de piezas OEM.
          </p>
        </div>

        <form onSubmit={handleTicketSearch} className="w-full max-w-md bg-white/5 border border-white/10 p-2 rounded-2xl flex items-center gap-2 backdrop-blur-md">
          <Search className="w-5 h-5 text-white/50 ml-3" />
          <input 
            type="text" 
            placeholder="Número de Ticket o WO-..."
            className="bg-transparent border-none text-white text-xs font-semibold focus:outline-none flex-grow placeholder:text-white/30 px-2 py-3"
            value={ticketSearchId}
            onChange={(e) => setTicketSearchId(e.target.value)}
          />
          <Button 
            type="submit"
            variant="primary"
            className="!py-3 !px-5 !text-xs font-extrabold uppercase tracking-wider whitespace-nowrap shadow-md active:scale-95"
          >
            Rastrear Orden
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default RepairsTracker;

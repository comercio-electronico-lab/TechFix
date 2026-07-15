'use client';

import React, { useState } from 'react';
import { ShieldCheck, Copy, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { claimWarrantyAction } from '@/actions';
import Modal from '@/components/ui/Modal';

interface WarrantyCertificateCardProps {
  id: string;
  token: string;
  startDate: string;
  endDate: string;
}

export default function WarrantyCertificateCard({ id, token: warrantyToken, startDate, endDate }: WarrantyCertificateCardProps) {
  const { isAuthenticated } = useAuth();
  const [copiedToken, setCopiedToken] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimNotes, setClaimNotes] = useState('');
  const [claiming, setClaiming] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(warrantyToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleClaimWarranty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    if (!claimNotes.trim()) {
      alert('Por favor describe la falla o problema.');
      return;
    }
    setClaiming(true);
    try {
      await claimWarrantyAction(id, claimNotes);
      alert('Reclamación enviada con éxito. Se ha programado una cita de evaluación técnica sin costo en nuestro taller.');
      setIsClaimModalOpen(false);
      setClaimNotes('');
    } catch (err: any) {
      alert(err.message || 'Error al enviar reclamación de garantía.');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6 shadow-sm relative overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300">
      
      {/* Sello de seguridad decorativo */}
      <div className="absolute -right-8 -top-8 text-primary/5 dark:text-sky-500/5 select-none pointer-events-none transition-transform group-hover:scale-105 duration-500">
        <ShieldCheck className="w-32 h-32" />
      </div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-primary dark:text-sky-400" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-on-surface dark:text-white">
              Cobertura TechCare
            </h3>
          </div>
          <p className="text-xs text-on-surface-variant dark:text-slate-400">
            Soporte Integral de Mano de Obra y Repuesto
          </p>
        </div>

        {/* Badge Activa */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/20 dark:bg-sky-950/30 text-primary dark:text-sky-400 font-bold text-[10px] uppercase tracking-wider shadow-sm border border-primary/10 dark:border-sky-900/30 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-sky-400 animate-pulse"></div>
          ACTIVA
        </div>
      </div>

      <div className="space-y-4 relative z-10 flex-1">
        <div>
          <span className="text-[10px] font-bold text-outline dark:text-slate-500 uppercase tracking-wide block mb-1">
            Token de Garantía
          </span>
          
          <div 
            onClick={handleCopyToken}
            className="bg-slate-50 dark:bg-slate-950 border border-outline-variant/50 dark:border-slate-800 rounded-lg p-3 flex justify-between items-center group cursor-pointer hover:border-primary dark:hover:border-sky-500 transition-colors"
          >
            <span className="font-mono text-xs tracking-wider text-on-surface dark:text-slate-300 font-bold">
              {warrantyToken}
            </span>
            {copiedToken ? (
              <span className="text-[10px] font-bold text-emerald-650 dark:text-emerald-400 uppercase">
                Copiado
              </span>
            ) : (
              <Copy className="w-3.5 h-3.5 text-outline group-hover:text-primary dark:group-hover:text-sky-400 transition-colors" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-outline dark:text-slate-500 uppercase tracking-wide block mb-0.5">Fecha de Inicio</span>
            <span className="text-xs font-semibold text-on-surface dark:text-slate-350">{new Date(startDate).toLocaleDateString('es-ES')}</span>
          </div>
          <div className="w-px h-8 bg-outline-variant/20 dark:bg-slate-800 mx-4"></div>
          <div>
            <span className="text-[10px] font-bold text-outline dark:text-slate-500 uppercase tracking-wide block mb-0.5">Fecha de Venc.</span>
            <span className="text-xs font-semibold text-on-surface dark:text-slate-350">{new Date(endDate).toLocaleDateString('es-ES')}</span>
          </div>
        </div>

        {/* Botón de Reclamación de Garantía */}
        <div className="pt-4 border-t border-outline-variant/10 dark:border-slate-800">
          <button
            onClick={() => setIsClaimModalOpen(true)}
            className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 text-on-surface dark:text-slate-200 font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-outline-variant/20 dark:border-slate-800/80 shadow-sm"
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Reclamar Cobertura
          </button>
        </div>
      </div>
      
      {/* Línea estética de seguridad */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-primary dark:via-sky-600 to-primary/30"></div>

      {/* Modal de Reclamación */}
      <Modal isOpen={isClaimModalOpen} onClose={() => setIsClaimModalOpen(false)} title="Reclamar Cobertura de Garantía">
        <form onSubmit={handleClaimWarranty} className="p-6 space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold">Información Importante:</span> La cobertura técnica de TechCare cubre fallas en la mano de obra o defectos inherentes en las piezas instaladas. Al enviar la solicitud, se generará una nueva orden de revisión sin costo en nuestro taller técnico.
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Descripción del problema *</label>
            <textarea
              className="w-full bg-slate-50 dark:bg-slate-950 border border-outline-variant/60 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary text-sm text-on-surface dark:text-slate-200"
              rows={4}
              placeholder="Ej: El repuesto de batería instalado presenta una descarga muy acelerada o el táctil de la pantalla no responde..."
              value={claimNotes}
              onChange={(e) => setClaimNotes(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsClaimModalOpen(false)}
              className="bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border border-outline-variant/65 text-on-surface-variant dark:text-slate-350 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-colors cursor-pointer"
              disabled={claiming}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-primary dark:bg-sky-500 hover:bg-primary/95 dark:hover:bg-sky-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              disabled={claiming}
            >
              {claiming ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

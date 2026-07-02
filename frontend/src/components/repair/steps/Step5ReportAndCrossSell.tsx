'use client';

import React, { useState } from 'react';
import { 
  Laptop, 
  Smartphone, 
  Check, 
  History, 
  ShoppingBag, 
  ArrowRight, 
  AlertCircle,
  Calendar,
  MapPin,
  Clock,
  Camera,
  Layers,
  Plus
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { scheduleRepairAction } from '@/actions';

interface Step5Props {
  ticketId: string;
  deviceType: string | null;
  brand?: string;
  terminalNode: any;
  symptomPath: string[];
  suggestedProducts: any[];
  clientName: string;
  // Nuevos campos
  serialNumber: string;
  deviceModel: string;
  appointmentDate: string;
  appointmentTime: string;
  selectedBranch: string;
  failurePhoto: string | null;
}

export function DiagnosticStep5({ 
  ticketId, 
  deviceType, 
  brand,
  terminalNode, 
  symptomPath, 
  suggestedProducts, 
  clientName,
  serialNumber,
  deviceModel,
  appointmentDate,
  appointmentTime,
  selectedBranch,
  failurePhoto
}: Step5Props) {
  const { addItem } = useCart();
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [booking, setBooking] = useState(false);

  const [localSerialNumber, setLocalSerialNumber] = useState(serialNumber || '');
  const [localAppointmentDate, setLocalAppointmentDate] = useState(appointmentDate || new Date().toISOString().split('T')[0]);
  const [localAppointmentTime, setLocalAppointmentTime] = useState(appointmentTime || '09:00');
  const [localSelectedBranch, setLocalSelectedBranch] = useState(selectedBranch || 'Laboratorio Central');
  const [localFailurePhoto, setLocalFailurePhoto] = useState<string | null>(failurePhoto || null);

  // Desglose del presupuesto estimado
  const laborCost = terminalNode?.estimated_min ? Math.round(terminalNode.estimated_min * 0.4) : 35;
  const partsCost = suggestedProducts && suggestedProducts.length > 0 
    ? suggestedProducts.reduce((sum, p) => sum + p.price, 0)
    : 0;
  
  const subtotalCost = laborCost + partsCost;
  const taxCost = subtotalCost * 0.18; // 18% IVA/IGV
  const totalCost = subtotalCost + taxCost;

  const formattedEstimate = `$${totalCost.toFixed(2)}S\.`;

  // Lógica DIY: Agregar repuestos al carrito y redirigir al catálogo
  const handleAddAllToCart = () => {
    if (suggestedProducts && suggestedProducts.length > 0) {
      suggestedProducts.forEach(prod => {
        addItem({
          id: prod.id,
          name: prod.name,
          price: prod.price,
          image: prod.image,
          description: prod.description
        });
      });
      localStorage.setItem('techfix_open_sidebar_invoice', 'true');
      router.push('/catalogo');
    }
  };

  // Lógica Taller: Reservar cita
  const handleBookRepair = async () => {
    setBooking(true);
    const repairData = {
      deviceName: `${deviceModel || deviceType || 'Dispositivo'}`,
      brand: brand || 'Genérico',
      deviceType: deviceType || 'Smartphone',
      notes: `Pre-diagnóstico ${ticketId} [S/N: ${localSerialNumber || 'No provisto'}]. Síntomas: ${symptomPath.join(' | ')}. Cita reservada para el ${localAppointmentDate} a las ${localAppointmentTime} en la sucursal ${localSelectedBranch}. Evidencia fotográfica adjunta: ${localFailurePhoto ? 'SÍ' : 'NO'}.`,
      deviceSerial: localSerialNumber || `SN-${Math.floor(Math.random() * 1000000).toString()}`,
      appointmentDate: localAppointmentDate,
      appointmentTime: localAppointmentTime
    };

    if (isAuthenticated && token) {
      try {
        await scheduleRepairAction(token, repairData);
        alert('¡Reserva de cita confirmada con éxito en nuestro laboratorio! Hemos cargado la ficha técnica y la evidencia en la cola del técnico asignado.');
        router.push('/cliente/dashboard');
      } catch (err: any) {
        alert('Error al programar reparación: ' + err.message);
      }
    } else {
      // Guardar en localStorage para procesar después del inicio de sesión
      localStorage.setItem('techfix_pending_repair', JSON.stringify(repairData));
      alert('Para confirmar tu cita reservada y asignarla a tu perfil de cliente, por favor inicia sesión o crea una cuenta.');
      router.push('/auth');
    }
    setBooking(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      {/* Exito Header */}
      <div className="space-y-3 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/45 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-center mb-2 shadow-sm animate-bounce">
          <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-on-surface dark:text-white tracking-tight">
          ¡Pre-Diagnóstico Completado!
        </h1>
        <p className="text-base text-on-surface-variant dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Hola <span className="font-bold text-primary dark:text-sky-400">{clientName}</span>, hemos analizado con éxito el comportamiento técnico de tu equipo. Selecciona a continuación cómo deseas resolver esta falla.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Ticket Ficha Técnica - Left Column */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-outline-variant/65 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Header Ticket */}
          <div className="bg-primary/5 dark:bg-sky-500/5 px-6 py-5 border-b border-outline-variant/30 dark:border-slate-800 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-primary dark:text-sky-400 uppercase tracking-widest block mb-0.5">
                FICHA DE EVALUACIÓN
              </span>
              <h2 className="text-xl font-mono font-black text-on-surface dark:text-white tracking-tight select-all">
                {ticketId}
              </h2>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            
            {/* Campos de Resumen */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs font-semibold">
              <div>
                <span className="text-on-surface-variant/70 dark:text-slate-500 block mb-0.5 uppercase tracking-wider font-extrabold text-[10px]">
                  DISPOSITIVO & MODELO
                </span>
                <span className="text-sm font-bold text-on-surface dark:text-slate-200 flex items-center gap-1.5">
                  {deviceType === 'Laptop' ? <Laptop className="w-4 h-4 text-slate-400" /> : <Smartphone className="w-4 h-4 text-slate-400" />}
                  {deviceModel || deviceType}
                </span>
              </div>
              <div>
                <span className="text-on-surface-variant/70 dark:text-slate-500 block mb-1 uppercase tracking-wider font-extrabold text-[10px]">
                  NÚMERO DE SERIE
                </span>
                <input
                  type="text"
                  value={localSerialNumber}
                  onChange={(e) => setLocalSerialNumber(e.target.value)}
                  placeholder="Ej: SN-9823412"
                  className="w-full text-xs font-mono p-2 border border-outline-variant/40 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-on-surface dark:text-slate-200 focus:outline-none focus:border-secondary dark:focus:border-sky-500"
                />
              </div>
              
              <div className="col-span-2 border-t border-outline-variant/20 dark:border-slate-800/20 pt-4">
                <span className="text-on-surface-variant/70 dark:text-slate-500 block mb-1 uppercase tracking-wider font-extrabold text-[10px]">
                  FALLA ESTIMADA IDENTIFICADA
                </span>
                <span className="text-sm font-black text-primary dark:text-sky-400 bg-primary/5 dark:bg-sky-500/5 px-3 py-2 rounded-lg border border-primary/10 dark:border-sky-500/10 leading-snug block">
                  {terminalNode?.preliminary_result || 'Falla de Hardware'}
                </span>
              </div>
            </div>

            {/* Fila de Cita Reservada */}
            <div className="bg-blue-500/5 border border-blue-500/10 p-4.5 rounded-xl space-y-3">
              <span className="text-[10px] font-black text-secondary dark:text-sky-400 uppercase tracking-widest block border-b border-blue-500/10 pb-1.5">
                PERSONALIZAR CITA EN LABORATORIO
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-secondary" /> Sucursal
                  </label>
                  <select
                    value={localSelectedBranch}
                    onChange={(e) => setLocalSelectedBranch(e.target.value)}
                    className="w-full p-2 border border-outline-variant/30 dark:border-slate-800 rounded bg-white dark:bg-slate-900 text-on-surface dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Laboratorio Central">Laboratorio Central (San Miguel)</option>
                    <option value="Sucursal Norte">Sucursal Norte (Los Olivos)</option>
                    <option value="Sucursal Sur">Sucursal Sur (Miraflores)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-secondary" /> Fecha de Cita
                  </label>
                  <input
                    type="date"
                    value={localAppointmentDate}
                    onChange={(e) => setLocalAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border border-outline-variant/30 dark:border-slate-800 rounded bg-white dark:bg-slate-900 text-on-surface dark:text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[9px] font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-secondary" /> Rango Horario
                  </label>
                  <select
                    value={localAppointmentTime}
                    onChange={(e) => setLocalAppointmentTime(e.target.value)}
                    className="w-full p-2 border border-outline-variant/30 dark:border-slate-800 rounded bg-white dark:bg-slate-900 text-on-surface dark:text-slate-200 focus:outline-none"
                  >
                    <option value="09:00">Mañana (09:00 AM - 12:00 PM)</option>
                    <option value="13:00">Tarde (01:00 PM - 04:00 PM)</option>
                    <option value="17:00">Noche (05:00 PM - 07:00 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Desglose de Cotización Transparente */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-outline-variant/30 dark:border-slate-850 p-5 rounded-xl space-y-3">
              <span className="text-[10px] font-black text-on-surface-variant/80 dark:text-slate-400 uppercase tracking-widest block border-b border-outline-variant/20 dark:border-slate-850/80 pb-1.5">
                DESGLOSE DE COTIZACIÓN ESTIMADA
              </span>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant dark:text-slate-400">Mano de Obra Certificada (Evaluación + Labor):</span>
                  <span className="font-mono text-on-surface dark:text-slate-200 font-bold">${laborCost.toFixed(2)}S\.</span>
                </div>
                
                {partsCost > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant dark:text-slate-400">Repuestos OEM Sugeridos:</span>
                    <span className="font-mono text-on-surface dark:text-slate-200 font-bold">${partsCost.toFixed(2)}S\.</span>
                  </div>
                )}
                
                <div className="border-t border-slate-100 dark:border-slate-850 pt-2 flex justify-between items-center font-semibold">
                  <span className="text-on-surface-variant dark:text-slate-400">Subtotal Neto:</span>
                  <span className="font-mono text-on-surface dark:text-slate-200">${subtotalCost.toFixed(2)}S\.</span>
                </div>

                <div className="flex justify-between items-center text-[11px] text-on-surface-variant/80 dark:text-slate-500">
                  <span>Impuesto de Ley Aplicado (18% IGV/IVA):</span>
                  <span className="font-mono">${taxCost.toFixed(2)}S\.</span>
                </div>

                <div className="border-t-2 border-dashed border-slate-200 dark:border-slate-800 pt-2.5 flex justify-between items-center font-bold text-sm">
                  <span className="text-primary dark:text-sky-400">Total Presupuestado Estimado:</span>
                  <span className="font-mono text-base text-primary dark:text-sky-400">${totalCost.toFixed(2)}S\.</span>
                </div>
              </div>
            </div>

            {/* Evidencia Fotográfica (Cargador / Vista previa) */}
            <div className="border border-outline-variant/30 dark:border-slate-850 p-4 rounded-xl space-y-2.5">
              <h4 className="text-[10px] font-black text-on-surface-variant/75 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-primary dark:text-sky-400" /> Evidencia Fotográfica
              </h4>
              
              {localFailurePhoto ? (
                <div className="relative rounded-lg overflow-hidden border border-outline-variant/10 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-2 flex flex-col items-center justify-center max-w-xs">
                  <img src={localFailurePhoto} alt="Evidencia física" className="h-24 object-contain rounded" />
                  <button
                    onClick={() => setLocalFailurePhoto(null)}
                    type="button"
                    className="text-[10px] text-rose-500 hover:underline mt-1 cursor-pointer"
                  >
                    Eliminar foto
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-outline-variant/30 dark:border-slate-800 rounded-lg cursor-pointer bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-100/50 dark:hover:bg-slate-950/40 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-3 pb-3">
                      <Plus className="w-5 h-5 text-slate-400 mb-1" />
                      <p className="text-[10px] text-slate-500 dark:text-slate-400"><span className="font-bold">Subir foto</span> de la falla (opcional)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setLocalFailurePhoto(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Recorrido Histórico */}
            <div className="border-t border-outline-variant/20 dark:border-slate-800/20 pt-5 space-y-2.5">
              <h4 className="text-[10px] font-extrabold text-on-surface-variant/75 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-primary dark:text-sky-400" /> SECUENCIA DE SÍNTOMAS REPORTADOS
              </h4>
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl space-y-2 border border-outline-variant/20 dark:border-slate-800/40">
                {symptomPath.map((stepStr, idx) => {
                  const [q, a] = stepStr.split(' → ');
                  return (
                    <div key={idx} className="flex gap-2 text-xs leading-normal">
                      <span className="text-slate-400 dark:text-slate-650 font-mono font-bold select-none">{idx + 1}.</span>
                      <div className="text-on-surface-variant dark:text-slate-400">
                        <span className="opacity-75">{q}:</span>{' '}
                        <span className="font-extrabold text-on-surface dark:text-slate-200">{a}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Botón de agendamiento en taller */}
            <div className="pt-4">
              <button
                onClick={handleBookRepair}
                disabled={booking}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow cursor-pointer uppercase tracking-wider disabled:opacity-50 font-sans"
              >
                <Calendar className="w-4 h-4" />
                {booking ? 'Confirmando Cita...' : isAuthenticated ? 'Confirmar Cita y Reserva en Taller' : 'Iniciar Sesión y Confirmar Cita'}
              </button>
              <p className="text-[10px] text-center text-on-surface-variant dark:text-slate-500 mt-2">
                {isAuthenticated 
                  ? 'Se creará un ticket prioritario en tu panel para la sucursal seleccionada.' 
                  : 'Guardaremos tu pre-diagnóstico y podrás agendar tu cita al iniciar sesión.'}
              </p>
            </div>

          </div>
        </div>

        {/* Repuestos Cross-Sell Sugeridos - Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-xs font-extrabold text-primary dark:text-sky-400 uppercase tracking-widest">
              <ShoppingBag className="w-4 h-4" /> Solución DIY (Hazlo tú mismo)
            </span>
            <h3 className="text-xl font-bold text-on-surface dark:text-white tracking-tight">
              Repuestos Recomendados
            </h3>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-normal">
              ¿Prefieres repararlo por tu cuenta? Adquiere el kit completo con componentes OEM originales y ahorra.
            </p>
          </div>

          {suggestedProducts && suggestedProducts.length > 0 ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                {suggestedProducts.map((product, idx) => {
                  const hasStock = product.status !== 'Out of Stock';
                  return (
                    <div
                      key={product.id || idx}
                      className="group bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-xl p-4 flex gap-4 hover:shadow-md hover:border-primary dark:hover:border-sky-500 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Imagen Repuesto */}
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-outline-variant/20 dark:border-slate-850">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=300&auto=format&fit=crop';
                          }}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Ficha Repuesto */}
                      <div className="flex flex-col justify-between flex-grow min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 font-mono tracking-wider truncate uppercase">
                              SKU: {product.sku || 'OEM-PART'}
                            </span>
                            <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                              hasStock 
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            }`}>
                              {hasStock ? 'Disponible' : 'Sin Stock'}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-on-surface dark:text-slate-200 mt-0.5 truncate leading-tight group-hover:text-primary dark:group-hover:text-sky-400 transition-colors">
                            {product.name}
                          </h4>
                        </div>

                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50 dark:border-slate-850">
                          <span className="text-xs font-black text-primary dark:text-sky-400">
                            ${((product.price || product.estimated_price) || 0).toFixed(2)}S\.
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Botón para añadir todo al carrito */}
              <button
                onClick={handleAddAllToCart}
                className="w-full py-4 bg-secondary hover:bg-secondary/95 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow cursor-pointer uppercase tracking-wider"
              >
                <ShoppingBag className="w-4 h-4" />
                Añadir Kit Completo al Carrito
              </button>
            </div>
          ) : (
            <div className="border border-dashed border-outline-variant/60 dark:border-slate-800 rounded-xl p-8 text-center space-y-2 bg-slate-50/40 dark:bg-slate-900/10">
              <AlertCircle className="w-8 h-8 text-slate-400 dark:text-slate-650 mx-auto" />
              <h4 className="text-xs font-bold text-on-surface dark:text-slate-350">No hay repuestos sugeridos</h4>
              <p className="text-[10px] text-on-surface-variant dark:text-slate-500 leading-normal max-w-xs mx-auto">
                Esta falla requiere calibración avanzada en laboratorio. Agenda tu reserva en taller para una inspección física detallada.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Botones de Retorno final */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center border-t border-outline-variant/20 dark:border-slate-800/40 pt-8">
        <a href="/catalogo" className="px-6 py-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 text-primary dark:text-sky-400 border border-primary/20 dark:border-slate-800 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer">
          Volver al Catálogo de Repuestos
        </a>
        <a href="/" className="px-6 py-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 text-primary dark:text-sky-400 border border-primary/20 dark:border-slate-800 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer">
          Volver al Inicio
        </a>
      </div>
    </div>
  );
}


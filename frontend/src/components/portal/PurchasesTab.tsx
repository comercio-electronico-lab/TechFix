'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShoppingBag,
  Truck,
  Coins,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserOrdersAction } from '@/actions';

interface LocalOrder {
  orderNumber: string;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  date?: string;
}

export default function PurchasesTab() {
  const { token } = useAuth();
  const [order, setOrder] = useState<LocalOrder | null>(null);

  useEffect(() => {
    if (!token) return;

    getUserOrdersAction(token)
      .then((pedidos) => {
        if (!pedidos || pedidos.length === 0) return;
        const latest = pedidos[0];
        setOrder({
          orderNumber: latest.id,
          subtotal: latest.subtotal,
          tax: latest.impuestos,
          total: latest.total,
          paymentMethod: 'Pasarela Digital Segura (Tarjeta)',
          date: latest.created_at,
        });
      })
      .catch((err) => console.error('Error al obtener pedidos:', err));
  }, [token]);

  const formatDate = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getEstimatedDelivery = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {order ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Ficha Principal de la Compra */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tarjeta de Orden */}
            <div className="bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow transition-shadow">
              {/* Header de la Orden */}
              <div className="bg-primary/5 dark:bg-sky-500/5 px-6 py-5 border-b border-outline-variant/30 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-primary dark:text-sky-400 uppercase tracking-widest block mb-0.5">
                    REFERENCIA DE PEDIDO
                  </span>
                  <h2 className="text-lg font-mono font-black text-on-surface dark:text-white tracking-tight select-all">
                    {order.orderNumber}
                  </h2>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Pago Aprobado
                </div>
              </div>

              {/* Contenido de la Orden */}
              <div className="p-6 space-y-6">
                
                {/* Detalles de Despacho */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-on-surface-variant/70 dark:text-slate-500 uppercase tracking-widest block">
                      MÉTODO DE PAGO
                    </span>
                    <span className="text-xs font-bold text-on-surface dark:text-slate-350 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-emerald-500 shrink-0" />
                      Pasarela Digital Segura (Tarjeta)
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-on-surface-variant/70 dark:text-slate-500 uppercase tracking-widest block">
                      FECHA DE COMPRA
                    </span>
                    <span className="text-xs font-bold text-on-surface dark:text-slate-350 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      {formatDate(order.date)}
                    </span>
                  </div>
                </div>

                {/* Delivery Timeline Progress */}
                <div className="border-t border-outline-variant/20 dark:border-slate-800/30 pt-5">
                  <span className="text-[10px] font-extrabold text-on-surface-variant/70 dark:text-slate-500 uppercase tracking-widest block mb-4">
                    ESTADO DE ENVÍO
                  </span>
                  
                  <div className="relative">
                    {/* Barra conectora */}
                    <div className="absolute top-3.5 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="absolute top-3.5 left-0 w-1/3 h-1 bg-primary dark:bg-sky-500 rounded" />
                    
                    {/* Hitos */}
                    <div className="relative flex justify-between">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary text-white dark:bg-sky-500 dark:text-slate-950 flex items-center justify-center font-bold text-xs shadow border-4 border-white dark:border-slate-900">
                          ✓
                        </div>
                        <span className="text-[10px] font-bold text-on-surface dark:text-slate-300 mt-2">Pago</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary text-white dark:bg-sky-500 dark:text-slate-950 flex items-center justify-center font-bold text-xs shadow border-4 border-white dark:border-slate-900 animate-pulse">
                          ●
                        </div>
                        <span className="text-[10px] font-bold text-primary dark:text-sky-400 mt-2">En Taller</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-650 flex items-center justify-center font-bold text-xs border-4 border-white dark:border-slate-900">
                          3
                        </div>
                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-550 mt-2">Despacho</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Ficha Resumen de Precios */}
            <div className="bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-extrabold text-on-surface-variant/80 dark:text-slate-450 uppercase tracking-widest mb-4">
                Resumen de Transacción
              </h3>
              
              <div className="space-y-3 pt-2 text-xs leading-normal">
                <div className="flex justify-between text-on-surface-variant dark:text-slate-400">
                  <span>Subtotal de Componentes</span>
                  <span className="font-semibold text-on-surface dark:text-slate-200">${order.subtotal.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-on-surface-variant dark:text-slate-400">
                  <span>Despacho Precision Logistics</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Gratis</span>
                </div>
                <div className="flex justify-between text-on-surface-variant dark:text-slate-400">
                  <span>Impuestos (8%)</span>
                  <span className="font-semibold text-on-surface dark:text-slate-200">${order.tax.toFixed(2)} USD</span>
                </div>
                
                <div className="flex justify-between items-center border-t border-outline-variant/30 dark:border-slate-800 pt-4 mt-2">
                  <span className="font-bold text-sm text-on-surface dark:text-white">Total Facturado</span>
                  <span className="font-bold text-lg text-primary dark:text-sky-400">${order.total.toFixed(2)} USD</span>
                </div>
              </div>
            </div>

          </div>

          {/* Lateral Derecho: Delivery & Warranty Alert */}
          <div className="space-y-6">
            
            {/* Delivery Info Box */}
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-outline-variant/40 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="text-primary dark:text-sky-400 w-5 h-5 shrink-0" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-on-surface dark:text-slate-350">Entrega Estimada</h4>
              </div>
              <p className="text-lg font-black text-on-surface dark:text-white leading-tight capitalize">
                {getEstimatedDelivery()}
              </p>
              <p className="text-[10px] text-on-surface-variant dark:text-slate-450 leading-relaxed mt-1">
                Tu kit OEM está siendo calibrado y verificado por nuestros técnicos. Será despachado con la firma de seguridad TechFix Precision.
              </p>
            </div>

            {/* Quality Seal */}
            <div className="bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm border-l-4 border-l-primary dark:border-l-sky-500">
              <div className="flex gap-3 items-start">
                <ShieldCheck className="text-primary dark:text-sky-400 shrink-0 w-5 h-5 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-on-surface dark:text-white text-xs uppercase tracking-wider">Soporte Técnico 24/7</h4>
                  <p className="text-[10px] text-on-surface-variant dark:text-slate-450 leading-normal">
                    Tu compra incluye 12 meses de garantía oficial y soporte de instalación en línea por ingenieros especializados.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Empty State */
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-slate-900 border border-outline-variant/50 dark:border-slate-800 p-8 rounded-2xl shadow-sm text-center py-16 space-y-4">
            <div className="p-4 bg-primary/5 dark:bg-sky-500/5 rounded-full inline-block border border-outline-variant/10">
              <ShoppingBag className="w-8 h-8 text-primary dark:text-sky-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-on-surface dark:text-white">Sin Pedidos Activos</h3>
              <p className="text-xs text-on-surface-variant dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Tu historial de compras de repuestos OEM y refacciones de hardware aparecerá aquí en tiempo real una vez completes un pedido en nuestro catálogo.
              </p>
            </div>
            <div className="pt-2">
              <a 
                href="/catalogo"
                className="inline-flex items-center justify-center h-10 px-6 bg-primary dark:bg-sky-600 hover:bg-surface-tint dark:hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                Explorar Catálogo
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

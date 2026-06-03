"use client";

import React from 'react';
import { Check } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId?: string;
  fecha?: string;
  items?: OrderItem[];
  total?: number;
  subtotal?: number;
}

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <div className="bg-white/70 dark:bg-slate-900 border border-outline-variant/15 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-md space-y-6">
      <div className="flex justify-between items-center border-b border-outline-variant/10 dark:border-slate-800/80 pb-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-650 dark:text-emerald-400 uppercase tracking-widest block mb-0.5 font-mono">COMPRA COMPLETA</span>
          <h4 className="text-base font-black text-on-background">Pedido #{order.orderId || 'ORD-9912'}</h4>
        </div>
        <span className="text-xs font-semibold text-on-surface-variant">Fecha: {order.fecha || new Date().toISOString().split('T')[0]}</span>
      </div>

      <div className="space-y-4">
        {order.items && order.items.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-on-background">{item.name}</span>
              <span className="text-on-surface-variant ml-2">x{item.quantity}</span>
            </div>
            <span className="font-mono text-on-background font-bold">${(item.price * item.quantity).toFixed(2)} USD</span>
          </div>
        ))}

        <div className="border-t border-outline-variant/10 dark:border-slate-800 pt-4 flex justify-between items-center font-bold text-sm">
          <span className="text-on-surface-variant">Total Pagado:</span>
          <span className="text-primary dark:text-sky-400 font-mono text-base">${(order.total || order.subtotal || 0).toFixed(2)} USD</span>
        </div>
      </div>

      <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl flex items-center gap-3">
        <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <div className="text-xs text-left">
          <p className="font-bold text-emerald-850 dark:text-emerald-400">Entrega y Facturación Procesada</p>
          <p className="text-on-surface-variant mt-0.5">El comprobante fiscal y los certificados de garantía correspondientes han sido emitidos.</p>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;

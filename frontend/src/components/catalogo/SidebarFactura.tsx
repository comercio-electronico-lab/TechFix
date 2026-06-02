'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  FileText
} from 'lucide-react';

export default function SidebarFactura() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Billing calculation (IGV/IVA 18% & Shipping details matching checkout pages)
  const shippingCost = subtotal > 500 || subtotal === 0 ? 0 : 10;
  const taxRate = 0.18; 
  const taxCost = Math.round(subtotal * taxRate * 100) / 100;
  const totalCost = subtotal + shippingCost + taxCost;

  // Handle Proceed to Checkout button
  const handleProceed = () => {
    if (items.length === 0) return;
    
    if (isAuthenticated) {
      router.push('/checkout/envio');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <aside className="bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-xl w-full sticky top-24 self-start max-h-[85vh] overflow-y-auto flex flex-col transition-all duration-300">
      
      {/* Sidebar Header */}
      <div className="border-b border-outline-variant/30 dark:border-slate-800 pb-4 mb-5 flex items-center justify-between">
        <h3 className="font-bold text-primary dark:text-white text-lg flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-secondary" /> Factura Pro-Forma
        </h3>
      </div>

      <div className="flex-1 flex flex-col">
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-on-surface dark:text-slate-350">Tu carrito está vacío</p>
              <p className="text-xs text-on-surface-variant dark:text-slate-500 mt-1 max-w-[200px] mx-auto">
                Agrega repuestos o herramientas desde el catálogo.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 flex-1">
            {/* Scrollable Cart Items List */}
            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-outline-variant/20 dark:border-slate-800/40 items-center justify-between animate-in fade-in duration-300">
                  <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded-md bg-white p-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-on-surface dark:text-slate-200 truncate">{item.name}</h4>
                    <p className="text-[10px] text-secondary font-black mt-0.5">${item.price.toFixed(2)} c/u</p>
                  </div>
                  {/* Quantity selector */}
                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-850 px-2 py-1 rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="text-on-surface-variant hover:text-primary dark:hover:text-white p-0.5 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-black text-on-surface dark:text-white w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="text-on-surface-variant hover:text-primary dark:hover:text-white p-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {/* Remove button */}
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-on-surface-variant/40 hover:text-red-500 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown Box */}
            <div className="bg-slate-50 dark:bg-slate-800/20 p-4 rounded-xl border border-outline-variant/20 dark:border-slate-800/40 space-y-2 text-xs">
              <div className="flex justify-between text-on-surface-variant dark:text-slate-400">
                <span>Subtotal Neto</span>
                <span className="font-bold font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant dark:text-slate-400">
                <span>IGV / IVA (18%)</span>
                <span className="font-bold font-mono">${taxCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant dark:text-slate-400">
                <span>Envío Express</span>
                <span className="font-bold">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-500 font-extrabold uppercase">Gratis</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-[10px] text-on-surface-variant/60 dark:text-slate-500 font-medium leading-none mt-1">
                  ¡Envío gratis para compras superiores a $500.00!
                </p>
              )}
              <div className="border-t border-outline-variant/30 dark:border-slate-850 pt-2.5 mt-2 flex justify-between text-sm font-bold text-on-surface dark:text-white">
                <span>TOTAL DE FACTURA</span>
                <span className="text-base text-primary dark:text-sky-400 font-mono font-black">${totalCost.toFixed(2)}</span>
              </div>
            </div>

            {/* Support message */}
            <div className="bg-primary/5 dark:bg-sky-500/5 px-4 py-2.5 text-center flex items-center justify-center gap-1.5 text-[9px] font-bold text-on-surface-variant/70 dark:text-slate-500 rounded-xl border border-primary/10 dark:border-sky-500/10">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Documento firmado digitalmente por TechFix</span>
            </div>

            {/* Action button */}
            <button 
              onClick={handleProceed}
              disabled={items.length === 0}
              className="w-full bg-secondary text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md active:scale-95 font-bold text-sm cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceder al Pago
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

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

  // Free shipping progress percentage
  const freeShippingLimit = 500;
  const shippingProgressPercent = Math.min((subtotal / freeShippingLimit) * 100, 100);
  const remainingForFreeShipping = freeShippingLimit - subtotal;

  // Handle Proceed to Checkout button
  const handleProceed = () => {
    if (items.length === 0) return;
    
    if (isAuthenticated) {
      router.push('/checkout/envio');
    } else {
      router.push('/auth?redirect=/checkout/envio');
    }
  };

  return (
    <aside className="bg-white dark:bg-[#061533]/45 border border-outline-variant/60 dark:border-outline/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl w-full max-h-[85vh] overflow-y-auto flex flex-col transition-all duration-300 relative">
      
      {/* Luz decorativa superior */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-secondary/40 via-secondary to-secondary/40 rounded-t-2xl"></div>

      {/* Sidebar Header */}
      <div className="border-b border-outline-variant/35 dark:border-outline/15 pb-4 mb-4 flex items-center justify-between">
        <h3 className="font-bold text-on-surface dark:text-white text-md flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-secondary dark:text-[#00bcff]" /> 
          Factura Pro-Forma
        </h3>
        <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-on-surface-variant dark:text-slate-400 font-black px-2 py-0.5 rounded font-mono uppercase">
          Draft #L1
        </span>
      </div>

      {/* Envío Gratis Progress Bar Indicator */}
      {subtotal > 0 && (
        <div className="mb-4 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-outline-variant/15 dark:border-outline/10">
          <div className="flex justify-between items-center text-[10px] font-bold mb-1.5">
            <span className="text-on-surface-variant dark:text-slate-400">
              {remainingForFreeShipping > 0 
                ? `Te faltan $${remainingForFreeShipping.toFixed(2)} para Envío Gratis` 
                : '¡Calificas para Envío Express Gratis!'}
            </span>
            <span className="text-secondary dark:text-sky-400 font-black font-mono">
              {Math.round(shippingProgressPercent)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                shippingProgressPercent >= 100 
                  ? 'bg-emerald-500 dark:bg-emerald-400' 
                  : 'bg-secondary dark:bg-[#00bcff]'
              }`}
              style={{ width: `${shippingProgressPercent}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-950/70 border border-outline-variant/20 dark:border-outline/15 flex items-center justify-center text-slate-400">
              <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
            </div>
            <div>
              <p className="font-bold text-on-surface dark:text-slate-200 text-sm">Tu carrito está vacío</p>
              <p className="text-xs text-on-surface-variant dark:text-slate-550 mt-1 max-w-[200px] mx-auto leading-relaxed">
                Agrega repuestos o herramientas desde el catálogo para iniciar la cotización.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 flex-1">
            {/* Scrollable Cart Items List */}
            <div className="max-h-[260px] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 bg-slate-50/50 dark:bg-slate-950/45 p-2.5 rounded-xl border border-outline-variant/20 dark:border-outline/10 items-center justify-between hover:border-outline-variant/60 dark:hover:border-[#0b61a1]/30 transition-all duration-200 group">
                  <div className="w-10 h-10 object-contain rounded-lg bg-white p-1 flex items-center justify-center border border-outline-variant/15 dark:bg-slate-900 dark:border-slate-800">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-bold text-on-surface dark:text-slate-250 truncate group-hover:text-primary dark:group-hover:text-sky-400 transition-colors">{item.name}</h4>
                    <p className="text-[10px] text-secondary dark:text-sky-455 font-black mt-0.5 font-mono">${item.price.toFixed(2)} c/u</p>
                  </div>
                  {/* Quantity selector */}
                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-outline/20 px-2 py-1 rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="text-on-surface-variant/70 hover:text-primary dark:hover:text-white p-0.5 cursor-pointer active:scale-75 transition-all"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-black text-on-surface dark:text-white w-4 text-center font-mono">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="text-on-surface-variant/70 hover:text-primary dark:hover:text-white p-0.5 cursor-pointer active:scale-75 transition-all"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {/* Remove button */}
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-on-surface-variant/40 hover:text-red-500 p-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Línea divisoria simulando ticket digital troquelado */}
            <div className="relative h-4 my-2 flex items-center">
              <div className="absolute inset-x-0 border-t-2 border-dashed border-outline-variant/30 dark:border-slate-800"></div>
              <div className="absolute -left-8 w-4 h-4 rounded-full bg-surface-bright dark:bg-slate-950 border-r border-outline-variant/30 dark:border-slate-900"></div>
              <div className="absolute -right-8 w-4 h-4 rounded-full bg-surface-bright dark:bg-slate-950 border-l border-outline-variant/30 dark:border-slate-900"></div>
            </div>

            {/* Calculations Breakdown Box */}
            <div className="bg-slate-50/70 dark:bg-slate-950/35 p-4 rounded-xl border border-outline-variant/15 dark:border-outline/10 space-y-2.5 text-[11px] font-medium">
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
                    <span className="text-emerald-500 dark:text-emerald-400 font-extrabold uppercase text-[10px]">Gratis</span>
                  ) : (
                    <span className="font-mono">${shippingCost.toFixed(2)}</span>
                  )}
                </span>
              </div>
              
              <div className="border-t border-outline-variant/25 dark:border-outline/15 pt-2.5 mt-2 flex justify-between text-xs font-black text-on-surface dark:text-white">
                <span>TOTAL DE FACTURA</span>
                <span className="text-sm text-primary dark:text-[#00bcff] font-mono font-black">${totalCost.toFixed(2)}</span>
              </div>
            </div>

            {/* Support message */}
            <div className="bg-primary/5 dark:bg-sky-500/5 px-4 py-2.5 text-center flex items-center justify-center gap-1.5 text-[9px] font-bold text-on-surface-variant/75 dark:text-slate-450 rounded-xl border border-primary/10 dark:border-sky-500/10">
              <FileText className="w-3.5 h-3.5 text-secondary dark:text-sky-400" />
              <span>Documento firmado digitalmente por TechFix</span>
            </div>

            {/* Action button */}
            <button 
              onClick={handleProceed}
              disabled={items.length === 0}
              className="w-full bg-secondary dark:bg-gradient-to-r dark:from-secondary dark:to-[#00bcff] text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 hover:shadow-lg hover:shadow-secondary/20 dark:hover:shadow-[#00bcff]/15 transition-all active:scale-[0.98] font-bold text-xs cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
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


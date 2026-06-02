'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Lock, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  FileText, 
  ArrowRight, 
  Loader2, 
  Wallet, 
  Check, 
  User
} from 'lucide-react';

export default function SidebarFactura() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalItems } = useCart();
  const { user, isAuthenticated, login, register } = useAuth();
  
  // Checkout flow state
  // 1: Cart View, 2: Inline Auth, 3: Address & Payment, 4: Receipt Success
  const [step, setStep] = useState(1);
  
  // Auth Form State
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  
  // Payment Form State
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'delivery'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  
  // Receipt State
  const [receiptNumber, setReceiptNumber] = useState('');
  const [purchasedItems, setPurchasedItems] = useState<any[]>([]);
  const [receiptTotal, setReceiptTotal] = useState(0);
  const [receiptTax, setReceiptTax] = useState(0);
  const [receiptSubtotal, setReceiptSubtotal] = useState(0);
  const [receiptShipping, setReceiptShipping] = useState(0);

  // Billing math
  const shippingCost = subtotal > 500 || subtotal === 0 ? 0 : 10;
  const taxRate = 0.18; // 18% IGV/IVA
  const taxCost = Math.round(subtotal * taxRate * 100) / 100;
  const totalCost = subtotal + shippingCost + taxCost;

  // Handle proceed to checkout
  const handleProceed = () => {
    if (isAuthenticated) {
      setStep(3);
    } else {
      setStep(2);
    }
  };

  // Handle inline Auth
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (isRegisterMode) {
        if (!authName || !authEmail || !authPassword) {
          throw new Error('Por favor completa todos los campos.');
        }
        await register(authName, authEmail.split('@')[0], authEmail, authPassword);
      } else {
        if (!authEmail || !authPassword) {
          throw new Error('Por favor ingresa correo y contraseña.');
        }
        await login(authEmail, authPassword);
      }
      setStep(3); // Success, go to shipping & payment
    } catch (err: any) {
      setAuthError(err.message || 'Error de autenticación');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle final Purchase Confirmation
  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !phone) {
      alert('Por favor, ingresa tu dirección y teléfono de contacto.');
      return;
    }
    
    setPaymentLoading(true);
    
    // Simulate transaction delay
    setTimeout(() => {
      const generatedInvoiceNumber = `FAC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setReceiptNumber(generatedInvoiceNumber);
      setPurchasedItems([...items]);
      setReceiptSubtotal(subtotal);
      setReceiptTax(taxCost);
      setReceiptShipping(shippingCost);
      setReceiptTotal(totalCost);
      
      setPaymentLoading(false);
      clearCart(); // Reset cart state
      setStep(4); // Render final receipt
    }, 1500);
  };

  const resetCheckout = () => {
    setStep(1);
    setAddress('');
    setPhone('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
  };

  return (
    <aside className="bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-xl w-full sticky top-24 self-start max-h-[85vh] overflow-y-auto flex flex-col transition-all duration-300">
      
      {/* HEADER DINÁMICO SEGÚN EL PASO */}
      <div className="border-b border-outline-variant/30 dark:border-slate-800 pb-4 mb-5 flex items-center justify-between">
        <h3 className="font-bold text-primary dark:text-white text-lg flex items-center gap-2">
          {step === 1 && <><ShoppingBag className="w-5 h-5 text-secondary" /> Factura Pro-Forma</>}
          {step === 2 && <><Lock className="w-5 h-5 text-secondary" /> Autenticación</>}
          {step === 3 && <><Truck className="w-5 h-5 text-secondary" /> Envío y Pago</>}
          {step === 4 && <><CheckCircle className="w-5 h-5 text-emerald-500" /> Factura Emitida</>}
        </h3>
        {step > 1 && step < 4 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="text-xs text-on-surface-variant hover:text-primary dark:hover:text-sky-400 font-bold transition-colors cursor-pointer"
          >
            Atrás
          </button>
        )}
      </div>

      {/* PASO 1: DETALLE DEL CARRITO */}
      {step === 1 && (
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
              {/* Lista scrollable de productos en carrito */}
              <div className="max-h-[260px] overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-outline-variant/20 dark:border-slate-800/40 items-center justify-between">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded-md bg-white p-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-on-surface dark:text-slate-200 truncate">{item.name}</h4>
                      <p className="text-[10px] text-secondary font-black mt-0.5">${item.price} c/u</p>
                    </div>
                    {/* Controles de cantidad */}
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
                    {/* Eliminar item */}
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-on-surface-variant/40 hover:text-red-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Detalle de precios / Factura */}
              <div className="bg-slate-50 dark:bg-slate-800/20 p-4 rounded-xl border border-outline-variant/20 dark:border-slate-800/40 space-y-2 text-xs">
                <div className="flex justify-between text-on-surface-variant dark:text-slate-400">
                  <span>Subtotal Neto</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant dark:text-slate-400">
                  <span>IGV / IVA (18%)</span>
                  <span className="font-bold">${taxCost.toFixed(2)}</span>
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

              <button 
                onClick={handleProceed}
                className="w-full bg-secondary text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md active:scale-95 font-bold text-sm cursor-pointer mt-4"
              >
                Proceder al Pago
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* PASO 2: AUTENTICACIÓN INLINE */}
      {step === 2 && (
        <form onSubmit={handleAuthSubmit} className="space-y-4 flex-1 flex flex-col justify-center">
          <div className="text-center space-y-1.5 mb-2">
            <h4 className="text-sm font-black text-on-surface dark:text-slate-200">
              {isRegisterMode ? 'Crea una cuenta rápida' : 'Ingresa a tu cuenta'}
            </h4>
            <p className="text-[11px] text-on-surface-variant dark:text-slate-500">
              Requerido para vincular la orden de compra y emitir la factura a tu nombre.
            </p>
          </div>

          {authError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg p-2.5 text-xs text-center font-bold">
              {authError}
            </div>
          )}

          {isRegisterMode && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-on-surface-variant/80 dark:text-slate-400 uppercase tracking-wider">Nombre Completo</label>
              <input 
                type="text" 
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-secondary transition-all"
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-on-surface-variant/80 dark:text-slate-400 uppercase tracking-wider">Correo Electrónico</label>
            <input 
              type="email" 
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-secondary transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-on-surface-variant/80 dark:text-slate-400 uppercase tracking-wider">Contraseña</label>
            <input 
              type="password" 
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-secondary transition-all"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={authLoading}
            className="w-full bg-primary text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md active:scale-95 font-bold text-xs cursor-pointer"
          >
            {authLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              isRegisterMode ? 'Crear Cuenta y Continuar' : 'Iniciar Sesión y Continuar'
            )}
          </button>

          <div className="text-center pt-2">
            <button 
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setAuthError(null);
              }}
              className="text-[11px] font-bold text-secondary hover:underline cursor-pointer"
            >
              {isRegisterMode ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate gratis'}
            </button>
          </div>
        </form>
      )}

      {/* PASO 3: INFORMACIÓN DE DESPACHO Y MÉTODOS DE PAGO */}
      {step === 3 && (
        <form onSubmit={handlePurchase} className="space-y-5 flex-1">
          {/* User Data Summary Card */}
          <div className="bg-slate-50 dark:bg-slate-800/30 border border-outline-variant/20 dark:border-slate-850 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary dark:text-sky-400">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-on-surface dark:text-slate-200 leading-none">{user?.nombre || 'Usuario'}</p>
              <p className="text-[10px] text-on-surface-variant dark:text-slate-500 truncate mt-1">{user?.email}</p>
            </div>
            <span className="ml-auto text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase px-2 py-0.5 rounded-full border border-emerald-500/20">
              Verificado
            </span>
          </div>

          {/* Form fields */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-on-surface-variant/80 dark:text-slate-400 uppercase tracking-wider">Dirección de Despacho</label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Av. Larco 123, Miraflores, Lima"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-secondary transition-all"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-on-surface-variant/80 dark:text-slate-400 uppercase tracking-wider">Número de Teléfono</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+51 987 654 321"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-secondary transition-all"
                required
              />
            </div>
          </div>

          {/* Selector de Métodos de Pago */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant/80 dark:text-slate-400 uppercase tracking-wider block">Método de Pago</label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                  paymentMethod === 'card' 
                    ? 'border-secondary bg-secondary/5 text-secondary dark:border-sky-400 dark:bg-sky-400/5 dark:text-sky-400 font-bold' 
                    : 'border-outline-variant/50 hover:bg-slate-50 dark:hover:bg-slate-850 dark:border-slate-800 text-on-surface-variant'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[9px]">Tarjeta</span>
              </button>
              <button 
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                  paymentMethod === 'transfer' 
                    ? 'border-secondary bg-secondary/5 text-secondary dark:border-sky-400 dark:bg-sky-400/5 dark:text-sky-400 font-bold' 
                    : 'border-outline-variant/50 hover:bg-slate-50 dark:hover:bg-slate-850 dark:border-slate-800 text-on-surface-variant'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span className="text-[9px]">Trf. Bancaria</span>
              </button>
              <button 
                type="button"
                onClick={() => setPaymentMethod('delivery')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                  paymentMethod === 'delivery' 
                    ? 'border-secondary bg-secondary/5 text-secondary dark:border-sky-400 dark:bg-sky-400/5 dark:text-sky-400 font-bold' 
                    : 'border-outline-variant/50 hover:bg-slate-50 dark:hover:bg-slate-850 dark:border-slate-800 text-on-surface-variant'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span className="text-[9px]">Contra Entrega</span>
              </button>
            </div>
          </div>

          {/* Subformularios condicionales según el método seleccionado */}
          {paymentMethod === 'card' && (
            <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-outline-variant/30 dark:border-slate-850 rounded-xl space-y-3">
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                  placeholder="Número de Tarjeta (16 dígitos)"
                  className="w-full bg-white dark:bg-slate-900 border border-outline-variant/50 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-secondary transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                  placeholder="MM/AA"
                  className="w-full bg-white dark:bg-slate-900 border border-outline-variant/50 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-secondary transition-all"
                  required
                />
                <input 
                  type="text" 
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="CVV / CVC"
                  className="w-full bg-white dark:bg-slate-900 border border-outline-variant/50 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-secondary transition-all"
                  required
                />
              </div>
            </div>
          )}

          {paymentMethod === 'transfer' && (
            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 border border-outline-variant/30 dark:border-slate-850 rounded-xl text-[10px] space-y-1 text-on-surface-variant/80 dark:text-slate-400">
              <p className="font-bold text-on-surface dark:text-white uppercase tracking-wider mb-1">Cuentas Corrientes TechFix:</p>
              <p>🏦 **Banco de la Nación**: 0011-0182-0100037812</p>
              <p>🏦 **BCP CCI**: 002-19100182010003781254</p>
              <p className="text-[9px] text-secondary dark:text-sky-400 font-medium leading-none mt-1.5">
                * Por favor, envía tu constancia a facturacion@techfix.com una vez realizada la transferencia.
              </p>
            </div>
          )}

          {paymentMethod === 'delivery' && (
            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 border border-outline-variant/30 dark:border-slate-850 rounded-xl text-[10px] text-on-surface-variant/80 dark:text-slate-400">
              <p className="font-bold text-on-surface dark:text-white uppercase tracking-wider mb-1">Condiciones de Envío:</p>
              <p>✓ El despachador validará el pago en efectivo o por billetera móvil (Yape/Plin) al momento de entregar tu pedido.</p>
            </div>
          )}

          {/* Confirm Button */}
          <button 
            type="submit"
            disabled={paymentLoading}
            className="w-full bg-secondary text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md active:scale-95 font-bold text-sm cursor-pointer mt-2"
          >
            {paymentLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Validando transacción...
              </>
            ) : (
              <>
                Confirmar y Pagar ${totalCost.toFixed(2)}
              </>
            )}
          </button>
        </form>
      )}

      {/* PASO 4: ÉXITO DE COMPRA (FACTURA VIRTUAL EMITIDA) */}
      {step === 4 && (
        <div className="space-y-6 flex-1 flex flex-col justify-between">
          
          {/* Ficha Factura con formato de Ticket */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-outline-variant/60 dark:border-slate-850/80 rounded-xl overflow-hidden shadow-inner flex flex-col relative select-text">
            {/* Cabecera Ticket */}
            <div className="bg-secondary/5 dark:bg-sky-500/5 p-4 border-b border-dashed border-outline-variant/40 text-center relative">
              <span className="text-[9px] font-black text-secondary dark:text-sky-400 uppercase tracking-widest block mb-0.5">COMPROBANTE ELECTRÓNICO</span>
              <h4 className="text-base font-mono font-black text-on-surface dark:text-white tracking-wide">{receiptNumber}</h4>
              <p className="text-[9px] text-on-surface-variant dark:text-slate-500 mt-1">Fecha: {new Date().toISOString().split('T')[0]}</p>
            </div>

            {/* Cuerpo de Ítems */}
            <div className="p-4 space-y-3.5 flex-1">
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-on-surface-variant dark:text-slate-500 uppercase tracking-wider block">Artículos Facturados</span>
                <div className="space-y-1.5 text-[11px] max-h-[140px] overflow-y-auto pr-1">
                  {purchasedItems.map((item) => (
                    <div key={item.id} className="flex justify-between font-medium">
                      <span className="truncate max-w-[150px] text-on-surface-variant dark:text-slate-400">
                        {item.name} <span className="font-bold text-on-surface dark:text-white">x{item.quantity}</span>
                      </span>
                      <span className="font-mono text-on-surface dark:text-slate-200">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información de Cliente y Pago */}
              <div className="border-t border-outline-variant/30 dark:border-slate-850/65 pt-3 space-y-2 text-[10px]">
                <div>
                  <span className="text-on-surface-variant/70 dark:text-slate-500 block font-bold uppercase tracking-wider">Cliente Facturado:</span>
                  <span className="font-semibold text-on-surface dark:text-slate-350">{user?.nombre}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant/70 dark:text-slate-500 block font-bold uppercase tracking-wider">Lugar de Entrega:</span>
                  <span className="font-semibold text-on-surface dark:text-slate-350 truncate block">{address}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant/70 dark:text-slate-500 block font-bold uppercase tracking-wider">Método de Pago:</span>
                  <span className="font-bold text-secondary dark:text-sky-400 capitalize">
                    {paymentMethod === 'card' ? 'Tarjeta de Crédito' : paymentMethod === 'transfer' ? 'Transferencia Bancaria' : 'Pago contra Entrega'}
                  </span>
                </div>
              </div>

              {/* Caja de Cálculos Finales */}
              <div className="border-t border-outline-variant/30 dark:border-slate-850/65 pt-3 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-on-surface-variant dark:text-slate-550">
                  <span>Subtotal Neto</span>
                  <span className="font-bold font-mono">${receiptSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant dark:text-slate-550">
                  <span>IGV / IVA (18%)</span>
                  <span className="font-bold font-mono">${receiptTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant dark:text-slate-550">
                  <span>Costo de Despacho</span>
                  <span className="font-bold font-mono">${receiptShipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-black text-on-surface dark:text-white border-t border-outline-variant/20 dark:border-slate-850/40 pt-2 mt-1">
                  <span>TOTAL ABONADO</span>
                  <span className="font-mono text-primary dark:text-sky-400 text-sm">${receiptTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Pie de Ticket Decorativo */}
            <div className="bg-primary/5 dark:bg-sky-500/5 px-4 py-3 text-center border-t border-dashed border-outline-variant/40 flex items-center justify-center gap-1 text-[9px] font-bold text-on-surface-variant/60 dark:text-slate-500">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Documento firmado digitalmente por TechFix S.A.C.</span>
            </div>
          </div>

          {/* Action button */}
          <button 
            type="button"
            onClick={resetCheckout}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 font-bold text-sm cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Listo (Seguir Comprando)
          </button>
        </div>
      )}
    </aside>
  );
}

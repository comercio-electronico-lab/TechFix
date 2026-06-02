'use client';

import React, { useState } from 'react';
import { Lock, Info, CheckCircle, Loader2 } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface CreditCardFormProps {
  totalAmount: number;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ totalAmount }) => {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 10;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    if (!cardHolder || !cardNumber || !cardExpiry || !cardCvv) {
      setErrorMsg('Por favor completa todos los campos de pago.');
      setSubmitting(false);
      return;
    }

    // Simulate payment transaction processing
    setTimeout(() => {
      // Get shipping details
      const savedAddressString = localStorage.getItem('techfix_shipping_address');
      let shippingInfo = { fullName: user?.nombre || 'Cliente', address: 'Entrega en tienda' };
      if (savedAddressString) {
        try {
          shippingInfo = JSON.parse(savedAddressString);
        } catch (e) {
          console.error(e);
        }
      }

      // Record final order
      const invoiceData = {
        orderNumber: `#TF-${Math.floor(1000 + Math.random() * 9000)}-0029X`,
        email: user?.email || 'cliente@correo.com',
        clientName: shippingInfo.fullName,
        address: shippingInfo.address,
        estimatedDate: 'En 3 a 5 días hábiles',
        courier: 'TechFix Express',
        items: items,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax
      };

      localStorage.setItem('techfix_last_order', JSON.stringify(invoiceData));
      
      // Clear shopping cart
      clearCart();
      setSubmitting(false);

      // Navigate to confirmation page
      router.push('/checkout/confirmacion');
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 dark:border-slate-800 p-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-primary dark:text-white">Información de la Tarjeta</h3>
        <div className="flex gap-2">
          <div className="h-8 w-12 bg-surface-container rounded flex items-center justify-center font-bold text-[10px] text-on-surface-variant dark:text-slate-400 border dark:border-slate-800">VISA</div>
          <div className="h-8 w-12 bg-surface-container rounded flex items-center justify-center font-bold text-[10px] text-on-surface-variant dark:text-slate-400 border dark:border-slate-800">MC</div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-error-container/20 border border-error/30 text-error rounded-xl p-4 mb-6 text-sm">
          {errorMsg}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input 
          label="NOMBRE DEL TITULAR" 
          placeholder="Ej: Juan Pérez" 
          iconPosition="left" 
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
          required
        />
        <Input 
          label="NÚMERO DE TARJETA" 
          placeholder="0000 0000 0000 0000" 
          icon={Lock} 
          iconPosition="left" 
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
          required
        />
        <div className="grid grid-cols-2 gap-6">
          <Input 
            label="FECHA DE EXPIRACIÓN" 
            placeholder="MM / YY" 
            value={cardExpiry}
            onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
            required
          />
          <Input 
            label="CVV / CVC" 
            placeholder="***" 
            type="password" 
            icon={Info} 
            iconPosition="left" 
            value={cardCvv}
            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
            required
          />
        </div>
        
        <div className="flex items-center gap-3 py-4">
          <input type="checkbox" className="w-5 h-5 text-secondary border-outline-variant rounded focus:ring-secondary cursor-pointer" id="save_card" defaultChecked />
          <label htmlFor="save_card" className="text-sm text-on-surface-variant dark:text-slate-400 cursor-pointer">Guardar detalles para futuras compras técnicas</label>
        </div>
        
        <Button 
          type="submit" 
          variant="secondary" 
          className="w-full py-5 text-xl flex justify-center items-center gap-2 shadow-lg"
          isLoading={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Procesando Pago Seguro...
            </>
          ) : (
            <>
              <CheckCircle className="w-6 h-6" />
              COMPLETAR COMPRA — ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreditCardForm;

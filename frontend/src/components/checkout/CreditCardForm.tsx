"use client";

import React from 'react';
import { Lock, Info, CheckCircle } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Link from 'next/link';

interface CreditCardFormProps {
  totalAmount: number;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ totalAmount }) => {
  return (
    <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 p-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-primary">Información de la Tarjeta</h3>
        <div className="flex gap-2">
          <div className="h-8 w-12 bg-surface-container rounded flex items-center justify-center font-bold text-[10px] text-on-surface-variant">VISA</div>
          <div className="h-8 w-12 bg-surface-container rounded flex items-center justify-center font-bold text-[10px] text-on-surface-variant">MC</div>
        </div>
      </div>
      
      <form className="space-y-6">
        <Input label="NOMBRE DEL TITULAR" placeholder="Ej: Juan Pérez" iconPosition="left" />
        <Input label="NÚMERO DE TARJETA" placeholder="0000 0000 0000 0000" icon={Lock} iconPosition="left" />
        <div className="grid grid-cols-2 gap-6">
          <Input label="FECHA DE EXPIRACIÓN" placeholder="MM / YY" />
          <Input label="CVV / CVC" placeholder="***" type="password" icon={Info} iconPosition="left" />
        </div>
        
        <div className="flex items-center gap-3 py-4">
          <input type="checkbox" className="w-5 h-5 text-secondary border-outline-variant rounded focus:ring-secondary cursor-pointer" id="save_card" />
          <label htmlFor="save_card" className="text-sm text-on-surface-variant cursor-pointer">Guardar detalles para futuras compras técnicas</label>
        </div>
        
        <Link href="/checkout/confirmacion">
          <Button variant="secondary" className="w-full py-5 text-xl flex justify-center items-center gap-2 shadow-lg">
            <CheckCircle className="w-6 h-6" />
            COMPLETAR COMPRA — ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Button>
        </Link>
      </form>
    </div>
  );
};

export default CreditCardForm;

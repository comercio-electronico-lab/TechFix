"use client";

import React from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Link from 'next/link';

const ShippingForm = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/10">
      <div className="flex items-center gap-3 mb-8 border-b border-outline-variant/20 pb-4">
        <Lock className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-primary">Información de Envío</h1>
      </div>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="NOMBRE COMPLETO" placeholder="Ej: Juan Pérez" iconPosition="left" />
          <Input label="TELÉFONO" placeholder="+51 999 999 999" iconPosition="left" />
        </div>
        
        <Input label="DIRECCIÓN" placeholder="Calle, número, departamento" iconPosition="left" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input label="CIUDAD" placeholder="Ej: Lima" iconPosition="left" />
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-primary uppercase tracking-tight">ESTADO / PROVINCIA</label>
            <select className="w-full bg-white border border-outline-variant/50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-secondary transition-all">
              <option>Seleccionar...</option>
              <option>Lima</option>
              <option>Arequipa</option>
              <option>Cusco</option>
            </select>
          </div>
          <Input label="CÓDIGO POSTAL" placeholder="15047" iconPosition="left" />
        </div>
        
        <div className="pt-6 border-t border-outline-variant/20 flex items-center gap-3">
          <input type="checkbox" className="w-5 h-5 text-secondary border-outline rounded focus:ring-secondary cursor-pointer" id="save_info" />
          <label htmlFor="save_info" className="text-sm text-on-surface-variant cursor-pointer">Guardar esta información para futuras órdenes</label>
        </div>
        
        <div className="flex justify-between items-center pt-8">
          <Link href="/carrito" className="flex items-center gap-2 text-primary hover:text-secondary transition-colors font-bold">
            Volver al Carrito
          </Link>
          <Link href="/checkout/pago">
            <Button variant="secondary" className="px-8 py-4 shadow-md hover:brightness-110 flex items-center gap-2">
              Continuar al Pago
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;

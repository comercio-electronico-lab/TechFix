'use client';

import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getMockPhone, getMockAddress, getMockZipCode } from '@/data/mock';

const mockShippingData = {
  phone: getMockPhone(),
  address: getMockAddress(),
  zipCode: getMockZipCode(),
};

const ShippingForm = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.nombre || 'Cliente Laboratorio');
  const [phone, setPhone] = useState(mockShippingData.phone);
  const [address, setAddress] = useState(mockShippingData.address);
  const [city, setCity] = useState('Lima');
  const [stateProv, setStateProv] = useState('Lima');
  const [zipCode, setZipCode] = useState(mockShippingData.zipCode);
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-fill name from authenticated user details
  useEffect(() => {
    if (user?.nombre) {
      setFullName(user.nombre);
    }
  }, [user]);

  // Load existing shipping info if any
  useEffect(() => {
    const saved = localStorage.getItem('techfix_shipping_address');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFullName(parsed.fullName || user?.nombre || '');
        setPhone(parsed.phone || '');
        setAddress(parsed.address || '');
        setCity(parsed.city || '');
        setStateProv(parsed.stateProv || 'Lima');
        setZipCode(parsed.zipCode || '');
      } catch (e) {
        console.error(e);
      }
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !phone || !address || !city || !zipCode) {
      setErrorMsg('Por favor, completa todos los campos del formulario.');
      return;
    }

    // Save shipping info to localStorage
    const shippingDetails = {
      fullName,
      phone,
      address: `${address}, ${city}, ${stateProv}, CP ${zipCode}`,
      city,
      stateProv,
      zipCode
    };
    
    localStorage.setItem('techfix_shipping_address', JSON.stringify(shippingDetails));

    // Redirect programmatically to payment step
    router.push('/checkout/pago');
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/10">
      <div className="flex items-center gap-3 mb-8 border-b border-outline-variant/20 pb-4">
        <Lock className="w-6 h-6 text-primary dark:text-sky-400" />
        <h1 className="text-2xl font-bold text-primary dark:text-white">Información de Envío</h1>
      </div>

      {errorMsg && (
        <div className="bg-error-container/20 border border-error/30 text-error rounded-xl p-4 mb-6 text-sm">
          {errorMsg}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="NOMBRE COMPLETO" 
            placeholder="Ej: Juan Pérez" 
            iconPosition="left" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input 
            label="TELÉFONO" 
            placeholder="+51 999 999 999" 
            iconPosition="left" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        
        <Input 
          label="DIRECCIÓN" 
          placeholder="Calle, número, departamento" 
          iconPosition="left" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input 
            label="CIUDAD" 
            placeholder="Ej: Lima" 
            iconPosition="left" 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-primary dark:text-slate-200 uppercase tracking-tight">ESTADO / PROVINCIA</label>
            <select 
              value={stateProv}
              onChange={(e) => setStateProv(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-outline-variant/50 dark:border-slate-800 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-secondary text-sm font-semibold text-on-surface dark:text-slate-250 transition-all"
            >
              <option value="Lima">Lima</option>
              <option value="Arequipa">Arequipa</option>
              <option value="Cusco">Cusco</option>
              <option value="La Libertad">La Libertad</option>
            </select>
          </div>
          <Input 
            label="CÓDIGO POSTAL" 
            placeholder="15047" 
            iconPosition="left" 
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            required
          />
        </div>
        
        <div className="pt-6 border-t border-outline-variant/20 flex items-center gap-3">
          <input type="checkbox" className="w-5 h-5 text-secondary border-outline rounded focus:ring-secondary cursor-pointer" id="save_info" defaultChecked />
          <label htmlFor="save_info" className="text-sm text-on-surface-variant dark:text-slate-400 cursor-pointer">Guardar esta información para futuras órdenes</label>
        </div>
        
        <div className="flex justify-between items-center pt-8">
          <Link href="/catalogo" className="flex items-center gap-2 text-primary hover:text-secondary dark:text-sky-400 dark:hover:text-sky-300 transition-colors font-bold text-sm">
            Volver al Catálogo
          </Link>
          <Button type="submit" variant="secondary" className="px-8 py-4 shadow-md hover:brightness-110 flex items-center gap-2">
            Continuar al Pago
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;

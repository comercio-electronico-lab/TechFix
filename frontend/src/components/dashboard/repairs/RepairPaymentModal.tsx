'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Info, CheckCircle, Loader2 } from 'lucide-react';
import Script from 'next/script';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { createPaymentAction } from '@/actions';

interface RepairPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  repairId: string;
  deviceName: string;
  onPaymentSuccess: () => void;
}

const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || '';
const isRealMP = MP_PUBLIC_KEY !== '' && MP_PUBLIC_KEY !== 'tu_public_key_de_mercado_pago';

export default function RepairPaymentModal({
  isOpen,
  onClose,
  amount,
  repairId,
  deviceName,
  onPaymentSuccess,
}: RepairPaymentModalProps) {
  const { token, user } = useAuth();
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Mercado Pago states
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loadingBrick, setLoadingBrick] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setErrorMsg('');
      setSubmitting(false);
      setLoadingBrick(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isRealMP || !scriptLoaded || !token || !isOpen) return;

    let brickController: any = null;

    const initBrick = async () => {
      try {
        const mp = new (window as any).MercadoPago(MP_PUBLIC_KEY, { locale: 'es-PE' });
        const bricksBuilder = mp.bricks();
        
        brickController = await bricksBuilder.create('cardPayment', 'repairCardPaymentBrick_container', {
          initialization: {
            amount: amount,
            payer: {
              email: user?.email || '',
            },
          },
          customization: {
            paymentMethods: {
              minInstallments: 1,
              maxInstallments: 12,
            },
          },
          callbacks: {
            onReady: () => {
              setLoadingBrick(false);
            },
            onSubmit: async (formData: any) => {
              try {
                await createPaymentAction(token, {
                  amount: amount,
                  description: `Pago de reparación para ${deviceName} (Orden: ${repairId})`,
                  payer_email: user?.email || '',
                  cardToken: formData.token,
                  installments: formData.installments,
                  repair_id: repairId
                });
                alert('¡Pago procesado con éxito!');
                onPaymentSuccess();
                onClose();
              } catch (err: any) {
                alert(err.message || 'Error al procesar el pago.');
              }
            },
            onError: (error: any) => {
              console.error(error);
              setErrorMsg('Error al inicializar la pasarela de Mercado Pago.');
            },
          },
        });
      } catch (err) {
        console.error("Error initializing MP Brick for repairs:", err);
      }
    };

    initBrick();

    return () => {
      if (brickController && typeof brickController.unmount === 'function') {
        brickController.unmount();
      }
    };
  }, [isRealMP, scriptLoaded, token, isOpen, amount, repairId, deviceName, user]);

  const handleMockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    if (!cardHolder || !cardNumber || !cardExpiry || !cardCvv) {
      setErrorMsg('Por favor completa todos los campos de pago.');
      setSubmitting(false);
      return;
    }

    try {
      if (token && user) {
        await createPaymentAction(token, {
          amount: amount,
          description: `Pago de reparación para ${deviceName} (Orden: ${repairId})`,
          payer_email: user.email,
          cardToken: 'tok_mock_' + Math.floor(Math.random() * 100000),
          installments: 1,
          repair_id: repairId
        });
        alert('Pago simulado con éxito (Aprobado).');
        onPaymentSuccess();
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar el pago seguro en el servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pagar Servicio Técnico">
      <div className="p-6">
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-950 border border-outline-variant/30 rounded-xl">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">DETALLE DEL PAGO</p>
          <div className="flex justify-between items-center text-xs font-semibold text-on-surface dark:text-slate-200">
            <span>{deviceName} (Reparación)</span>
            <span className="font-mono text-sm font-black text-primary dark:text-sky-400">S/. {amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {isRealMP ? (
          <div className="space-y-4">
            <Script
              src="https://sdk.mercadopago.com/js/v2"
              onLoad={() => setScriptLoaded(true)}
            />
            {loadingBrick && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                <p className="text-xs text-on-surface-variant dark:text-slate-400 ml-2">Cargando pasarela segura...</p>
              </div>
            )}
            <div id="repairCardPaymentBrick_container" />
          </div>
        ) : (
          <form onSubmit={handleMockSubmit} className="space-y-4">
            {errorMsg && (
              <div className="bg-error-container/20 border border-error/30 text-error rounded-xl p-3 text-xs">
                {errorMsg}
              </div>
            )}

            <Input 
              label="NOMBRE DEL TITULAR" 
              placeholder="Ej: Juan Pérez" 
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              required
            />
            <Input 
              label="NÚMERO DE TARJETA" 
              placeholder="4009 1753 3280 6176" 
              icon={Lock} 
              iconPosition="left" 
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="EXPIRACIÓN" 
                placeholder="MM / YY" 
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                required
              />
              <Input 
                label="CVV" 
                placeholder="***" 
                type="password" 
                icon={Info} 
                iconPosition="left" 
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                required
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                variant="secondary" 
                className="w-full py-4 text-xs font-black uppercase tracking-wider flex justify-center items-center gap-2 shadow-lg"
                isLoading={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    PAGAR S/. {amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

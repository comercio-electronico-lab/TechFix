'use client';

import React, { useState } from 'react';
import { Lock, Info, CheckCircle, Loader2, ShieldAlert } from 'lucide-react';
import Script from 'next/script';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createPaymentAction, createOrderAction } from '@/actions';
import type { MercadoPagoCardFormData, MercadoPagoBrickController, MercadoPagoBrickError } from '@/types/mercadopago';
import { MP_PUBLIC_KEY, isRealMP, allowMockPayment } from '@/lib/mercadopago';
import { calculateOrderTotals } from '@/lib/pricing';

interface CreditCardFormProps {
  totalAmount: number;
}

interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  phone: string;
  stateProv?: string;
  zipCode?: string;
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

  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loadingBrick, setLoadingBrick] = useState(true);

  const { shipping, tax } = calculateOrderTotals(subtotal);

  const getShippingInfo = (): ShippingInfo => {
    const savedAddressString = localStorage.getItem('techfix_shipping_address');
    const defaults: ShippingInfo = { fullName: user?.nombre || 'Cliente', address: 'Entrega en tienda', city: '', phone: '' };
    if (savedAddressString) {
      try {
        const parsed = JSON.parse(savedAddressString) as Partial<ShippingInfo>;
        return { ...defaults, ...parsed };
      } catch (e) {
        console.error(e);
      }
    }
    return defaults;
  };

  const completeOrder = async (cardToken: string, installments: number, paymentMethodId?: string) => {
    const shippingInfo = getShippingInfo();

    const paymentRecord = await createPaymentAction({
      amount: totalAmount,
      description: `Compra de catálogo TechFix por ${shippingInfo.fullName}`,
      payer_email: user!.email,
      cardToken,
      installments,
      paymentMethodId,
    });

    let orderNumber = `#TF-${Math.floor(1000 + Math.random() * 9000)}-0029X`;

    try {
      const pedido = await createOrderAction({
        payment_id: paymentRecord.id,
        items: items.map((item) => ({ producto_id: item.id, cantidad: item.quantity })),
        nombre_envio: shippingInfo.fullName,
        direccion_envio: shippingInfo.address,
        ciudad_envio: shippingInfo.city || '',
        telefono_envio: shippingInfo.phone || '',
        envio: shipping,
        impuestos: tax,
      });
      orderNumber = pedido.id;
    } catch (orderErr) {
      // El pago ya se registró; si el pedido no pudo persistirse (p.ej. producto fuera de catálogo)
      // seguimos con la confirmación para no bloquear al cliente que ya pagó.
      console.error('Error al registrar el pedido en el backend:', orderErr);
    }

    const invoiceData = {
      orderNumber,
      email: user?.email || 'cliente@correo.com',
      clientName: shippingInfo.fullName,
      address: shippingInfo.address,
      estimatedDate: 'En 3 a 5 días hábiles',
      courier: 'TechFix Express',
      items,
      subtotal,
      shipping,
      tax,
    };

    localStorage.setItem('techfix_last_order', JSON.stringify(invoiceData));
    clearCart();
    router.push(`/checkout/confirmacion?orderId=${orderNumber}`);
  };

  React.useEffect(() => {
    // totalAmount cae a 0 justo después de una compra exitosa (clearCart()
    // vacía el carrito antes de que termine la navegación a /confirmacion);
    // sin esta guarda, el efecto reintenta inicializar el Brick con amount:0
    // y Mercado Pago lo rechaza con "Amount property is required".
    if (!isRealMP || !scriptLoaded || !user || totalAmount <= 0) return;

    // React Strict Mode ejecuta este efecto dos veces en desarrollo; sin esta
    // guarda, la segunda llamada a bricksBuilder.create() choca con el iframe
    // que la primera dejó a medio montar y el SDK de MP falla con un error
    // genérico "Bricks component initialization failed".
    let cancelled = false;
    let brickController: MercadoPagoBrickController | null = null;

    const initBrick = async () => {
      const container = document.getElementById('checkoutCardPaymentBrick_container');
      if (container) container.innerHTML = '';

      try {
        const mp = new window.MercadoPago(MP_PUBLIC_KEY, { locale: 'es-PE' });
        const bricksBuilder = mp.bricks();

        const controller = await bricksBuilder.create('cardPayment', 'checkoutCardPaymentBrick_container', {
          initialization: {
            amount: totalAmount,
            payer: { email: user.email },
          },
          customization: {
            paymentMethods: { minInstallments: 1, maxInstallments: 1 },
          },
          callbacks: {
            onReady: () => setLoadingBrick(false),
            onSubmit: async (formData: MercadoPagoCardFormData) => {
              try {
                setSubmitting(true);
                await completeOrder(formData.token, formData.installments, formData.payment_method_id);
              } catch (err: unknown) {
                setErrorMsg(err instanceof Error ? err.message : 'Error al procesar el pago.');
              } finally {
                setSubmitting(false);
              }
            },
            onError: (error: MercadoPagoBrickError) => {
              // El Brick reporta eventos "non_critical" mientras el usuario todavía
              // está escribiendo la tarjeta (ej. BIN no identificable aún); no son
              // errores reales, así que ni se loguean como error ni interrumpen
              // el checkout con un banner.
              if (error?.type === 'non_critical') {
                console.debug('[MercadoPago Brick]', error);
                return;
              }
              console.error(error);
              setErrorMsg('Error al inicializar la pasarela de Mercado Pago.');
            },
          },
        });

        if (cancelled) {
          controller.unmount();
          return;
        }
        brickController = controller;
      } catch (err) {
        console.error('Error initializing MP Brick for checkout:', err);
      }
    };

    initBrick();

    return () => {
      cancelled = true;
      if (brickController && typeof brickController.unmount === 'function') {
        brickController.unmount();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded, user, totalAmount]);

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
      if (!user) throw new Error('Debes iniciar sesión para completar la compra.');
      await completeOrder('tok_mock_' + Math.floor(Math.random() * 100000), 1);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al procesar el pago seguro en el servidor.');
    } finally {
      setSubmitting(false);
    }
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

      {isRealMP ? (
        <div className="space-y-4">
          <Script src="https://sdk.mercadopago.com/js/v2" onLoad={() => setScriptLoaded(true)} />
          {loadingBrick && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-secondary" />
              <p className="text-xs text-on-surface-variant dark:text-slate-400 ml-2">Cargando pasarela segura...</p>
            </div>
          )}
          <div id="checkoutCardPaymentBrick_container" />
        </div>
      ) : !allowMockPayment ? (
        <div className="bg-error-container/20 border border-error/30 text-error rounded-xl p-6 flex flex-col items-center text-center gap-3">
          <ShieldAlert className="w-8 h-8" />
          <p className="font-semibold">El pago con tarjeta no está disponible en este momento.</p>
          <p className="text-sm opacity-80">Por favor, inténtalo más tarde o contacta a soporte.</p>
        </div>
      ) : (
        <form onSubmit={handleMockSubmit} className="space-y-6">
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
      )}
    </div>
  );
};

export default CreditCardForm;

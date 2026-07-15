export const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || '';

export const isRealMP = MP_PUBLIC_KEY !== '' && MP_PUBLIC_KEY !== 'tu_public_key_de_mercado_pago';

// El formulario de tarjeta "mock" pide PAN/CVV en campos propios (no tokenizados por MP).
// Nunca debe quedar como fallback silencioso en producción: si isRealMP es false ahí,
// es una pasarela mal configurada y hay que mostrar un error, no una tarjeta falsa.
export const allowMockPayment = isRealMP || process.env.NODE_ENV !== 'production';

if (!isRealMP && process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  console.error(
    '[MercadoPago] NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY no está configurada en producción. El checkout con tarjeta quedará deshabilitado.'
  );
}

'use server';

import { getAuthToken } from '@/lib/auth-token';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function createPaymentAction(paymentData: {
  amount: number;
  description: string;
  payer_email: string;
  repair_id?: string;
  installments?: number;
  cardToken?: string;
  paymentMethodId?: string;
  payerIdentificationType?: string;
  payerIdentificationNumber?: string;
}) {
  const token = await getAuthToken();
  const response = await fetch(`${BACKEND_URL}/api/payments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: paymentData.amount,
      description: paymentData.description,
      payer_email: paymentData.payer_email,
      repair_id: paymentData.repair_id,
      installments: paymentData.installments || 1,
      token: paymentData.cardToken || '',
      payment_method_id: paymentData.paymentMethodId || '',
      payer_identification_type: paymentData.payerIdentificationType || '',
      payer_identification_number: paymentData.payerIdentificationNumber || '',
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al procesar el pago');
  }

  return await response.json();
}

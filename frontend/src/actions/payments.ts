'use server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function createPaymentAction(token: string, paymentData: {
  amount: number;
  description: string;
  payer_email: string;
  repair_id?: string;
  installments?: number;
  cardToken?: string;
}) {
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
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al procesar el pago');
  }

  return await response.json();
}

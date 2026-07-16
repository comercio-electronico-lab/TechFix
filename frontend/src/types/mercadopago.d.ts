export interface MercadoPagoCardFormData {
  token: string;
  installments: number;
  payment_method_id: string;
  issuer_id?: string;
  payer?: {
    email?: string;
    identification?: { type?: string; number?: string };
  };
}

export interface MercadoPagoBrickController {
  unmount: () => void;
}

export interface MercadoPagoBrickError {
  type: 'critical' | 'non_critical';
  cause?: string;
  message?: string;
}

interface MercadoPagoBricksBuilder {
  create: (
    brickType: string,
    containerId: string,
    settings: Record<string, unknown>
  ) => Promise<MercadoPagoBrickController>;
}

interface MercadoPagoInstance {
  bricks: () => MercadoPagoBricksBuilder;
}

declare global {
  interface Window {
    MercadoPago: new (publicKey: string, options?: { locale?: string }) => MercadoPagoInstance;
  }
}

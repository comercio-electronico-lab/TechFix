export interface PurchaseItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CustomerPurchase {
  orderNumber: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  estimatedDeliveryDate?: string;
  trackingNumber?: string;
  items: PurchaseItem[];
}

export const mockPurchases: CustomerPurchase[] = [
  {
    orderNumber: 'ORD-2026-9812',
    date: '2026-05-12T14:30:00Z',
    status: 'delivered',
    subtotal: 199.00,
    tax: 35.82,
    total: 234.82,
    paymentMethod: 'Tarjeta de Crédito (Visa **** 4321)',
    trackingNumber: 'TRK-PE-881239',
    items: [
      {
        id: 'RAM-015',
        name: 'DDR5 32GB Kit (2x16GB) 5200MHz',
        price: 199.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?w=150&auto=format&fit=crop&q=60',
      }
    ]
  },
  {
    orderNumber: 'ORD-2026-9745',
    date: '2026-04-05T09:15:00Z',
    status: 'delivered',
    subtotal: 90.00,
    tax: 16.20,
    total: 106.20,
    paymentMethod: 'PayPal (carlos.g@example.com)',
    trackingNumber: 'TRK-PE-772183',
    items: [
      {
        id: 'prod1',
        name: 'Cable de carga USB-C trenzado 2m',
        price: 45.00,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1541660802143-117369b4c919?w=150&auto=format&fit=crop&q=60',
      }
    ]
  },
  {
    orderNumber: 'ORD-2026-9905',
    date: '2026-06-02T11:45:00Z',
    status: 'processing',
    subtotal: 649.00,
    tax: 116.82,
    total: 765.82,
    paymentMethod: 'Tarjeta de Débito (Mastercard **** 8890)',
    estimatedDeliveryDate: '2026-06-05',
    items: [
      {
        id: '3',
        name: 'Pantalla de Precisión 4K 27"',
        price: 649.00,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoHyUO_CJZH4O0q3yR0o2wEQRSgN26OmcIndyZw83S-1Q4AcyyhRikgMn2gcJD4Fm6GjSgnqfnNjQx72rywYiVyd4l3__RatgEOjwmQJAuUgEA3Q7kkPuOP1x0X6_4jNJoph4eu8F1O_Vm4wkEJgqa0zMpfcfJbiBNTc9tQURWVyir87IL8sVtvxZxBtzy6JUS_Q-B0NbMh2PtbcpVkZo0A18zofORJ4KMXnJajp68KgngTaDoVxxXWtK0oRAesWrn-tis7pfMTKA',
      }
    ]
  }
];

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 10;
const TAX_RATE = 0.18;

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export function calculateOrderTotals(subtotal: number): OrderTotals {
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  // Mercado Pago rechaza montos con más de 2 decimales exactos; la suma de
  // floats en JS puede producir valores como 116.18999999999999.
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;
  return { subtotal, shipping, tax, total };
}

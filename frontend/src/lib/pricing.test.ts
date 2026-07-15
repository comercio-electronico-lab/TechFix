import { describe, it, expect } from 'vitest';
import { calculateOrderTotals } from './pricing';

describe('calculateOrderTotals', () => {
  it('cobra envío cuando el subtotal es menor o igual al umbral', () => {
    const totals = calculateOrderTotals(100);
    expect(totals.shipping).toBe(10);
  });

  it('no cobra envío cuando el subtotal supera el umbral', () => {
    const totals = calculateOrderTotals(501);
    expect(totals.shipping).toBe(0);
  });

  it('no cobra envío cuando el carrito está vacío (subtotal 0)', () => {
    const totals = calculateOrderTotals(0);
    expect(totals.shipping).toBe(0);
  });

  it('calcula el impuesto como 18% del subtotal', () => {
    const totals = calculateOrderTotals(100);
    expect(totals.tax).toBeCloseTo(18, 2);
  });

  it('redondea el total a 2 decimales para evitar errores de punto flotante', () => {
    // 89.99 * 0.18 = 16.1982, produce residuos de punto flotante al sumar
    const totals = calculateOrderTotals(89.99);
    const decimals = totals.total.toString().split('.')[1]?.length ?? 0;
    expect(decimals).toBeLessThanOrEqual(2);
  });

  it('el total es la suma de subtotal + envío + impuesto', () => {
    const totals = calculateOrderTotals(100);
    expect(totals.total).toBeCloseTo(totals.subtotal + totals.shipping + totals.tax, 2);
  });
});

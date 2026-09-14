import { describe, expect, it } from 'vitest';
import { voltageDivider } from './voltageDivider';

describe('Voltage Divider', () => {
  it('computes Vout for equal resistors: Vin=10V, R1=R2=1k -> Vout=5V', () => {
    const out = voltageDivider.calculate({ Vin: 10, R1: 1000, R2: 1000 });
    expect(out.raw?.Vout).toBeCloseTo(5, 10);
  });

  it('computes Vout for a 9:1 divider', () => {
    const out = voltageDivider.calculate({ Vin: 10, R1: 9000, R2: 1000 });
    expect(out.raw?.Vout).toBeCloseTo(1, 10);
  });

  it('rejects R1=R2=0', () => {
    const errors = voltageDivider.validate({ Vin: 10, R1: 0, R2: 0 }, voltageDivider.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

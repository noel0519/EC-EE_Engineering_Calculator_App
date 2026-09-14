import { describe, expect, it } from 'vitest';
import { acPower } from './acPower';

describe('AC Power', () => {
  it('computes unity power factor (phase=0): P=S, Q=0', () => {
    const out = acPower.calculate({ Vrms: 120, Irms: 10, phase: 0 });
    expect(out.raw?.P).toBeCloseTo(1200, 8);
    expect(out.raw?.Q).toBeCloseTo(0, 8);
    expect(out.raw?.powerFactor).toBeCloseTo(1, 10);
  });

  it('computes purely reactive power at 90 degrees: P=0, Q=S', () => {
    const out = acPower.calculate({ Vrms: 120, Irms: 10, phase: 90 });
    expect(out.raw?.P).toBeCloseTo(0, 6);
    expect(out.raw?.Q).toBeCloseTo(1200, 6);
  });

  it('satisfies S^2 = P^2 + Q^2 for an intermediate angle', () => {
    const out = acPower.calculate({ Vrms: 120, Irms: 10, phase: 30 });
    const P = out.raw!.P as number;
    const Q = out.raw!.Q as number;
    const S = out.raw!.S as number;
    expect(Math.sqrt(P * P + Q * Q)).toBeCloseTo(S, 8);
  });

  it('rejects Irms <= 0', () => {
    const errors = acPower.validate({ Vrms: 120, Irms: 0, phase: 0 }, acPower.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from 'vitest';
import { electricFieldPotential } from './electricFieldPotential';

describe('Electric Field & Potential (Point Charge)', () => {
  it('computes E and V for a 1 nC charge at 1 m', () => {
    const out = electricFieldPotential.calculate({ Q: 1e-9, r: 1 });
    // k = 8.9875e9 -> E = V = k * 1e-9 ≈ 8.9875
    expect(out.raw?.E).toBeGreaterThan(8.9);
    expect(out.raw?.E).toBeLessThan(9.0);
    expect(out.raw?.V).toBeCloseTo(out.raw?.E as number, 6);
  });

  it('E follows an inverse-square distance law (4x at half the distance)', () => {
    const a = electricFieldPotential.calculate({ Q: 1e-9, r: 1 });
    const b = electricFieldPotential.calculate({ Q: 1e-9, r: 2 });
    expect((a.raw!.E as number) / (b.raw!.E as number)).toBeCloseTo(4, 6);
  });

  it('V follows inverse (not inverse-square) distance law', () => {
    const a = electricFieldPotential.calculate({ Q: 1e-9, r: 1 });
    const b = electricFieldPotential.calculate({ Q: 1e-9, r: 2 });
    expect((a.raw!.V as number) / (b.raw!.V as number)).toBeCloseTo(2, 6);
  });

  it('rejects Q=0 (nonZero field)', () => {
    const errors = electricFieldPotential.validate({ Q: 0, r: 1 }, electricFieldPotential.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

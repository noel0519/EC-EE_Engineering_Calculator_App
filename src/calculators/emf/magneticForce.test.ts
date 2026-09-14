import { describe, expect, it } from 'vitest';
import { magneticForce } from './magneticForce';

describe('Magnetic Force', () => {
  it('computes force on a moving charge: q=1C, v=1m/s, B=1T, theta=90 -> F=1N', () => {
    const out = magneticForce.calculate({ mode: 'charge', q: 1, v: 1, I: 0, L: 0, B: 1, theta: 90 });
    expect(out.raw?.force).toBeCloseTo(1, 10);
  });

  it('computes force on a wire: I=2A, L=0.5m, B=1T, theta=90 -> F=1N', () => {
    const out = magneticForce.calculate({ mode: 'wire', q: 0, v: 0, I: 2, L: 0.5, B: 1, theta: 90 });
    expect(out.raw?.force).toBeCloseTo(1, 10);
  });

  it('yields zero force when the field is parallel to velocity/current (theta=0)', () => {
    const out = magneticForce.calculate({ mode: 'wire', q: 0, v: 0, I: 2, L: 0.5, B: 1, theta: 0 });
    expect(out.raw?.force).toBeCloseTo(0, 10);
  });

  it('rejects zero current for wire mode', () => {
    const errors = magneticForce.validate({ mode: 'wire', I: 0, L: 1, B: 1, theta: 90 });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects zero charge for charge mode', () => {
    const errors = magneticForce.validate({ mode: 'charge', q: 0, v: 1, B: 1, theta: 90 });
    expect(errors.length).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from 'vitest';
import { dcPower } from './dcPower';

describe('DC Power', () => {
  it('computes P=VI: 10V, 2A -> 20W', () => {
    const out = dcPower.calculate({ given: 'VI', V: 10, I: 2, R: 0 });
    expect(out.raw?.P).toBeCloseTo(20, 10);
  });

  it('computes P=I^2R: 2A, 5Ω -> 20W', () => {
    const out = dcPower.calculate({ given: 'IR', V: 0, I: 2, R: 5 });
    expect(out.raw?.P).toBeCloseTo(20, 10);
  });

  it('computes P=V^2/R: 10V, 5Ω -> 20W', () => {
    const out = dcPower.calculate({ given: 'VR', V: 10, I: 0, R: 5 });
    expect(out.raw?.P).toBeCloseTo(20, 10);
  });

  it('rejects R=0 when resistance is a given quantity', () => {
    const errors = dcPower.validate({ given: 'VR', V: 10, R: 0 }, dcPower.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

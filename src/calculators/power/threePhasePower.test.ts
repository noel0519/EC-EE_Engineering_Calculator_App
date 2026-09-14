import { describe, expect, it } from 'vitest';
import { threePhasePower } from './threePhasePower';

describe('Three-Phase Power', () => {
  it('computes real power at unity power factor: P = sqrt(3)*VL*IL', () => {
    const out = threePhasePower.calculate({ VL: 400, IL: 10, powerFactor: 1 });
    expect(out.raw?.P).toBeCloseTo(Math.sqrt(3) * 400 * 10, 6);
    expect(out.raw?.Q).toBeCloseTo(0, 6);
  });

  it('computes apparent power independent of power factor', () => {
    const a = threePhasePower.calculate({ VL: 400, IL: 10, powerFactor: 1 });
    const b = threePhasePower.calculate({ VL: 400, IL: 10, powerFactor: 0.8 });
    expect(a.raw?.S).toBeCloseTo(b.raw?.S as number, 8);
  });

  it('rejects a power factor outside [-1, 1]', () => {
    const errors = threePhasePower.validate({ VL: 400, IL: 10, powerFactor: 1.2 });
    expect(errors.length).toBeGreaterThan(0);
  });
});

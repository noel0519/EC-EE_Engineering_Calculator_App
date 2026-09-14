import { describe, expect, it } from 'vitest';
import { propagationDelay } from './propagationDelay';

describe('CMOS Propagation Delay & Rise/Fall Time', () => {
  it('computes tpd = 0.69RC for R=1kΩ, C=1pF', () => {
    const out = propagationDelay.calculate({ R: 1000, C: 1e-12 });
    expect(out.raw?.tpd).toBeCloseTo(0.69 * 1000 * 1e-12, 15);
  });

  it('computes rise/fall time as ~3.19x the propagation delay (2.2 / 0.69)', () => {
    const out = propagationDelay.calculate({ R: 1000, C: 1e-12 });
    expect((out.raw!.tRiseFall as number) / (out.raw!.tpd as number)).toBeCloseTo(2.2 / 0.69, 4);
  });

  it('rejects R=0', () => {
    const errors = propagationDelay.validate({ R: 0, C: 1e-12 }, propagationDelay.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

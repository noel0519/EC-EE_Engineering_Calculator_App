import { describe, expect, it } from 'vitest';
import { rcTimeConstant } from './rcTimeConstant';

describe('RC Time Constant', () => {
  it('computes tau = R*C: 10kΩ, 100nF -> 1ms', () => {
    const out = rcTimeConstant.calculate({ mode: 'charging', R: 10000, C: 100e-9, Vsource: 5, t: 0 });
    expect(out.raw?.tau).toBeCloseTo(0.001, 12);
  });

  it('charges to ~63.2% of source after one time constant', () => {
    const R = 1000;
    const C = 1e-6;
    const tau = R * C;
    const out = rcTimeConstant.calculate({ mode: 'charging', R, C, Vsource: 10, t: tau });
    expect(out.raw?.Vc).toBeCloseTo(10 * (1 - Math.exp(-1)), 8);
  });

  it('discharges to ~36.8% of source after one time constant', () => {
    const R = 1000;
    const C = 1e-6;
    const tau = R * C;
    const out = rcTimeConstant.calculate({ mode: 'discharging', R, C, Vsource: 10, t: tau });
    expect(out.raw?.Vc).toBeCloseTo(10 * Math.exp(-1), 8);
  });

  it('rejects negative elapsed time', () => {
    const errors = rcTimeConstant.validate({ mode: 'charging', R: 1000, C: 1e-6, Vsource: 5, t: -1 }, rcTimeConstant.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

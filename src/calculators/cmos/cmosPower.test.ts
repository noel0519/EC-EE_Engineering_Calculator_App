import { describe, expect, it } from 'vitest';
import { cmosPower } from './cmosPower';

describe('CMOS Static / Dynamic / Total Power', () => {
  it('computes dynamic power: alpha=1, C=1pF, VDD=1V, f=1GHz -> 1mW', () => {
    const out = cmosPower.calculate({ VDD: 1, Ileak: 0, Cload: 1e-12, f: 1e9, alpha: 1 });
    expect(out.raw?.dynamicPower).toBeCloseTo(1e-3, 12);
  });

  it('computes static power as VDD * Ileak', () => {
    const out = cmosPower.calculate({ VDD: 1, Ileak: 1e-6, Cload: 1e-12, f: 1e9, alpha: 0 });
    expect(out.raw?.staticPower).toBeCloseTo(1e-6, 15);
    expect(out.raw?.dynamicPower).toBeCloseTo(0, 15);
  });

  it('sums static and dynamic into total power', () => {
    const out = cmosPower.calculate({ VDD: 1, Ileak: 1e-6, Cload: 1e-12, f: 1e9, alpha: 1 });
    expect(out.raw?.totalPower).toBeCloseTo((out.raw!.staticPower as number) + (out.raw!.dynamicPower as number), 15);
  });

  it('rejects an activity factor outside [0, 1]', () => {
    const errors = cmosPower.validate({ VDD: 1, Ileak: 0, Cload: 1e-12, f: 1e9, alpha: 1.5 }, cmosPower.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

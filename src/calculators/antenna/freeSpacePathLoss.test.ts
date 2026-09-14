import { describe, expect, it } from 'vitest';
import { freeSpacePathLoss } from './freeSpacePathLoss';

describe('Free-Space Path Loss', () => {
  it('matches the standard FSPL(dB) = 32.44 + 20log10(f_MHz) + 20log10(d_km) reference formula at 2.4 GHz / 1 km', () => {
    const out = freeSpacePathLoss.calculate({ distance: 1000, frequency: 2.4e9 });
    const reference = 32.44 + 20 * Math.log10(2400) + 20 * Math.log10(1);
    expect(out.raw?.fsplDb).toBeCloseTo(reference, 1);
  });

  it('increases by ~6 dB when distance doubles', () => {
    const a = freeSpacePathLoss.calculate({ distance: 1000, frequency: 1e9 });
    const b = freeSpacePathLoss.calculate({ distance: 2000, frequency: 1e9 });
    expect((b.raw!.fsplDb as number) - (a.raw!.fsplDb as number)).toBeCloseTo(20 * Math.log10(2), 6);
  });

  it('rejects zero distance', () => {
    const errors = freeSpacePathLoss.validate({ distance: 0, frequency: 1e9 }, freeSpacePathLoss.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

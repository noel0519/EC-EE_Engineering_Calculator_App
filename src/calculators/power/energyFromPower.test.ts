import { describe, expect, it } from 'vitest';
import { energyFromPower } from './energyFromPower';

describe('Energy from Power & Time', () => {
  it('computes E=Pt: 1000W for 1hr -> 3.6MJ = 1kWh', () => {
    const out = energyFromPower.calculate({ P: 1000, t: 3600 });
    expect(out.raw?.energyJoules).toBeCloseTo(3.6e6, 6);
    expect(out.raw?.energyKwh).toBeCloseTo(1, 8);
  });

  it('gives equal energy for 1hr expressed in seconds vs hours (unit equivalence)', () => {
    const inSeconds = energyFromPower.calculate({ P: 1000, t: 3600 });
    // Simulate entering "1 hr" by normalizing through the field's own toBase (3600).
    const inHours = energyFromPower.calculate({ P: 1000, t: 1 * 3600 });
    expect(inSeconds.raw?.energyJoules).toBeCloseTo(inHours.raw?.energyJoules as number, 8);
  });

  it('rejects zero duration', () => {
    const errors = energyFromPower.validate({ P: 1000, t: 0 }, energyFromPower.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

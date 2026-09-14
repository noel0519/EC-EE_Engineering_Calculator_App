import { describe, expect, it } from 'vitest';
import { powerDbConverter } from './powerDbConverter';

describe('dBm / dBW <-> Watts', () => {
  it('converts 0 dBm to 1 mW', () => {
    const out = powerDbConverter.calculate({ conversion: 'DbmToW', value: 0 });
    expect(out.raw?.watts).toBeCloseTo(0.001, 10);
  });

  it('converts 30 dBm to 30 dBW minus 30 -> 0 dBW', () => {
    const out = powerDbConverter.calculate({ conversion: 'DbmToDbw', value: 30 });
    expect(out.raw?.dbw).toBeCloseTo(0, 10);
  });

  it('round-trips W -> dBm -> W', () => {
    const toDbm = powerDbConverter.calculate({ conversion: 'WToDbm', value: 0.5 });
    const back = powerDbConverter.calculate({ conversion: 'DbmToW', value: toDbm.raw!.dbm as number });
    expect(back.raw?.watts).toBeCloseTo(0.5, 8);
  });

  it('rejects a non-positive watt value when converting to dB', () => {
    const errors = powerDbConverter.validate({ conversion: 'WToDbm', value: 0 });
    expect(errors.length).toBeGreaterThan(0);
  });
});

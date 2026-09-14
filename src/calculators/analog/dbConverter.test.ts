import { describe, expect, it } from 'vitest';
import { dbConverter } from './dbConverter';

describe('dB Converter', () => {
  it('converts a power ratio of 10 to 10 dB', () => {
    const out = dbConverter.calculate({ quantity: 'power', direction: 'toDb', ratio: 10, db: 0 });
    expect(out.raw?.db).toBeCloseTo(10, 8);
  });

  it('converts a power ratio of 2 to ~3.01 dB', () => {
    const out = dbConverter.calculate({ quantity: 'power', direction: 'toDb', ratio: 2, db: 0 });
    expect(out.raw?.db).toBeCloseTo(3.0103, 3);
  });

  it('converts an amplitude ratio of 10 to 20 dB (not 10 dB)', () => {
    const out = dbConverter.calculate({ quantity: 'amplitude', direction: 'toDb', ratio: 10, db: 0 });
    expect(out.raw?.db).toBeCloseTo(20, 8);
  });

  it('round-trips ratio -> dB -> ratio', () => {
    const toDb = dbConverter.calculate({ quantity: 'power', direction: 'toDb', ratio: 5, db: 0 });
    const back = dbConverter.calculate({ quantity: 'power', direction: 'fromDb', ratio: 1, db: toDb.raw!.db as number });
    expect(back.raw?.ratio).toBeCloseTo(5, 8);
  });

  it('rejects a non-positive ratio', () => {
    const errors = dbConverter.validate({ quantity: 'power', direction: 'toDb', ratio: 0, db: 0 }, dbConverter.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

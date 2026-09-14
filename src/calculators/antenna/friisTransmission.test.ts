import { describe, expect, it } from 'vitest';
import { friisTransmission } from './friisTransmission';
import { freeSpacePathLoss } from './freeSpacePathLoss';

describe('Friis Transmission', () => {
  it('matches Pr = Pt + Gt + Gr - FSPL for a simple case', () => {
    const fspl = freeSpacePathLoss.calculate({ distance: 500, frequency: 900e6 });
    const out = friisTransmission.calculate({ ptDbm: 20, gtDbi: 6, grDbi: 3, frequency: 900e6, distance: 500 });
    expect(out.raw?.prDbm).toBeCloseTo(20 + 6 + 3 - (fspl.raw!.fsplDb as number), 6);
  });

  it('computes EIRP as Pt + Gt only (independent of Gr and distance)', () => {
    const out = friisTransmission.calculate({ ptDbm: 30, gtDbi: 10, grDbi: 5, frequency: 2.4e9, distance: 100 });
    expect(out.raw?.eirpDbm).toBeCloseTo(40, 10);
  });

  it('rejects zero frequency', () => {
    const errors = friisTransmission.validate({ ptDbm: 0, gtDbi: 0, grDbi: 0, frequency: 0, distance: 10 });
    expect(errors.length).toBeGreaterThan(0);
  });
});

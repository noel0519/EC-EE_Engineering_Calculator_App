import { describe, expect, it } from 'vitest';
import { magneticField } from './magneticField';

describe('Magnetic Field (Simple Geometries)', () => {
  it('computes B for an infinite wire: I=1A at r=1m (~2e-7 T)', () => {
    const out = magneticField.calculate({ geometry: 'wire', I: 1, r: 1 });
    expect(out.raw?.B).toBeGreaterThan(1.9e-7);
    expect(out.raw?.B).toBeLessThan(2.1e-7);
  });

  it('gives a stronger field at the loop center than at the same-radius wire distance', () => {
    const wire = magneticField.calculate({ geometry: 'wire', I: 1, r: 1 });
    const loop = magneticField.calculate({ geometry: 'loop', I: 1, r: 1 });
    expect(loop.raw!.B as number).toBeGreaterThan(wire.raw!.B as number);
  });

  it('rejects zero current', () => {
    const errors = magneticField.validate({ geometry: 'wire', I: 0, r: 1 }, magneticField.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from 'vitest';
import { parallelPlateCapacitance } from './parallelPlateCapacitance';

describe('Parallel-Plate Capacitance', () => {
  it('computes capacitance for a 1 m² plate, 1mm gap, vacuum (~8.85 nF)', () => {
    const out = parallelPlateCapacitance.calculate({ area: 1, d: 0.001, epsilonR: 1, voltage: 0 });
    expect(out.raw?.C).toBeGreaterThan(8.8e-9);
    expect(out.raw?.C).toBeLessThan(8.9e-9);
  });

  it('scales linearly with relative permittivity', () => {
    const a = parallelPlateCapacitance.calculate({ area: 1, d: 0.001, epsilonR: 1, voltage: 0 });
    const b = parallelPlateCapacitance.calculate({ area: 1, d: 0.001, epsilonR: 4, voltage: 0 });
    expect((b.raw!.C as number) / (a.raw!.C as number)).toBeCloseTo(4, 6);
  });

  it('computes stored charge and energy only when voltage is provided', () => {
    const withV = parallelPlateCapacitance.calculate({ area: 1, d: 0.001, epsilonR: 1, voltage: 10 });
    const withoutV = parallelPlateCapacitance.calculate({ area: 1, d: 0.001, epsilonR: 1, voltage: 0 });
    expect(withV.results.length).toBe(3);
    expect(withoutV.results.length).toBe(1);
  });

  it('rejects zero plate separation', () => {
    const errors = parallelPlateCapacitance.validate({ area: 1, d: 0, epsilonR: 1, voltage: 0 }, parallelPlateCapacitance.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

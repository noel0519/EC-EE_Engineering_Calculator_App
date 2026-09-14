import { describe, expect, it } from 'vitest';
import { seriesParallelResistance } from './seriesParallelResistance';

describe('Series / Parallel Resistance', () => {
  it('sums series resistors: 100 + 200 = 300 Ω', () => {
    const out = seriesParallelResistance.calculate({ mode: 'series', count: '2', R1: 100, R2: 200, R3: 0, R4: 0 });
    expect(out.raw?.total).toBeCloseTo(300, 10);
  });

  it('combines two equal parallel resistors: 100 || 100 = 50 Ω', () => {
    const out = seriesParallelResistance.calculate({ mode: 'parallel', count: '2', R1: 100, R2: 100, R3: 0, R4: 0 });
    expect(out.raw?.total).toBeCloseTo(50, 10);
  });

  it('handles 3 resistors in parallel (known value)', () => {
    // 1/(1/60+1/120+1/40) = 20
    const out = seriesParallelResistance.calculate({ mode: 'parallel', count: '3', R1: 60, R2: 120, R3: 40, R4: 0 });
    expect(out.raw?.total).toBeCloseTo(20, 8);
  });

  it('rejects a zero-valued resistor', () => {
    const errors = seriesParallelResistance.validate(
      { mode: 'series', count: '2', R1: 0, R2: 100, R3: 0, R4: 0 },
      seriesParallelResistance.fields
    );
    expect(errors.length).toBeGreaterThan(0);
  });
});

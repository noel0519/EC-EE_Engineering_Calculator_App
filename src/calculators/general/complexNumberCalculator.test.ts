import { describe, expect, it } from 'vitest';
import { complexNumberCalculator } from './complexNumberCalculator';

describe('Complex Number Calculator', () => {
  it('adds two complex numbers', () => {
    const out = complexNumberCalculator.calculate({ operation: 'add', a: '3+4i', b: '1-2i' });
    expect(out.raw?.re).toBeCloseTo(4, 10);
    expect(out.raw?.im).toBeCloseTo(2, 10);
  });

  it('computes magnitude/phase of 3+4i as 5 / 53.13 deg', () => {
    const out = complexNumberCalculator.calculate({ operation: 'polar', a: '3+4i', b: '' });
    expect(out.raw?.magnitude).toBeCloseTo(5, 10);
    expect(out.raw?.phaseDeg).toBeCloseTo(53.13, 1);
  });

  it('multiplies i * i = -1', () => {
    const out = complexNumberCalculator.calculate({ operation: 'multiply', a: 'i', b: 'i' });
    expect(out.raw?.re).toBeCloseTo(-1, 10);
    expect(out.raw?.im).toBeCloseTo(0, 10);
  });

  it('rejects an unparseable value for A', () => {
    const errors = complexNumberCalculator.validate({ operation: 'add', a: 'garbage', b: '1+1i' });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects division by zero', () => {
    const errors = complexNumberCalculator.validate({ operation: 'divide', a: '1+1i', b: '0' });
    expect(errors.length).toBeGreaterThan(0);
  });
});

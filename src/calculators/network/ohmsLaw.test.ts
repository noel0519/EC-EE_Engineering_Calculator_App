import { describe, expect, it } from 'vitest';
import { ohmsLaw } from './ohmsLaw';

describe("Ohm's Law", () => {
  it('solves for voltage: I=2A, R=5Ω -> V=10V', () => {
    const out = ohmsLaw.calculate({ solveFor: 'V', I: 2, R: 5, V: NaN });
    expect(out.raw?.V).toBeCloseTo(10, 10);
  });

  it('solves for current: V=10V, R=5Ω -> I=2A', () => {
    const out = ohmsLaw.calculate({ solveFor: 'I', V: 10, R: 5, I: NaN });
    expect(out.raw?.I).toBeCloseTo(2, 10);
  });

  it('solves for resistance: V=10V, I=2A -> R=5Ω', () => {
    const out = ohmsLaw.calculate({ solveFor: 'R', V: 10, I: 2, R: NaN });
    expect(out.raw?.R).toBeCloseTo(5, 10);
  });

  it('rejects R=0 (division by zero) when solving for current', () => {
    const errors = ohmsLaw.validate({ solveFor: 'I', V: 10, R: 0 }, ohmsLaw.fields);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects I=0 when solving for resistance', () => {
    const errors = ohmsLaw.validate({ solveFor: 'R', V: 10, I: 0 }, ohmsLaw.fields);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('gives the same result for R in kΩ vs Ω after normalization', () => {
    const a = ohmsLaw.calculate({ solveFor: 'V', I: 0.002, R: 5000 });
    expect(a.raw?.V).toBeCloseTo(10, 10);
  });
});

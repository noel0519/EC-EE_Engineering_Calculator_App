import { describe, expect, it } from 'vitest';
import { quadraticSolver } from './quadraticSolver';

describe('Quadratic Equation Solver', () => {
  it('solves x^2 - 3x + 2 = 0 -> roots 1 and 2', () => {
    const out = quadraticSolver.calculate({ a: 1, b: -3, c: 2 });
    const roots = [out.raw?.x1, out.raw?.x2].sort();
    expect(roots[0]).toBeCloseTo(1, 10);
    expect(roots[1]).toBeCloseTo(2, 10);
  });

  it('solves the repeated-root boundary case x^2 - 4x + 4 = 0 -> x=2', () => {
    const out = quadraticSolver.calculate({ a: 1, b: -4, c: 4 });
    expect(out.raw?.discriminant).toBeCloseTo(0, 10);
    expect(out.raw?.x).toBeCloseTo(2, 10);
  });

  it('solves the complex case x^2 + 1 = 0 -> roots ±i', () => {
    const out = quadraticSolver.calculate({ a: 1, b: 0, c: 1 });
    expect(out.raw?.discriminant).toBeLessThan(0);
    expect(out.raw?.rePart).toBeCloseTo(0, 10);
    expect(out.raw?.imPart).toBeCloseTo(1, 10);
  });

  it('rejects a=0', () => {
    const errors = quadraticSolver.validate({ a: 0, b: 1, c: 1 });
    expect(errors.length).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from 'vitest';
import { matrixSolver } from './matrixSolver';

describe('Matrix Solver', () => {
  it('computes the determinant of a 2x2 matrix', () => {
    const out = matrixSolver.calculate({ operation: 'determinant', a: '1,2;3,4', b: '' });
    expect(out.raw?.determinant).toBe(-2);
  });

  it('multiplies two matrices', () => {
    const out = matrixSolver.calculate({ operation: 'multiply', a: '1,2;3,4', b: '5,6;7,8' });
    expect(out.results[0].value).toContain('19');
  });

  it('rejects a non-square matrix for determinant', () => {
    const errors = matrixSolver.validate({ operation: 'determinant', a: '1,2,3;4,5,6', b: '' });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects malformed matrix text', () => {
    const errors = matrixSolver.validate({ operation: 'transpose', a: '1,2;3', b: '' });
    expect(errors.length).toBeGreaterThan(0);
  });
});

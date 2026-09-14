import { describe, expect, it } from 'vitest';
import { add, determinant, inverse, multiply, parseMatrix, solveLinearSystem, transpose } from './matrix';

describe('parseMatrix', () => {
  it('parses a well-formed matrix', () => {
    expect(parseMatrix('1,2;3,4')).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it('returns null for ragged rows', () => {
    expect(parseMatrix('1,2;3')).toBeNull();
  });

  it('returns null for non-numeric entries', () => {
    expect(parseMatrix('1,x;3,4')).toBeNull();
  });
});

describe('matrix arithmetic', () => {
  const A = [
    [1, 2],
    [3, 4],
  ];
  const B = [
    [5, 6],
    [7, 8],
  ];

  it('adds two matrices element-wise', () => {
    expect(add(A, B)).toEqual([
      [6, 8],
      [10, 12],
    ]);
  });

  it('multiplies two matrices (known result)', () => {
    expect(multiply(A, B)).toEqual([
      [19, 22],
      [43, 50],
    ]);
  });

  it('transposes a matrix', () => {
    expect(transpose(A)).toEqual([
      [1, 3],
      [2, 4],
    ]);
  });

  it('computes the determinant of a 2x2 matrix', () => {
    expect(determinant(A)).toBe(1 * 4 - 2 * 3);
  });

  it('computes the determinant of a 3x3 matrix (known value)', () => {
    const M = [
      [6, 1, 1],
      [4, -2, 5],
      [2, 8, 7],
    ];
    expect(determinant(M)).toBeCloseTo(-306, 6);
  });

  it('computes an inverse such that A * A^-1 = I', () => {
    const inv = inverse(A);
    const identity = multiply(A, inv);
    expect(identity[0][0]).toBeCloseTo(1, 10);
    expect(identity[0][1]).toBeCloseTo(0, 10);
    expect(identity[1][0]).toBeCloseTo(0, 10);
    expect(identity[1][1]).toBeCloseTo(1, 10);
  });

  it('throws for a singular matrix inverse', () => {
    expect(() => inverse([[1, 2], [2, 4]])).toThrow();
  });

  it('solves a known linear system: x + y = 3, x - y = 1 -> x=2, y=1', () => {
    const A2 = [
      [1, 1],
      [1, -1],
    ];
    const b = [[3], [1]];
    const x = solveLinearSystem(A2, b);
    expect(x[0][0]).toBeCloseTo(2, 8);
    expect(x[1][0]).toBeCloseTo(1, 8);
  });
});

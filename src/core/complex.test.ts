import { describe, expect, it } from 'vitest';
import { add, divide, magnitude, multiply, parseComplex, phase } from './complex';

describe('parseComplex', () => {
  it('parses rectangular form', () => {
    expect(parseComplex('3+4i')).toEqual({ re: 3, im: 4 });
    expect(parseComplex('-2-1.5j')).toEqual({ re: -2, im: -1.5 });
  });

  it('parses a pure real number', () => {
    expect(parseComplex('5')).toEqual({ re: 5, im: 0 });
  });

  it('parses a pure imaginary number', () => {
    expect(parseComplex('-i')).toEqual({ re: 0, im: -1 });
    expect(parseComplex('4i')).toEqual({ re: 0, im: 4 });
  });

  it('returns null for invalid input', () => {
    expect(parseComplex('not a number')).toBeNull();
    expect(parseComplex('')).toBeNull();
  });
});

describe('complex arithmetic', () => {
  it('adds two complex numbers', () => {
    expect(add({ re: 1, im: 2 }, { re: 3, im: -1 })).toEqual({ re: 4, im: 1 });
  });

  it('multiplies two complex numbers (known identity: i * i = -1)', () => {
    expect(multiply({ re: 0, im: 1 }, { re: 0, im: 1 })).toEqual({ re: -1, im: 0 });
  });

  it('divides and matches magnitude/phase of 3+4i (classic 3-4-5 triangle)', () => {
    const a = { re: 3, im: 4 };
    expect(magnitude(a)).toBeCloseTo(5, 10);
    expect(phase(a)).toBeCloseTo(Math.atan2(4, 3), 10);
  });

  it('throws when dividing by zero', () => {
    expect(() => divide({ re: 1, im: 0 }, { re: 0, im: 0 })).toThrow();
  });
});

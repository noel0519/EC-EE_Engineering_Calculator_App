import { describe, expect, it } from 'vitest';
import { formatEngineering, formatNumber } from './format';

describe('formatEngineering', () => {
  it('formats 0.0000012 F as 1.2 µF', () => {
    expect(formatEngineering(0.0000012, 'F')).toBe('1.2 µF');
  });

  it('formats 4700 as 4.7 kΩ', () => {
    expect(formatEngineering(4700, 'Ω')).toBe('4.7 kΩ');
  });

  it('formats exactly zero', () => {
    expect(formatEngineering(0, 'V')).toBe('0 V');
  });

  it('formats NaN and Infinity distinctly', () => {
    expect(formatEngineering(NaN, 'V')).toBe('NaN');
    expect(formatEngineering(Infinity, 'V')).toBe('+Infinity');
    expect(formatEngineering(-Infinity, 'V')).toBe('-Infinity');
  });

  it('formats a negative value with the correct prefix', () => {
    expect(formatEngineering(-2400000, 'Hz')).toBe('-2.4 MHz');
  });
});

describe('formatNumber', () => {
  it('rounds to the requested significant figures', () => {
    expect(formatNumber(3.14159265, 4)).toBe('3.142');
  });
});

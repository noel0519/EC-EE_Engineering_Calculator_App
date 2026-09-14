import { describe, expect, it } from 'vitest';
import { fromBaseUnit, pickEngineeringPrefix, prefixUnits, toBaseUnit } from './units';

describe('prefixUnits', () => {
  it('builds unit options with correct multipliers', () => {
    const units = prefixUnits('Ω', ['', 'k', 'M']);
    expect(units).toEqual([
      { symbol: 'Ω', toBase: 1 },
      { symbol: 'kΩ', toBase: 1e3 },
      { symbol: 'MΩ', toBase: 1e6 },
    ]);
  });

  it('throws on an unknown prefix', () => {
    expect(() => prefixUnits('Ω', ['x'])).toThrow();
  });
});

describe('toBaseUnit / fromBaseUnit', () => {
  it('round-trips a value through a unit conversion', () => {
    const base = toBaseUnit(1, 1e3); // 1 kΩ -> Ω
    expect(base).toBe(1000);
    expect(fromBaseUnit(base, 1e3)).toBe(1);
  });

  it('treats 1 kΩ and 1000 Ω as physically equal after conversion', () => {
    expect(toBaseUnit(1, 1e3)).toBe(toBaseUnit(1000, 1));
  });
});

describe('pickEngineeringPrefix', () => {
  it('picks µ for 1.2e-6', () => {
    expect(pickEngineeringPrefix(1.2e-6).symbol).toBe('µ');
  });

  it('picks k for 4700', () => {
    expect(pickEngineeringPrefix(4700).symbol).toBe('k');
  });

  it('picks no prefix for values in [1, 1000)', () => {
    expect(pickEngineeringPrefix(42).symbol).toBe('');
  });

  it('handles zero without throwing', () => {
    expect(pickEngineeringPrefix(0).symbol).toBe('');
  });
});

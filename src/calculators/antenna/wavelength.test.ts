import { describe, expect, it } from 'vitest';
import { wavelength } from './wavelength';
import { SPEED_OF_LIGHT } from '@/core/constants';

describe('Wavelength <-> Frequency', () => {
  it('computes wavelength for 2.4 GHz (Wi-Fi band, ~12.5 cm)', () => {
    const out = wavelength.calculate({ solveFor: 'lambda', f: 2.4e9, lambda: NaN });
    expect(out.raw?.lambda).toBeCloseTo(SPEED_OF_LIGHT / 2.4e9, 6);
    expect(out.raw?.lambda).toBeCloseTo(0.12491, 4);
  });

  it('computes frequency for a 1m wavelength -> ~300 MHz', () => {
    const out = wavelength.calculate({ solveFor: 'f', lambda: 1, f: NaN });
    expect(out.raw?.f).toBeCloseTo(SPEED_OF_LIGHT, 6);
  });

  it('round-trips f -> lambda -> f', () => {
    const step1 = wavelength.calculate({ solveFor: 'lambda', f: 900e6, lambda: NaN });
    const step2 = wavelength.calculate({ solveFor: 'f', lambda: step1.raw!.lambda as number, f: NaN });
    expect(step2.raw?.f).toBeCloseTo(900e6, 2);
  });

  it('rejects frequency <= 0', () => {
    const errors = wavelength.validate({ solveFor: 'lambda', f: 0, lambda: 1 });
    expect(errors.length).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from 'vitest';
import { adcResolution } from './adcResolution';

describe('ADC Resolution', () => {
  it('computes LSB for an 8-bit ADC with 5V range: 5/256 ≈ 19.53mV', () => {
    const out = adcResolution.calculate({ bits: 8, vfsr: 5 });
    expect(out.raw?.lsb).toBeCloseTo(5 / 256, 10);
  });

  it('computes theoretical SNR for 12 bits: 6.02*12+1.76 = 74.0 dB', () => {
    const out = adcResolution.calculate({ bits: 12, vfsr: 3.3 });
    expect(out.raw?.snrDb).toBeCloseTo(6.02 * 12 + 1.76, 8);
  });

  it('rejects a non-integer bit count', () => {
    const errors = adcResolution.validate({ bits: 8.5, vfsr: 5 });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('handles the 1-bit boundary case', () => {
    const out = adcResolution.calculate({ bits: 1, vfsr: 5 });
    expect(out.raw?.lsb).toBeCloseTo(2.5, 10);
  });
});

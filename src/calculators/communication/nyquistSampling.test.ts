import { describe, expect, it } from 'vitest';
import { nyquistSampling } from './nyquistSampling';

describe('Nyquist Sampling', () => {
  it('computes the Nyquist rate as 2x the max frequency', () => {
    const out = nyquistSampling.calculate({ fmax: 4000, fs: 0 });
    expect(out.raw?.nyquistRate).toBeCloseTo(8000, 6);
  });

  it('flags aliasing risk when fs is below the Nyquist rate', () => {
    const out = nyquistSampling.calculate({ fmax: 4000, fs: 7000 });
    const line = out.results.find((r) => r.label === 'Aliasing risk');
    expect(line?.value).toContain('YES');
  });

  it('reports no aliasing risk when fs meets the Nyquist rate', () => {
    const out = nyquistSampling.calculate({ fmax: 4000, fs: 8000 });
    const line = out.results.find((r) => r.label === 'Aliasing risk');
    expect(line?.value).toBe('No');
  });

  it('rejects fmax=0', () => {
    const errors = nyquistSampling.validate({ fmax: 0, fs: 0 }, nyquistSampling.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

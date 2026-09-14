import { describe, expect, it } from 'vitest';
import { rcLowPassFilter } from './rcLowPassFilter';

describe('RC Low-Pass Filter', () => {
  it('computes cutoff frequency: R=1kΩ, C=159.15nF -> fc ≈ 1kHz', () => {
    const out = rcLowPassFilter.calculate({ R: 1000, C: 159.155e-9, ftest: 0 });
    expect(out.raw?.fc).toBeCloseTo(1000, 0);
  });

  it('shows -3dB attenuation at the cutoff frequency', () => {
    const R = 1000;
    const C = 1e-7;
    const fc = 1 / (2 * Math.PI * R * C);
    const out = rcLowPassFilter.calculate({ R, C, ftest: fc });
    const magLine = out.results.find((r) => r.label.startsWith('Magnitude'));
    expect(magLine?.value).toContain('-3');
  });

  it('rejects R=0', () => {
    const errors = rcLowPassFilter.validate({ R: 0, C: 1e-6, ftest: 0 }, rcLowPassFilter.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

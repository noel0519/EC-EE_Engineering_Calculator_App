import { describe, expect, it } from 'vitest';
import { switchingEnergy } from './switchingEnergy';

describe('CMOS Switching Energy', () => {
  it('computes dissipated energy = 0.5*C*VDD^2', () => {
    const out = switchingEnergy.calculate({ Cload: 1e-12, VDD: 1 });
    expect(out.raw?.dissipatedPerTransition).toBeCloseTo(0.5e-12, 15);
  });

  it('supply energy is exactly double the dissipated energy', () => {
    const out = switchingEnergy.calculate({ Cload: 1e-12, VDD: 1 });
    expect(out.raw?.drawnFromSupply).toBeCloseTo(2 * (out.raw!.dissipatedPerTransition as number), 15);
  });

  it('scales with the square of VDD', () => {
    const a = switchingEnergy.calculate({ Cload: 1e-12, VDD: 1 });
    const b = switchingEnergy.calculate({ Cload: 1e-12, VDD: 2 });
    expect((b.raw!.drawnFromSupply as number) / (a.raw!.drawnFromSupply as number)).toBeCloseTo(4, 10);
  });

  it('rejects VDD=0', () => {
    const errors = switchingEnergy.validate({ Cload: 1e-12, VDD: 0 }, switchingEnergy.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

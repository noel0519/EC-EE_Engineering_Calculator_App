import { describe, expect, it } from 'vitest';
import { switchingThreshold } from './switchingThreshold';

describe('CMOS Inverter Switching Threshold', () => {
  it('gives VM = VDD/2 for a symmetric inverter with matched thresholds', () => {
    const out = switchingThreshold.calculate({ VDD: 5, Vtn: 1, Vtp: 1, r: 1 });
    expect(out.raw?.VM).toBeCloseTo(2.5, 8);
  });

  it('shifts VM toward VDD when the PMOS is much stronger (r > 1)', () => {
    const weak = switchingThreshold.calculate({ VDD: 5, Vtn: 1, Vtp: 1, r: 1 });
    const strongPmos = switchingThreshold.calculate({ VDD: 5, Vtn: 1, Vtp: 1, r: 4 });
    expect(strongPmos.raw!.VM as number).toBeGreaterThan(weak.raw!.VM as number);
  });

  it('rejects VDD too small to turn on both devices', () => {
    const errors = switchingThreshold.validate({ VDD: 1, Vtn: 1, Vtp: 1, r: 1 }, switchingThreshold.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

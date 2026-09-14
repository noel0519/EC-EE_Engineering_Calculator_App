import { describe, expect, it } from 'vitest';
import { efficiency } from './efficiency';

describe('Efficiency', () => {
  it('computes 80% efficiency: Pout=80W, Pin=100W', () => {
    const out = efficiency.calculate({ Pout: 80, Pin: 100 });
    expect(out.raw?.efficiencyPercent).toBeCloseTo(80, 10);
  });

  it('handles the 100% boundary case (no losses)', () => {
    const out = efficiency.calculate({ Pout: 100, Pin: 100 });
    expect(out.raw?.efficiencyPercent).toBeCloseTo(100, 10);
  });

  it('rejects Pin=0', () => {
    const errors = efficiency.validate({ Pout: 50, Pin: 0 }, efficiency.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

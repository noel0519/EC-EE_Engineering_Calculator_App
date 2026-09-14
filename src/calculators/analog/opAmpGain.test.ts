import { describe, expect, it } from 'vitest';
import { opAmpGain } from './opAmpGain';

describe('Op-Amp Gain', () => {
  it('computes non-inverting gain: Rf=9k, Rin=1k -> Av=10', () => {
    const out = opAmpGain.calculate({ topology: 'noninverting', Rf: 9000, Rin: 1000 });
    expect(out.raw?.gain).toBeCloseTo(10, 10);
  });

  it('computes inverting gain: Rf=10k, Rin=1k -> Av=-10', () => {
    const out = opAmpGain.calculate({ topology: 'inverting', Rf: 10000, Rin: 1000 });
    expect(out.raw?.gain).toBeCloseTo(-10, 10);
  });

  it('computes gain in dB correctly for Av=10 -> 20 dB', () => {
    const out = opAmpGain.calculate({ topology: 'noninverting', Rf: 9000, Rin: 1000 });
    expect(out.raw?.gainDb).toBeCloseTo(20, 6);
  });

  it('rejects Rin=0', () => {
    const errors = opAmpGain.validate({ topology: 'inverting', Rf: 1000, Rin: 0 }, opAmpGain.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

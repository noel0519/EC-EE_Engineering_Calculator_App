import { describe, expect, it } from 'vitest';
import { pcmBitRate } from './pcmBitRate';

describe('PCM Bit Rate', () => {
  it('computes telephone PCM bit rate: 8kHz, 8 bits, 1 channel -> 64 kbit/s', () => {
    const out = pcmBitRate.calculate({ fs: 8000, bitsPerSample: 8, channels: 1 });
    expect(out.raw?.bitRate).toBeCloseTo(64000, 6);
  });

  it('scales linearly with channel count', () => {
    const out = pcmBitRate.calculate({ fs: 8000, bitsPerSample: 8, channels: 24 });
    expect(out.raw?.bitRate).toBeCloseTo(64000 * 24, 3);
  });

  it('computes minimum baseband bandwidth as half the bit rate', () => {
    const out = pcmBitRate.calculate({ fs: 8000, bitsPerSample: 8, channels: 1 });
    expect(out.raw?.minBandwidth).toBeCloseTo(32000, 6);
  });

  it('rejects a zero sampling rate', () => {
    const errors = pcmBitRate.validate({ fs: 0, bitsPerSample: 8, channels: 1 }, pcmBitRate.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

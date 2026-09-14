import type { CalculatorDefinition } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatEngineering, formatNumber } from '@/core/format';
import { prefixUnits } from '@/core/units';

export const pcmBitRate: CalculatorDefinition = {
  id: 'communication.pcm-bit-rate',
  category: 'communication',
  name: 'PCM Bit Rate',
  description: 'Transmitted bit rate and minimum baseband bandwidth for a PCM system.',
  fields: [
    {
      kind: 'number',
      id: 'fs',
      label: 'Sampling rate',
      baseUnit: 'Hz',
      units: prefixUnits('Hz', ['', 'k', 'M', 'G']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'bitsPerSample',
      label: 'Bits per sample',
      baseUnit: '',
      units: [{ symbol: 'bit', toBase: 1 }],
      positive: true,
      defaultValue: 8,
    },
    {
      kind: 'number',
      id: 'channels',
      label: 'Channels',
      baseUnit: '',
      units: [{ symbol: 'ch', toBase: 1 }],
      positive: true,
      defaultValue: 1,
    },
  ],
  validate(values, fields) {
    return validateFields(values, fields);
  },
  calculate(values) {
    const fs = values.fs as number;
    const bitsPerSample = values.bitsPerSample as number;
    const channels = values.channels as number;

    const bitRate = fs * bitsPerSample * channels;
    const minBandwidth = bitRate / 2;
    const levels = 2 ** bitsPerSample;

    return {
      results: [
        { label: 'Bit rate', value: formatEngineering(bitRate, 'bit/s'), primary: true },
        { label: 'Quantization levels', value: formatNumber(levels, 6) },
        { label: 'Min. baseband bandwidth', value: formatEngineering(minBandwidth, 'Hz') },
      ],
      formula: 'Rb = fs × n × channels,  BWmin = Rb / 2',
      assumptions: ['Nyquist-rate baseband bandwidth estimate (BWmin = Rb/2), no line coding overhead.'],
      raw: { bitRate, minBandwidth },
    };
  },
};

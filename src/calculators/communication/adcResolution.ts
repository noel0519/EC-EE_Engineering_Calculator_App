import type { CalculatorDefinition } from '@/core/types';
import { formatEngineering, formatNumber } from '@/core/format';
import { prefixUnits } from '@/core/units';

export const adcResolution: CalculatorDefinition = {
  id: 'communication.adc-resolution',
  category: 'communication',
  name: 'ADC Resolution',
  description: 'LSB size, quantization error, and theoretical SNR for an N-bit ADC.',
  fields: [
    {
      kind: 'number',
      id: 'bits',
      label: 'Resolution (bits)',
      baseUnit: '',
      units: [{ symbol: 'bit', toBase: 1 }],
      positive: true,
      min: 1,
      max: 32,
      defaultValue: 12,
    },
    {
      kind: 'number',
      id: 'vfsr',
      label: 'Full-scale voltage range',
      baseUnit: 'V',
      units: prefixUnits('V', ['m', '', 'k']),
      positive: true,
      defaultValue: 5,
    },
  ],
  validate(values) {
    const errors = [];
    const bits = values.bits as number;
    if (!Number.isInteger(bits)) {
      errors.push({ fieldId: 'bits', message: 'Resolution must be a whole number of bits.' });
    }
    return errors;
  },
  calculate(values) {
    const bits = values.bits as number;
    const vfsr = values.vfsr as number;

    const levels = 2 ** bits;
    const lsb = vfsr / levels;
    const quantError = lsb / 2;
    const snrDb = 6.02 * bits + 1.76;
    const dynamicRangeDb = 20 * Math.log10(levels);

    return {
      results: [
        { label: 'LSB size', value: formatEngineering(lsb, 'V'), primary: true },
        { label: 'Quantization levels', value: formatNumber(levels, 6) },
        { label: 'Max quantization error (±LSB/2)', value: formatEngineering(quantError, 'V') },
        { label: 'Theoretical SNR', value: `${formatNumber(snrDb)} dB` },
        { label: 'Dynamic range', value: `${formatNumber(dynamicRangeDb)} dB` },
      ],
      formula: 'LSB = Vfsr / 2ⁿ,  SNR ≈ 6.02n + 1.76 dB,  DR = 20·log₁₀(2ⁿ) dB',
      assumptions: [
        'Full-scale sinusoidal input (for the SNR estimate).',
        'Uniform quantization, no missing codes.',
      ],
      raw: { lsb, quantError, snrDb, dynamicRangeDb },
    };
  },
};

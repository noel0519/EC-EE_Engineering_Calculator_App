import type { CalculatorDefinition } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatNumber } from '@/core/format';
import { prefixUnits } from '@/core/units';

export const opAmpGain: CalculatorDefinition = {
  id: 'analog.op-amp-gain',
  category: 'analog',
  name: 'Op-Amp Gain',
  description: 'Closed-loop voltage gain for an ideal inverting or non-inverting op-amp.',
  fields: [
    {
      kind: 'select',
      id: 'topology',
      label: 'Topology',
      options: [
        { value: 'inverting', label: 'Inverting' },
        { value: 'noninverting', label: 'Non-inverting' },
      ],
      defaultValue: 'noninverting',
    },
    {
      kind: 'number',
      id: 'Rf',
      label: 'Feedback resistor (Rf)',
      baseUnit: 'Ω',
      units: prefixUnits('Ω', ['', 'k', 'M']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'Rin',
      label: 'Input resistor (Rin)',
      baseUnit: 'Ω',
      units: prefixUnits('Ω', ['', 'k', 'M']),
      positive: true,
    },
  ],
  validate(values, fields) {
    return validateFields(values, fields);
  },
  calculate(values) {
    const topology = values.topology as string;
    const Rf = values.Rf as number;
    const Rin = values.Rin as number;

    const gain = topology === 'inverting' ? -(Rf / Rin) : 1 + Rf / Rin;
    const gainDb = 20 * Math.log10(Math.abs(gain));

    return {
      results: [
        { label: 'Voltage gain (Av)', value: `${formatNumber(gain)} V/V`, primary: true },
        { label: 'Gain in dB', value: `${formatNumber(gainDb)} dB` },
      ],
      formula: topology === 'inverting' ? 'Av = −Rf / Rin' : 'Av = 1 + Rf / Rin',
      assumptions: [
        'Ideal op-amp: infinite open-loop gain, infinite input impedance, zero output impedance.',
        'Op-amp operating within its linear (non-saturated) region.',
      ],
      raw: { gain, gainDb },
    };
  },
};

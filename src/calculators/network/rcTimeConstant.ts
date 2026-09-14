import type { CalculatorDefinition } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatEngineering } from '@/core/format';
import { prefixUnits } from '@/core/units';

export const rcTimeConstant: CalculatorDefinition = {
  id: 'network.rc-time-constant',
  category: 'network',
  name: 'RC Time Constant',
  description: 'Time constant and instantaneous capacitor voltage during charge/discharge.',
  fields: [
    {
      kind: 'select',
      id: 'mode',
      label: 'Mode',
      options: [
        { value: 'charging', label: 'Charging' },
        { value: 'discharging', label: 'Discharging' },
      ],
      defaultValue: 'charging',
    },
    {
      kind: 'number',
      id: 'R',
      label: 'Resistance',
      baseUnit: 'Ω',
      units: prefixUnits('Ω', ['', 'k', 'M']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'C',
      label: 'Capacitance',
      baseUnit: 'F',
      units: prefixUnits('F', ['p', 'n', 'µ', 'm']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'Vsource',
      label: 'Source voltage',
      baseUnit: 'V',
      units: prefixUnits('V', ['m', '', 'k']),
    },
    {
      kind: 'number',
      id: 't',
      label: 'Elapsed time',
      baseUnit: 's',
      units: prefixUnits('s', ['µ', 'm', '']),
      min: 0,
      defaultValue: 0,
    },
  ],
  validate(values, fields) {
    return validateFields(values, fields);
  },
  calculate(values) {
    const mode = values.mode as string;
    const R = values.R as number;
    const C = values.C as number;
    const Vsource = values.Vsource as number;
    const t = values.t as number;

    const tau = R * C;
    const Vc =
      mode === 'charging'
        ? Vsource * (1 - Math.exp(-t / tau))
        : Vsource * Math.exp(-t / tau);
    const fractionPercent = mode === 'charging' ? (1 - Math.exp(-t / tau)) * 100 : Math.exp(-t / tau) * 100;

    return {
      results: [
        { label: 'Time constant (τ)', value: formatEngineering(tau, 's'), primary: true },
        { label: 'Capacitor voltage at t', value: formatEngineering(Vc, 'V') },
        { label: 'Fraction of source', value: `${fractionPercent.toFixed(2)} %` },
      ],
      formula:
        mode === 'charging'
          ? 'τ = R×C,  Vc(t) = Vsource × (1 − e^(−t/τ))'
          : 'τ = R×C,  Vc(t) = Vsource × e^(−t/τ)',
      assumptions: ['Ideal resistor and capacitor.', 'Step input applied at t = 0.'],
      raw: { tau, Vc },
    };
  },
};

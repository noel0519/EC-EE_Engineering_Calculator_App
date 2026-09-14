import type { CalculatorDefinition } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatEngineering } from '@/core/format';
import { prefixUnits } from '@/core/units';

export const dcPower: CalculatorDefinition = {
  id: 'power.dc-power',
  category: 'power',
  name: 'DC Power',
  description: 'Power dissipated given any two of voltage, current, and resistance.',
  fields: [
    {
      kind: 'select',
      id: 'given',
      label: 'Given',
      options: [
        { value: 'VI', label: 'Voltage & Current' },
        { value: 'IR', label: 'Current & Resistance' },
        { value: 'VR', label: 'Voltage & Resistance' },
      ],
      defaultValue: 'VI',
    },
    {
      kind: 'number',
      id: 'V',
      label: 'Voltage',
      baseUnit: 'V',
      units: prefixUnits('V', ['m', '', 'k']),
      hiddenWhen: (v) => v.given === 'IR',
    },
    {
      kind: 'number',
      id: 'I',
      label: 'Current',
      baseUnit: 'A',
      units: prefixUnits('A', ['µ', 'm', '']),
      hiddenWhen: (v) => v.given === 'VR',
    },
    {
      kind: 'number',
      id: 'R',
      label: 'Resistance',
      baseUnit: 'Ω',
      units: prefixUnits('Ω', ['', 'k', 'M']),
      positive: true,
      nonZero: true,
      hiddenWhen: (v) => v.given === 'VI',
    },
  ],
  validate(values, fields) {
    return validateFields(values, fields);
  },
  calculate(values) {
    const given = values.given as string;
    const V = values.V as number;
    const I = values.I as number;
    const R = values.R as number;

    if (given === 'VI') {
      const P = V * I;
      return {
        results: [{ label: 'Power (P)', value: formatEngineering(P, 'W'), primary: true }],
        formula: 'P = V × I',
        raw: { P },
      };
    }
    if (given === 'IR') {
      const P = I * I * R;
      return {
        results: [{ label: 'Power (P)', value: formatEngineering(P, 'W'), primary: true }],
        formula: 'P = I² × R',
        raw: { P },
      };
    }
    const P = (V * V) / R;
    return {
      results: [{ label: 'Power (P)', value: formatEngineering(P, 'W'), primary: true }],
      formula: 'P = V² / R',
      raw: { P },
    };
  },
};

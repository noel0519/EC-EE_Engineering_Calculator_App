import type { CalculatorDefinition, NormalizedValues } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatEngineering } from '@/core/format';
import { prefixUnits } from '@/core/units';

export const ohmsLaw: CalculatorDefinition = {
  id: 'network.ohms-law',
  category: 'network',
  name: "Ohm's Law",
  description: 'Solve for voltage, current, or resistance given the other two.',
  fields: [
    {
      kind: 'select',
      id: 'solveFor',
      label: 'Solve for',
      options: [
        { value: 'V', label: 'Voltage (V)' },
        { value: 'I', label: 'Current (I)' },
        { value: 'R', label: 'Resistance (R)' },
      ],
      defaultValue: 'V',
    },
    {
      kind: 'number',
      id: 'V',
      label: 'Voltage',
      baseUnit: 'V',
      units: prefixUnits('V', ['m', '', 'k']),
      hiddenWhen: (v) => v.solveFor === 'V',
    },
    {
      kind: 'number',
      id: 'I',
      label: 'Current',
      baseUnit: 'A',
      units: prefixUnits('A', ['µ', 'm', '']),
      hiddenWhen: (v) => v.solveFor === 'I',
    },
    {
      kind: 'number',
      id: 'R',
      label: 'Resistance',
      baseUnit: 'Ω',
      units: prefixUnits('Ω', ['', 'k', 'M']),
      positive: true,
      nonZero: true,
      hiddenWhen: (v) => v.solveFor === 'R',
    },
  ],
  validate(values, fields) {
    const errors = validateFields(values, fields);
    if (values.solveFor === 'R' && values.I === 0) {
      errors.push({ fieldId: 'I', message: 'Current must not be 0 A when solving for resistance.' });
    }
    return errors;
  },
  calculate(values: NormalizedValues) {
    const solveFor = values.solveFor as string;
    const V = values.V as number;
    const I = values.I as number;
    const R = values.R as number;

    if (solveFor === 'V') {
      const result = I * R;
      return {
        results: [{ label: 'Voltage', value: formatEngineering(result, 'V'), primary: true }],
        formula: 'V = I × R',
        raw: { V: result, I, R },
      };
    }
    if (solveFor === 'I') {
      const result = V / R;
      return {
        results: [{ label: 'Current', value: formatEngineering(result, 'A'), primary: true }],
        formula: 'I = V / R',
        raw: { V, I: result, R },
      };
    }
    const result = V / I;
    return {
      results: [{ label: 'Resistance', value: formatEngineering(result, 'Ω'), primary: true }],
      formula: 'R = V / I',
      assumptions: ['I ≠ 0'],
      raw: { V, I, R: result },
    };
  },
};

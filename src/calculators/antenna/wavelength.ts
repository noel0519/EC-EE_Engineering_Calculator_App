import type { CalculatorDefinition } from '@/core/types';
import { formatEngineering } from '@/core/format';
import { prefixUnits } from '@/core/units';
import { SPEED_OF_LIGHT } from '@/core/constants';

export const wavelength: CalculatorDefinition = {
  id: 'antenna.wavelength',
  category: 'antenna',
  name: 'Wavelength ↔ Frequency',
  description: 'Free-space wavelength from frequency, or frequency from wavelength.',
  fields: [
    {
      kind: 'select',
      id: 'solveFor',
      label: 'Solve for',
      options: [
        { value: 'lambda', label: 'Wavelength (from frequency)' },
        { value: 'f', label: 'Frequency (from wavelength)' },
      ],
      defaultValue: 'lambda',
    },
    {
      kind: 'number',
      id: 'f',
      label: 'Frequency',
      baseUnit: 'Hz',
      units: prefixUnits('Hz', ['', 'k', 'M', 'G']),
      positive: true,
      hiddenWhen: (v) => v.solveFor === 'f',
    },
    {
      kind: 'number',
      id: 'lambda',
      label: 'Wavelength',
      baseUnit: 'm',
      units: prefixUnits('m', ['m', '', 'k']),
      positive: true,
      hiddenWhen: (v) => v.solveFor === 'lambda',
    },
  ],
  validate(values) {
    const errors = [];
    const solveFor = values.solveFor as string;
    if (solveFor === 'lambda' && !((values.f as number) > 0)) {
      errors.push({ fieldId: 'f', message: 'Frequency must be greater than 0 Hz.' });
    }
    if (solveFor === 'f' && !((values.lambda as number) > 0)) {
      errors.push({ fieldId: 'lambda', message: 'Wavelength must be greater than 0 m.' });
    }
    return errors;
  },
  calculate(values) {
    const solveFor = values.solveFor as string;

    if (solveFor === 'lambda') {
      const f = values.f as number;
      const lambda = SPEED_OF_LIGHT / f;
      return {
        results: [{ label: 'Wavelength (λ)', value: formatEngineering(lambda, 'm'), primary: true }],
        formula: 'λ = c / f',
        assumptions: ['Free-space propagation (v = c).'],
        raw: { lambda },
      };
    }

    const lambda = values.lambda as number;
    const f = SPEED_OF_LIGHT / lambda;
    return {
      results: [{ label: 'Frequency (f)', value: formatEngineering(f, 'Hz'), primary: true }],
      formula: 'f = c / λ',
      assumptions: ['Free-space propagation (v = c).'],
      raw: { f },
    };
  },
};

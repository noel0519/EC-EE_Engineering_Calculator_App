import type { CalculatorDefinition, ResultLine } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatEngineering, formatNumber } from '@/core/format';
import { prefixUnits } from '@/core/units';

export const nyquistSampling: CalculatorDefinition = {
  id: 'communication.nyquist-sampling',
  category: 'communication',
  name: 'Nyquist Sampling',
  description: 'Minimum sampling rate for a band-limited signal, with an optional aliasing check.',
  fields: [
    {
      kind: 'number',
      id: 'fmax',
      label: 'Max signal frequency',
      baseUnit: 'Hz',
      units: prefixUnits('Hz', ['', 'k', 'M', 'G']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'fs',
      label: 'Proposed sampling rate (optional)',
      baseUnit: 'Hz',
      units: prefixUnits('Hz', ['', 'k', 'M', 'G']),
      min: 0,
      defaultValue: 0,
      helpText: 'Leave at 0 to skip the aliasing check.',
    },
  ],
  validate(values, fields) {
    return validateFields(values, fields);
  },
  calculate(values) {
    const fmax = values.fmax as number;
    const fs = values.fs as number;

    const nyquistRate = 2 * fmax;
    const results: ResultLine[] = [{ label: 'Nyquist rate (min fs)', value: formatEngineering(nyquistRate, 'Hz'), primary: true }];

    if (fs > 0) {
      const oversamplingRatio = fs / nyquistRate;
      const aliasing = fs < nyquistRate;
      results.push(
        { label: 'Oversampling ratio', value: `${formatNumber(oversamplingRatio)}×` },
        { label: 'Aliasing risk', value: aliasing ? 'YES — fs below Nyquist rate' : 'No' }
      );
    }

    return {
      results,
      formula: 'fs(min) = 2 × fmax',
      assumptions: ['Signal strictly band-limited to fmax.', 'Ideal (brick-wall) reconstruction/anti-alias filtering.'],
      raw: { nyquistRate },
    };
  },
};

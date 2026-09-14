import type { CalculatorDefinition, ResultLine } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatEngineering, formatNumber } from '@/core/format';
import { prefixUnits } from '@/core/units';
import { PI } from '@/core/constants';

export const rcLowPassFilter: CalculatorDefinition = {
  id: 'analog.rc-low-pass-filter',
  category: 'analog',
  name: 'RC Low-Pass Filter',
  description: 'Cutoff frequency and response at a test frequency for a single-pole RC low-pass filter.',
  fields: [
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
      id: 'ftest',
      label: 'Test frequency (optional)',
      baseUnit: 'Hz',
      units: prefixUnits('Hz', ['', 'k', 'M', 'G']),
      min: 0,
      defaultValue: 0,
      helpText: 'Leave at 0 to skip the response calculation.',
    },
  ],
  validate(values, fields) {
    return validateFields(values, fields);
  },
  calculate(values) {
    const R = values.R as number;
    const C = values.C as number;
    const ftest = values.ftest as number;

    const fc = 1 / (2 * PI * R * C);
    const results: ResultLine[] = [{ label: 'Cutoff frequency (fc)', value: formatEngineering(fc, 'Hz'), primary: true }];

    if (ftest > 0) {
      const ratio = ftest / fc;
      const magnitude = 1 / Math.sqrt(1 + ratio * ratio);
      const magnitudeDb = 20 * Math.log10(magnitude);
      const phaseDeg = (-Math.atan(ratio) * 180) / PI;
      results.push(
        { label: 'Magnitude at ftest', value: `${formatNumber(magnitude)} (${formatNumber(magnitudeDb)} dB)` },
        { label: 'Phase at ftest', value: `${formatNumber(phaseDeg)} deg` }
      );
    }

    return {
      results,
      formula: 'fc = 1 / (2π·R·C),  |H(f)| = 1 / √(1 + (f/fc)²)',
      assumptions: ['Ideal single-pole passive RC filter.', 'Unloaded output (no downstream loading).'],
      raw: { fc },
    };
  },
};

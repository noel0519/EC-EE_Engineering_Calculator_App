import type { CalculatorDefinition } from '@/core/types';
import { formatNumber } from '@/core/format';

export const dbConverter: CalculatorDefinition = {
  id: 'analog.db-converter',
  category: 'analog',
  name: 'dB Converter',
  description: 'Convert between a linear ratio and decibels, for power or amplitude ratios.',
  fields: [
    {
      kind: 'select',
      id: 'quantity',
      label: 'Ratio type',
      options: [
        { value: 'power', label: 'Power ratio (10·log₁₀)' },
        { value: 'amplitude', label: 'Amplitude/voltage ratio (20·log₁₀)' },
      ],
      defaultValue: 'power',
    },
    {
      kind: 'select',
      id: 'direction',
      label: 'Direction',
      options: [
        { value: 'toDb', label: 'Ratio → dB' },
        { value: 'fromDb', label: 'dB → Ratio' },
      ],
      defaultValue: 'toDb',
    },
    {
      kind: 'number',
      id: 'ratio',
      label: 'Linear ratio',
      baseUnit: '',
      units: [{ symbol: '', toBase: 1 }],
      positive: true,
      defaultValue: 1,
      hiddenWhen: (v) => v.direction === 'fromDb',
    },
    {
      kind: 'number',
      id: 'db',
      label: 'Decibels',
      baseUnit: 'dB',
      units: [{ symbol: 'dB', toBase: 1 }],
      defaultValue: 0,
      hiddenWhen: (v) => v.direction === 'toDb',
    },
  ],
  validate(values, fields) {
    const errors = [];
    if (values.direction === 'toDb') {
      const ratio = values.ratio as number;
      if (!Number.isFinite(ratio) || ratio <= 0) {
        errors.push({ fieldId: 'ratio', message: 'Linear ratio must be a positive number.' });
      }
    } else {
      const db = values.db as number;
      if (!Number.isFinite(db)) {
        errors.push({ fieldId: 'db', message: 'Decibel value must be a finite number.' });
      }
    }
    return errors;
  },
  calculate(values) {
    const quantity = values.quantity as string;
    const direction = values.direction as string;
    const multiplier = quantity === 'power' ? 10 : 20;

    if (direction === 'toDb') {
      const ratio = values.ratio as number;
      const db = multiplier * Math.log10(ratio);
      return {
        results: [{ label: 'Decibels', value: `${formatNumber(db)} dB`, primary: true }],
        formula: quantity === 'power' ? 'dB = 10·log₁₀(ratio)' : 'dB = 20·log₁₀(ratio)',
        raw: { db },
      };
    }

    const db = values.db as number;
    const ratio = 10 ** (db / multiplier);
    return {
      results: [{ label: 'Linear ratio', value: `${formatNumber(ratio)}`, primary: true }],
      formula: quantity === 'power' ? 'ratio = 10^(dB/10)' : 'ratio = 10^(dB/20)',
      raw: { ratio },
    };
  },
};

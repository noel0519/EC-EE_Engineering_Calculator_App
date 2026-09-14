import type { CalculatorDefinition } from '@/core/types';
import { formatEngineering, formatNumber } from '@/core/format';

const REQUIRES_POSITIVE_WATTS = new Set(['WToDbm', 'WToDbw']);

export const powerDbConverter: CalculatorDefinition = {
  id: 'power.db-converter',
  category: 'power',
  name: 'dBm / dBW ↔ Watts',
  description: 'Convert absolute power between dBm, dBW, and watts.',
  fields: [
    {
      kind: 'select',
      id: 'conversion',
      label: 'Conversion',
      options: [
        { value: 'DbmToW', label: 'dBm → W' },
        { value: 'WToDbm', label: 'W → dBm' },
        { value: 'DbwToW', label: 'dBW → W' },
        { value: 'WToDbw', label: 'W → dBW' },
        { value: 'DbmToDbw', label: 'dBm → dBW' },
        { value: 'DbwToDbm', label: 'dBW → dBm' },
      ],
      defaultValue: 'DbmToW',
    },
    {
      kind: 'number',
      id: 'value',
      label: 'Value',
      baseUnit: '',
      units: [{ symbol: '', toBase: 1 }],
      defaultValue: 0,
      helpText: 'Enter in the unit named on the left side of the selected conversion.',
    },
  ],
  validate(values) {
    const conversion = values.conversion as string;
    const value = values.value as number;
    if (!Number.isFinite(value)) return [{ fieldId: 'value', message: 'Value must be a finite number.' }];
    if (REQUIRES_POSITIVE_WATTS.has(conversion) && value <= 0) {
      return [{ fieldId: 'value', message: 'Power in watts must be greater than 0 W to convert to dB.' }];
    }
    return [];
  },
  calculate(values) {
    const conversion = values.conversion as string;
    const value = values.value as number;

    switch (conversion) {
      case 'DbmToW': {
        const watts = 10 ** (value / 10) / 1000;
        return {
          results: [{ label: 'Power', value: formatEngineering(watts, 'W'), primary: true }],
          formula: 'P(W) = 10^(dBm/10) / 1000',
          raw: { watts },
        };
      }
      case 'WToDbm': {
        const dbm = 10 * Math.log10(value * 1000);
        return {
          results: [{ label: 'Power', value: `${formatNumber(dbm)} dBm`, primary: true }],
          formula: 'dBm = 10·log₁₀(P(W) × 1000)',
          raw: { dbm },
        };
      }
      case 'DbwToW': {
        const watts = 10 ** (value / 10);
        return {
          results: [{ label: 'Power', value: formatEngineering(watts, 'W'), primary: true }],
          formula: 'P(W) = 10^(dBW/10)',
          raw: { watts },
        };
      }
      case 'WToDbw': {
        const dbw = 10 * Math.log10(value);
        return {
          results: [{ label: 'Power', value: `${formatNumber(dbw)} dBW`, primary: true }],
          formula: 'dBW = 10·log₁₀(P(W))',
          raw: { dbw },
        };
      }
      case 'DbmToDbw': {
        const dbw = value - 30;
        return {
          results: [{ label: 'Power', value: `${formatNumber(dbw)} dBW`, primary: true }],
          formula: 'dBW = dBm − 30',
          raw: { dbw },
        };
      }
      default: {
        const dbm = value + 30;
        return {
          results: [{ label: 'Power', value: `${formatNumber(dbm)} dBm`, primary: true }],
          formula: 'dBm = dBW + 30',
          raw: { dbm },
        };
      }
    }
  },
};

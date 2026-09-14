import type { CalculatorDefinition } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatEngineering } from '@/core/format';
import { prefixUnits } from '@/core/units';

export const energyFromPower: CalculatorDefinition = {
  id: 'power.energy-from-power',
  category: 'power',
  name: 'Energy from Power & Time',
  description: 'Energy consumed or delivered given constant power over a duration.',
  fields: [
    {
      kind: 'number',
      id: 'P',
      label: 'Power',
      baseUnit: 'W',
      units: prefixUnits('W', ['m', '', 'k', 'M']),
      positive: true,
    },
    {
      kind: 'number',
      id: 't',
      label: 'Duration',
      baseUnit: 's',
      units: [
        { symbol: 's', toBase: 1 },
        { symbol: 'min', toBase: 60 },
        { symbol: 'hr', toBase: 3600 },
      ],
      positive: true,
    },
  ],
  validate(values, fields) {
    return validateFields(values, fields);
  },
  calculate(values) {
    const P = values.P as number;
    const t = values.t as number;

    const energyJoules = P * t;
    const energyKwh = energyJoules / 3.6e6;

    return {
      results: [
        { label: 'Energy', value: formatEngineering(energyJoules, 'J'), primary: true },
        { label: 'Energy (kWh)', value: `${energyKwh.toPrecision(4)} kWh` },
      ],
      formula: 'E = P × t',
      assumptions: ['Constant power over the entire duration.'],
      raw: { energyJoules, energyKwh },
    };
  },
};

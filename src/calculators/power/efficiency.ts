import type { CalculatorDefinition } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatEngineering, formatNumber } from '@/core/format';
import { prefixUnits } from '@/core/units';

export const efficiency: CalculatorDefinition = {
  id: 'power.efficiency',
  category: 'power',
  name: 'Efficiency',
  description: 'Power (or energy) conversion efficiency from output and input values.',
  fields: [
    {
      kind: 'number',
      id: 'Pout',
      label: 'Output power',
      baseUnit: 'W',
      units: prefixUnits('W', ['m', '', 'k', 'M']),
      min: 0,
    },
    {
      kind: 'number',
      id: 'Pin',
      label: 'Input power',
      baseUnit: 'W',
      units: prefixUnits('W', ['m', '', 'k', 'M']),
      positive: true,
    },
  ],
  validate(values, fields) {
    return validateFields(values, fields);
  },
  calculate(values) {
    const Pout = values.Pout as number;
    const Pin = values.Pin as number;
    const efficiencyPercent = (Pout / Pin) * 100;

    return {
      results: [
        { label: 'Efficiency (η)', value: `${formatNumber(efficiencyPercent)} %`, primary: true },
        { label: 'Losses (Pin − Pout)', value: formatEngineering(Pin - Pout, 'W') },
      ],
      formula: 'η = Pout / Pin × 100%',
      assumptions: ['Pout and Pin measured under the same steady-state operating condition.'],
      raw: { efficiencyPercent },
    };
  },
};

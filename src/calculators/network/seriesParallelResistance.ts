import type { CalculatorDefinition } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatEngineering } from '@/core/format';
import { prefixUnits } from '@/core/units';

const resistorUnits = prefixUnits('Ω', ['', 'k', 'M']);

function resistorField(n: number) {
  return {
    kind: 'number' as const,
    id: `R${n}`,
    label: `R${n}`,
    baseUnit: 'Ω',
    units: resistorUnits,
    positive: true,
    nonZero: true,
    hiddenWhen: (v: Record<string, number | string>) => Number(v.count) < n,
  };
}

export const seriesParallelResistance: CalculatorDefinition = {
  id: 'network.series-parallel-resistance',
  category: 'network',
  name: 'Series / Parallel Resistance',
  description: 'Combine 2-4 resistors in series or in parallel.',
  fields: [
    {
      kind: 'select',
      id: 'mode',
      label: 'Configuration',
      options: [
        { value: 'series', label: 'Series' },
        { value: 'parallel', label: 'Parallel' },
      ],
      defaultValue: 'series',
    },
    {
      kind: 'select',
      id: 'count',
      label: 'Number of resistors',
      options: [
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
      ],
      defaultValue: '2',
    },
    resistorField(1),
    resistorField(2),
    resistorField(3),
    resistorField(4),
  ],
  validate(values, fields) {
    return validateFields(values, fields);
  },
  calculate(values) {
    const mode = values.mode as string;
    const count = Number(values.count);
    const resistors: number[] = [];
    for (let n = 1; n <= count; n++) resistors.push(values[`R${n}`] as number);

    let total: number;
    let formula: string;
    if (mode === 'series') {
      total = resistors.reduce((a, b) => a + b, 0);
      formula = `R_total = ${resistors.map((_, i) => `R${i + 1}`).join(' + ')}`;
    } else {
      const reciprocalSum = resistors.reduce((a, b) => a + 1 / b, 0);
      total = 1 / reciprocalSum;
      formula = `1/R_total = ${resistors.map((_, i) => `1/R${i + 1}`).join(' + ')}`;
    }

    return {
      results: [{ label: 'Total resistance', value: formatEngineering(total, 'Ω'), primary: true }],
      formula,
      raw: { total },
    };
  },
};

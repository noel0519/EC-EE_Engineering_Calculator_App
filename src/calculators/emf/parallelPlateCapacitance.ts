import type { CalculatorDefinition, ResultLine } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatEngineering } from '@/core/format';
import { prefixUnits } from '@/core/units';
import { EPSILON_0 } from '@/core/constants';

export const parallelPlateCapacitance: CalculatorDefinition = {
  id: 'emf.parallel-plate-capacitance',
  category: 'emf',
  name: 'Parallel-Plate Capacitance',
  description: 'Capacitance of a parallel-plate capacitor, with optional stored charge/energy.',
  fields: [
    {
      kind: 'number',
      id: 'area',
      label: 'Plate area (A)',
      baseUnit: 'm²',
      units: [
        { symbol: 'mm²', toBase: 1e-6 },
        { symbol: 'cm²', toBase: 1e-4 },
        { symbol: 'm²', toBase: 1 },
      ],
      positive: true,
    },
    {
      kind: 'number',
      id: 'd',
      label: 'Plate separation (d)',
      baseUnit: 'm',
      units: prefixUnits('m', ['µ', 'm', '']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'epsilonR',
      label: 'Relative permittivity (εr)',
      baseUnit: '',
      units: [{ symbol: '', toBase: 1 }],
      positive: true,
      defaultValue: 1,
      helpText: '1 = vacuum/air.',
    },
    {
      kind: 'number',
      id: 'voltage',
      label: 'Applied voltage (optional)',
      baseUnit: 'V',
      units: prefixUnits('V', ['m', '', 'k']),
      min: 0,
      defaultValue: 0,
      helpText: 'Leave at 0 to skip the stored charge/energy calculation.',
    },
  ],
  validate(values, fields) {
    return validateFields(values, fields);
  },
  calculate(values) {
    const area = values.area as number;
    const d = values.d as number;
    const epsilonR = values.epsilonR as number;
    const voltage = values.voltage as number;

    const C = (EPSILON_0 * epsilonR * area) / d;
    const results: ResultLine[] = [{ label: 'Capacitance (C)', value: formatEngineering(C, 'F'), primary: true }];

    if (voltage > 0) {
      const charge = C * voltage;
      const energy = 0.5 * C * voltage * voltage;
      results.push(
        { label: 'Stored charge (Q = CV)', value: formatEngineering(charge, 'C') },
        { label: 'Stored energy (½CV²)', value: formatEngineering(energy, 'J') }
      );
    }

    return {
      results,
      formula: 'C = ε0·εr·A / d',
      assumptions: ['Uniform field between plates.', 'Plate separation much smaller than plate dimensions (fringing fields neglected).'],
      raw: { C },
    };
  },
};

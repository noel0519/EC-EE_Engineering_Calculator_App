import type { CalculatorDefinition } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatEngineering } from '@/core/format';
import { prefixUnits } from '@/core/units';
import { EPSILON_0, PI } from '@/core/constants';

const COULOMB_K = 1 / (4 * PI * EPSILON_0);

export const coulombsLaw: CalculatorDefinition = {
  id: 'emf.coulombs-law',
  category: 'emf',
  name: "Coulomb's Law",
  description: 'Electrostatic force between two point charges.',
  fields: [
    {
      kind: 'number',
      id: 'q1',
      label: 'Charge 1 (q1)',
      baseUnit: 'C',
      units: prefixUnits('C', ['n', 'µ', 'm', '']),
      nonZero: true,
      defaultValue: 1,
    },
    {
      kind: 'number',
      id: 'q2',
      label: 'Charge 2 (q2)',
      baseUnit: 'C',
      units: prefixUnits('C', ['n', 'µ', 'm', '']),
      nonZero: true,
      defaultValue: 1,
    },
    {
      kind: 'number',
      id: 'r',
      label: 'Separation distance',
      baseUnit: 'm',
      units: prefixUnits('m', ['m', '', 'k']),
      positive: true,
    },
  ],
  validate(values, fields) {
    return validateFields(values, fields);
  },
  calculate(values) {
    const q1 = values.q1 as number;
    const q2 = values.q2 as number;
    const r = values.r as number;

    const force = (COULOMB_K * Math.abs(q1 * q2)) / (r * r);
    const nature = q1 * q2 > 0 ? 'Repulsive' : 'Attractive';

    return {
      results: [
        { label: 'Force magnitude', value: formatEngineering(force, 'N'), primary: true },
        { label: 'Nature', value: nature },
      ],
      formula: 'F = |q1·q2| / (4π·ε0·r²)',
      assumptions: ['Point charges in vacuum/free space.', 'Static charges (no relativistic or radiative effects).'],
      raw: { force },
    };
  },
};

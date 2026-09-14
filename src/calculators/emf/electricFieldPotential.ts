import type { CalculatorDefinition } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatEngineering } from '@/core/format';
import { prefixUnits } from '@/core/units';
import { EPSILON_0, PI } from '@/core/constants';

const COULOMB_K = 1 / (4 * PI * EPSILON_0);

export const electricFieldPotential: CalculatorDefinition = {
  id: 'emf.electric-field-potential',
  category: 'emf',
  name: 'Electric Field & Potential (Point Charge)',
  description: 'Electric field magnitude and potential at a distance from a point charge.',
  fields: [
    {
      kind: 'number',
      id: 'Q',
      label: 'Charge (Q)',
      baseUnit: 'C',
      units: prefixUnits('C', ['n', 'µ', 'm', '']),
      nonZero: true,
      defaultValue: 1,
    },
    {
      kind: 'number',
      id: 'r',
      label: 'Distance from charge',
      baseUnit: 'm',
      units: prefixUnits('m', ['m', '', 'k']),
      positive: true,
    },
  ],
  validate(values, fields) {
    return validateFields(values, fields);
  },
  calculate(values) {
    const Q = values.Q as number;
    const r = values.r as number;

    const E = (COULOMB_K * Q) / (r * r);
    const V = (COULOMB_K * Q) / r;

    return {
      results: [
        { label: 'Electric field (E)', value: formatEngineering(E, 'V/m'), primary: true },
        { label: 'Electric potential (V)', value: formatEngineering(V, 'V'), primary: true },
      ],
      formula: 'E = Q / (4π·ε0·r²),  V = Q / (4π·ε0·r)',
      assumptions: ['Point charge in vacuum/free space.', 'Potential referenced to zero at infinity.'],
      raw: { E, V },
    };
  },
};

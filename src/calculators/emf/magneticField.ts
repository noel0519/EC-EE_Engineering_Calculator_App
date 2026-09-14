import type { CalculatorDefinition } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatEngineering } from '@/core/format';
import { prefixUnits } from '@/core/units';
import { MU_0, PI } from '@/core/constants';

export const magneticField: CalculatorDefinition = {
  id: 'emf.magnetic-field',
  category: 'emf',
  name: 'Magnetic Field (Simple Geometries)',
  description: 'Magnetic flux density from an infinite straight wire or at the center of a circular loop.',
  fields: [
    {
      kind: 'select',
      id: 'geometry',
      label: 'Geometry',
      options: [
        { value: 'wire', label: 'Infinite straight wire' },
        { value: 'loop', label: 'Center of circular loop' },
      ],
      defaultValue: 'wire',
    },
    {
      kind: 'number',
      id: 'I',
      label: 'Current (I)',
      baseUnit: 'A',
      units: prefixUnits('A', ['m', '']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'r',
      label: 'Distance from wire / loop radius',
      baseUnit: 'm',
      units: prefixUnits('m', ['m', '', 'k']),
      positive: true,
    },
  ],
  validate(values, fields) {
    return validateFields(values, fields);
  },
  calculate(values) {
    const geometry = values.geometry as string;
    const I = values.I as number;
    const r = values.r as number;

    if (geometry === 'wire') {
      const B = (MU_0 * I) / (2 * PI * r);
      return {
        results: [{ label: 'Magnetic flux density (B)', value: formatEngineering(B, 'T'), primary: true }],
        formula: 'B = μ0·I / (2π·r)',
        assumptions: ['Infinitely long straight conductor.', 'Field evaluated at perpendicular distance r in free space.'],
        raw: { B },
      };
    }

    const B = (MU_0 * I) / (2 * r);
    return {
      results: [{ label: 'Magnetic flux density (B)', value: formatEngineering(B, 'T'), primary: true }],
      formula: 'B = μ0·I / (2·R)',
      assumptions: ['Single-turn circular loop.', 'Field evaluated at the loop center in free space.'],
      raw: { B },
    };
  },
};

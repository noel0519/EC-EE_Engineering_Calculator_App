import type { CalculatorDefinition } from '@/core/types';
import { formatEngineering } from '@/core/format';
import { prefixUnits } from '@/core/units';
import { PI } from '@/core/constants';

export const magneticForce: CalculatorDefinition = {
  id: 'emf.magnetic-force',
  category: 'emf',
  name: 'Magnetic Force',
  description: 'Force on a moving charge or a current-carrying wire in a magnetic field.',
  fields: [
    {
      kind: 'select',
      id: 'mode',
      label: 'Force on',
      options: [
        { value: 'charge', label: 'Moving charge (F = qvB sinθ)' },
        { value: 'wire', label: 'Current-carrying wire (F = BIL sinθ)' },
      ],
      defaultValue: 'wire',
    },
    {
      kind: 'number',
      id: 'q',
      label: 'Charge (q)',
      baseUnit: 'C',
      units: prefixUnits('C', ['n', 'µ', 'm', '']),
      nonZero: true,
      hiddenWhen: (v) => v.mode !== 'charge',
    },
    {
      kind: 'number',
      id: 'v',
      label: 'Velocity (v)',
      baseUnit: 'm/s',
      units: [{ symbol: 'm/s', toBase: 1 }],
      positive: true,
      hiddenWhen: (v) => v.mode !== 'charge',
    },
    {
      kind: 'number',
      id: 'I',
      label: 'Current (I)',
      baseUnit: 'A',
      units: prefixUnits('A', ['m', '']),
      positive: true,
      hiddenWhen: (v) => v.mode !== 'wire',
    },
    {
      kind: 'number',
      id: 'L',
      label: 'Wire length (L)',
      baseUnit: 'm',
      units: prefixUnits('m', ['m', '', 'k']),
      positive: true,
      hiddenWhen: (v) => v.mode !== 'wire',
    },
    {
      kind: 'number',
      id: 'B',
      label: 'Magnetic flux density (B)',
      baseUnit: 'T',
      units: prefixUnits('T', ['µ', 'm', '']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'theta',
      label: 'Angle between v/I and B',
      baseUnit: 'deg',
      units: [{ symbol: 'deg', toBase: 1 }],
      defaultValue: 90,
      min: 0,
      max: 180,
    },
  ],
  validate(values) {
    const errors = [];
    const mode = values.mode as string;
    if (mode === 'charge') {
      if (!Number.isFinite(values.q) || values.q === 0) errors.push({ fieldId: 'q', message: 'Charge must not be 0 C.' });
      if (!((values.v as number) > 0)) errors.push({ fieldId: 'v', message: 'Velocity must be greater than 0 m/s.' });
    } else {
      if (!((values.I as number) > 0)) errors.push({ fieldId: 'I', message: 'Current must be greater than 0 A.' });
      if (!((values.L as number) > 0)) errors.push({ fieldId: 'L', message: 'Wire length must be greater than 0 m.' });
    }
    if (!((values.B as number) > 0)) errors.push({ fieldId: 'B', message: 'Magnetic flux density must be greater than 0 T.' });
    return errors;
  },
  calculate(values) {
    const mode = values.mode as string;
    const B = values.B as number;
    const thetaRad = ((values.theta as number) * PI) / 180;

    if (mode === 'charge') {
      const q = values.q as number;
      const v = values.v as number;
      const force = Math.abs(q) * v * B * Math.sin(thetaRad);
      return {
        results: [{ label: 'Force magnitude', value: formatEngineering(force, 'N'), primary: true }],
        formula: 'F = |q|·v·B·sinθ',
        assumptions: ['Uniform magnetic field.', 'Force direction given by F = qv × B (right-hand rule), magnitude only shown here.'],
        raw: { force },
      };
    }

    const I = values.I as number;
    const L = values.L as number;
    const force = B * I * L * Math.sin(thetaRad);
    return {
      results: [{ label: 'Force magnitude', value: formatEngineering(force, 'N'), primary: true }],
      formula: 'F = B·I·L·sinθ',
      assumptions: ['Uniform magnetic field.', 'Straight wire segment of length L.'],
      raw: { force },
    };
  },
};

import type { CalculatorDefinition } from '@/core/types';
import { formatEngineering } from '@/core/format';
import { prefixUnits } from '@/core/units';

export const threePhasePower: CalculatorDefinition = {
  id: 'power.three-phase-power',
  category: 'power',
  name: 'Three-Phase Power',
  description: 'Real, reactive, and apparent power for a balanced three-phase load.',
  fields: [
    {
      kind: 'number',
      id: 'VL',
      label: 'Line-to-line voltage (VL)',
      baseUnit: 'V',
      units: prefixUnits('V', ['', 'k']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'IL',
      label: 'Line current (IL)',
      baseUnit: 'A',
      units: prefixUnits('A', ['m', '']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'powerFactor',
      label: 'Power factor',
      baseUnit: '',
      units: [{ symbol: '', toBase: 1 }],
      defaultValue: 1,
      min: -1,
      max: 1,
    },
  ],
  validate(values) {
    const pf = values.powerFactor as number;
    if (!Number.isFinite(pf) || Math.abs(pf) > 1) {
      return [{ fieldId: 'powerFactor', message: 'Power factor must be between -1 and 1.' }];
    }
    return [];
  },
  calculate(values) {
    const VL = values.VL as number;
    const IL = values.IL as number;
    const pf = values.powerFactor as number;

    const S = Math.sqrt(3) * VL * IL;
    const P = S * pf;
    const Q = S * Math.sin(Math.acos(pf));

    return {
      results: [
        { label: 'Real power (P)', value: formatEngineering(P, 'W'), primary: true },
        { label: 'Reactive power (Q)', value: formatEngineering(Q, 'VAR') },
        { label: 'Apparent power (S)', value: formatEngineering(S, 'VA') },
      ],
      formula: 'S = √3·VL·IL,  P = S·PF,  Q = S·sin(cos⁻¹ PF)',
      assumptions: ['Balanced three-phase load.', 'VL and IL are line (not phase) quantities.'],
      raw: { P, Q, S },
    };
  },
};

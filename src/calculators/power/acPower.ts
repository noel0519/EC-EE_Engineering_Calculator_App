import type { CalculatorDefinition } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatEngineering, formatNumber } from '@/core/format';
import { prefixUnits } from '@/core/units';
import { PI } from '@/core/constants';

export const acPower: CalculatorDefinition = {
  id: 'power.ac-power',
  category: 'power',
  name: 'AC Power (Real / Reactive / Apparent)',
  description: 'Real, reactive, and apparent power plus power factor from RMS voltage, current, and phase angle.',
  fields: [
    {
      kind: 'number',
      id: 'Vrms',
      label: 'RMS voltage',
      baseUnit: 'V',
      units: prefixUnits('V', ['m', '', 'k']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'Irms',
      label: 'RMS current',
      baseUnit: 'A',
      units: prefixUnits('A', ['m', '']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'phase',
      label: 'Phase angle (V relative to I)',
      baseUnit: 'deg',
      units: [{ symbol: 'deg', toBase: 1 }],
      defaultValue: 0,
      min: -90,
      max: 90,
    },
  ],
  validate(values, fields) {
    return validateFields(values, fields);
  },
  calculate(values) {
    const Vrms = values.Vrms as number;
    const Irms = values.Irms as number;
    const thetaRad = ((values.phase as number) * PI) / 180;

    const S = Vrms * Irms;
    const P = S * Math.cos(thetaRad);
    const Q = S * Math.sin(thetaRad);
    const powerFactor = Math.cos(thetaRad);

    return {
      results: [
        { label: 'Real power (P)', value: formatEngineering(P, 'W'), primary: true },
        { label: 'Reactive power (Q)', value: formatEngineering(Q, 'VAR') },
        { label: 'Apparent power (S)', value: formatEngineering(S, 'VA') },
        { label: 'Power factor', value: formatNumber(powerFactor, 4) },
      ],
      formula: 'S = Vrms·Irms,  P = S·cosθ,  Q = S·sinθ,  PF = cosθ',
      assumptions: ['Single-phase sinusoidal steady state.', 'θ is the angle by which voltage leads current.'],
      raw: { P, Q, S, powerFactor },
    };
  },
};

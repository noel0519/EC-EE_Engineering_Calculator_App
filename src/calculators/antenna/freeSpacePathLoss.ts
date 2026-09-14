import type { CalculatorDefinition } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatNumber } from '@/core/format';
import { prefixUnits } from '@/core/units';
import { SPEED_OF_LIGHT, PI } from '@/core/constants';

export const freeSpacePathLoss: CalculatorDefinition = {
  id: 'antenna.free-space-path-loss',
  category: 'antenna',
  name: 'Free-Space Path Loss',
  description: 'FSPL between two isotropic antennas over a line-of-sight path.',
  fields: [
    {
      kind: 'number',
      id: 'distance',
      label: 'Distance',
      baseUnit: 'm',
      units: prefixUnits('m', ['m', '', 'k']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'frequency',
      label: 'Frequency',
      baseUnit: 'Hz',
      units: prefixUnits('Hz', ['', 'k', 'M', 'G']),
      positive: true,
    },
  ],
  validate(values, fields) {
    return validateFields(values, fields);
  },
  calculate(values) {
    const d = values.distance as number;
    const f = values.frequency as number;

    const fsplDb = 20 * Math.log10((4 * PI * d * f) / SPEED_OF_LIGHT);

    return {
      results: [{ label: 'Free-space path loss', value: `${formatNumber(fsplDb)} dB`, primary: true }],
      formula: 'FSPL(dB) = 20·log₁₀(4πdf / c)',
      assumptions: ['Line-of-sight, unobstructed path.', 'No multipath, atmospheric, or rain attenuation.', 'Isotropic (0 dBi) antennas at both ends.'],
      raw: { fsplDb },
    };
  },
};

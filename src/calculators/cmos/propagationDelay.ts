import type { CalculatorDefinition } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatEngineering } from '@/core/format';
import { prefixUnits } from '@/core/units';

export const propagationDelay: CalculatorDefinition = {
  id: 'cmos.propagation-delay',
  category: 'cmos',
  name: 'CMOS Propagation Delay & Rise/Fall Time',
  description: 'RC-approximation delay and transition times for a gate driving a load capacitance.',
  fields: [
    {
      kind: 'number',
      id: 'R',
      label: 'Equivalent on-resistance (R)',
      baseUnit: 'Ω',
      units: prefixUnits('Ω', ['', 'k']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'C',
      label: 'Load capacitance (C)',
      baseUnit: 'F',
      units: prefixUnits('F', ['p', 'n', 'µ']),
      positive: true,
    },
  ],
  validate(values, fields) {
    return validateFields(values, fields);
  },
  calculate(values) {
    const R = values.R as number;
    const C = values.C as number;

    const tpd = 0.69 * R * C;
    const tRiseFall = 2.2 * R * C;

    return {
      results: [
        { label: 'Propagation delay (tpd, 50%)', value: formatEngineering(tpd, 's'), primary: true },
        { label: 'Rise/fall time (10%-90%)', value: formatEngineering(tRiseFall, 's') },
      ],
      formula: 'tpd ≈ 0.69·R·C  (ln 2),  trise ≈ tfall ≈ 2.2·R·C  (ln 9)',
      assumptions: [
        'Single-pole RC step response for the gate output driving C.',
        'Constant equivalent on-resistance R (not a full transistor I-V model).',
      ],
      raw: { tpd, tRiseFall },
    };
  },
};

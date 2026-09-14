import type { CalculatorDefinition } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatEngineering } from '@/core/format';
import { prefixUnits } from '@/core/units';

export const switchingEnergy: CalculatorDefinition = {
  id: 'cmos.switching-energy',
  category: 'cmos',
  name: 'CMOS Switching Energy',
  description: 'Energy dissipated per transition and total energy drawn from the supply per charge cycle.',
  fields: [
    {
      kind: 'number',
      id: 'Cload',
      label: 'Load capacitance (C)',
      baseUnit: 'F',
      units: prefixUnits('F', ['p', 'n', 'µ']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'VDD',
      label: 'Supply voltage (VDD)',
      baseUnit: 'V',
      units: prefixUnits('V', ['m', '', 'k']),
      positive: true,
    },
  ],
  validate(values, fields) {
    return validateFields(values, fields);
  },
  calculate(values) {
    const C = values.Cload as number;
    const VDD = values.VDD as number;

    const dissipatedPerTransition = 0.5 * C * VDD * VDD;
    const drawnFromSupply = C * VDD * VDD;

    return {
      results: [
        { label: 'Energy dissipated per transition', value: formatEngineering(dissipatedPerTransition, 'J'), primary: true },
        { label: 'Energy drawn from supply (charge cycle)', value: formatEngineering(drawnFromSupply, 'J') },
      ],
      formula: 'Edissipated = ½·C·VDD²,  Esupply = C·VDD²',
      assumptions: [
        'Full 0→VDD (or VDD→0) transition.',
        'Half the energy drawn from the supply is stored on C; the other half is dissipated as heat during a 0→1 charge.',
      ],
      raw: { dissipatedPerTransition, drawnFromSupply },
    };
  },
};

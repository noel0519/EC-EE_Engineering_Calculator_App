import type { CalculatorDefinition } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatEngineering } from '@/core/format';
import { prefixUnits } from '@/core/units';

export const voltageDivider: CalculatorDefinition = {
  id: 'network.voltage-divider',
  category: 'network',
  name: 'Voltage Divider',
  description: 'Output voltage across R2 in a two-resistor series divider.',
  fields: [
    {
      kind: 'number',
      id: 'Vin',
      label: 'Input voltage',
      baseUnit: 'V',
      units: prefixUnits('V', ['m', '', 'k']),
    },
    {
      kind: 'number',
      id: 'R1',
      label: 'R1 (top)',
      baseUnit: 'Ω',
      units: prefixUnits('Ω', ['', 'k', 'M']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'R2',
      label: 'R2 (bottom)',
      baseUnit: 'Ω',
      units: prefixUnits('Ω', ['', 'k', 'M']),
      positive: true,
    },
  ],
  validate(values, fields) {
    const errors = validateFields(values, fields);
    const R1 = values.R1 as number;
    const R2 = values.R2 as number;
    if ((R1 ?? 0) + (R2 ?? 0) === 0) {
      errors.push({ fieldId: 'R2', message: 'R1 + R2 must be greater than 0 Ω.' });
    }
    return errors;
  },
  calculate(values) {
    const Vin = values.Vin as number;
    const R1 = values.R1 as number;
    const R2 = values.R2 as number;
    const Vout = (Vin * R2) / (R1 + R2);
    const current = Vin / (R1 + R2);

    return {
      results: [
        { label: 'Output voltage (Vout)', value: formatEngineering(Vout, 'V'), primary: true },
        { label: 'Loop current', value: formatEngineering(current, 'A') },
      ],
      formula: 'Vout = Vin × R2 / (R1 + R2)',
      assumptions: ['No load current drawn from the R1/R2 node (unloaded divider).'],
      raw: { Vout, current },
    };
  },
};

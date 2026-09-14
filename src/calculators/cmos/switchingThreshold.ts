import type { CalculatorDefinition } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatWithUnit } from '@/core/format';
import { prefixUnits } from '@/core/units';

export const switchingThreshold: CalculatorDefinition = {
  id: 'cmos.switching-threshold',
  category: 'cmos',
  name: 'CMOS Inverter Switching Threshold',
  description: 'Switching-point voltage (VM) of a static CMOS inverter under the square-law model.',
  fields: [
    {
      kind: 'number',
      id: 'VDD',
      label: 'Supply voltage (VDD)',
      baseUnit: 'V',
      units: prefixUnits('V', ['m', '', 'k']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'Vtn',
      label: 'NMOS threshold (Vtn)',
      baseUnit: 'V',
      units: prefixUnits('V', ['m', '']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'Vtp',
      label: 'PMOS threshold magnitude (|Vtp|)',
      baseUnit: 'V',
      units: prefixUnits('V', ['m', '']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'r',
      label: 'Strength ratio r = √(kp / kn)',
      baseUnit: '',
      units: [{ symbol: '', toBase: 1 }],
      positive: true,
      defaultValue: 1,
      helpText: 'r = 1 means a symmetric (matched-strength) inverter.',
    },
  ],
  validate(values, fields) {
    const errors = validateFields(values, fields);
    const VDD = values.VDD as number;
    const Vtn = values.Vtn as number;
    const Vtp = values.Vtp as number;
    if (Number.isFinite(VDD) && Number.isFinite(Vtn) && Number.isFinite(Vtp) && VDD <= Vtn + Vtp) {
      errors.push({ fieldId: 'VDD', message: 'VDD must exceed Vtn + |Vtp| for both devices to switch on.' });
    }
    return errors;
  },
  calculate(values) {
    const VDD = values.VDD as number;
    const Vtn = values.Vtn as number;
    const Vtp = values.Vtp as number;
    const r = values.r as number;

    const VM = (r * (VDD - Vtp) + Vtn) / (1 + r);

    return {
      results: [{ label: 'Switching threshold (VM)', value: formatWithUnit(VM, 'V'), primary: true }],
      formula: 'VM = [r·(VDD − |Vtp|) + Vtn] / (1 + r),  r = √(kp/kn)',
      assumptions: [
        'Both transistors in saturation (square-law model) at the switching point.',
        'Channel-length modulation and velocity saturation neglected.',
      ],
      raw: { VM },
    };
  },
};

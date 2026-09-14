import type { CalculatorDefinition } from '@/core/types';
import { validateFields } from '@/core/validation';
import { formatEngineering } from '@/core/format';
import { prefixUnits } from '@/core/units';

export const cmosPower: CalculatorDefinition = {
  id: 'cmos.power',
  category: 'cmos',
  name: 'CMOS Static / Dynamic / Total Power',
  description: 'Leakage (static) power, switching (dynamic) power, and their sum for a CMOS gate.',
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
      id: 'Ileak',
      label: 'Leakage current (Ileak)',
      baseUnit: 'A',
      units: prefixUnits('A', ['p', 'n', 'µ', 'm']),
      min: 0,
      defaultValue: 0,
    },
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
      id: 'f',
      label: 'Switching frequency (f)',
      baseUnit: 'Hz',
      units: prefixUnits('Hz', ['', 'k', 'M', 'G']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'alpha',
      label: 'Activity factor (α)',
      baseUnit: '',
      units: [{ symbol: '', toBase: 1 }],
      min: 0,
      max: 1,
      defaultValue: 1,
      helpText: 'Fraction of clock cycles with a 0→1 output transition (0-1).',
    },
  ],
  validate(values, fields) {
    return validateFields(values, fields);
  },
  calculate(values) {
    const VDD = values.VDD as number;
    const Ileak = values.Ileak as number;
    const Cload = values.Cload as number;
    const f = values.f as number;
    const alpha = values.alpha as number;

    const staticPower = VDD * Ileak;
    const dynamicPower = alpha * Cload * VDD * VDD * f;
    const totalPower = staticPower + dynamicPower;

    return {
      results: [
        { label: 'Total power', value: formatEngineering(totalPower, 'W'), primary: true },
        { label: 'Static (leakage) power', value: formatEngineering(staticPower, 'W') },
        { label: 'Dynamic (switching) power', value: formatEngineering(dynamicPower, 'W') },
      ],
      formula: 'Pstatic = VDD·Ileak,  Pdynamic = α·C·VDD²·f,  Ptotal = Pstatic + Pdynamic',
      assumptions: ['Short-circuit power neglected.', 'Single equivalent load capacitance C for the gate output.'],
      raw: { staticPower, dynamicPower, totalPower },
    };
  },
};

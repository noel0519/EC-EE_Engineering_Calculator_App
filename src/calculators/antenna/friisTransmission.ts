import type { CalculatorDefinition } from '@/core/types';
import { formatNumber } from '@/core/format';
import { prefixUnits } from '@/core/units';
import { SPEED_OF_LIGHT, PI } from '@/core/constants';

export const friisTransmission: CalculatorDefinition = {
  id: 'antenna.friis-transmission',
  category: 'antenna',
  name: 'Friis Transmission',
  description: 'Received power from transmit power, antenna gains, frequency, and distance.',
  fields: [
    {
      kind: 'number',
      id: 'ptDbm',
      label: 'Transmit power',
      baseUnit: 'dBm',
      units: [{ symbol: 'dBm', toBase: 1 }],
      defaultValue: 0,
    },
    {
      kind: 'number',
      id: 'gtDbi',
      label: 'Transmit antenna gain',
      baseUnit: 'dBi',
      units: [{ symbol: 'dBi', toBase: 1 }],
      defaultValue: 0,
    },
    {
      kind: 'number',
      id: 'grDbi',
      label: 'Receive antenna gain',
      baseUnit: 'dBi',
      units: [{ symbol: 'dBi', toBase: 1 }],
      defaultValue: 0,
    },
    {
      kind: 'number',
      id: 'frequency',
      label: 'Frequency',
      baseUnit: 'Hz',
      units: prefixUnits('Hz', ['', 'k', 'M', 'G']),
      positive: true,
    },
    {
      kind: 'number',
      id: 'distance',
      label: 'Distance',
      baseUnit: 'm',
      units: prefixUnits('m', ['m', '', 'k']),
      positive: true,
    },
  ],
  validate(values) {
    const errors = [];
    if (!((values.frequency as number) > 0)) errors.push({ fieldId: 'frequency', message: 'Frequency must be greater than 0 Hz.' });
    if (!((values.distance as number) > 0)) errors.push({ fieldId: 'distance', message: 'Distance must be greater than 0 m.' });
    return errors;
  },
  calculate(values) {
    const ptDbm = values.ptDbm as number;
    const gtDbi = values.gtDbi as number;
    const grDbi = values.grDbi as number;
    const f = values.frequency as number;
    const d = values.distance as number;

    const fsplDb = 20 * Math.log10((4 * PI * d * f) / SPEED_OF_LIGHT);
    const prDbm = ptDbm + gtDbi + grDbi - fsplDb;
    const eirpDbm = ptDbm + gtDbi;

    return {
      results: [
        { label: 'Received power (Pr)', value: `${formatNumber(prDbm)} dBm`, primary: true },
        { label: 'EIRP', value: `${formatNumber(eirpDbm)} dBm` },
        { label: 'Free-space path loss', value: `${formatNumber(fsplDb)} dB` },
      ],
      formula: 'Pr(dBm) = Pt(dBm) + Gt(dBi) + Gr(dBi) − FSPL(dB),  FSPL(dB) = 20·log₁₀(4πdf/c)',
      assumptions: [
        'Antenna gains given relative to isotropic (dBi) — do not mix with dBd gains here.',
        'Line-of-sight, free-space propagation, matched polarization, no multipath.',
      ],
      raw: { prDbm, eirpDbm, fsplDb },
    };
  },
};

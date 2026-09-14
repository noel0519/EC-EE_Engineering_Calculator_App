import { describe, expect, it } from 'vitest';
import { normalizeValues } from './normalize';
import type { FieldDef } from './types';
import { prefixUnits } from './units';

const fields: FieldDef[] = [
  { kind: 'number', id: 'R', label: 'R', baseUnit: 'Ω', units: prefixUnits('Ω', ['', 'k', 'M']) },
  { kind: 'select', id: 'mode', label: 'Mode', options: [{ value: 'a', label: 'A' }], defaultValue: 'a' },
];

describe('normalizeValues', () => {
  it('converts a value in kΩ to base ohms', () => {
    const result = normalizeValues({ R: 1, mode: 'a' }, { R: 'kΩ' }, fields);
    expect(result.R).toBe(1000);
  });

  it('defaults to the first unit option when none selected', () => {
    const result = normalizeValues({ R: 5, mode: 'a' }, {}, fields);
    expect(result.R).toBe(5);
  });

  it('passes select field values through unchanged', () => {
    const result = normalizeValues({ R: 1, mode: 'a' }, {}, fields);
    expect(result.mode).toBe('a');
  });

  it('produces equal base values for 1 kΩ and 1000 Ω', () => {
    const a = normalizeValues({ R: 1, mode: 'a' }, { R: 'kΩ' }, fields);
    const b = normalizeValues({ R: 1000, mode: 'a' }, { R: 'Ω' }, fields);
    expect(a.R).toBe(b.R);
  });
});

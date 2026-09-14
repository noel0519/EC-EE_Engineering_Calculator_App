import { describe, expect, it } from 'vitest';
import { validateFields } from './validation';
import type { FieldDef } from './types';

const fields: FieldDef[] = [
  { kind: 'number', id: 'R', label: 'R', baseUnit: 'Ω', units: [{ symbol: 'Ω', toBase: 1 }], positive: true, nonZero: true },
  { kind: 'number', id: 'skipped', label: 'Skipped', baseUnit: '', units: [{ symbol: '', toBase: 1 }], hiddenWhen: () => true },
];

describe('validateFields', () => {
  it('accepts a valid positive value', () => {
    expect(validateFields({ R: 100, skipped: 1 }, fields)).toEqual([]);
  });

  it('rejects zero for a nonZero field', () => {
    const errors = validateFields({ R: 0, skipped: 1 }, fields);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain('0 Ω');
  });

  it('rejects a negative value for a positive field', () => {
    const errors = validateFields({ R: -5, skipped: 1 }, fields);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects NaN', () => {
    const errors = validateFields({ R: NaN, skipped: 1 }, fields);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('skips hidden fields entirely', () => {
    const errors = validateFields({ R: 100, skipped: NaN }, fields);
    expect(errors).toEqual([]);
  });
});

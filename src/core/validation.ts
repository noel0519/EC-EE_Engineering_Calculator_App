import type { FieldDef, NormalizedValues, NumberFieldDef, ValidationError } from './types';

/**
 * Generic structural validation shared by every calculator: required
 * numeric fields must be finite numbers, and must respect each field's
 * declared positive/nonZero constraints. Calculator-specific validation
 * (e.g. cross-field relationships) should be layered on top of this.
 * `values` must already be normalized to base SI units.
 */
export function validateFields(values: NormalizedValues, fields: FieldDef[] = []): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const field of fields) {
    if (field.kind !== 'number') continue;
    if (field.hiddenWhen && field.hiddenWhen(values)) continue;
    const raw = values[field.id];
    const num = typeof raw === 'number' ? raw : Number(raw);

    if (raw === undefined || raw === '' || Number.isNaN(num)) {
      errors.push({ fieldId: field.id, message: `${field.label} must be a valid number.` });
      continue;
    }
    if (!Number.isFinite(num)) {
      errors.push({ fieldId: field.id, message: `${field.label} must be finite.` });
      continue;
    }
    errors.push(...validateNumberField(num, field));
  }

  return errors;
}

function validateNumberField(num: number, field: NumberFieldDef): ValidationError[] {
  const errors: ValidationError[] = [];
  if (field.positive && num <= 0) {
    errors.push({ fieldId: field.id, message: `${field.label} must be greater than 0 ${field.baseUnit}.`.trim() });
  }
  if (field.nonZero && num === 0) {
    errors.push({ fieldId: field.id, message: `${field.label} must not be 0.` });
  }
  if (field.min !== undefined && num < field.min) {
    errors.push({ fieldId: field.id, message: `${field.label} must be at least ${field.min}.` });
  }
  if (field.max !== undefined && num > field.max) {
    errors.push({ fieldId: field.id, message: `${field.label} must be at most ${field.max}.` });
  }
  return errors;
}

export function ok(): ValidationError[] {
  return [];
}

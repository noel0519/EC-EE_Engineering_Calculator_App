import type { FieldDef, FieldValues, NormalizedValues, UnitSelections } from './types';
import { toBaseUnit } from './units';

/**
 * Converts raw field values (numbers in whichever unit the user selected)
 * into base-SI values, per field.units[selected].toBase. Select/text fields
 * pass through unchanged. This is the single place unit conversion happens
 * before a calculator's `calculate` runs (master prompt constraint #3).
 */
export function normalizeValues(
  values: FieldValues,
  unitSelections: UnitSelections,
  fields: FieldDef[]
): NormalizedValues {
  const result: NormalizedValues = {};

  for (const field of fields) {
    if (field.kind === 'select' || field.kind === 'text') {
      result[field.id] = values[field.id] ?? field.defaultValue ?? '';
      continue;
    }
    const raw = values[field.id];
    const num = typeof raw === 'number' ? raw : Number(raw);
    const unitSymbol = unitSelections[field.id] ?? field.units[0].symbol;
    const unit = field.units.find((u) => u.symbol === unitSymbol) ?? field.units[0];
    result[field.id] = Number.isFinite(num) ? toBaseUnit(num, unit.toBase) : NaN;
  }

  return result;
}

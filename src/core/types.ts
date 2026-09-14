// Core contracts shared by every calculator. UI components must depend only
// on these types — never on a specific calculator's internals — so that a
// new calculator can be added without touching the shell.

export type Category =
  | 'network'
  | 'emf'
  | 'cmos'
  | 'communication'
  | 'analog'
  | 'antenna'
  | 'logic'
  | 'general'
  | 'power';

export interface UnitOption {
  /** Symbol shown in the unit dropdown, e.g. "kΩ". */
  symbol: string;
  /** Multiplier applied to convert a value in this unit to the field's base SI unit. */
  toBase: number;
}

export type FieldKind = 'number' | 'select' | 'text';

export interface NumberFieldDef {
  kind: 'number';
  id: string;
  label: string;
  /** Base SI unit symbol, e.g. "Ω", "F", "Hz". Empty string for dimensionless. */
  baseUnit: string;
  /** Selectable unit prefixes/units; first entry is the default. */
  units: UnitOption[];
  defaultValue?: number;
  min?: number;
  max?: number;
  /** Whether the value must be strictly greater than zero. */
  positive?: boolean;
  /** Whether zero is disallowed (e.g. a denominator). */
  nonZero?: boolean;
  helpText?: string;
  /** When present, the field is hidden (and excluded from validation) while this returns true. */
  hiddenWhen?: (values: FieldValues) => boolean;
}

export interface SelectFieldDef {
  kind: 'select';
  id: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue: string;
  helpText?: string;
  hiddenWhen?: (values: FieldValues) => boolean;
}

export interface TextFieldDef {
  kind: 'text';
  id: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  helpText?: string;
  hiddenWhen?: (values: FieldValues) => boolean;
}

export type FieldDef = NumberFieldDef | SelectFieldDef | TextFieldDef;

/** Raw field values as entered: numbers are in the currently selected display unit. */
export interface FieldValues {
  [fieldId: string]: number | string;
}

/** Currently selected unit symbol per number field id (defaults to each field's first unit option). */
export interface UnitSelections {
  [fieldId: string]: string;
}

/** Field values after unit conversion: numbers are in each field's base SI unit. */
export type NormalizedValues = Record<string, number | string>;

export interface ResultLine {
  label: string;
  value: string;
  /** True to render with visual emphasis (the headline result). */
  primary?: boolean;
}

/** Generic tabular data, reused by any calculator that needs to show a table (e.g. a truth table). */
export interface TableData {
  headers: string[];
  rows: string[][];
}

/** Generic Karnaugh-map grid, reused by the Logic category's K-map tool. */
export interface KMapData {
  rowVars: string[];
  colVars: string[];
  grid: { minterm: number; value: boolean | 'dc'; rowBits: string; colBits: string }[][];
}

export interface CalculationOutput {
  results: ResultLine[];
  /** Formula shown in the formula panel, e.g. "f0 = 1 / (2*pi*sqrt(L*C))". */
  formula?: string;
  /** Model assumptions shown in the assumptions panel. */
  assumptions?: string[];
  /** Optional machine-readable values for graphing/history replay. */
  raw?: Record<string, number | undefined>;
  /** Optional table for the auxiliary panel (e.g. a truth table). */
  table?: TableData;
  /** Optional K-map grid for the auxiliary panel. */
  kmap?: KMapData;
}

export interface ValidationError {
  fieldId?: string;
  message: string;
}

export interface CalculatorDefinition {
  id: string;
  category: Category;
  name: string;
  description: string;
  fields: FieldDef[];
  /**
   * Validates field values already normalized to base SI units, so every
   * error message can reference the base unit regardless of what the user
   * selected (e.g. "R2 must be greater than 0 Ω" even if entered in kΩ).
   * Return an array of errors; empty array means valid.
   */
  validate: (values: NormalizedValues, fields?: FieldDef[]) => ValidationError[];
  /**
   * Runs the calculation on normalized (base-SI) numeric values.
   * `values` maps every number field id to its value already converted to baseUnit,
   * and every select field id to its chosen string value.
   */
  calculate: (values: NormalizedValues) => CalculationOutput;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  calculatorId: string;
  calculatorName: string;
  category: Category;
  inputs: FieldValues;
  units: UnitSelections;
  output: CalculationOutput;
}

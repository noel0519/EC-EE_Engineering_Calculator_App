import type { CalculatorDefinition } from '@/core/types';
import { buildKMapGrid, minimize, type TruthTableRow } from '@/core/boolean';

const VARIABLE_NAMES = ['A', 'B', 'C', 'D'];

function parseIndexList(text: string): number[] | null {
  const trimmed = text.trim();
  if (trimmed === '') return [];
  const parts = trimmed.split(',').map((p) => p.trim());
  const nums = parts.map((p) => Number(p));
  if (nums.some((n) => !Number.isInteger(n) || n < 0)) return null;
  return nums;
}

export const kmapSimplifier: CalculatorDefinition = {
  id: 'logic.kmap-simplifier',
  category: 'logic',
  name: 'K-map Simplifier',
  description: 'Minimize a Boolean function from its minterm list using a Karnaugh map.',
  fields: [
    {
      kind: 'select',
      id: 'numVars',
      label: 'Variables',
      options: [
        { value: '2', label: '2 (A, B)' },
        { value: '3', label: '3 (A, B, C)' },
        { value: '4', label: '4 (A, B, C, D)' },
      ],
      defaultValue: '3',
    },
    {
      kind: 'text',
      id: 'minterms',
      label: 'Minterms (output = 1)',
      placeholder: 'e.g. 0,1,2,5',
      defaultValue: '0,1,2,5',
      helpText: 'Comma-separated minterm indices, 0-based.',
    },
    {
      kind: 'text',
      id: 'dontCares',
      label: "Don't-care minterms (optional)",
      placeholder: 'e.g. 3,7',
      defaultValue: '',
    },
  ],
  validate(values) {
    const errors = [];
    const n = Number(values.numVars);
    const max = 2 ** n - 1;

    const minterms = parseIndexList(values.minterms as string);
    if (minterms === null) {
      errors.push({ fieldId: 'minterms', message: 'Minterms must be a comma-separated list of non-negative integers.' });
    } else if (minterms.some((m) => m > max)) {
      errors.push({ fieldId: 'minterms', message: `Minterm indices must be between 0 and ${max} for ${n} variables.` });
    }

    const dontCares = parseIndexList(values.dontCares as string);
    if (dontCares === null) {
      errors.push({ fieldId: 'dontCares', message: "Don't-cares must be a comma-separated list of non-negative integers." });
    } else if (dontCares.some((m) => m > max)) {
      errors.push({ fieldId: 'dontCares', message: `Don't-care indices must be between 0 and ${max} for ${n} variables.` });
    }

    if (minterms && dontCares) {
      const overlap = minterms.filter((m) => dontCares.includes(m));
      if (overlap.length > 0) {
        errors.push({ fieldId: 'dontCares', message: `Index ${overlap[0]} cannot be both a minterm and a don't-care.` });
      }
    }

    return errors;
  },
  calculate(values) {
    const n = Number(values.numVars);
    const variables = VARIABLE_NAMES.slice(0, n);
    const minterms = parseIndexList(values.minterms as string) ?? [];
    const dontCares = parseIndexList(values.dontCares as string) ?? [];

    const { sop, pos } = minimize(variables, minterms, dontCares);

    const rows: TruthTableRow[] = Array.from({ length: 2 ** n }, (_, m) => ({
      minterm: m,
      inputs: [],
      output: minterms.includes(m),
    }));
    const kmap = buildKMapGrid(variables, rows, dontCares);

    return {
      results: [
        { label: 'Simplified SOP', value: sop || '0', primary: true },
        { label: 'Simplified POS', value: pos || '0' },
      ],
      formula: `f(${variables.join(', ')}) = Σm(${minterms.join(', ')})${dontCares.length ? ` + d(${dontCares.join(', ')})` : ''}`,
      kmap,
    };
  },
};

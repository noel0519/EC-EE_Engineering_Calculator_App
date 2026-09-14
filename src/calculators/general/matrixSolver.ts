import type { CalculatorDefinition } from '@/core/types';
import * as M from '@/core/matrix';

const BINARY_OPS = new Set(['add', 'subtract', 'multiply', 'solve']);
const UNARY_SQUARE_OPS = new Set(['determinant', 'inverse']);

export const matrixSolver: CalculatorDefinition = {
  id: 'general.matrix-solver',
  category: 'general',
  name: 'Matrix Solver',
  description: 'Matrix arithmetic, determinant/inverse, and linear-system solving.',
  fields: [
    {
      kind: 'select',
      id: 'operation',
      label: 'Operation',
      options: [
        { value: 'add', label: 'A + B' },
        { value: 'subtract', label: 'A − B' },
        { value: 'multiply', label: 'A × B' },
        { value: 'transpose', label: 'Transpose of A' },
        { value: 'determinant', label: 'Determinant of A' },
        { value: 'inverse', label: 'Inverse of A' },
        { value: 'solve', label: 'Solve A·x = B' },
      ],
      defaultValue: 'determinant',
    },
    {
      kind: 'text',
      id: 'a',
      label: 'Matrix A',
      placeholder: 'e.g. 1,2;3,4',
      defaultValue: '1,2;3,4',
      helpText: 'Rows separated by ";", entries by ",".',
    },
    {
      kind: 'text',
      id: 'b',
      label: 'Matrix B',
      placeholder: 'e.g. 5,6;7,8',
      defaultValue: '5,6;7,8',
      hiddenWhen: (v) => !BINARY_OPS.has(v.operation as string),
      helpText: 'For "Solve", enter B as a single column, e.g. 5;7.',
    },
  ],
  validate(values) {
    const errors = [];
    const operation = values.operation as string;
    const a = M.parseMatrix(values.a as string);
    if (a === null) {
      errors.push({ fieldId: 'a', message: 'Matrix A is not valid. Use rows separated by ";", entries by ",".' });
    }
    if (BINARY_OPS.has(operation)) {
      const b = M.parseMatrix(values.b as string);
      if (b === null) {
        errors.push({ fieldId: 'b', message: 'Matrix B is not valid. Use rows separated by ";", entries by ",".' });
      }
    }
    if (a && (UNARY_SQUARE_OPS.has(operation) || operation === 'solve')) {
      const { rows, cols } = M.dimensions(a);
      if (rows !== cols) {
        errors.push({ fieldId: 'a', message: `Matrix A must be square for this operation (got ${rows}x${cols}).` });
      }
    }
    return errors;
  },
  calculate(values) {
    const operation = values.operation as string;
    const a = M.parseMatrix(values.a as string)!;
    const b = BINARY_OPS.has(operation) ? M.parseMatrix(values.b as string)! : undefined;

    if (operation === 'determinant') {
      const det = M.determinant(a);
      return {
        results: [{ label: 'Determinant', value: `${det}`, primary: true }],
        formula: 'det(A) via cofactor expansion',
        raw: { determinant: det },
      };
    }
    if (operation === 'transpose') {
      return {
        results: [{ label: 'Transpose (Aᵗ)', value: M.formatMatrix(M.transpose(a)), primary: true }],
        formula: 'Aᵗ[i][j] = A[j][i]',
      };
    }
    if (operation === 'inverse') {
      const inv = M.inverse(a);
      return {
        results: [{ label: 'Inverse (A⁻¹)', value: M.formatMatrix(inv), primary: true }],
        formula: 'A⁻¹ via Gauss-Jordan elimination',
      };
    }
    if (operation === 'solve') {
      const x = M.solveLinearSystem(a, b!);
      return {
        results: [{ label: 'Solution (x)', value: M.formatMatrix(x), primary: true }],
        formula: 'x = A⁻¹ × B',
        assumptions: ['A must be square and non-singular.'],
      };
    }

    const opFn = operation === 'add' ? M.add : operation === 'subtract' ? M.subtract : M.multiply;
    const result = opFn(a, b!);
    const symbol = operation === 'add' ? '+' : operation === 'subtract' ? '−' : '×';
    return {
      results: [{ label: 'Result', value: M.formatMatrix(result), primary: true }],
      formula: `A ${symbol} B`,
    };
  },
};

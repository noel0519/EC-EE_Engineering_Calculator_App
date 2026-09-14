import type { CalculatorDefinition } from '@/core/types';
import { formatNumber } from '@/core/format';

export const quadraticSolver: CalculatorDefinition = {
  id: 'general.quadratic-solver',
  category: 'general',
  name: 'Quadratic Equation Solver',
  description: 'Roots of ax² + bx + c = 0, real or complex.',
  fields: [
    { kind: 'number', id: 'a', label: 'a', baseUnit: '', units: [{ symbol: '', toBase: 1 }], nonZero: true, defaultValue: 1 },
    { kind: 'number', id: 'b', label: 'b', baseUnit: '', units: [{ symbol: '', toBase: 1 }], defaultValue: 0 },
    { kind: 'number', id: 'c', label: 'c', baseUnit: '', units: [{ symbol: '', toBase: 1 }], defaultValue: 0 },
  ],
  validate(values) {
    const errors = [];
    if (values.a === 0) {
      errors.push({ fieldId: 'a', message: 'a must not be 0 (equation would not be quadratic).' });
    }
    return errors;
  },
  calculate(values) {
    const a = values.a as number;
    const b = values.b as number;
    const c = values.c as number;

    const discriminant = b * b - 4 * a * c;

    if (discriminant > 0) {
      const sqrtD = Math.sqrt(discriminant);
      const x1 = (-b + sqrtD) / (2 * a);
      const x2 = (-b - sqrtD) / (2 * a);
      return {
        results: [
          { label: 'x₁', value: formatNumber(x1), primary: true },
          { label: 'x₂', value: formatNumber(x2), primary: true },
          { label: 'Discriminant', value: formatNumber(discriminant) },
        ],
        formula: 'x = (−b ± √(b² − 4ac)) / 2a',
        assumptions: ['Discriminant > 0: two distinct real roots.'],
        raw: { x1, x2, discriminant },
      };
    }

    if (discriminant === 0) {
      const x = -b / (2 * a);
      return {
        results: [
          { label: 'x (double root)', value: formatNumber(x), primary: true },
          { label: 'Discriminant', value: '0' },
        ],
        formula: 'x = −b / 2a',
        assumptions: ['Discriminant = 0: one repeated real root.'],
        raw: { x, discriminant },
      };
    }

    const sqrtNegD = Math.sqrt(-discriminant);
    const rePart = -b / (2 * a);
    const imPart = sqrtNegD / (2 * a);
    return {
      results: [
        { label: 'x₁', value: `${formatNumber(rePart)} + ${formatNumber(Math.abs(imPart))}i`, primary: true },
        { label: 'x₂', value: `${formatNumber(rePart)} − ${formatNumber(Math.abs(imPart))}i`, primary: true },
        { label: 'Discriminant', value: formatNumber(discriminant) },
      ],
      formula: 'x = (−b ± i√(4ac − b²)) / 2a',
      assumptions: ['Discriminant < 0: complex conjugate root pair.'],
      raw: { rePart, imPart, discriminant },
    };
  },
};

import type { CalculatorDefinition } from '@/core/types';
import * as C from '@/core/complex';
import { formatNumber } from '@/core/format';

const BINARY_OPS = new Set(['add', 'subtract', 'multiply', 'divide']);

export const complexNumberCalculator: CalculatorDefinition = {
  id: 'general.complex-number',
  category: 'general',
  name: 'Complex Number Calculator',
  description: 'Arithmetic and conversions on complex numbers entered as a+bi.',
  fields: [
    {
      kind: 'select',
      id: 'operation',
      label: 'Operation',
      options: [
        { value: 'add', label: 'A + B' },
        { value: 'subtract', label: 'A − B' },
        { value: 'multiply', label: 'A × B' },
        { value: 'divide', label: 'A ÷ B' },
        { value: 'conjugate', label: 'Conjugate of A' },
        { value: 'polar', label: 'Magnitude / phase of A' },
      ],
      defaultValue: 'add',
    },
    {
      kind: 'text',
      id: 'a',
      label: 'A',
      placeholder: 'e.g. 3+4i',
      defaultValue: '3+4i',
    },
    {
      kind: 'text',
      id: 'b',
      label: 'B',
      placeholder: 'e.g. 1-2i',
      defaultValue: '1-2i',
      hiddenWhen: (v) => !BINARY_OPS.has(v.operation as string),
    },
  ],
  validate(values) {
    const errors = [];
    const operation = values.operation as string;
    if (C.parseComplex(values.a as string) === null) {
      errors.push({ fieldId: 'a', message: 'A must be a valid complex number, e.g. 3+4i.' });
    }
    if (BINARY_OPS.has(operation) && C.parseComplex(values.b as string) === null) {
      errors.push({ fieldId: 'b', message: 'B must be a valid complex number, e.g. 1-2i.' });
    }
    if (operation === 'divide') {
      const b = C.parseComplex(values.b as string);
      if (b && b.re === 0 && b.im === 0) {
        errors.push({ fieldId: 'b', message: 'B must not be 0 when dividing.' });
      }
    }
    return errors;
  },
  calculate(values) {
    const operation = values.operation as string;
    const a = C.parseComplex(values.a as string)!;
    const b = BINARY_OPS.has(operation) ? C.parseComplex(values.b as string)! : undefined;

    let result: C.Complex;
    let formula: string;

    switch (operation) {
      case 'add':
        result = C.add(a, b!);
        formula = 'A + B';
        break;
      case 'subtract':
        result = C.subtract(a, b!);
        formula = 'A − B';
        break;
      case 'multiply':
        result = C.multiply(a, b!);
        formula = 'A × B';
        break;
      case 'divide':
        result = C.divide(a, b!);
        formula = 'A ÷ B';
        break;
      case 'conjugate':
        result = C.conjugate(a);
        formula = 'conj(A)';
        break;
      default: {
        const mag = C.magnitude(a);
        const ph = (C.phase(a) * 180) / Math.PI;
        return {
          results: [
            { label: 'Magnitude |A|', value: formatNumber(mag), primary: true },
            { label: 'Phase (A)', value: `${formatNumber(ph)}°` },
          ],
          formula: '|A| = √(re² + im²),  phase = atan2(im, re)',
          raw: { magnitude: mag, phaseDeg: ph },
        };
      }
    }

    const mag = C.magnitude(result);
    const ph = (C.phase(result) * 180) / Math.PI;

    return {
      results: [
        { label: 'Result (rectangular)', value: C.formatComplex(result), primary: true },
        { label: 'Result (polar)', value: `${formatNumber(mag)} ∠ ${formatNumber(ph)}°` },
      ],
      formula,
      raw: { re: result.re, im: result.im, magnitude: mag, phaseDeg: ph },
    };
  },
};

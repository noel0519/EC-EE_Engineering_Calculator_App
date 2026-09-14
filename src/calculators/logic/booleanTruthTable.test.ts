import { describe, expect, it } from 'vitest';
import { booleanTruthTable } from './booleanTruthTable';

describe('Boolean Expression -> Truth Table', () => {
  it('builds a 4-row table for a 2-variable expression', () => {
    const out = booleanTruthTable.calculate({ expression: "A'B + AB'" });
    expect(out.table?.rows.length).toBe(4);
    expect(out.table?.headers).toEqual(['A', 'B', 'f']);
  });

  it('reports minterms matching a simple AND', () => {
    const out = booleanTruthTable.calculate({ expression: 'AB' });
    const line = out.results.find((r) => r.label.startsWith('Minterms'));
    expect(line?.value).toBe('3');
  });

  it('rejects an empty expression', () => {
    const errors = booleanTruthTable.validate({ expression: '' });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects invalid syntax', () => {
    const errors = booleanTruthTable.validate({ expression: 'A + ' });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects expressions with more than 4 variables', () => {
    const errors = booleanTruthTable.validate({ expression: 'A+B+C+D+E' });
    expect(errors.length).toBeGreaterThan(0);
  });
});

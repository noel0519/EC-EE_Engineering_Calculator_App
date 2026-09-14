import { describe, expect, it } from 'vitest';
import {
  BooleanParseError,
  buildKMapGrid,
  buildTruthTable,
  extractVariables,
  minimize,
  parseBooleanExpression,
} from './boolean';

describe('parseBooleanExpression + buildTruthTable', () => {
  it('evaluates AND correctly (A.B)', () => {
    const ast = parseBooleanExpression('A.B');
    const table = buildTruthTable(ast, ['A', 'B']);
    expect(table.rows.map((r) => r.output)).toEqual([false, false, false, true]);
  });

  it('evaluates implicit-juxtaposition AND the same as explicit "."', () => {
    const a = buildTruthTable(parseBooleanExpression('AB'), ['A', 'B']);
    const b = buildTruthTable(parseBooleanExpression('A.B'), ['A', 'B']);
    expect(a.rows.map((r) => r.output)).toEqual(b.rows.map((r) => r.output));
  });

  it('evaluates OR correctly (A+B)', () => {
    const table = buildTruthTable(parseBooleanExpression('A+B'), ['A', 'B']);
    expect(table.rows.map((r) => r.output)).toEqual([false, true, true, true]);
  });

  it('evaluates postfix NOT correctly (A\')', () => {
    const table = buildTruthTable(parseBooleanExpression("A'"), ['A']);
    expect(table.rows.map((r) => r.output)).toEqual([true, false]);
  });

  it('evaluates a classic XOR expression: A\'B + AB\'', () => {
    const table = buildTruthTable(parseBooleanExpression("A'B + AB'"), ['A', 'B']);
    // A=0,B=0 -> 0 ; A=0,B=1 -> 1 ; A=1,B=0 -> 1 ; A=1,B=1 -> 0
    expect(table.rows.map((r) => r.output)).toEqual([false, true, true, false]);
  });

  it('respects parentheses over default precedence', () => {
    const withParens = buildTruthTable(parseBooleanExpression("(A+B)'"), ['A', 'B']);
    expect(withParens.rows.map((r) => r.output)).toEqual([true, false, false, false]); // NOR
  });

  it('throws BooleanParseError on invalid syntax', () => {
    expect(() => parseBooleanExpression('A + ')).toThrow(BooleanParseError);
    expect(() => parseBooleanExpression('(A+B')).toThrow(BooleanParseError);
    expect(() => parseBooleanExpression('A $ B')).toThrow(BooleanParseError);
  });
});

describe('extractVariables', () => {
  it('deduplicates and sorts variables', () => {
    expect(extractVariables("C'A + B")).toEqual(['A', 'B', 'C']);
  });
});

describe('minimize (Quine-McCluskey)', () => {
  it('produces the single essential term for a plain AND (2 vars, minterm 3)', () => {
    const result = minimize(['A', 'B'], [3]);
    expect(result.sop).toBe('AB');
  });

  it('returns constant 0 when there are no 1-minterms', () => {
    expect(minimize(['A', 'B'], []).sop).toBe('0');
  });

  it('returns constant 1 when every minterm is 1', () => {
    expect(minimize(['A', 'B'], [0, 1, 2, 3]).sop).toBe('1');
  });

  it('round-trips: simplified SOP evaluates to the same truth table as the original expression', () => {
    const expr = "A'BC + AB'C + ABC' + ABC"; // majority function of 3 variables
    const variables = extractVariables(expr);
    const original = buildTruthTable(parseBooleanExpression(expr), variables);
    const onesMinterms = original.rows.filter((r) => r.output).map((r) => r.minterm);

    const { sop } = minimize(variables, onesMinterms);
    const resimplified = buildTruthTable(parseBooleanExpression(sop), variables);

    expect(resimplified.rows.map((r) => r.output)).toEqual(original.rows.map((r) => r.output));
  });

  it("honors don't-cares by allowing them to be freely assigned", () => {
    // 2 vars: f=1 only at minterm 0 (A=0,B=0); minterm 2 (A=1,B=0) is don't-care.
    // Treating the don't-care as 1 lets minterms 0 and 2 merge into a single term: B'.
    const result = minimize(['A', 'B'], [0], [2]);
    expect(result.sop).toBe("B'");
  });
});

describe('buildKMapGrid', () => {
  it('produces a grid whose cells cover every minterm exactly once for 4 variables', () => {
    const variables = ['A', 'B', 'C', 'D'];
    const rows = Array.from({ length: 16 }, (_, m) => ({ minterm: m, inputs: [], output: m % 2 === 0 }));
    const { grid } = buildKMapGrid(variables, rows);
    const seen = new Set(grid.flat().map((cell) => cell.minterm));
    expect(seen.size).toBe(16);
    for (let m = 0; m < 16; m++) expect(seen.has(m)).toBe(true);
  });
});

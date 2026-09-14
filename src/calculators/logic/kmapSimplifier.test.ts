import { describe, expect, it } from 'vitest';
import { kmapSimplifier } from './kmapSimplifier';

describe('K-map Simplifier', () => {
  it('simplifies a 3-variable function to a K-map grid of the right shape', () => {
    const out = kmapSimplifier.calculate({ numVars: '3', minterms: '0,1,2,5', dontCares: '' });
    // 3 vars: rowBitCount=ceil(3/2)=2 -> 4 rows, colBitCount=1 -> 2 columns.
    expect(out.kmap?.grid.length).toBe(4);
    expect(out.kmap?.grid[0].length).toBe(2);
  });

  it('produces a constant-1 result when every minterm is present', () => {
    const out = kmapSimplifier.calculate({ numVars: '2', minterms: '0,1,2,3', dontCares: '' });
    expect(out.results[0].value).toBe('1');
  });

  it('rejects a minterm index out of range for the chosen variable count', () => {
    const errors = kmapSimplifier.validate({ numVars: '2', minterms: '0,7', dontCares: '' });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects an index used as both a minterm and a dont-care', () => {
    const errors = kmapSimplifier.validate({ numVars: '2', minterms: '0,1', dontCares: '1' });
    expect(errors.length).toBeGreaterThan(0);
  });
});

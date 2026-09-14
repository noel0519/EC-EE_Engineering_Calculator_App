import { describe, expect, it } from 'vitest';
import { coulombsLaw } from './coulombsLaw';

describe("Coulomb's Law", () => {
  it('matches the known force between two 1 C charges at 1 m (~8.99e9 N)', () => {
    const out = coulombsLaw.calculate({ q1: 1, q2: 1, r: 1 });
    expect(out.raw?.force).toBeGreaterThan(8.9e9);
    expect(out.raw?.force).toBeLessThan(9.0e9);
  });

  it('reports repulsive for like charges and attractive for opposite charges', () => {
    const like = coulombsLaw.calculate({ q1: 1e-6, q2: 1e-6, r: 1 });
    const opposite = coulombsLaw.calculate({ q1: 1e-6, q2: -1e-6, r: 1 });
    expect(like.results.find((r) => r.label === 'Nature')?.value).toBe('Repulsive');
    expect(opposite.results.find((r) => r.label === 'Nature')?.value).toBe('Attractive');
  });

  it('scales with inverse square of distance', () => {
    const a = coulombsLaw.calculate({ q1: 1e-6, q2: 1e-6, r: 1 });
    const b = coulombsLaw.calculate({ q1: 1e-6, q2: 1e-6, r: 2 });
    expect((a.raw!.force as number) / (b.raw!.force as number)).toBeCloseTo(4, 6);
  });

  it('rejects zero separation distance', () => {
    const errors = coulombsLaw.validate({ q1: 1e-6, q2: 1e-6, r: 0 }, coulombsLaw.fields);
    expect(errors.length).toBeGreaterThan(0);
  });
});

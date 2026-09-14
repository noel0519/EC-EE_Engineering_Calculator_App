// Reusable engineering-prefix unit system. Every calculator's numeric fields
// declare their unit options in terms of this table so conversion logic is
// never duplicated per calculator (per the master prompt's constraint #3).

export interface EngineeringPrefix {
  symbol: string;
  factor: number;
}

/** Standard engineering (10^3n) prefixes, p through T. */
export const ENGINEERING_PREFIXES: EngineeringPrefix[] = [
  { symbol: 'p', factor: 1e-12 },
  { symbol: 'n', factor: 1e-9 },
  { symbol: 'µ', factor: 1e-6 },
  { symbol: 'm', factor: 1e-3 },
  { symbol: '', factor: 1 },
  { symbol: 'k', factor: 1e3 },
  { symbol: 'M', factor: 1e6 },
  { symbol: 'G', factor: 1e9 },
  { symbol: 'T', factor: 1e12 },
];

/** Builds unit options for a base unit across a chosen subset of prefixes. */
export function prefixUnits(baseSymbol: string, prefixSymbols: string[]): { symbol: string; toBase: number }[] {
  return prefixSymbols.map((p) => {
    const prefix = ENGINEERING_PREFIXES.find((e) => e.symbol === p);
    if (!prefix) throw new Error(`Unknown engineering prefix "${p}"`);
    return { symbol: `${p}${baseSymbol}`, toBase: prefix.factor };
  });
}

/** Converts a value in `fromUnit` (toBase multiplier) to the field's base SI unit. */
export function toBaseUnit(value: number, toBase: number): number {
  return value * toBase;
}

/** Converts a base-SI value back to a display unit given its toBase multiplier. */
export function fromBaseUnit(value: number, toBase: number): number {
  return value / toBase;
}

/**
 * Picks the engineering prefix (10^3n) that keeps a base-SI magnitude's
 * mantissa in [1, 1000), for display formatting.
 */
export function pickEngineeringPrefix(magnitude: number): EngineeringPrefix {
  if (magnitude === 0 || !Number.isFinite(magnitude)) {
    return { symbol: '', factor: 1 };
  }
  const abs = Math.abs(magnitude);
  const candidates = ENGINEERING_PREFIXES.filter((p) => p.factor >= 1e-12 && p.factor <= 1e12);
  let best = candidates[0];
  for (const p of candidates) {
    if (abs / p.factor >= 1) {
      best = p;
    }
  }
  return best;
}

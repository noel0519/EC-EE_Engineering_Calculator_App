// Presentation-only formatting. Calculations must never round internally;
// only this module rounds, and only for display (master prompt section 7).

import { pickEngineeringPrefix } from './units';

/**
 * Formats a base-SI numeric value using engineering notation (10^3n steps)
 * with the given unit symbol, e.g. formatEngineering(0.0000012, 'F') -> "1.2 µF".
 */
export function formatEngineering(value: number, unitSymbol: string, sigFigs = 4): string {
  if (Number.isNaN(value)) return 'NaN';
  if (!Number.isFinite(value)) return value > 0 ? '+Infinity' : '-Infinity';
  if (value === 0) return `0 ${unitSymbol}`.trim();

  const prefix = pickEngineeringPrefix(value);
  const scaled = value / prefix.factor;
  const rounded = roundToSigFigs(scaled, sigFigs);
  const unit = `${prefix.symbol}${unitSymbol}`;
  return `${rounded} ${unit}`.trim();
}

/** Rounds to N significant figures and returns a clean decimal string (no trailing zeros noise). */
export function roundToSigFigs(value: number, sigFigs = 4): string {
  if (value === 0) return '0';
  const digits = Math.ceil(Math.log10(Math.abs(value)));
  const decimals = Math.max(0, sigFigs - digits);
  const factor = 10 ** decimals;
  const rounded = Math.round(value * factor) / factor;
  // Avoid "-0"
  const clean = rounded === 0 ? 0 : rounded;
  return clean.toString();
}

/** Formats a plain dimensionless number to N significant figures. */
export function formatNumber(value: number, sigFigs = 4): string {
  if (Number.isNaN(value)) return 'NaN';
  if (!Number.isFinite(value)) return value > 0 ? '+Infinity' : '-Infinity';
  return roundToSigFigs(value, sigFigs);
}

/** Formats a value already in a specific display unit (no further scaling), e.g. dB, degrees. */
export function formatWithUnit(value: number, unitSymbol: string, sigFigs = 4): string {
  return `${formatNumber(value, sigFigs)}${unitSymbol ? ' ' + unitSymbol : ''}`;
}

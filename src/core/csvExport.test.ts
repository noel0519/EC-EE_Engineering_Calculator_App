import { describe, expect, it } from 'vitest';
import { buildHistoryCsv } from './csvExport';
import type { HistoryEntry } from './types';

function makeEntry(overrides: Partial<HistoryEntry> = {}): HistoryEntry {
  return {
    id: '1',
    timestamp: new Date('2024-01-01T12:00:00Z').getTime(),
    calculatorId: 'ohmsLaw',
    calculatorName: "Ohm's Law",
    category: 'network',
    inputs: { I: 5, R: 10 },
    units: { I: 'A', R: 'Ω' },
    output: { results: [{ label: 'Voltage', value: '50 V', primary: true }] },
    ...overrides,
  };
}

describe('buildHistoryCsv', () => {
  it('emits a header row followed by one row per entry', () => {
    const csv = buildHistoryCsv([makeEntry()]);
    const lines = csv.split('\r\n');
    expect(lines[0]).toBe('Timestamp,Category,Calculator,Inputs,Result');
    expect(lines[1]).toContain("Ohm's Law");
    expect(lines[1]).toContain('Voltage: 50 V');
  });

  it('returns just the header row for an empty history', () => {
    const csv = buildHistoryCsv([]);
    expect(csv).toBe('Timestamp,Category,Calculator,Inputs,Result');
  });

  it('quotes fields that contain commas (e.g. multi-input summaries)', () => {
    const csv = buildHistoryCsv([makeEntry()]);
    expect(csv).toMatch(/"I=5A, R=10Ω"/);
  });

  it('escapes embedded double quotes by doubling them', () => {
    const csv = buildHistoryCsv([
      makeEntry({ calculatorName: 'Weird "Calc"' }),
    ]);
    expect(csv).toContain('"Weird ""Calc"""');
  });
});

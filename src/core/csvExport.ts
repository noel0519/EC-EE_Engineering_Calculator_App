import type { HistoryEntry } from './types';

const CSV_HEADERS = ['Timestamp', 'Category', 'Calculator', 'Inputs', 'Result'];

function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function summarizeInputs(entry: HistoryEntry): string {
  return Object.entries(entry.inputs)
    .map(([id, value]) => {
      const unit = entry.units[id];
      return typeof value === 'number' ? `${id}=${value}${unit ?? ''}` : `${id}=${value}`;
    })
    .join(', ');
}

function summarizeResult(entry: HistoryEntry): string {
  return entry.output.results.map((r) => `${r.label}: ${r.value}`).join('; ');
}

/** Builds an RFC-4180-ish CSV string (CRLF line endings) from the calculation history. */
export function buildHistoryCsv(history: HistoryEntry[]): string {
  const rows = history.map((entry) => [
    new Date(entry.timestamp).toLocaleString(),
    entry.category,
    entry.calculatorName,
    summarizeInputs(entry),
    summarizeResult(entry),
  ]);

  return [CSV_HEADERS, ...rows]
    .map((row) => row.map(escapeCsvField).join(','))
    .join('\r\n');
}

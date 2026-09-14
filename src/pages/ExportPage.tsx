import { useState } from 'react';
import { useStore } from '@/state/store';
import { buildHistoryCsv } from '@/core/csvExport';
import { downloadTextFile, fileTimestamp } from '@/utils/download';

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString();
}

function summarizeInputs(inputs: Record<string, number | string>, units: Record<string, string>): string {
  return Object.entries(inputs)
    .map(([k, v]) => (typeof v === 'number' ? `${k}=${v}${units[k] ?? ''}` : `${k}=${v}`))
    .join(', ');
}

function summarizeResult(entry: { output: { results: { label: string; value: string }[] } }): string {
  return entry.output.results.map((r) => `${r.label}: ${r.value}`).join('; ');
}

export function ExportPage() {
  const { state } = useStore();
  const history = state.history;
  const hasEntries = history.length > 0;
  const [pdfPending, setPdfPending] = useState(false);

  function handleExportCsv() {
    const csv = buildHistoryCsv(history);
    downloadTextFile(`calculation-log_${fileTimestamp()}.csv`, csv, 'text/csv;charset=utf-8');
  }

  async function handleExportPdf() {
    setPdfPending(true);
    try {
      const { exportHistoryPdf } = await import('@/utils/pdfExport');
      exportHistoryPdf(history);
    } finally {
      setPdfPending(false);
    }
  }

  return (
    <div className="export-page">
      <header className="header">
        <a className="header__back" href="#/">
          ← Back to Calculators
        </a>
        <span className="header__title">Calculation Log Export</span>
        <div className="header__spacer" />
      </header>

      <div className="export-page__body">
        <div className="panel">
          <div className="panel__header">
            <h2 className="panel__title">Export Options</h2>
            <p className="panel__description">
              {hasEntries
                ? `${history.length} calculation${history.length === 1 ? '' : 's'} logged this session.`
                : 'No calculations logged yet — export buttons are disabled.'}
            </p>
          </div>
          <div className="panel__body">
            <div className="btn-row">
              <button className="btn btn--primary" onClick={handleExportCsv} disabled={!hasEntries}>
                Export as CSV
              </button>
              <button className="btn btn--primary" onClick={handleExportPdf} disabled={!hasEntries || pdfPending}>
                {pdfPending ? 'Generating…' : 'Export as PDF'}
              </button>
            </div>
          </div>
        </div>

        <div className="panel" style={{ marginTop: 'var(--space-3)' }}>
          <div className="panel__header">
            <h2 className="panel__title">Preview</h2>
          </div>
          <div className="panel__body export-page__table-wrap">
            {hasEntries ? (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Category</th>
                    <th>Calculator</th>
                    <th className="history-col--wide">Inputs</th>
                    <th className="history-col--wide">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => (
                    <tr key={entry.id}>
                      <td>{formatTimestamp(entry.timestamp)}</td>
                      <td>{entry.category}</td>
                      <td>{entry.calculatorName}</td>
                      <td className="history-col--wide">{summarizeInputs(entry.inputs, entry.units)}</td>
                      <td className="history-col--wide">{summarizeResult(entry)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="history-empty">Run a calculation, then come back here to export the log.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

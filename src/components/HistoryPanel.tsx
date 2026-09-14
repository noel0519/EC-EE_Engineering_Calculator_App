import { useStore } from '@/state/store';

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function summarizeInputs(inputs: Record<string, number | string>, units: Record<string, string>): string {
  return Object.entries(inputs)
    .map(([k, v]) => (typeof v === 'number' ? `${k}=${v}${units[k] ?? ''}` : `${k}=${v}`))
    .join(', ');
}

/**
 * Global calculation history — one mechanism shared by every calculator
 * and category (master prompt section 4/14), not a per-calculator log.
 */
export function HistoryPanel() {
  const { state, dispatch } = useStore();

  return (
    <div className="history-panel">
      <div className="panel__header" style={{ display: 'flex', alignItems: 'center' }}>
        <a className="panel__title panel__title--link" style={{ flex: 1 }} href="#/export" title="View full log and export as CSV or PDF">
          Calculation Log <span className="history-panel__export-hint">— view &amp; export ↗</span>
        </a>
        <button className="icon-btn" onClick={() => dispatch({ type: 'CLEAR_HISTORY' })} disabled={state.history.length === 0}>
          Clear History
        </button>
      </div>
      <div className="history-panel__body">
        {state.history.length === 0 ? (
          <p className="history-empty">No calculations yet.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Calculator</th>
                <th className="history-col--wide">Input</th>
                <th className="history-col--wide">Result</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {state.history.map((entry) => (
                <tr key={entry.id} onClick={() => dispatch({ type: 'LOAD_HISTORY_ENTRY', entry })}>
                  <td>{formatTime(entry.timestamp)}</td>
                  <td>{entry.calculatorName}</td>
                  <td className="history-col--wide">{summarizeInputs(entry.inputs, entry.units)}</td>
                  <td className="history-col--wide">{entry.output.results.find((r) => r.primary)?.value ?? entry.output.results[0]?.value}</td>
                  <td>
                    <button
                      className="icon-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: 'REMOVE_HISTORY_ENTRY', id: entry.id });
                      }}
                      title="Remove entry"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

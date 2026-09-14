import type { CalculationOutput } from '@/core/types';
import { TruthTableView } from './TruthTableView';
import { KMapView } from './KMapView';

/**
 * The right-hand auxiliary workspace. Shows whichever of formula /
 * assumptions / table / K-map the current calculator's last result
 * produced. Deliberately renders nothing for sections that don't apply
 * (master prompt section 15: "empty space is acceptable").
 */
export function AuxiliaryPanel({ output }: { output: CalculationOutput | null }) {
  if (!output) {
    return (
      <div className="panel">
        <div className="panel__header">
          <h2 className="panel__title">Reference</h2>
        </div>
        <div className="panel__body">
          <p className="empty-result">Formula and assumptions appear here after you calculate.</p>
        </div>
      </div>
    );
  }

  const hasAnything = output.formula || output.assumptions?.length || output.table || output.kmap;

  return (
    <div className="panel">
      <div className="panel__header">
        <h2 className="panel__title">Reference</h2>
      </div>
      <div className="panel__body">
        {!hasAnything && <p className="empty-result">No additional reference information for this result.</p>}

        {output.formula && (
          <>
            <p className="panel__section-label">Formula</p>
            <div className="formula-block">{output.formula}</div>
          </>
        )}

        {output.assumptions && output.assumptions.length > 0 && (
          <div className={output.formula ? 'panel--sub' : undefined}>
            <p className="panel__section-label">Assumptions</p>
            <ul className="assumptions-list">
              {output.assumptions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        )}

        {output.table && (
          <div className={output.formula || output.assumptions?.length ? 'panel--sub' : undefined}>
            <p className="panel__section-label">Truth Table</p>
            <TruthTableView table={output.table} />
          </div>
        )}

        {output.kmap && (
          <div className={output.formula || output.assumptions?.length ? 'panel--sub' : undefined}>
            <p className="panel__section-label">Karnaugh Map</p>
            <KMapView kmap={output.kmap} />
          </div>
        )}
      </div>
    </div>
  );
}

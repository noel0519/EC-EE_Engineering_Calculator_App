import type { KMapData } from '@/core/types';

export function KMapView({ kmap }: { kmap: KMapData }) {
  const colBits = kmap.grid[0]?.map((cell) => cell.colBits) ?? [];

  return (
    <div className="kmap-wrap">
      <table className="kmap-grid">
        <thead>
          <tr>
            <th className="kmap-corner">
              {kmap.rowVars.join('')}\{kmap.colVars.join('') || '—'}
            </th>
            {colBits.map((bits, i) => (
              <th key={i}>{bits || '—'}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {kmap.grid.map((row, i) => (
            <tr key={i}>
              <th>{row[0].rowBits}</th>
              {row.map((cell) => (
                <td
                  key={cell.minterm}
                  className={cell.value === 'dc' ? 'is-dc' : cell.value ? 'is-one' : undefined}
                  title={`m${cell.minterm}`}
                >
                  {cell.value === 'dc' ? 'X' : cell.value ? '1' : '0'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

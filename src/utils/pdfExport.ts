import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { HistoryEntry } from '@/core/types';
import { fileTimestamp } from './download';

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

/** Builds and downloads a PDF of the calculation log via the browser's save dialog. */
export function exportHistoryPdf(history: HistoryEntry[]): void {
  const doc = new jsPDF({ orientation: 'landscape' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text('Engineering Calculator Suite — Calculation Log', 14, 15);
  doc.setFontSize(9);
  doc.text(`Exported ${new Date().toLocaleString()} · ${history.length} entr${history.length === 1 ? 'y' : 'ies'}`, 14, 21);

  autoTable(doc, {
    startY: 26,
    head: [['Time', 'Category', 'Calculator', 'Inputs', 'Result']],
    body: history.map((entry) => [
      new Date(entry.timestamp).toLocaleString(),
      entry.category,
      entry.calculatorName,
      summarizeInputs(entry),
      summarizeResult(entry),
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [61, 90, 115] },
    columnStyles: {
      3: { cellWidth: 90 },
      4: { cellWidth: 90 },
    },
  });

  doc.save(`calculation-log_${fileTimestamp()}.pdf`);
}

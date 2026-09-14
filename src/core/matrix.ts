// Minimal reusable matrix arithmetic for the General calculator's Matrix
// Solver, kept as one shared module rather than duplicated per operation.

export type Matrix = number[][];

/** Parses "1,2;3,4" into [[1,2],[3,4]]. Rows separated by ";", entries by ",". */
export function parseMatrix(text: string): Matrix | null {
  const cleaned = text.trim();
  if (cleaned === '') return null;
  const rows = cleaned.split(';').map((r) => r.trim()).filter((r) => r !== '');
  if (rows.length === 0) return null;

  const matrix: Matrix = [];
  for (const row of rows) {
    const entries = row.split(',').map((e) => Number(e.trim()));
    if (entries.some((n) => Number.isNaN(n))) return null;
    matrix.push(entries);
  }
  const width = matrix[0].length;
  if (matrix.some((r) => r.length !== width)) return null;
  return matrix;
}

export function formatMatrix(m: Matrix, sigFigs = 4): string {
  const round = (n: number) => {
    const factor = 10 ** sigFigs;
    return Math.round(n * factor) / factor;
  };
  return m.map((row) => `[ ${row.map(round).join(', ')} ]`).join('\n');
}

export function dimensions(m: Matrix): { rows: number; cols: number } {
  return { rows: m.length, cols: m[0]?.length ?? 0 };
}

export function add(a: Matrix, b: Matrix): Matrix {
  assertSameShape(a, b, 'add');
  return a.map((row, i) => row.map((v, j) => v + b[i][j]));
}

export function subtract(a: Matrix, b: Matrix): Matrix {
  assertSameShape(a, b, 'subtract');
  return a.map((row, i) => row.map((v, j) => v - b[i][j]));
}

export function multiply(a: Matrix, b: Matrix): Matrix {
  const { cols: aCols } = dimensions(a);
  const { rows: bRows, cols: bCols } = dimensions(b);
  if (aCols !== bRows) {
    throw new Error(`Cannot multiply a ${a.length}x${aCols} matrix by a ${bRows}x${bCols} matrix.`);
  }
  const result: Matrix = [];
  for (let i = 0; i < a.length; i++) {
    const row: number[] = [];
    for (let j = 0; j < bCols; j++) {
      let sum = 0;
      for (let k = 0; k < aCols; k++) sum += a[i][k] * b[k][j];
      row.push(sum);
    }
    result.push(row);
  }
  return result;
}

export function transpose(a: Matrix): Matrix {
  const { rows, cols } = dimensions(a);
  const result: Matrix = Array.from({ length: cols }, () => new Array(rows).fill(0));
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) result[j][i] = a[i][j];
  return result;
}

export function determinant(a: Matrix): number {
  const { rows, cols } = dimensions(a);
  if (rows !== cols) throw new Error('Determinant requires a square matrix.');
  const n = rows;
  if (n === 1) return a[0][0];
  if (n === 2) return a[0][0] * a[1][1] - a[0][1] * a[1][0];

  let det = 0;
  for (let col = 0; col < n; col++) {
    const minor = a.slice(1).map((row) => row.filter((_, j) => j !== col));
    det += (col % 2 === 0 ? 1 : -1) * a[0][col] * determinant(minor);
  }
  return det;
}

/** Gauss-Jordan matrix inverse. Throws if the matrix is singular. */
export function inverse(a: Matrix): Matrix {
  const { rows, cols } = dimensions(a);
  if (rows !== cols) throw new Error('Inverse requires a square matrix.');
  const n = rows;
  const augmented: Matrix = a.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);

  for (let col = 0; col < n; col++) {
    let pivotRow = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(augmented[r][col]) > Math.abs(augmented[pivotRow][col])) pivotRow = r;
    }
    if (Math.abs(augmented[pivotRow][col]) < 1e-12) {
      throw new Error('Matrix is singular; inverse does not exist.');
    }
    [augmented[col], augmented[pivotRow]] = [augmented[pivotRow], augmented[col]];

    const pivot = augmented[col][col];
    for (let j = 0; j < 2 * n; j++) augmented[col][j] /= pivot;

    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = augmented[r][col];
      for (let j = 0; j < 2 * n; j++) augmented[r][j] -= factor * augmented[col][j];
    }
  }

  return augmented.map((row) => row.slice(n));
}

/** Solves Ax = b via inverse(A) * b. Throws if A is singular or non-square. */
export function solveLinearSystem(A: Matrix, b: Matrix): Matrix {
  return multiply(inverse(A), b);
}

function assertSameShape(a: Matrix, b: Matrix, op: string) {
  const da = dimensions(a);
  const db = dimensions(b);
  if (da.rows !== db.rows || da.cols !== db.cols) {
    throw new Error(`Cannot ${op} a ${da.rows}x${da.cols} matrix with a ${db.rows}x${db.cols} matrix.`);
  }
}

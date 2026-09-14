// Self-contained Boolean-algebra engine: expression parsing, truth-table
// generation, and Quine-McCluskey SOP/POS minimization. Kept independent of
// the UI and of any single calculator so both the truth-table tool and the
// K-map tool can share it (master prompt section G).
//
// Supported syntax:
//   variables      single letters A-Z (case-insensitive)
//   NOT            postfix "'"  or prefix "!" / "~"
//   AND            "." or implicit juxtaposition, e.g. "AB" = A AND B
//   OR             "+"
//   constants      "0", "1"
//   grouping       "( ... )"
// Example: "A'B + AC'" means (NOT A AND B) OR (A AND NOT C).

type Node =
  | { type: 'var'; name: string }
  | { type: 'const'; value: boolean }
  | { type: 'not'; arg: Node }
  | { type: 'and'; args: Node[] }
  | { type: 'or'; args: Node[] };

export class BooleanParseError extends Error {}

/** Parses a Boolean expression into an AST. Throws BooleanParseError on invalid syntax. */
export function parseBooleanExpression(input: string): Node {
  const tokens = tokenize(input);
  let pos = 0;

  function peek() {
    return tokens[pos];
  }
  function consume() {
    return tokens[pos++];
  }

  function parseExpr(): Node {
    let node = parseTerm();
    while (peek() === '+') {
      consume();
      const rhs = parseTerm();
      node = node.type === 'or' ? { type: 'or', args: [...node.args, rhs] } : { type: 'or', args: [node, rhs] };
    }
    return node;
  }

  function parseTerm(): Node {
    let node = parseFactor();
    while (peek() && isFactorStart(peek())) {
      if (peek() === '.') consume();
      const rhs = parseFactor();
      node = node.type === 'and' ? { type: 'and', args: [...node.args, rhs] } : { type: 'and', args: [node, rhs] };
    }
    return node;
  }

  function parseFactor(): Node {
    if (peek() === '!' || peek() === '~') {
      consume();
      return { type: 'not', arg: parseFactor() };
    }
    let node = parsePrimary();
    while (peek() === "'") {
      consume();
      node = { type: 'not', arg: node };
    }
    return node;
  }

  function parsePrimary(): Node {
    const tok = consume();
    if (tok === undefined) throw new BooleanParseError('Unexpected end of expression.');
    if (tok === '(') {
      const node = parseExpr();
      if (consume() !== ')') throw new BooleanParseError('Missing closing parenthesis.');
      return node;
    }
    if (tok === '0' || tok === '1') return { type: 'const', value: tok === '1' };
    if (/^[A-Za-z]$/.test(tok)) return { type: 'var', name: tok.toUpperCase() };
    throw new BooleanParseError(`Unexpected token "${tok}".`);
  }

  function isFactorStart(tok: string) {
    return tok === '.' || tok === '!' || tok === '~' || tok === '(' || /^[A-Za-z01]$/.test(tok);
  }

  if (tokens.length === 0) throw new BooleanParseError('Expression is empty.');
  const result = parseExpr();
  if (pos !== tokens.length) throw new BooleanParseError(`Unexpected token "${tokens[pos]}".`);
  return result;
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  for (const ch of input) {
    if (/\s/.test(ch)) continue;
    if (/[A-Za-z01().'+!~]/.test(ch)) {
      tokens.push(ch);
    } else {
      throw new BooleanParseError(`Unsupported character "${ch}".`);
    }
  }
  return tokens;
}

/** Extracts the distinct variable letters used in an expression, sorted alphabetically. */
export function extractVariables(input: string): string[] {
  const found = new Set<string>();
  for (const ch of input) {
    if (/[A-Za-z]/.test(ch)) found.add(ch.toUpperCase());
  }
  return Array.from(found).sort();
}

function evaluate(node: Node, assignment: Record<string, boolean>): boolean {
  switch (node.type) {
    case 'var':
      return assignment[node.name];
    case 'const':
      return node.value;
    case 'not':
      return !evaluate(node.arg, assignment);
    case 'and':
      return node.args.every((n) => evaluate(n, assignment));
    case 'or':
      return node.args.some((n) => evaluate(n, assignment));
  }
}

export interface TruthTableRow {
  minterm: number;
  inputs: boolean[];
  output: boolean;
}

export interface TruthTable {
  variables: string[];
  rows: TruthTableRow[];
}

/** Builds the full truth table for a parsed expression over the given variables (MSB = first variable). */
export function buildTruthTable(node: Node, variables: string[]): TruthTable {
  const n = variables.length;
  const rows: TruthTableRow[] = [];
  for (let m = 0; m < 2 ** n; m++) {
    const inputs = bitsOf(m, n);
    const assignment: Record<string, boolean> = {};
    variables.forEach((v, i) => (assignment[v] = inputs[i]));
    rows.push({ minterm: m, inputs, output: evaluate(node, assignment) });
  }
  return { variables, rows };
}

function bitsOf(value: number, n: number): boolean[] {
  const bits: boolean[] = [];
  for (let i = n - 1; i >= 0; i--) bits.push(((value >> i) & 1) === 1);
  return bits;
}

// ---------------------------------------------------------------------------
// Quine-McCluskey minimization
// ---------------------------------------------------------------------------

/** A term over n bits: each position is '0', '1', or '-' (don't-care/eliminated). */
type QMTerm = string;

function countOnes(term: QMTerm): number {
  return term.split('').filter((c) => c === '1').length;
}

function combine(a: QMTerm, b: QMTerm): QMTerm | null {
  let diffCount = 0;
  let result = '';
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      diffCount++;
      if (diffCount > 1) return null;
      result += '-';
    } else {
      result += a[i];
    }
  }
  return diffCount === 1 ? result : null;
}

/** Runs Quine-McCluskey on a list of "1" minterms (plus optional don't-cares) to find all prime implicants. */
function findPrimeImplicants(onesAndDontCares: number[], n: number): QMTerm[] {
  if (onesAndDontCares.length === 0) return [];
  let currentGroup: QMTerm[] = onesAndDontCares.map((m) => m.toString(2).padStart(n, '0'));
  const primes = new Set<QMTerm>();

  while (currentGroup.length > 0) {
    const combined = new Set<QMTerm>();
    const used = new Set<QMTerm>();

    const byOnes = new Map<number, QMTerm[]>();
    for (const term of currentGroup) {
      const key = countOnes(term);
      if (!byOnes.has(key)) byOnes.set(key, []);
      byOnes.get(key)!.push(term);
    }
    const groupKeys = Array.from(byOnes.keys()).sort((a, b) => a - b);

    for (let i = 0; i < groupKeys.length - 1; i++) {
      const group1 = byOnes.get(groupKeys[i]) ?? [];
      const group2 = byOnes.get(groupKeys[i + 1]) ?? [];
      for (const t1 of group1) {
        for (const t2 of group2) {
          const merged = combine(t1, t2);
          if (merged !== null) {
            combined.add(merged);
            used.add(t1);
            used.add(t2);
          }
        }
      }
    }

    for (const term of currentGroup) {
      if (!used.has(term)) primes.add(term);
    }

    currentGroup = Array.from(combined);
  }

  return Array.from(primes);
}

/** Returns which minterm indices a QM term (with '-' wildcards) covers. */
function termCoversMinterm(term: QMTerm, minterm: number, n: number): boolean {
  const bits = minterm.toString(2).padStart(n, '0');
  for (let i = 0; i < n; i++) {
    if (term[i] !== '-' && term[i] !== bits[i]) return false;
  }
  return true;
}

/** Selects a minimal (essential-first, then greedy) cover of prime implicants for the target minterms. */
function selectCover(primeImplicants: QMTerm[], targetMinterms: number[], n: number): QMTerm[] {
  const coverage = new Map<QMTerm, Set<number>>();
  for (const pi of primeImplicants) {
    coverage.set(pi, new Set(targetMinterms.filter((m) => termCoversMinterm(pi, m, n))));
  }

  const remaining = new Set(targetMinterms);
  const selected: QMTerm[] = [];

  // Essential prime implicants: the only one covering some minterm.
  for (const m of targetMinterms) {
    const coveringPIs = primeImplicants.filter((pi) => coverage.get(pi)!.has(m));
    if (coveringPIs.length === 1 && !selected.includes(coveringPIs[0])) {
      selected.push(coveringPIs[0]);
    }
  }
  for (const pi of selected) for (const m of coverage.get(pi)!) remaining.delete(m);

  // Greedily cover what's left with the PI that covers the most remaining minterms.
  while (remaining.size > 0) {
    let best: QMTerm | null = null;
    let bestCount = 0;
    for (const pi of primeImplicants) {
      if (selected.includes(pi)) continue;
      const count = Array.from(coverage.get(pi)!).filter((m) => remaining.has(m)).length;
      if (count > bestCount) {
        best = pi;
        bestCount = count;
      }
    }
    if (!best) break; // Should not happen if PIs fully cover the target set.
    selected.push(best);
    for (const m of coverage.get(best)!) remaining.delete(m);
  }

  return selected;
}

/** Converts a QM term (with '-' wildcards) into an SOP literal product, e.g. "10-" with vars [A,B,C] -> "AB'". */
function termToSopLiteral(term: QMTerm, variables: string[]): string {
  let out = '';
  for (let i = 0; i < term.length; i++) {
    if (term[i] === '1') out += variables[i];
    else if (term[i] === '0') out += `${variables[i]}'`;
  }
  return out === '' ? '1' : out;
}

/** Converts a QM term into a POS sum-of-literals, e.g. "10-" with vars [A,B,C] -> "(A' + B)". */
function termToPosLiteral(term: QMTerm, variables: string[]): string {
  const literals: string[] = [];
  for (let i = 0; i < term.length; i++) {
    if (term[i] === '1') literals.push(`${variables[i]}'`);
    else if (term[i] === '0') literals.push(variables[i]);
  }
  return literals.length === 0 ? '0' : `(${literals.join(' + ')})`;
}

export interface MinimizationResult {
  sop: string;
  pos: string;
  sopTerms: string[];
  posTerms: string[];
}

/**
 * Minimizes a Boolean function to SOP and POS form given its 1-minterms
 * (and optional don't-care minterms) over `variables.length` variables.
 */
export function minimize(variables: string[], onesMinterms: number[], dontCares: number[] = []): MinimizationResult {
  const n = variables.length;
  const total = 2 ** n;
  const allMinterms = Array.from({ length: total }, (_, i) => i);
  const zerosMinterms = allMinterms.filter((m) => !onesMinterms.includes(m) && !dontCares.includes(m));

  if (onesMinterms.length === 0) {
    return { sop: '0', pos: '0', sopTerms: [], posTerms: [] };
  }
  if (onesMinterms.length + dontCares.length === total) {
    return { sop: '1', pos: '1', sopTerms: [], posTerms: [] };
  }

  const sopPrimes = findPrimeImplicants([...onesMinterms, ...dontCares], n);
  const sopCover = selectCover(sopPrimes, onesMinterms, n);
  const sopTerms = sopCover.map((t) => termToSopLiteral(t, variables));

  const posPrimes = findPrimeImplicants([...zerosMinterms, ...dontCares], n);
  const posCover = selectCover(posPrimes, zerosMinterms, n);
  const posTerms = posCover.map((t) => termToPosLiteral(t, variables));

  return {
    sop: sopTerms.join(' + '),
    pos: posTerms.join(''),
    sopTerms,
    posTerms,
  };
}

// ---------------------------------------------------------------------------
// K-map grid layout
// ---------------------------------------------------------------------------

const GRAY_CODE: Record<number, number[]> = {
  1: [0, 1],
  2: [0, 1, 3, 2],
};

export interface KMapCell {
  minterm: number;
  value: boolean | 'dc';
  rowBits: string;
  colBits: string;
}

/**
 * Lays out a truth table as a 2/3/4-variable Karnaugh map grid. Rows are
 * indexed by the first ceil(n/2) variables, columns by the rest, both in
 * Gray-code order so adjacent cells differ by exactly one bit.
 */
export function buildKMapGrid(
  variables: string[],
  rows: TruthTableRow[],
  dontCares: number[] = []
): { rowVars: string[]; colVars: string[]; grid: KMapCell[][] } {
  const n = variables.length;
  const rowBitCount = Math.ceil(n / 2);
  const colBitCount = n - rowBitCount;
  const rowVars = variables.slice(0, rowBitCount);
  const colVars = variables.slice(rowBitCount);

  const rowGray = GRAY_CODE[rowBitCount] ?? [0];
  const colGray = GRAY_CODE[colBitCount] ?? [0];

  const outputByMinterm = new Map(rows.map((r) => [r.minterm, r.output]));

  const grid: KMapCell[][] = rowGray.map((rowCode) => {
    const rowBits = rowCode.toString(2).padStart(rowBitCount, '0');
    return colGray.map((colCode) => {
      const colBits = colBitCount > 0 ? colCode.toString(2).padStart(colBitCount, '0') : '';
      const minterm = parseInt(rowBits + colBits, 2);
      const value: boolean | 'dc' = dontCares.includes(minterm) ? 'dc' : outputByMinterm.get(minterm) ?? false;
      return { minterm, value, rowBits, colBits };
    });
  });

  return { rowVars, colVars, grid };
}

// Minimal reusable complex-number arithmetic, shared by the General
// calculator's Complex Number tool and any future impedance/Laplace work,
// so this logic is written once (master prompt constraint #3).

export interface Complex {
  re: number;
  im: number;
}

export function complex(re: number, im: number): Complex {
  return { re, im };
}

export function add(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function subtract(a: Complex, b: Complex): Complex {
  return { re: a.re - b.re, im: a.im - b.im };
}

export function multiply(a: Complex, b: Complex): Complex {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}

export function divide(a: Complex, b: Complex): Complex {
  const denom = b.re * b.re + b.im * b.im;
  if (denom === 0) throw new Error('Division by zero complex number.');
  return {
    re: (a.re * b.re + a.im * b.im) / denom,
    im: (a.im * b.re - a.re * b.im) / denom,
  };
}

export function conjugate(a: Complex): Complex {
  return { re: a.re, im: -a.im };
}

export function magnitude(a: Complex): number {
  return Math.hypot(a.re, a.im);
}

/** Phase angle in radians, in (-pi, pi]. */
export function phase(a: Complex): number {
  return Math.atan2(a.im, a.re);
}

export function fromPolar(r: number, thetaRad: number): Complex {
  return { re: r * Math.cos(thetaRad), im: r * Math.sin(thetaRad) };
}

/**
 * Parses a complex number from rectangular text like "3+4i", "-2-1j", "5",
 * "-3i". Accepts either "i" or "j" as the imaginary unit. Returns null if
 * the text cannot be parsed, so callers can produce a clear validation error.
 */
export function parseComplex(text: string): Complex | null {
  const cleaned = text.trim().replace(/\s+/g, '');
  if (cleaned === '') return null;

  // Pure real number, e.g. "5", "-3.2"
  if (/^[+-]?\d*\.?\d+(e[+-]?\d+)?$/i.test(cleaned)) {
    return { re: Number(cleaned), im: 0 };
  }

  // Pure imaginary, e.g. "4i", "-i", "+j"
  const pureImagMatch = cleaned.match(/^([+-]?\d*\.?\d*)(e[+-]?\d+)?[ij]$/i);
  if (pureImagMatch) {
    const [, mantissa, exp] = pureImagMatch;
    let coeff = mantissa === '' || mantissa === '+' ? 1 : mantissa === '-' ? -1 : Number(mantissa);
    if (exp) coeff = Number(`${mantissa || '1'}${exp}`);
    return { re: 0, im: coeff };
  }

  // Full rectangular form, e.g. "3+4i", "-2-1.5j", "3-4i"
  const fullMatch = cleaned.match(/^([+-]?\d*\.?\d+(?:e[+-]?\d+)?)([+-]\d*\.?\d*(?:e[+-]?\d+)?)[ij]$/i);
  if (fullMatch) {
    const [, reStr, imStr] = fullMatch;
    const re = Number(reStr);
    let im: number;
    if (imStr === '+') im = 1;
    else if (imStr === '-') im = -1;
    else im = Number(imStr);
    if (Number.isFinite(re) && Number.isFinite(im)) return { re, im };
  }

  return null;
}

export function formatComplex(a: Complex, sigFigs = 4): string {
  const round = (n: number) => {
    const factor = 10 ** sigFigs;
    return Math.round(n * factor) / factor;
  };
  const re = round(a.re);
  const im = round(a.im);
  if (im === 0) return `${re}`;
  const sign = im >= 0 ? '+' : '-';
  return `${re} ${sign} ${Math.abs(im)}i`;
}

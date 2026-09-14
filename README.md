# Engineering Calculator Suite

A modular calculator suite for Electrical/Electronics/Communication
engineering, styled after early/mid-2000s technical desktop utilities
(restrained, rectangular, information-dense — not a modern SaaS dashboard).

## Stack

- React + TypeScript + Vite
- Plain CSS with design tokens (no CSS framework, to keep the retro-utility
  look intentional rather than defaulting to a modern aesthetic)
- Vitest for calculation-logic unit tests

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm test          # run the calculation-logic test suite
npm run build     # type-check and produce a production build
```

## Architecture

- `src/core/` — unit system, engineering-notation formatting, validation,
  physical constants, complex-number and matrix math, and the Boolean
  algebra engine (parser, truth tables, Quine-McCluskey minimization,
  K-map layout). All pure functions, independently tested, with no UI
  dependencies.
- `src/calculators/<category>/` — one file per calculator. Each exports a
  `CalculatorDefinition` (fields, validation, calculation) that the shell
  renders generically — adding a calculator never requires touching the UI
  shell.
- `src/calculators/registry.ts` — the single list of categories and
  calculators the whole app reads from.
- `src/state/store.tsx` — one React context + reducer for calculator
  selection, per-calculator field state, and the global calculation history
  (persisted to `localStorage`).
- `src/components/` — the shell: category/calculator navigation, the
  generic input renderer (`fields/FieldInput.tsx`), the workspace, the
  auxiliary panel (formula/assumptions/truth-table/K-map), the history
  panel, and the status bar.

## Status

Implements the Phase 1-3 scope from the project brief: application shell,
reusable calculator infrastructure, and 18 calculators across Network,
Analog, Communication, Antenna, General, and Logic (KMap + Boolean).
EMF, CMOS, and Power categories are wired into the navigation as
placeholders ("coming soon") — the intended Phase 4 expansion surface.

## Known assumptions / simplifications

- Dynamic range / SNR figures (ADC calculator) use the standard 6.02N+1.76
  full-scale-sinusoid approximation; documented in-app under "Assumptions".
- The K-map/Boolean minimizer supports 2-4 variables and uses an
  essential-prime-implicant-first, then-greedy cover — not guaranteed
  minimum-literal-count in every pathological case, but standard practice
  for a practical UI (per the project brief's "do not over-engineer
  symbolic algebra" guidance).

import type { CalculatorDefinition, Category } from '@/core/types';

import { ohmsLaw } from './network/ohmsLaw';
import { seriesParallelResistance } from './network/seriesParallelResistance';
import { voltageDivider } from './network/voltageDivider';
import { rcTimeConstant } from './network/rcTimeConstant';

import { opAmpGain } from './analog/opAmpGain';
import { rcLowPassFilter } from './analog/rcLowPassFilter';
import { dbConverter } from './analog/dbConverter';

import { adcResolution } from './communication/adcResolution';
import { pcmBitRate } from './communication/pcmBitRate';
import { nyquistSampling } from './communication/nyquistSampling';

import { wavelength } from './antenna/wavelength';
import { freeSpacePathLoss } from './antenna/freeSpacePathLoss';
import { friisTransmission } from './antenna/friisTransmission';

import { complexNumberCalculator } from './general/complexNumberCalculator';
import { matrixSolver } from './general/matrixSolver';
import { quadraticSolver } from './general/quadraticSolver';

import { booleanTruthTable } from './logic/booleanTruthTable';
import { kmapSimplifier } from './logic/kmapSimplifier';

export interface CategoryMeta {
  id: Category;
  label: string;
}

/**
 * Category order and labels. Categories with no calculators yet (EMF, CMOS,
 * Power) are declared so the shell's navigation and "coming soon" placeholder
 * can reference them without any calculator-specific code — this is Phase 4
 * expansion surface per the master prompt's phased build plan.
 */
export const CATEGORIES: CategoryMeta[] = [
  { id: 'network', label: 'Network Calc' },
  { id: 'emf', label: 'EMF Calc' },
  { id: 'cmos', label: 'CMOS Calc' },
  { id: 'communication', label: 'Communication' },
  { id: 'analog', label: 'Analog Calc' },
  { id: 'antenna', label: 'Antenna Calc' },
  { id: 'logic', label: 'KMap + Boolean' },
  { id: 'general', label: 'General Calc' },
  { id: 'power', label: 'Power Calc' },
];

export const CALCULATORS: CalculatorDefinition[] = [
  ohmsLaw,
  seriesParallelResistance,
  voltageDivider,
  rcTimeConstant,
  opAmpGain,
  rcLowPassFilter,
  dbConverter,
  adcResolution,
  pcmBitRate,
  nyquistSampling,
  wavelength,
  freeSpacePathLoss,
  friisTransmission,
  complexNumberCalculator,
  matrixSolver,
  quadraticSolver,
  booleanTruthTable,
  kmapSimplifier,
];

export function calculatorsByCategory(category: Category): CalculatorDefinition[] {
  return CALCULATORS.filter((c) => c.category === category);
}

export function findCalculator(id: string): CalculatorDefinition | undefined {
  return CALCULATORS.find((c) => c.id === id);
}

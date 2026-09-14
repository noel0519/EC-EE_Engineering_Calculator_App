import type { CalculatorDefinition, Category } from '@/core/types';

import { coulombsLaw } from './emf/coulombsLaw';
import { electricFieldPotential } from './emf/electricFieldPotential';
import { parallelPlateCapacitance } from './emf/parallelPlateCapacitance';
import { magneticForce } from './emf/magneticForce';
import { magneticField } from './emf/magneticField';

import { switchingThreshold } from './cmos/switchingThreshold';
import { cmosPower } from './cmos/cmosPower';
import { propagationDelay } from './cmos/propagationDelay';
import { switchingEnergy } from './cmos/switchingEnergy';

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

import { dcPower } from './power/dcPower';
import { acPower } from './power/acPower';
import { powerDbConverter } from './power/powerDbConverter';
import { threePhasePower } from './power/threePhasePower';
import { efficiency } from './power/efficiency';
import { energyFromPower } from './power/energyFromPower';

export interface CategoryMeta {
  id: Category;
  label: string;
}

/** Category order and labels, read directly by the shell's navigation. */
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
  coulombsLaw,
  electricFieldPotential,
  parallelPlateCapacitance,
  magneticForce,
  magneticField,
  switchingThreshold,
  cmosPower,
  propagationDelay,
  switchingEnergy,
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
  dcPower,
  acPower,
  powerDbConverter,
  threePhasePower,
  efficiency,
  energyFromPower,
];

export function calculatorsByCategory(category: Category): CalculatorDefinition[] {
  return CALCULATORS.filter((c) => c.category === category);
}

export function findCalculator(id: string): CalculatorDefinition | undefined {
  return CALCULATORS.find((c) => c.id === id);
}

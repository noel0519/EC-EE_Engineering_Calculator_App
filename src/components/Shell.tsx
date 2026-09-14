import { useState } from 'react';
import type { CalculationOutput } from '@/core/types';
import { CATEGORIES, findCalculator } from '@/calculators/registry';
import { useStore } from '@/state/store';
import { CategoryNav } from './CategoryNav';
import { CalculatorNav } from './CalculatorNav';
import { CalculatorWorkspace } from './CalculatorWorkspace';
import { AuxiliaryPanel } from './AuxiliaryPanel';
import { HistoryPanel } from './HistoryPanel';
import { StatusBar } from './StatusBar';

export function Shell() {
  const { state } = useStore();
  const [output, setOutput] = useState<CalculationOutput | null>(null);

  const calculator = findCalculator(state.selectedCalculatorId);
  const categoryLabel = CATEGORIES.find((c) => c.id === state.selectedCategory)?.label ?? '';

  return (
    <div className="shell">
      <header className="header">
        <span className="header__title">Engineering Calculator Suite</span>
        <span className="header__breadcrumb">
          {categoryLabel}
          {calculator ? ` › ${calculator.name}` : ''}
        </span>
        <div className="header__spacer" />
      </header>

      <CategoryNav />
      <CalculatorNav />

      <div className="workspace">
        <div className="workspace__main">
          {calculator ? (
            <CalculatorWorkspace calculator={calculator} onResult={setOutput} />
          ) : (
            <div className="panel">
              <div className="panel__body">
                <p className="empty-result">This category has no calculators yet. Check back in a future update.</p>
              </div>
            </div>
          )}
        </div>
        <div className="workspace__aux">
          <AuxiliaryPanel output={output} />
        </div>
      </div>

      <HistoryPanel />
      <StatusBar />
    </div>
  );
}

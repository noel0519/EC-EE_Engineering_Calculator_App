import { CALCULATORS } from '@/calculators/registry';
import { useStore } from '@/state/store';

export function StatusBar() {
  const { state } = useStore();
  const calc = CALCULATORS.find((c) => c.id === state.selectedCalculatorId);

  return (
    <div className="status-bar">
      <span>Status: Ready</span>
      <div className="status-bar__spacer" />
      <span>{calc ? calc.category.toUpperCase() : ''}</span>
      <span>SI</span>
      <span>{state.history.length} in log</span>
    </div>
  );
}

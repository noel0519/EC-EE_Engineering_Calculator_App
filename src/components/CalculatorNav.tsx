import { calculatorsByCategory } from '@/calculators/registry';
import { useStore } from '@/state/store';

export function CalculatorNav() {
  const { state, dispatch } = useStore();
  const calculators = calculatorsByCategory(state.selectedCategory);

  if (calculators.length === 0) {
    return (
      <div className="calculator-nav">
        <span className="field-row__help" style={{ alignSelf: 'center' }}>
          No calculators in this category yet.
        </span>
      </div>
    );
  }

  return (
    <nav className="calculator-nav">
      {calculators.map((calc) => (
        <button
          key={calc.id}
          className={`tab${state.selectedCalculatorId === calc.id ? ' tab--active' : ''}`}
          onClick={() => dispatch({ type: 'SELECT_CALCULATOR', calculatorId: calc.id })}
        >
          {calc.name}
        </button>
      ))}
    </nav>
  );
}

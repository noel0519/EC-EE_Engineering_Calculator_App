import { CATEGORIES, calculatorsByCategory } from '@/calculators/registry';
import { useStore } from '@/state/store';

export function CategoryNav() {
  const { state, dispatch } = useStore();

  return (
    <nav className="category-nav">
      {CATEGORIES.map((cat) => {
        const count = calculatorsByCategory(cat.id).length;
        const active = state.selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            className={`tab${active ? ' tab--active' : ''}`}
            onClick={() => dispatch({ type: 'SELECT_CATEGORY', category: cat.id })}
            disabled={count === 0}
            title={count === 0 ? 'Coming soon' : undefined}
          >
            {cat.label}
            {count === 0 && ' (soon)'}
          </button>
        );
      })}
    </nav>
  );
}

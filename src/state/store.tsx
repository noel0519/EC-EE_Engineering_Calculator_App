import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { Category, FieldValues, HistoryEntry, UnitSelections } from '@/core/types';
import { CALCULATORS, CATEGORIES, findCalculator } from '@/calculators/registry';

const STORAGE_KEY = 'ecs.appState.v1';
const MAX_HISTORY = 200;

interface PersistedState {
  selectedCategory: Category;
  selectedCalculatorId: string;
  fieldValuesByCalculator: Record<string, FieldValues>;
  unitSelectionsByCalculator: Record<string, UnitSelections>;
  history: HistoryEntry[];
}

type Action =
  | { type: 'SELECT_CATEGORY'; category: Category }
  | { type: 'SELECT_CALCULATOR'; calculatorId: string }
  | { type: 'SET_FIELD_VALUE'; calculatorId: string; fieldId: string; value: number | string }
  | { type: 'SET_UNIT'; calculatorId: string; fieldId: string; unitSymbol: string }
  | { type: 'RESET_CALCULATOR'; calculatorId: string }
  | { type: 'ADD_HISTORY_ENTRY'; entry: HistoryEntry }
  | { type: 'REMOVE_HISTORY_ENTRY'; id: string }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'LOAD_HISTORY_ENTRY'; entry: HistoryEntry };

function defaultFieldValues(calculatorId: string): FieldValues {
  const calc = findCalculator(calculatorId);
  const values: FieldValues = {};
  if (!calc) return values;
  for (const field of calc.fields) {
    if (field.kind === 'select') values[field.id] = field.defaultValue;
    else if (field.kind === 'text') values[field.id] = field.defaultValue ?? '';
    else values[field.id] = field.defaultValue ?? 0;
  }
  return values;
}

function loadInitialState(): PersistedState {
  const fallback: PersistedState = {
    selectedCategory: CATEGORIES[0].id,
    selectedCalculatorId: CALCULATORS[0]?.id ?? '',
    fieldValuesByCalculator: {},
    unitSelectionsByCalculator: {},
    history: [],
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      selectedCategory: parsed.selectedCategory ?? fallback.selectedCategory,
      selectedCalculatorId: parsed.selectedCalculatorId ?? fallback.selectedCalculatorId,
      fieldValuesByCalculator: parsed.fieldValuesByCalculator ?? {},
      unitSelectionsByCalculator: parsed.unitSelectionsByCalculator ?? {},
      history: parsed.history ?? [],
    };
  } catch {
    return fallback;
  }
}

function reducer(state: PersistedState, action: Action): PersistedState {
  switch (action.type) {
    case 'SELECT_CATEGORY': {
      const firstCalc = CALCULATORS.find((c) => c.category === action.category);
      return { ...state, selectedCategory: action.category, selectedCalculatorId: firstCalc?.id ?? '' };
    }
    case 'SELECT_CALCULATOR': {
      const calc = findCalculator(action.calculatorId);
      return {
        ...state,
        selectedCalculatorId: action.calculatorId,
        selectedCategory: calc?.category ?? state.selectedCategory,
      };
    }
    case 'SET_FIELD_VALUE': {
      const current = state.fieldValuesByCalculator[action.calculatorId] ?? defaultFieldValues(action.calculatorId);
      return {
        ...state,
        fieldValuesByCalculator: {
          ...state.fieldValuesByCalculator,
          [action.calculatorId]: { ...current, [action.fieldId]: action.value },
        },
      };
    }
    case 'SET_UNIT': {
      const current = state.unitSelectionsByCalculator[action.calculatorId] ?? {};
      return {
        ...state,
        unitSelectionsByCalculator: {
          ...state.unitSelectionsByCalculator,
          [action.calculatorId]: { ...current, [action.fieldId]: action.unitSymbol },
        },
      };
    }
    case 'RESET_CALCULATOR': {
      return {
        ...state,
        fieldValuesByCalculator: {
          ...state.fieldValuesByCalculator,
          [action.calculatorId]: defaultFieldValues(action.calculatorId),
        },
        unitSelectionsByCalculator: {
          ...state.unitSelectionsByCalculator,
          [action.calculatorId]: {},
        },
      };
    }
    case 'ADD_HISTORY_ENTRY': {
      return { ...state, history: [action.entry, ...state.history].slice(0, MAX_HISTORY) };
    }
    case 'REMOVE_HISTORY_ENTRY': {
      return { ...state, history: state.history.filter((h) => h.id !== action.id) };
    }
    case 'CLEAR_HISTORY': {
      return { ...state, history: [] };
    }
    case 'LOAD_HISTORY_ENTRY': {
      return {
        ...state,
        selectedCategory: action.entry.category,
        selectedCalculatorId: action.entry.calculatorId,
        fieldValuesByCalculator: {
          ...state.fieldValuesByCalculator,
          [action.entry.calculatorId]: { ...action.entry.inputs },
        },
        unitSelectionsByCalculator: {
          ...state.unitSelectionsByCalculator,
          [action.entry.calculatorId]: { ...action.entry.units },
        },
      };
    }
    default:
      return state;
  }
}

interface StoreValue {
  state: PersistedState;
  dispatch: React.Dispatch<Action>;
  getFieldValues: (calculatorId: string) => FieldValues;
  getUnitSelections: (calculatorId: string) => UnitSelections;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage may be unavailable (private browsing, quota) — history simply won't persist.
    }
  }, [state]);

  const value = useMemo<StoreValue>(
    () => ({
      state,
      dispatch,
      getFieldValues: (calculatorId) => state.fieldValuesByCalculator[calculatorId] ?? defaultFieldValues(calculatorId),
      getUnitSelections: (calculatorId) => state.unitSelectionsByCalculator[calculatorId] ?? {},
    }),
    [state]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider.');
  return ctx;
}

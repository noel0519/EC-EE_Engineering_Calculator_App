import { useEffect, useState } from 'react';
import type { CalculationOutput, CalculatorDefinition, ValidationError } from '@/core/types';
import { normalizeValues } from '@/core/normalize';
import { useStore } from '@/state/store';
import { FieldInput } from './fields/FieldInput';

interface Props {
  calculator: CalculatorDefinition;
  onResult: (output: CalculationOutput | null) => void;
}

export function CalculatorWorkspace({ calculator, onResult }: Props) {
  const { state, dispatch, getFieldValues, getUnitSelections } = useStore();
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [output, setOutput] = useState<CalculationOutput | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const values = getFieldValues(calculator.id);
  const units = getUnitSelections(calculator.id);

  useEffect(() => {
    setErrors([]);
    setOutput(null);
    setCopyStatus(null);
    onResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculator.id]);

  function errorFor(fieldId: string) {
    return errors.find((e) => e.fieldId === fieldId)?.message;
  }

  function handleValueChange(fieldId: string, value: number | string) {
    dispatch({ type: 'SET_FIELD_VALUE', calculatorId: calculator.id, fieldId, value });
  }

  function handleUnitChange(fieldId: string, unitSymbol: string) {
    dispatch({ type: 'SET_UNIT', calculatorId: calculator.id, fieldId, unitSymbol });
  }

  function handleCalculate() {
    const normalized = normalizeValues(values, units, calculator.fields);
    const validationErrors = calculator.validate(normalized, calculator.fields);
    setErrors(validationErrors);
    if (validationErrors.length > 0) {
      setOutput(null);
      onResult(null);
      return;
    }

    const result = calculator.calculate(normalized);
    setOutput(result);
    onResult(result);
    setCopyStatus(null);

    dispatch({
      type: 'ADD_HISTORY_ENTRY',
      entry: {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Date.now(),
        calculatorId: calculator.id,
        calculatorName: calculator.name,
        category: calculator.category,
        inputs: { ...values },
        units: { ...units },
        output: result,
      },
    });
  }

  function handleClear() {
    dispatch({ type: 'RESET_CALCULATOR', calculatorId: calculator.id });
    setErrors([]);
    setOutput(null);
    onResult(null);
    setCopyStatus(null);
  }

  function handleLoadPrevious() {
    const previous = state.history.find((h) => h.calculatorId === calculator.id);
    if (!previous) return;
    dispatch({ type: 'LOAD_HISTORY_ENTRY', entry: previous });
  }

  function handleCopy() {
    if (!output) return;
    const text = output.results.map((r) => `${r.label}: ${r.value}`).join('\n');
    navigator.clipboard?.writeText(text).then(
      () => setCopyStatus('Copied.'),
      () => setCopyStatus('Copy failed.')
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCalculate();
    } else if (e.key === 'Escape') {
      setErrors([]);
    }
  }

  const hasPrevious = state.history.some((h) => h.calculatorId === calculator.id);

  return (
    <div className="panel" onKeyDown={handleKeyDown}>
      <div className="panel__header">
        <h2 className="panel__title">{calculator.name}</h2>
        <p className="panel__description">{calculator.description}</p>
      </div>
      <div className="panel__body">
        <p className="panel__section-label">Inputs</p>
        {calculator.fields.map((field) => (
          <FieldInput
            key={field.id}
            field={field}
            allValues={values}
            unitSymbol={field.kind === 'number' ? units[field.id] : undefined}
            error={errorFor(field.id)}
            onValueChange={handleValueChange}
            onUnitChange={handleUnitChange}
          />
        ))}

        <div className="btn-row">
          <button className="btn btn--primary" onClick={handleCalculate}>
            Calculate
          </button>
          <button className="btn" onClick={handleClear}>
            Clear
          </button>
          <button className="btn" onClick={handleLoadPrevious} disabled={!hasPrevious}>
            Load Previous
          </button>
        </div>

        <div className="panel--sub">
          <p className="panel__section-label">Result</p>
          {output ? (
            <>
              {output.results.map((r, i) => (
                <div key={i} className={`result-line${r.primary ? ' result-line--primary' : ''}`}>
                  <span className="result-line__label">{r.label}</span>
                  <span className="result-line__value">{r.value}</span>
                </div>
              ))}
              <div className="btn-row">
                <button className="btn" onClick={handleCopy}>
                  Copy
                </button>
                {copyStatus && <span className="field-row__help">{copyStatus}</span>}
              </div>
            </>
          ) : (
            <p className="empty-result">
              {errors.length > 0 ? 'Fix the highlighted inputs and calculate again.' : 'No result yet. Enter inputs and press Calculate.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

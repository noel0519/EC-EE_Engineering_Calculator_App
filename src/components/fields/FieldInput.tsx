import type { FieldDef, FieldValues } from '@/core/types';

interface Props {
  field: FieldDef;
  allValues: FieldValues;
  unitSymbol?: string;
  error?: string;
  onValueChange: (fieldId: string, value: number | string) => void;
  onUnitChange: (fieldId: string, unitSymbol: string) => void;
}

/**
 * Renders a single calculator input field. This is the ONE input renderer
 * every calculator uses (number+unit, select, or free text) — calculators
 * must never bring their own bespoke input widget (master prompt section 5,
 * "General calculator should reuse one input system").
 */
export function FieldInput({ field, allValues, unitSymbol, error, onValueChange, onUnitChange }: Props) {
  if (field.hiddenWhen && field.hiddenWhen(allValues)) return null;

  if (field.kind === 'select') {
    return (
      <div className={`field-row${error ? ' field-row--invalid' : ''}`}>
        <label className="field-row__label" htmlFor={field.id}>
          {field.label}
        </label>
        <select
          id={field.id}
          className="field-select"
          value={(allValues[field.id] as string) ?? field.defaultValue}
          onChange={(e) => onValueChange(field.id, e.target.value)}
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span />
        {field.helpText && <div className="field-row__help">{field.helpText}</div>}
        {error && <div className="field-row__error">{error}</div>}
      </div>
    );
  }

  if (field.kind === 'text') {
    return (
      <div className={`field-row field-row--text${error ? ' field-row--invalid' : ''}`}>
        <label className="field-row__label" htmlFor={field.id}>
          {field.label}
        </label>
        <input
          id={field.id}
          className="field-text"
          type="text"
          placeholder={field.placeholder}
          value={(allValues[field.id] as string) ?? ''}
          onChange={(e) => onValueChange(field.id, e.target.value)}
        />
        {field.helpText && <div className="field-row__help">{field.helpText}</div>}
        {error && <div className="field-row__error">{error}</div>}
      </div>
    );
  }

  const rawValue = allValues[field.id];
  const currentUnit = unitSymbol ?? field.units[0].symbol;

  return (
    <div className={`field-row${error ? ' field-row--invalid' : ''}`}>
      <label className="field-row__label" htmlFor={field.id}>
        {field.label}
      </label>
      <input
        id={field.id}
        className="field-input"
        type="number"
        step="any"
        value={rawValue === undefined || Number.isNaN(rawValue) ? '' : (rawValue as number)}
        onChange={(e) => onValueChange(field.id, e.target.value === '' ? NaN : Number(e.target.value))}
      />
      {field.units.length > 1 ? (
        <select
          className="field-unit"
          value={currentUnit}
          onChange={(e) => onUnitChange(field.id, e.target.value)}
        >
          {field.units.map((u) => (
            <option key={u.symbol} value={u.symbol}>
              {u.symbol || '—'}
            </option>
          ))}
        </select>
      ) : (
        <span className="field-unit" style={{ textAlign: 'center' }}>
          {field.units[0].symbol || '—'}
        </span>
      )}
      {field.helpText && <div className="field-row__help">{field.helpText}</div>}
      {error && <div className="field-row__error">{error}</div>}
    </div>
  );
}

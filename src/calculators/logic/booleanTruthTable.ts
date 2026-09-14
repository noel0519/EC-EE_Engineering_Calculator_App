import type { CalculatorDefinition } from '@/core/types';
import { BooleanParseError, buildTruthTable, extractVariables, minimize, parseBooleanExpression } from '@/core/boolean';

const MAX_VARIABLES = 4;

export const booleanTruthTable: CalculatorDefinition = {
  id: 'logic.boolean-truth-table',
  category: 'logic',
  name: 'Boolean Expression → Truth Table',
  description: 'Parse a Boolean expression, generate its truth table, and simplify to SOP/POS.',
  fields: [
    {
      kind: 'text',
      id: 'expression',
      label: 'Expression',
      placeholder: "e.g. A'B + AC'",
      defaultValue: "A'B + AC'",
      helpText: "Operators: ' or ! for NOT, . or juxtaposition for AND, + for OR, ( ) for grouping. Variables: A-D.",
    },
  ],
  validate(values) {
    const expr = values.expression as string;
    if (!expr || expr.trim() === '') {
      return [{ fieldId: 'expression', message: 'Expression must not be empty.' }];
    }
    const variables = extractVariables(expr);
    if (variables.length > MAX_VARIABLES) {
      return [{ fieldId: 'expression', message: `Expression uses ${variables.length} variables; up to ${MAX_VARIABLES} are supported.` }];
    }
    try {
      parseBooleanExpression(expr);
      return [];
    } catch (e) {
      const message = e instanceof BooleanParseError ? e.message : 'Invalid Boolean expression.';
      return [{ fieldId: 'expression', message }];
    }
  },
  calculate(values) {
    const expr = values.expression as string;
    const variables = extractVariables(expr);
    const ast = parseBooleanExpression(expr);
    const table = buildTruthTable(ast, variables);

    const onesMinterms = table.rows.filter((r) => r.output).map((r) => r.minterm);
    const { sop, pos } = minimize(variables, onesMinterms);

    return {
      results: [
        { label: 'Simplified SOP', value: sop || '0', primary: true },
        { label: 'Simplified POS', value: pos || '0' },
        { label: 'Minterms (output = 1)', value: onesMinterms.length ? onesMinterms.join(', ') : 'none' },
      ],
      formula: `f(${variables.join(', ')}) = ${expr}`,
      table: {
        headers: [...variables, 'f'],
        rows: table.rows.map((r) => [...r.inputs.map((b) => (b ? '1' : '0')), r.output ? '1' : '0']),
      },
    };
  },
};

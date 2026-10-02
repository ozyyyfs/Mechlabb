import { calculators, evaluate } from '../calculators/registry.js';
import { calculationSteps } from '../calculators/steps.js';
import { convert, unitCategories } from '../utils/units.js';

// Progressive enhancement: ordinary browsers require no WebMCP support.
// These tools are pure reads using exactly the same numerical engines as the UI.
export function registerEngineeringTools(context) {
  if (!context?.registerTool) return () => {};
  const lifecycle = new AbortController();
  const register = (tool) => {
    try {
      Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {});
    } catch {
      /* Optional browser capability; never block the application. */
    }
  };
  register({
    name: 'read_engineering_calculation',
    title: 'Evaluate engineering inputs',
    description:
      'Evaluate one MECHLAB calculator using its labeled units and validation. Returns the equation, numerical result and worked steps; does not change saved or visible app state.',
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    inputSchema: {
      type: 'object',
      properties: {
        calculatorId: { type: 'string', enum: calculators.map((c) => c.id) },
        values: { type: 'object', additionalProperties: { type: ['number', 'string'] } },
      },
      required: ['calculatorId', 'values'],
      additionalProperties: false,
    },
    execute(input) {
      if (
        !input ||
        typeof input !== 'object' ||
        !input.values ||
        typeof input.values !== 'object' ||
        Array.isArray(input.values)
      )
        throw new Error('Provide a calculator ID and a values object.');
      const calc = calculators.find((c) => c.id === input.calculatorId);
      if (!calc) throw new Error('Unknown calculator.');
      if (Object.keys(input.values).some((key) => !calc.fields.some((f) => f.key === key)))
        throw new Error('Unknown input field.');
      const answer = evaluate(calc, input.values);
      return {
        calculator: calc.name,
        formula: calc.formula,
        result: answer.result,
        unit: calc.unit,
        steps: calculationSteps(calc, answer),
        assumptions: calc.note,
      };
    },
  });
  register({
    name: 'read_unit_conversion',
    title: 'Convert engineering units',
    description:
      'Convert a value between MECHLAB engineering units. Returns a value without changing app state.',
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', enum: Object.keys(unitCategories) },
        value: { type: 'number' },
        from: { type: 'string' },
        to: { type: 'string' },
      },
      required: ['category', 'value', 'from', 'to'],
      additionalProperties: false,
    },
    execute(input) {
      if (!input || typeof input.value !== 'number')
        throw new Error('Provide a numeric value and units.');
      return {
        value: convert(input.category, input.value, input.from, input.to),
        unit: input.to,
        category: input.category,
      };
    },
  });
  return () => lifecycle.abort();
}

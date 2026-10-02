import { calculators } from '../calculators/registry.js';
export const formulas = calculators
  .map((c) => ({
    id: `formula-${c.id}`,
    name: c.name,
    category:
      c.category === 'Basics'
        ? 'Mechanics'
        : c.category === 'Strength / Machine Design'
          ? ['stress', 'strain', 'youngs-modulus'].includes(c.id)
            ? 'Strength of Materials'
            : 'Machine Design'
          : c.category,
    formula: c.formula,
    variables: c.fields.map((f) => `${f.key}: ${f.label} (${f.unit})`),
    description: c.note,
    example: `${c.fields.map((f) => `${f.key} = ${f.value} ${f.unit}`).join(', ')} → ${Number(c.compute(Object.fromEntries(c.fields.map((f) => [f.key, f.value])))).toPrecision(5)} ${c.unit}`,
    calculator: c.id,
  }))
  .concat([
    {
      id: 'fourier',
      name: 'Fourier Conduction',
      category: 'Heat Transfer',
      formula: 'Q̇ = k A (T₁ − T₂) / L',
      variables: [
        'k: thermal conductivity (W/(m·K))',
        'A: heat-transfer area (m²)',
        'T₁, T₂: surface temperatures (K)',
        'L: wall thickness (m)',
      ],
      description:
        'Steady one-dimensional conduction through a plane wall with constant k and no internal heat generation.',
      example: 'k = 15, A = 1, ΔT = 20, L = 0.01 → Q̇ = 30,000 W',
    },
    {
      id: 'convection',
      name: 'Newton’s Law of Cooling',
      category: 'Heat Transfer',
      formula: 'Q̇ = h A (Ts − T∞)',
      variables: [
        'h: convection coefficient (W/(m²·K))',
        'A: surface area (m²)',
        'Ts: surface temperature (K)',
        'T∞: bulk fluid temperature (K)',
      ],
      description:
        'Convective heat transfer using an appropriate experimentally or analytically determined coefficient.',
      example: 'h = 10, A = 2, ΔT = 30 → Q̇ = 600 W',
    },
    {
      id: 'radiation',
      name: 'Net Thermal Radiation',
      category: 'Heat Transfer',
      formula: 'Q̇ = ε σ A (Ts⁴ − Tsur⁴)',
      variables: [
        'ε: emissivity (dimensionless)',
        'σ: Stefan–Boltzmann constant, 5.670374419 × 10⁻⁸ W/(m²·K⁴)',
        'A: area (m²)',
        'Ts, Tsur: absolute temperatures (K)',
      ],
      description:
        'A small gray surface exchanging with large isothermal surroundings, view factor approximately one.',
      example: 'ε = 0.8, A = 1, Ts = 400 K, Tsur = 300 K → Q̇ ≈ 793.85 W',
    },
  ]);

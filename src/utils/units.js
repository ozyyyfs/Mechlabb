const units = (base, list) => ({ base, units: Object.fromEntries(list) });
export const unitCategories = {
  Length: units('m', [
    ['m', 1],
    ['mm', 0.001],
    ['cm', 0.01],
    ['km', 1000],
    ['in', 0.0254],
    ['ft', 0.3048],
    ['yd', 0.9144],
    ['mile', 1609.344],
  ]),
  Mass: units('kg', [
    ['kg', 1],
    ['g', 0.001],
    ['tonne', 1000],
    ['lb', 0.45359237],
    ['oz', 0.028349523125],
  ]),
  Force: units('N', [
    ['N', 1],
    ['kN', 1000],
    ['lbf', 4.4482216152605],
    ['kgf', 9.80665],
  ]),
  Pressure: units('Pa', [
    ['Pa', 1],
    ['kPa', 1000],
    ['MPa', 1e6],
    ['bar', 1e5],
    ['psi', 6894.757293168],
    ['atm', 101325],
  ]),
  Torque: units('N·m', [
    ['N·m', 1],
    ['N·mm', 0.001],
    ['lb-ft', 1.3558179483314],
    ['lb-in', 0.1129848290276],
  ]),
  Power: units('W', [
    ['W', 1],
    ['kW', 1000],
    ['MW', 1e6],
    ['hp (mechanical)', 745.6998715823],
    ['PS (metric)', 735.49875],
  ]),
  Energy: units('J', [
    ['J', 1],
    ['kJ', 1000],
    ['MJ', 1e6],
    ['Wh', 3600],
    ['kWh', 3600000],
    ['BTU (IT)', 1055.05585262],
    ['ft·lbf', 1.3558179483314],
  ]),
  Temperature: { base: 'K', units: { '°C': 1, '°F': 1, K: 1, '°R': 1 } },
  Velocity: units('m/s', [
    ['m/s', 1],
    ['km/h', 1 / 3.6],
    ['ft/s', 0.3048],
    ['mph', 0.44704],
    ['knot', 0.514444444444],
  ]),
  Acceleration: units('m/s²', [
    ['m/s²', 1],
    ['ft/s²', 0.3048],
    ['g₀', 9.80665],
  ]),
  Density: units('kg/m³', [
    ['kg/m³', 1],
    ['g/cm³', 1000],
    ['lb/ft³', 16.01846337396],
    ['lb/in³', 27679.90471019],
  ]),
  'Flow Rate': units('m³/s', [
    ['m³/s', 1],
    ['m³/h', 1 / 3600],
    ['L/s', 0.001],
    ['L/min', 1 / 60000],
    ['US gpm', 0.003785411784 / 60],
    ['Imperial gpm', 0.00454609 / 60],
  ]),
  Area: units('m²', [
    ['m²', 1],
    ['mm²', 1e-6],
    ['cm²', 1e-4],
    ['ft²', 0.09290304],
    ['in²', 0.00064516],
  ]),
  Volume: units('m³', [
    ['m³', 1],
    ['L', 0.001],
    ['mL', 1e-6],
    ['ft³', 0.028316846592],
    ['in³', 0.000016387064],
    ['US gal', 0.003785411784],
    ['Imperial gal', 0.00454609],
  ]),
  Time: units('s', [
    ['s', 1],
    ['ms', 0.001],
    ['min', 60],
    ['h', 3600],
    ['day', 86400],
  ]),
  Angle: units('rad', [
    ['rad', 1],
    ['°', Math.PI / 180],
    ['rev', 2 * Math.PI],
  ]),
};
export function convert(category, value, from, to) {
  if (String(value).trim() === '') throw new Error('Enter a value to convert.');
  const n = Number(value),
    entry = unitCategories[category];
  if (!Number.isFinite(n) || Math.abs(n) > 1e15)
    throw new Error('Enter a finite value with magnitude ≤ 10¹⁵.');
  if (!entry || !(from in entry.units) || !(to in entry.units))
    throw new Error('Choose valid units.');
  if (category === 'Temperature') {
    let k =
      from === '°C'
        ? n + 273.15
        : from === '°F'
          ? ((n - 32) * 5) / 9 + 273.15
          : from === '°R'
            ? (n * 5) / 9
            : n;
    if (k < 0) throw new Error('Temperature cannot be below absolute zero.');
    return to === '°C'
      ? k - 273.15
      : to === '°F'
        ? ((k - 273.15) * 9) / 5 + 32
        : to === '°R'
          ? (k * 9) / 5
          : k;
  }
  return (n * entry.units[from]) / entry.units[to];
}

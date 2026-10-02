export function darcyFactor(re, roughness) {
  if (re <= 0) throw new Error('Reynolds number must be positive.');
  if (re < 2300) return 64 / re;
  let f = 0.02;
  for (let i = 0; i < 30; i++)
    f = 1 / (-2 * Math.log10(roughness / 3.7 + 2.51 / (re * Math.sqrt(f)))) ** 2;
  return f;
}
export function humidityRatio(t, rh, pressure = 101.325) {
  const ps = 0.61094 * Math.exp((17.625 * t) / (t + 243.04)),
    pv = rh * ps;
  return (0.62198 * pv) / (pressure - pv);
}
export function chartModel(kind, parameter) {
  if (kind === 'stress') {
    const E = parameter * 1000,
      ys = 250,
      ep = ys / E;
    return {
      xLabel: 'Engineering strain (m/m)',
      yLabel: 'Stress (MPa)',
      note: 'Illustrative ductile metal: editable elastic modulus, 250 MPa yield, idealized plateau and strain hardening. Not material-specific test data; unloading, necking and fracture are omitted.',
      series: [{ key: 'stress', name: 'Engineering stress' }],
      data: Array.from({ length: 121 }, (_, i) => {
        const x = i * 0.0005;
        return {
          x,
          stress: x <= ep ? E * x : x < 0.012 ? ys : ys + 180 * (1 - Math.exp(-(x - 0.012) * 35)),
        };
      }),
    };
  }
  if (kind === 'sn')
    return {
      xLabel: 'Cycles N (log scale)',
      yLabel: 'Alternating stress (MPa)',
      xLog: true,
      note: 'Illustrative fully reversed steel-like Basquin curve, S = max(200, 800 N⁻⁰·¹), showing an assumed endurance limit. Not a fatigue allowable; mean stress, finish, size, environment and scatter are excluded.',
      series: [{ key: 'stress', name: 'Illustrative fatigue strength' }],
      data: Array.from({ length: 81 }, (_, i) => {
        const x = 10 ** (3 + (i * 5) / 80);
        return { x, stress: Math.max(200, 800 * x ** -0.1) };
      }),
    };
  if (kind === 'moody')
    return {
      xLabel: 'Reynolds number (log scale)',
      yLabel: 'Darcy friction factor',
      xLog: true,
      note: 'Laminar f = 64/Re below 2300; Colebrook–White solved iteratively above 4000. The transitional interval is intentionally left blank. Relative roughness ε/D is dimensionless.',
      series: [{ key: 'f', name: `ε/D = ${parameter}` }],
      data: Array.from({ length: 121 }, (_, i) => {
        const x = 10 ** (2.6 + (i * 5.4) / 120);
        return { x, f: x >= 2300 && x <= 4000 ? null : darcyFactor(x, parameter) };
      }),
    };
  if (kind === 'phase')
    return {
      xLabel: 'Carbon content (wt. %)',
      yLabel: 'Temperature (°C)',
      note: 'Schematic Fe–Fe₃C landmark diagram: eutectoid ≈ 0.76 wt.% C at 727 °C and eutectic ≈ 4.3 wt.% C at 1147 °C. Only selected idealized boundaries are shown; this is not a complete equilibrium diagram for heat-treatment decisions.',
      series: [
        { key: 'liquidus', name: 'Approximate liquidus' },
        { key: 'a3', name: 'Approximate A₃ / Acm' },
        { key: 'eutectoid', name: 'Eutectoid temperature' },
        { key: 'eutectic', name: 'Eutectic temperature' },
      ],
      data: [
        { x: 0, liquidus: 1538, a3: 912, eutectoid: 727 },
        { x: 0.76, liquidus: 1490, a3: 727, eutectoid: 727 },
        { x: 2.11, liquidus: 1370, a3: 1147, eutectoid: 727, eutectic: 1147 },
        { x: 4.3, liquidus: 1147, eutectoid: 727, eutectic: 1147 },
        { x: 6.67, liquidus: 1250, eutectoid: 727, eutectic: 1147 },
      ],
    };
  if (kind === 'psychro')
    return {
      xLabel: 'Dry-bulb temperature (°C)',
      yLabel: 'Humidity ratio (g/kg dry air)',
      note: `Calculated relative-humidity curves at ${parameter} kPa total pressure using a Magnus saturation-pressure approximation for 0–50 °C. Humidity ratio is on a dry-air mass basis. Wet-bulb, specific-volume and enthalpy grids are omitted.`,
      series: [20, 40, 60, 80, 100].map((r) => ({ key: `rh${r}`, name: `${r}% RH` })),
      data: Array.from({ length: 51 }, (_, x) => ({
        x,
        ...Object.fromEntries(
          [20, 40, 60, 80, 100].map((r) => [`rh${r}`, humidityRatio(x, r / 100, parameter) * 1000]),
        ),
      })),
    };
  // Superheated vapor teaching model, not IAPWS steam-table data.
  const pressures = [0.1, 0.5, 1, 2],
    cp = 2.08,
    R = 0.4615;
  const series = pressures.map((p) => ({ key: `p${p}`, name: `${p} MPa` }));
  return {
    xLabel: 'Specific entropy (kJ/(kg·K))',
    yLabel: 'Specific enthalpy (kJ/kg)',
    note: 'Mollier-style h–s teaching diagram for dilute superheated water vapor. Uses ideal-gas vapor cp = 2.08 kJ/(kg·K), R = 0.4615, referenced to h = 2676 kJ/kg and s = 7.355 kJ/(kg·K) at 373.15 K, 0.1 MPa. Curves run from 250–600 °C. No saturation dome; use IAPWS steam tables for real-cycle calculations.',
    series,
    data: Array.from({ length: 71 }, (_, i) => {
      const x = 6 + i * 0.04;
      const values = Object.fromEntries(
        pressures.map((p) => {
          const T = 373.15 * Math.exp((x - 7.355 + R * Math.log(p / 0.1)) / cp);
          return [`p${p}`, T >= 523.15 && T <= 873.15 ? 2676 + cp * (T - 373.15) : null];
        }),
      );
      return { x, ...values };
    }),
  };
}

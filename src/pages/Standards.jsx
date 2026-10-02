import { useEffect, useState } from 'react';
import { Card, PageHeading, SearchBar, EmptyState } from '../components/UI.jsx';
// Metric coarse-pitch threads. Tensile stress areas follow ISO 898-1 / common machine-design tables.
const bolts = [
  ['M3', 3, 0.5, 5.03], ['M4', 4, 0.7, 8.78], ['M5', 5, 0.8, 14.2], ['M6', 6, 1, 20.1],
  ['M8', 8, 1.25, 36.6], ['M10', 10, 1.5, 58], ['M12', 12, 1.75, 84.3], ['M14', 14, 2, 115],
  ['M16', 16, 2, 157], ['M20', 20, 2.5, 245], ['M24', 24, 3, 353], ['M30', 30, 3.5, 561],
];
const classes = [['4.6', 400, 240], ['8.8', 800, 640], ['10.9', 1000, 900], ['12.9', 1200, 1080]];
const constants = [
  ['Standard gravity g', '9.80665 m/s²'], ['Universal gas constant R', '8.314462618 J/(mol·K)'],
  ['Stefan–Boltzmann σ', '5.670374419×10⁻⁸ W/(m²·K⁴)'], ['Standard atmosphere', '101 325 Pa'],
  ['Water density (4 °C)', '1000 kg/m³'], ['Air density (15 °C, 1 atm)', '1.225 kg/m³'],
  ['Steel E / G / ρ (typ.)', '200 GPa / 79 GPa / 7850 kg/m³'], ['Aluminium E / ρ (typ.)', '69 GPa / 2700 kg/m³'],
];
export default function Standards({ lab }) {
  const [q, setQ] = useState(''), [cls, setCls] = useState('8.8');
  useEffect(() => lab.record({ key: 'standards', route: 'standards', name: 'Standards & Tables', type: 'Reference' }), []);
  const k = classes.find((c) => c[0] === cls),
    rows = bolts.filter((b) => b[0].toLowerCase().includes(q.toLowerCase().trim()));
  return (
    <>
      <PageHeading
        eyebrow="QUICK REFERENCE"
        title="Standards & Tables"
        description="Metric bolt sizes with proof load by property class, plus the constants engineers reach for most."
      />
      <SearchBar value={q} onChange={setQ} placeholder="Find a bolt size, e.g. M10" />
      <div className="filter-row" aria-label="Property class">
        {classes.map(([c]) => (
          <button key={c} className={`chip ${cls === c ? 'selected' : ''}`} aria-pressed={cls === c} onClick={() => setCls(c)}>
            Class {c}
          </button>
        ))}
      </div>
      <Card className="padded">
        <h2>Metric coarse bolts · class {cls}</h2>
        <p className="muted">
          Ultimate strength ≈ {k[1]} MPa, yield ≈ {k[2]} MPa (nominal). Load shown = 0.9 × yield × tensile area (a conservative guide, not a design value).
        </p>
        <div className="table-scroll" tabIndex={0} role="region" aria-label="Bolt table">
          <table>
            <thead>
              <tr><th>Size</th><th>Diameter (mm)</th><th>Pitch (mm)</th><th>Tensile area (mm²)</th><th>Guide load (kN)</th></tr>
            </thead>
            <tbody>
              {rows.map(([n, d, p, a]) => (
                <tr key={n}>
                  <th>{n}</th><td>{d}</td><td>{p}</td><td>{a}</td><td>{((0.9 * k[2] * a) / 1000).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && <EmptyState />}
      </Card>
      <Card className="padded section-space">
        <h2>Handy constants</h2>
        <dl className="const-list">
          {constants.map(([n, v]) => (
            <div key={n}><dt>{n}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </Card>
    </>
  );
}

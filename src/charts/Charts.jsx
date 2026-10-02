import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
} from 'recharts';
import { RotateCcw } from 'lucide-react';
import { chartModel } from './models.js';
import { PageHeading, Card, Button } from '../components/UI.jsx';
const types = [
  ['stress', 'Stress–Strain Curve'],
  ['sn', 'S–N Curve'],
  ['moody', 'Moody Chart'],
  ['phase', 'Phase Diagram'],
  ['psychro', 'Psychrometric Chart'],
  ['mollier', 'Mollier Diagram'],
];
const colors = ['#2585f0', '#08a4ba', '#ad7df2', '#e8a63a', '#ef6e78'];
export default function Charts() {
  const [kind, setKind] = useState('stress'),
    [parameter, setParameter] = useState(200),
    [version, setVersion] = useState(0),
    [hidden, setHidden] = useState([]);
  const model = useMemo(() => chartModel(kind, parameter), [kind, parameter]);
  const change = (k) => {
    setKind(k);
    setParameter(k === 'moody' ? 0.001 : k === 'psychro' ? 101.325 : 200);
    setHidden([]);
    setVersion((v) => v + 1);
  };
  return (
    <>
      <PageHeading
        eyebrow="ENGINEERING VISUALIZATIONS"
        title="Engineering charts"
        description="Explore trends, inspect values and connect equations to behavior."
      />
      <Card className="padded">
        <div className="chart-controls">
          <label>
            Chart
            <select aria-label="Chart" value={kind} onChange={(e) => change(e.target.value)}>
              {types.map(([id, name]) => (
                <option value={id} key={id}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          {['stress', 'moody', 'psychro'].includes(kind) && (
            <label>
              {kind === 'stress'
                ? `Elastic modulus: ${parameter} GPa`
                : kind === 'moody'
                  ? `Relative roughness: ${parameter}`
                  : `Atmospheric pressure: ${parameter} kPa`}
              <input
                type="range"
                min={kind === 'stress' ? 50 : kind === 'moody' ? 0 : 70}
                max={kind === 'stress' ? 220 : kind === 'moody' ? 0.05 : 110}
                step={kind === 'moody' ? 0.0005 : kind === 'psychro' ? 0.025 : 1}
                value={parameter}
                onChange={(e) => setParameter(Number(e.target.value))}
              />
            </label>
          )}
          <Button
            variant="secondary"
            onClick={() => {
              change(kind);
            }}
          >
            <RotateCcw size={16} />
            Reset chart
          </Button>
        </div>
        <div className="chart-canvas">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              key={version}
              data={model.data}
              margin={{ top: 15, right: 20, left: 20, bottom: 32 }}
              accessibilityLayer
            >
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" />
              <XAxis
                dataKey="x"
                type="number"
                scale={model.xLog ? 'log' : 'linear'}
                domain={['dataMin', 'dataMax']}
                tick={{ fill: 'var(--muted)', fontSize: 12 }}
                tickFormatter={(v) =>
                  model.xLog ? Number(v).toExponential(0) : Number(v.toFixed(3))
                }
              />
              <YAxis
                width={55}
                domain={['auto', 'auto']}
                tick={{ fill: 'var(--muted)', fontSize: 12 }}
                tickFormatter={(v) => Number(v.toPrecision(3))}
                label={{
                  value: model.yLabel,
                  angle: -90,
                  position: 'insideLeft',
                  offset: -10,
                  fill: 'var(--muted)',
                  fontSize: 12,
                }}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--text)',
                }}
                formatter={(v, name) => [Number(v).toPrecision(5), name]}
                labelFormatter={(v) => `x = ${Number(v).toPrecision(5)}`}
              />
              <Legend
                verticalAlign="top"
                content={() => (
                  <div className="chart-legend" aria-label="Chart series">
                    {model.series.map((series, i) => (
                      <button
                        key={series.key}
                        aria-pressed={!hidden.includes(series.key)}
                        onClick={() =>
                          setHidden((h) =>
                            h.includes(series.key)
                              ? h.filter((key) => key !== series.key)
                              : [...h, series.key],
                          )
                        }
                      >
                        <span style={{ background: colors[i % colors.length] }} />
                        {series.name}
                      </button>
                    ))}
                  </div>
                )}
              />
              {model.series.map((s, i) => (
                <Line
                  key={s.key}
                  type={kind === 'phase' ? 'linear' : 'monotone'}
                  dataKey={s.key}
                  name={s.name}
                  stroke={colors[i % colors.length]}
                  strokeWidth={2.5}
                  dot={false}
                  hide={hidden.includes(s.key)}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              ))}
              <Brush
                dataKey="x"
                height={22}
                stroke="var(--accent)"
                fill="var(--surface)"
                tickFormatter={(v) =>
                  model.xLog ? Number(v).toExponential(0) : Number(v.toFixed(2))
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p style={{ textAlign: 'center', fontSize: '.8rem', marginBottom: 16 }}>{model.xLabel}</p>
        <p className="chart-description">{model.note}</p>
        <p className="chart-description">
          Drag the handles below the chart to zoom. Hover or touch the curve to inspect values.
          Select a legend item to hide or show it.
        </p>
        <details className="reference-note">
          <summary>Model assumptions & references</summary>
          <p>
            These charts mix calculated correlations and explicitly illustrative models. They are
            educational references, not certified engineering data.
          </p>
          <a href="https://www.iapws.org/" target="_blank" rel="noreferrer">
            IAPWS — authoritative water and steam property formulations
          </a>
          <a
            href="https://www.nist.gov/srd/nist-standard-reference-database-23"
            target="_blank"
            rel="noreferrer"
          >
            NIST REFPROP — reference fluid properties
          </a>
        </details>
      </Card>
    </>
  );
}

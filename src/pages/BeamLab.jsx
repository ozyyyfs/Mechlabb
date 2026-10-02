import { useEffect, useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button, Card, PageHeading } from '../components/UI.jsx';
const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
function analyse(L, F, a) {
  const b = L - a,
    R1 = (F * b) / L,
    R2 = (F * a) / L,
    Mmax = (F * a * b) / L,
    N = 60,
    pts = Array.from({ length: N + 1 }, (_, i) => {
      const x = (L * i) / N,
        V = x < a ? R1 : -R2,
        M = x <= a ? R1 * x : R2 * (L - x);
      return { x, V, M };
    });
  return { R1, R2, Mmax, pts };
}
function Diagram({ title, unit, pts, k, color }) {
  const W = 600,
    H = 150,
    P = 30,
    max = Math.max(...pts.map((p) => Math.abs(p[k])), 1e-9),
    X = (x) => P + (x / pts.at(-1).x) * (W - 2 * P),
    Y = (v) => H / 2 - (v / max) * (H / 2 - 22);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${X(p.x).toFixed(1)} ${Y(p[k]).toFixed(1)}`).join('');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="beam-svg" role="img" aria-label={`${title} diagram`}>
      <line x1={P} x2={W - P} y1={H / 2} y2={H / 2} stroke="var(--border)" strokeWidth="2" />
      <path d={`${d}L${X(pts.at(-1).x)} ${H / 2}L${X(0)} ${H / 2}Z`} fill={color} opacity=".18" />
      <path d={d} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" />
      <text x={P} y="16" fill="var(--muted)" fontSize="13">
        {title} ({unit}) · peak {max.toPrecision(4)}
      </text>
    </svg>
  );
}
export default function BeamLab({ lab }) {
  const [L, setL] = useState(4),
    [F, setF] = useState(10),
    [pos, setPos] = useState(50);
  useEffect(() => lab.record({ key: 'beamlab', route: 'beamlab', name: 'Beam Lab', type: 'Interactive' }), []);
  const len = Math.max(num(L, 4), 0.1),
    load = Math.max(num(F, 0), 0),
    a = (len * pos) / 100;
  const r = useMemo(() => analyse(len, load, a), [len, load, a]);
  const sx = (x) => 40 + (x / len) * 520;
  return (
    <>
      <PageHeading
        eyebrow="STRUCTURAL ANALYSIS"
        title="Beam Lab"
        description="Simply supported beam with a movable point load. Drag the sliders to see reactions, shear force and bending moment update live."
      >
        <Button
          variant="secondary"
          onClick={() => {
            setL(4);
            setF(10);
            setPos(50);
          }}
        >
          <RotateCcw size={16} /> Reset
        </Button>
      </PageHeading>
      <div className="detail-grid">
        <Card className="padded">
          <h2>Beam &amp; load</h2>
          <div className="input-grid">
            <label>
              Span L
              <div className="input-unit">
                <input type="number" min="0.1" step="any" value={L} onChange={(e) => setL(e.target.value)} />
                <span>m</span>
              </div>
            </label>
            <label>
              Point load F
              <div className="input-unit">
                <input type="number" min="0" step="any" value={F} onChange={(e) => setF(e.target.value)} />
                <span>kN</span>
              </div>
            </label>
          </div>
          <label>
            Load position: {a.toFixed(2)} m from left support
            <input type="range" min="0" max="100" value={pos} onChange={(e) => setPos(+e.target.value)} />
          </label>
          <svg viewBox="0 0 600 130" className="beam-svg" role="img" aria-label="Beam schematic">
            <rect x="40" y="56" width="520" height="14" rx="3" fill="var(--accent)" opacity=".85" />
            <path d="M40 72L24 100H56ZM544 100H576" fill="var(--pale)" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="560" cy="80" r="8" fill="var(--pale)" stroke="var(--accent)" strokeWidth="2" />
            <path d={`M${sx(a)} 8V50M${sx(a) - 8} 40l8 11 8-11`} stroke="#d9534f" strokeWidth="3" fill="none" strokeLinecap="round" />
            <text x={sx(a)} y="122" textAnchor="middle" fill="var(--muted)" fontSize="13">
              F = {load} kN
            </text>
          </svg>
        </Card>
        <Card className="padded">
          <span className="eyebrow">RESULTS</span>
          <div className="stats-grid">
            <div className="property"><span className="meta">Reaction R₁</span><strong>{r.R1.toFixed(3)}</strong><span>kN (left)</span></div>
            <div className="property"><span className="meta">Reaction R₂</span><strong>{r.R2.toFixed(3)}</strong><span>kN (right)</span></div>
            <div className="property"><span className="meta">Max moment</span><strong>{r.Mmax.toFixed(3)}</strong><span>kN·m under load</span></div>
            <div className="property"><span className="meta">Max shear</span><strong>{Math.max(r.R1, r.R2).toFixed(3)}</strong><span>kN</span></div>
          </div>
          <p className="muted">Check: R₁ + R₂ = {(r.R1 + r.R2).toFixed(3)} kN = applied load. Self-weight is ignored.</p>
        </Card>
      </div>
      <Card className="padded">
        <h2>Shear force diagram</h2>
        <Diagram title="Shear V" unit="kN" pts={r.pts} k="V" color="#126ee3" />
        <h2>Bending moment diagram</h2>
        <Diagram title="Moment M" unit="kN·m" pts={r.pts} k="M" color="#08a4ba" />
      </Card>
    </>
  );
}

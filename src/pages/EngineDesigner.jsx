import { useState, useRef, useEffect } from 'react';
import {
  sections,
  defaults,
  presets,
  metrics,
  validateDesign,
  decodeDesign,
} from '../data/engineDesigner.js';
import DesignPreview from '../three/DesignPreview.jsx';
const storageKey = 'mechlab-engine-design-v1';
function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function EngineDesigner() {
  const [d, setD] = useState({ ...defaults }),
    [parts, setParts] = useState([]),
    [tab, setTab] = useState('Design'),
    [section, setSection] = useState(0),
    [page, setPage] = useState(0),
    [status, setStatus] = useState(''),
    [exploded, setExploded] = useState(false),
    [cutaway, setCutaway] = useState(true),
    [playing, setPlaying] = useState(false),
    [layer, setLayer] = useState('All'),
    [preset, setPreset] = useState('2.0L inline four'),
    [baseline, setBaseline] = useState(null),
    [resultPage, setResultPage] = useState(0),
    [partPage, setPartPage] = useState(0);
  const file = useRef(),
    issues = validateDesign(d),
    valid = !issues.length,
    results = valid ? metrics(d) : null;
  const payload = () => ({ version: 1, design: d, parts });
  useEffect(() => {
    document.body.classList.add('designer-open');
    return () => document.body.classList.remove('designer-open');
  }, []);
  const update = (key, value) => {
    setD((v) => ({ ...v, [key]: value }));
    setStatus('Unsaved changes');
  };
  const load = (data) => {
    const v = decodeDesign(data);
    setD(v.design);
    setParts(v.parts);
    setPartPage(0);
    setStatus('Design loaded');
    setPage(0);
  };
  const save = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload()));
      setStatus('Saved on this device');
    } catch {
      setStatus('Device storage unavailable. Export JSON to keep your design.');
    }
  };
  const restore = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) throw new Error('No saved design on this device.');
      load(JSON.parse(raw));
    } catch (e) {
      setStatus(e.message);
    }
  };
  const importFile = async (e) => {
    try {
      const f = e.target.files[0];
      if (!f) return;
      if (f.size > 1024 * 1024) throw new Error('Choose a JSON file smaller than 1 MB.');
      load(JSON.parse(await f.text()));
    } catch (e) {
      setStatus(e.message);
    }
    e.target.value = '';
  };
  const report = () => {
    const lines = [
      'MECHLAB ENGINE CONCEPT REPORT',
      'Concept only; not manufacturing CAD.',
      ...sections.flatMap((s) => [
        '\n' + s.name,
        ...s.fields.map((f) => `${f.label}: ${d[f.key]}`),
      ]),
      '\nCustom parts',
      ...parts.map((p) => `${p.name}: ${p.spec}`),
      '\nCalculated estimates',
      `Displacement: ${results.displacement.toFixed(3)} L`,
      `Torque: ${results.torque.toFixed(1)} Nm`,
      `Power: ${results.power.toFixed(1)} kW`,
      `Mean piston speed: ${results.pistonSpeed.toFixed(2)} m/s`,
      `Clearance / cylinder: ${results.clearance.toFixed(2)} cc`,
      `Rod/stroke ratio: ${results.rodRatio.toFixed(3)}`,
      `Intake volume flow: ${results.airFlow.toFixed(0)} L/min`,
      'Power/torque use assumed constant BMEP, not a dyno prediction. Airflow is intake volume at assumed VE; boost does not predict power.',
    ];
    download('engine-report.txt', lines.join('\n'), 'text/plain');
  };
  const fieldList = sections[section].fields,
    pages = Math.ceil(fieldList.length / 4);
  const cards = results
    ? [
        ['Displacement', results.displacement.toFixed(2), 'L'],
        ['Estimated torque', results.torque.toFixed(0), 'N·m'],
        ['Estimated power', results.power.toFixed(1), 'kW'],
        ['Mean piston speed', results.pistonSpeed.toFixed(1), 'm/s'],
        ['Clearance / cylinder', results.clearance.toFixed(1), 'cc'],
        ['Rod / stroke ratio', results.rodRatio.toFixed(2), ''],
        ['Intake volume flow', results.airFlow.toFixed(0), 'L/min'],
        [
          'Comparison',
          baseline ? `${(results.power - baseline.power).toFixed(1)} kW` : 'Capture baseline',
          'power change',
        ],
      ]
    : [];
  return (
    <section className="designer">
      <div className="designer-heading">
        <div>
          <span className="eyebrow">BUILD YOUR CONCEPT</span>
          <h1>Engine Designer</h1>
        </div>
        <span className="designer-badge">
          {valid ? `${results.displacement.toFixed(2)} L` : 'Check inputs'}
        </span>
      </div>
      <div className="designer-tabs" role="tablist" aria-label="Designer workspace">
        {['Design', 'Preview', 'Results', 'Parts', 'Files'].map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? 'active' : ''}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="designer-workspace">
        <div className={`designer-view ${tab === 'Preview' ? 'selected' : ''}`}>
          <DesignPreview design={valid ? d : defaults} {...{ exploded, cutaway, playing, layer }} />
          <div className="designer-view-tools">
            <button onClick={() => setPlaying((v) => !v)}>{playing ? 'Pause' : 'Animate'}</button>
            <label>
              <input
                type="checkbox"
                checked={cutaway}
                onChange={(e) => setCutaway(e.target.checked)}
              />{' '}
              Cutaway
            </label>
            <label>
              <input
                type="checkbox"
                checked={exploded}
                onChange={(e) => setExploded(e.target.checked)}
              />{' '}
              Explode
            </label>
            <select
              aria-label="Visible assembly"
              value={layer}
              onChange={(e) => setLayer(e.target.value)}
            >
              {['All', 'Block', 'Moving parts', 'Head', 'Air system'].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
        <div
          className={`designer-panel ${tab !== 'Preview' ? 'selected' : ''}`}
          role="tabpanel"
          aria-label={tab}
        >
          {tab === 'Design' && (
            <>
              <div className="designer-preset">
                <label>
                  Starting concept
                  <select
                    aria-label="Starting concept"
                    value={preset}
                    onChange={(e) => setPreset(e.target.value)}
                  >
                    {Object.keys(presets).map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </label>
                <button
                  onClick={() => {
                    setD({ ...defaults, ...presets[preset] });
                    setStatus('Concept applied. Custom part notes retained.');
                  }}
                >
                  Apply
                </button>
              </div>
              <label className="designer-section">
                Subsystem
                <select
                  aria-label="Subsystem"
                  value={section}
                  onChange={(e) => {
                    setSection(Number(e.target.value));
                    setPage(0);
                  }}
                >
                  {sections.map((s, i) => (
                    <option value={i} key={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="designer-fields">
                {fieldList.slice(page * 4, page * 4 + 4).map((f) => (
                  <label key={f.key}>
                    {f.label}
                    {f.type === 'select' ? (
                      <select
                        aria-label={f.label}
                        value={d[f.key]}
                        onChange={(e) =>
                          update(
                            f.key,
                            typeof f.value === 'number' ? Number(e.target.value) : e.target.value,
                          )
                        }
                      >
                        {f.options.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={f.type}
                        aria-label={f.label}
                        value={d[f.key]}
                        min={f.min}
                        max={f.max}
                        step={f.step}
                        maxLength={2000}
                        onChange={(e) =>
                          update(
                            f.key,
                            f.type === 'number' && e.target.value !== ''
                              ? Number(e.target.value)
                              : e.target.value,
                          )
                        }
                      />
                    )}
                  </label>
                ))}
              </div>
              <div className="designer-pagination">
                <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </button>
                <span>
                  {page + 1} / {pages}
                </span>
                <button disabled={page === pages - 1} onClick={() => setPage((p) => p + 1)}>
                  Next
                </button>
              </div>
            </>
          )}
          {tab === 'Results' && (
            <>
              {!valid ? (
                <div className="designer-validation" role="alert">
                  <h2>Review your inputs</h2>
                  <p>{issues[resultPage % issues.length]}</p>
                  <button onClick={() => setResultPage((p) => p + 1)}>
                    Next issue ({(resultPage % issues.length) + 1}/{issues.length})
                  </button>
                </div>
              ) : (
                <>
                  <h2>Design estimates</h2>
                  <div className="designer-metrics">
                    {cards
                      .slice((resultPage % 2) * 4, (resultPage % 2) * 4 + 4)
                      .map(([label, v, u]) => (
                        <div key={label}>
                          <small>{label}</small>
                          <strong>{v}</strong>
                          <span>{u}</span>
                        </div>
                      ))}
                  </div>
                  <div className="designer-pagination">
                    <button onClick={() => setBaseline(results)}>Capture baseline</button>
                    <button onClick={() => setResultPage((p) => p + 1)}>More results</button>
                  </div>
                  <p className="designer-note">
                    Torque = BMEP × swept volume / {d.cycle === 'Four-stroke' ? '4π' : '2π'}. Power
                    = torque × RPM × 2π / 60. BMEP is assumed; these are not measured performance
                    figures.{' '}
                    {results.pistonSpeed > 25 ? 'High piston speed: review durability.' : ''}
                  </p>
                </>
              )}
            </>
          )}
          {tab === 'Parts' && (
            <>
              <h2>Custom component details</h2>
              <p className="designer-note">
                Add any extra part, dimensions, material, tolerance or assembly instruction.
              </p>
              {parts.length > 0 && (
                <div className="designer-fields">
                  <label>
                    Part name
                    <input
                      value={parts[partPage]?.name || ''}
                      maxLength={120}
                      onChange={(e) =>
                        setParts((ps) =>
                          ps.map((p, i) => (i === partPage ? { ...p, name: e.target.value } : p)),
                        )
                      }
                    />
                  </label>
                  <label>
                    Specification
                    <textarea
                      rows={3}
                      maxLength={2000}
                      value={parts[partPage]?.spec || ''}
                      onChange={(e) =>
                        setParts((ps) =>
                          ps.map((p, i) => (i === partPage ? { ...p, spec: e.target.value } : p)),
                        )
                      }
                    />
                  </label>
                </div>
              )}
              <div className="designer-pagination">
                <button
                  disabled={parts.length >= 100}
                  onClick={() => {
                    setParts((ps) => [...ps, { name: 'New component', spec: '' }]);
                    setPartPage(parts.length);
                  }}
                >
                  Add part
                </button>
                <button
                  disabled={!parts.length}
                  onClick={() => {
                    setParts((ps) => ps.filter((_, i) => i !== partPage));
                    setPartPage((p) => Math.max(0, p - 1));
                  }}
                >
                  Remove
                </button>
              </div>
              {parts.length > 0 && (
                <div className="designer-pagination">
                  <button disabled={!partPage} onClick={() => setPartPage((p) => p - 1)}>
                    Previous
                  </button>
                  <span>
                    {partPage + 1}/{parts.length}
                  </span>
                  <button
                    disabled={partPage === parts.length - 1}
                    onClick={() => setPartPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
          {tab === 'Files' && (
            <>
              <h2>Keep your design</h2>
              <div className="designer-file-actions">
                <button disabled={!valid} onClick={save}>
                  Save on device
                </button>
                <button onClick={restore}>Load saved design</button>
                <button
                  disabled={!valid}
                  onClick={() =>
                    download(
                      'engine-design.json',
                      JSON.stringify(payload(), null, 2),
                      'application/json',
                    )
                  }
                >
                  Export JSON
                </button>
                <button onClick={() => file.current.click()}>Import JSON</button>
                <button disabled={!valid} onClick={report}>
                  Export report
                </button>
                <button
                  onClick={() => {
                    setD({ ...defaults });
                    setParts([]);
                    setBaseline(null);
                    setPartPage(0);
                    setStatus('New design started; saved file retained.');
                  }}
                >
                  New design
                </button>
              </div>
              <input
                hidden
                ref={file}
                type="file"
                accept=".json,application/json"
                onChange={importFile}
              />
              <p className="designer-note">
                JSON keeps all settings and custom parts. Presets are generic concepts, not factory
                specifications. Geometry illustrates key dimensions; text specifications remain in
                the report. No machining drawings or verified engine designs.
              </p>
            </>
          )}
          {tab === 'Preview' && (
            <p className="designer-note">Use the preview controls to inspect the assembly.</p>
          )}
        </div>
      </div>
      <div className="designer-status" role="status">
        {!valid ? issues[0] : status || 'Concept workspace · Save or export to keep changes'}
      </div>
    </section>
  );
}

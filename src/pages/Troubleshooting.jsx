import { useState } from 'react';
import { Wrench, RotateCcw } from 'lucide-react';
import { PageHeading, Card, Button } from '../components/UI.jsx';
const flows = {
  Pump: {
    problem: 'Excessive vibration',
    nodes: [
      {
        q: 'Is there evidence of low suction pressure or a crackling, gravel-like noise?',
        yes: 'cavitation',
        no: 1,
      },
      { q: 'Did vibration begin after coupling or foundation work?', yes: 'alignment', no: 2 },
      {
        q: 'Is bearing temperature elevated or bearing noise unusual?',
        yes: 'bearing',
        no: 'imbalance',
      },
    ],
    results: {
      cavitation: {
        causes: ['Cavitation', 'Restricted suction', 'Air ingress'],
        checks: [
          'Review suction pressure and liquid temperature.',
          'Compare available NPSH with manufacturer requirements and margin.',
          'Review suction strainer condition and valve position.',
        ],
        actions: [
          'Have qualified personnel address suction restrictions or air ingress.',
          'Confirm the operating point is within the approved range.',
        ],
      },
      alignment: {
        causes: ['Misalignment', 'Soft foot', 'Loose foundation'],
        checks: [
          'Review recent maintenance and alignment records.',
          'Have the foundation, hold-downs and coupling alignment inspected.',
        ],
        actions: [
          'Arrange precision alignment and approved foundation correction.',
          'Verify vibration after approved repairs.',
        ],
      },
      bearing: {
        causes: ['Bearing damage', 'Lubrication fault'],
        checks: [
          'Compare bearing temperature and vibration trends.',
          'Review lubrication type, quantity and maintenance records.',
        ],
        actions: [
          'Arrange a bearing and lubrication inspection under lockout.',
          'Stop operation if protective limits are exceeded.',
        ],
      },
      imbalance: {
        causes: [
          'Impeller imbalance',
          'Loose foundation',
          'Operation away from best efficiency point',
        ],
        checks: [
          'Review flow, pressure and vibration spectrum.',
          'Inspect rotor and foundation during planned isolation.',
        ],
        actions: [
          'Have a specialist evaluate balance and duty point.',
          'Follow manufacturer operating limits.',
        ],
      },
    },
  },
  Gearbox: {
    problem: 'Noise or overheating',
    nodes: [
      { q: 'Is lubricant level or condition outside specification?', yes: 'oil', no: 1 },
      {
        q: 'Is the load above the gearbox rating or recently increased?',
        yes: 'overload',
        no: 'wear',
      },
    ],
    results: {
      oil: {
        causes: ['Insufficient lubrication', 'Wrong viscosity', 'Contaminated oil'],
        checks: [
          'Review the specified lubricant and oil-analysis results.',
          'Inspect leakage and approved level indicators.',
        ],
        actions: [
          'Correct lubrication only using the manufacturer’s service procedure.',
          'Investigate leaks and contamination.',
        ],
      },
      overload: {
        causes: ['Excessive transmitted load', 'Poor cooling'],
        checks: [
          'Review torque, duty cycle and ambient conditions.',
          'Check the rating including service factor.',
        ],
        actions: ['Reduce duty to approved limits.', 'Have cooling and sizing reviewed.'],
      },
      wear: {
        causes: ['Gear tooth wear', 'Bearing damage', 'Misalignment'],
        checks: [
          'Review vibration trends and debris analysis.',
          'Inspect tooth contact and bearings during a planned shutdown.',
        ],
        actions: [
          'Arrange qualified inspection and repair.',
          'Verify alignment and lubrication before return to service.',
        ],
      },
    },
  },
  Compressor: {
    problem: 'Low delivered pressure',
    nodes: [
      { q: 'Is high air demand or a downstream leak evident?', yes: 'leak', no: 1 },
      {
        q: 'Is intake restriction or overdue filter service evident?',
        yes: 'filter',
        no: 'internal',
      },
    ],
    results: {
      leak: {
        causes: ['Downstream leakage', 'Demand exceeding capacity'],
        checks: [
          'Review pressure trends and demand.',
          'Use approved leak-detection methods without touching pressurized joints.',
        ],
        actions: [
          'Isolate and repair leaks with qualified personnel.',
          'Review required capacity and duty cycle.',
        ],
      },
      filter: {
        causes: ['Restricted inlet', 'Blocked filter'],
        checks: ['Review differential pressure and maintenance interval.'],
        actions: [
          'Replace filters per manufacturer procedures after isolation.',
          'Investigate the contamination source.',
        ],
      },
      internal: {
        causes: ['Valve wear', 'Compression-element wear', 'Control fault'],
        checks: [
          'Review unloaded and loaded operating states.',
          'Check service records and control alarms.',
        ],
        actions: ['Arrange qualified compressor service.', 'Avoid defeating protective controls.'],
      },
    },
  },
  Lathe: {
    problem: 'Poor surface finish / chatter',
    nodes: [
      { q: 'Is the workpiece or tool overhang unusually long?', yes: 'rigidity', no: 1 },
      { q: 'Is the cutting edge worn or chipped?', yes: 'tool', no: 'parameters' },
    ],
    results: {
      rigidity: {
        causes: ['Insufficient rigidity', 'Long unsupported work', 'Weak clamping'],
        checks: [
          'Review fixture design and overhang.',
          'Check support and clamping with the spindle stopped.',
        ],
        actions: [
          'Arrange a safer, more rigid setup.',
          'Use appropriate support within machine limits.',
        ],
      },
      tool: {
        causes: ['Worn insert', 'Damaged cutting edge'],
        checks: ['Inspect the tool while isolated.', 'Review the insert grade for the material.'],
        actions: [
          'Replace or index the insert according to the setup procedure.',
          'Verify the holder and tool geometry.',
        ],
      },
      parameters: {
        causes: ['Unsuitable cutting parameters', 'Spindle or slide condition', 'Built-up edge'],
        checks: [
          'Compare speed, feed and depth with tool-maker guidance.',
          'Review spindle runout and maintenance condition.',
        ],
        actions: [
          'Adjust within approved cutting recommendations.',
          'Arrange maintenance if mechanical play is suspected.',
        ],
      },
    },
  },
};
export default function Troubleshooting() {
  const [machine, setMachine] = useState('Pump'),
    [node, setNode] = useState(0),
    [history, setHistory] = useState([]),
    [started, setStarted] = useState(false);
  const flow = flows[machine],
    result = typeof node === 'string' ? flow.results[node] : null;
  const reset = () => {
    setNode(0);
    setHistory([]);
    setStarted(false);
  };
  const answer = (yes) => {
    const n = flow.nodes[node];
    setHistory([...history, { question: n.q, answer: yes ? 'Yes' : 'No' }]);
    setNode(yes ? n.yes : n.no);
  };
  return (
    <>
      <PageHeading
        eyebrow="GUIDED DIAGNOSTICS"
        title="Troubleshooting center"
        description="Narrow down likely causes with observations and a structured checklist."
      />
      <div className="detail-grid">
        <Card className="padded">
          <span className="tile-icon">
            <Wrench />
          </span>
          <h2 className="section-space">Choose the equipment</h2>
          <label className="section-space">
            Machine
            <select
              value={machine}
              disabled={started}
              onChange={(e) => {
                setMachine(e.target.value);
                reset();
              }}
            >
              {Object.keys(flows).map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
          <div className="note">
            <span className="meta">SYMPTOM</span>
            <h3>{flow.problem}</h3>
          </div>
          {!started ? (
            <div className="actions">
              <Button onClick={() => setStarted(true)}>Start guided check</Button>
            </div>
          ) : !result ? (
            <>
              <div className="eyebrow section-space">OBSERVATION {history.length + 1}</div>
              <h2 className="troubleshoot-question">{flow.nodes[node].q}</h2>
              <p>
                Use existing observations or approved instruments. Do not approach hazardous moving
                or pressurized equipment.
              </p>
              <div className="actions">
                <Button onClick={() => answer(true)}>Yes</Button>
                <Button variant="secondary" onClick={() => answer(false)}>
                  No
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="section-space">Possible causes</h2>
              <ul>
                {result.causes.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <h3>Checks to perform</h3>
              <ul>
                {result.checks.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <h3>General corrective actions</h3>
              <ul>
                {result.actions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </>
          )}
          {started && (
            <Button variant="secondary" className="section-space" onClick={reset}>
              <RotateCcw size={16} />
              Restart diagnosis
            </Button>
          )}
        </Card>
        <Card className="padded">
          <h2>Your observations</h2>
          {history.length ? (
            <ol>
              {history.map((h, i) => (
                <li key={i}>
                  {h.question}
                  <br />
                  <strong>{h.answer}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p className="section-space">
              Your answers will appear here as you work through the questions.
            </p>
          )}
          <div className="safety">
            <strong>Safety first</strong>
            <p>
              This guide suggests possible causes, not a confirmed diagnosis. Stop and isolate
              equipment if safe operating limits are exceeded. Maintenance requires qualified
              personnel, lockout/tagout, depressurization and the manufacturer’s procedures. Never
              bypass guards or protective devices.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}

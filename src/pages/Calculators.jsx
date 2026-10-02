import { useEffect, useState } from 'react';
import { Calculator, RotateCcw, CheckCircle2 } from 'lucide-react';
import { calculators, evaluate, formatNumber } from '../calculators/registry.js';
import { calculationSteps } from '../calculators/steps.js';
import {
  Button,
  Card,
  PageHeading,
  SearchBar,
  CategoryFilter,
  EmptyState,
  BookmarkButton,
  ErrorMessage,
} from '../components/UI.jsx';
export default function Calculators({ selected, lab, navigate }) {
  const [query, setQuery] = useState(''),
    [category, setCategory] = useState('All');
  const calc = calculators.find((c) => c.id === selected);
  if (calc) return <CalculatorDetail key={calc.id} calc={calc} lab={lab} navigate={navigate} />;
  const shown = calculators.filter(
    (c) =>
      (category === 'All' || c.category === category) &&
      `${c.name} ${c.note}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow="ENGINEERING TOOLKIT"
        title="Engineering calculators"
        description="Clear inputs. Explicit units. Calculations you can follow."
      />
      <SearchBar value={query} onChange={setQuery} placeholder="Find a calculator…" />
      <CategoryFilter
        values={['All', ...new Set(calculators.map((c) => c.category))]}
        value={category}
        onChange={setCategory}
      />
      <div className="grid three">
        {shown.map((c) => (
          <Card key={c.id} className="tool-card">
            <div className="card-top">
              <span className="tile-icon">
                <Calculator size={21} />
              </span>
              <BookmarkButton
                lab={lab}
                item={{
                  key: `calculators/${c.id}`,
                  route: `calculators/${c.id}`,
                  name: c.name,
                  type: 'Calculator',
                }}
              />
            </div>
            <span className="meta">{c.category}</span>
            <h3>
              <a href={`#/calculators/${c.id}`}>{c.name}</a>
            </h3>
            <div className="formula-mini">{c.formula}</div>
            <p>{c.note}</p>
          </Card>
        ))}
      </div>
      {!shown.length && <EmptyState />}
    </>
  );
}
function CalculatorDetail({ calc, lab, navigate }) {
  const defaults = () => Object.fromEntries(calc.fields.map((f) => [f.key, String(f.value)]));
  const [inputs, setInputs] = useState(defaults),
    [answer, setAnswer] = useState(null),
    [error, setError] = useState('');
  const item = {
    key: `calculators/${calc.id}`,
    route: `calculators/${calc.id}`,
    name: calc.name,
    type: 'Calculator',
  };
  useEffect(() => lab.record(item), [calc.id]);
  const calculate = (e) => {
    e.preventDefault();
    try {
      setAnswer(evaluate(calc, inputs));
      setError('');
      lab.record(item);
    } catch (err) {
      setError(err.message);
      setAnswer(null);
    }
  };
  return (
    <>
      <PageHeading
        eyebrow={calc.category.toUpperCase()}
        title={`${calc.name} Calculator`}
        description={calc.note}
      >
        <BookmarkButton lab={lab} item={item} />
      </PageHeading>
      <div className="detail-grid">
        <Card className="padded">
          <h2>Input parameters</h2>
          <p className="muted">Enter values using the units shown.</p>
          <form onSubmit={calculate} noValidate>
            <div className="input-grid">
              {calc.fields.map((f) => (
                <label key={f.key}>
                  {f.label}
                  <div className="input-unit">
                    <input
                      type="number"
                      step="any"
                      value={inputs[f.key]}
                      onChange={(e) => {
                        setInputs({ ...inputs, [f.key]: e.target.value });
                        setAnswer(null);
                      }}
                      aria-label={f.label}
                    />
                    <span>{f.unit}</span>
                  </div>
                  <small>
                    {f.key} · {f.label}
                  </small>
                </label>
              ))}
            </div>
            <ErrorMessage>{error}</ErrorMessage>
            <div className="actions">
              <Button type="submit">
                <Calculator size={18} />
                Calculate
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setInputs(defaults());
                  setAnswer(null);
                  setError('');
                }}
              >
                <RotateCcw size={16} />
                Reset
              </Button>
            </div>
          </form>
        </Card>
        <div>
          <Card className="padded formula-card">
            <span className="eyebrow">GOVERNING EQUATION</span>
            <div className="equation">{calc.formula}</div>
            <h3>Variables & units</h3>
            <dl>
              {calc.fields.map((f) => (
                <div key={f.key}>
                  <dt>{f.key}</dt>
                  <dd>
                    {f.label} · {f.unit}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card className={`padded result-card ${answer ? 'has-result' : ''}`} aria-live="polite">
            {answer ? (
              <>
                <div className="eyebrow">
                  <CheckCircle2 size={16} />
                  CALCULATED RESULT
                </div>
                <div className="result-number">
                  {formatNumber(answer.result)} <span>{calc.unit}</span>
                </div>
                <h3>Step-by-step calculation</h3>
                <ol className="steps">
                  {calculationSteps(calc, answer).map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
                <p className="muted">
                  See the equation and input units above. Results are rounded to 7 significant
                  digits for display.
                </p>
              </>
            ) : (
              <>
                <span className="eyebrow">RESULT</span>
                <h3>Your result will appear here</h3>
                <p>Enter your parameters and select Calculate.</p>
              </>
            )}
          </Card>
        </div>
      </div>
      <Button variant="secondary" onClick={() => navigate('calculators')}>
        Browse all calculators
      </Button>
    </>
  );
}

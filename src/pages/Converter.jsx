import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { unitCategories, convert } from '../utils/units.js';
import { formatNumber } from '../calculators/registry.js';
import { PageHeading, Card, Button, ErrorMessage } from '../components/UI.jsx';
export default function Converter() {
  const [category, setCategory] = useState('Length'),
    [value, setValue] = useState('25.4'),
    [from, setFrom] = useState('mm'),
    [to, setTo] = useState('in');
  let result,
    error = '';
  try {
    result = convert(category, value, from, to);
  } catch (e) {
    error = e.message;
  }
  const keys = Object.keys(unitCategories[category].units);
  return (
    <>
      <PageHeading
        eyebrow="ENGINEERING TOOLKIT"
        title="Unit converter"
        description="Precise conversions across 16 engineering quantities."
      />
      <div className="converter-layout">
        <Card className="padded">
          <label>
            Quantity
            <select
              value={category}
              onChange={(e) => {
                const k = e.target.value,
                  units = Object.keys(unitCategories[k].units);
                setCategory(k);
                setFrom(units[0]);
                setTo(units[1]);
              }}
            >
              {Object.keys(unitCategories).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <div className="converter-fields">
            <label>
              Value
              <input
                type="number"
                step="any"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </label>
            <label>
              From
              <select value={from} onChange={(e) => setFrom(e.target.value)}>
                {keys.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </label>
            <button
              className="icon-button swap"
              aria-label="Swap units"
              title="Swap units"
              onClick={() => {
                setFrom(to);
                setTo(from);
                if (result !== undefined) setValue(String(result));
              }}
            >
              <ArrowLeftRight />
            </button>
            <label>
              To
              <select value={to} onChange={(e) => setTo(e.target.value)}>
                {keys.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </label>
          </div>
          <ErrorMessage>{error}</ErrorMessage>
          <div className="conversion-result" aria-live="polite">
            <span className="eyebrow">CONVERTED VALUE</span>
            <div className="result-number">
              {result === undefined ? '—' : formatNumber(result)} <span>{to}</span>
            </div>
            <p>
              {value || '—'} {from} = {result === undefined ? '—' : formatNumber(result)} {to}
            </p>
          </div>
          <Button variant="secondary" onClick={() => setValue('0')}>
            Reset value
          </Button>
        </Card>
        <Card className="padded">
          <h2>Keep the units consistent</h2>
          <p>
            A calculation is only as reliable as its inputs. Convert all variables to the units
            required by the equation before substituting.
          </p>
          <div className="note">
            <h3>Temperature is different</h3>
            <p>
              Absolute temperatures include an offset. A 1 °C temperature difference equals 1 K, but
              1 °C absolute is 274.15 K.
            </p>
          </div>
          <div className="note">
            <h3>Imperial conventions</h3>
            <p>
              US and Imperial gallons differ. Mechanical horsepower and metric PS also differ; both
              are labeled explicitly.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}

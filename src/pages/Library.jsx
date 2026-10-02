import { useEffect, useState } from 'react';
import { Cog, Factory, Ruler, Sigma, FolderKanban } from 'lucide-react';
import { machines } from '../data/machines.js';
import { manufacturing } from '../data/manufacturing.js';
import { drawing } from '../data/drawing.js';
import { formulas } from '../data/formulas.js';
import { projects } from '../data/projects.js';
import {
  PageHeading,
  Card,
  SearchBar,
  CategoryFilter,
  EmptyState,
  BookmarkButton,
  Button,
} from '../components/UI.jsx';
const libraries = {
  machines: {
    data: machines,
    title: 'Machine explorer',
    description: 'Meet the components. Understand the working principles.',
    icon: Cog,
  },
  manufacturing: {
    data: manufacturing,
    title: 'Manufacturing hub',
    description: 'Explore how engineering ideas become physical parts.',
    icon: Factory,
  },
  drawing: {
    data: drawing,
    title: 'Engineering drawing & GD&T',
    description: 'Communicate geometry, function and acceptable variation.',
    icon: Ruler,
  },
  formulas: {
    data: formulas,
    title: 'Formula library',
    description: 'The equations behind your engineering decisions.',
    icon: Sigma,
  },
  projects: {
    data: projects,
    title: 'Engineering projects',
    description: 'Purposeful builds that turn theory into experience.',
    icon: FolderKanban,
  },
};
export default function Library({ kind, selected, lab }) {
  const lib = libraries[kind],
    Icon = lib.icon;
  const [query, setQuery] = useState(''),
    [category, setCategory] = useState('All');
  const record = lib.data.find((d) => d.id === selected),
    item = record
      ? {
          key: `${kind}/${record.id}`,
          route: `${kind}/${record.id}`,
          name: record.name,
          type: kind.slice(0, -1),
        }
      : null;
  useEffect(() => {
    if (item) lab.record(item);
  }, [kind, selected]);
  if (record)
    return (
      <>
        <PageHeading
          eyebrow={(record.category || kind).toUpperCase()}
          title={record.name}
          description={
            record.overview ||
            record.definition ||
            record.objective ||
            record.description ||
            record.meaning
          }
        >
          {['machines', 'formulas', 'projects'].includes(kind) && (
            <BookmarkButton lab={lab} item={item} />
          )}
        </PageHeading>
        <Detail kind={kind} data={record} />
      </>
    );
  const categories = [
      'All',
      ...new Set(lib.data.map((d) => d.category || d.difficulty || d.type)),
    ].filter(Boolean),
    shown = lib.data.filter(
      (d) =>
        (category === 'All' || (d.category || d.difficulty || d.type) === category) &&
        JSON.stringify(d).toLowerCase().includes(query.toLowerCase()),
    );
  return (
    <>
      <PageHeading title={lib.title} description={lib.description} />
      <SearchBar value={query} onChange={setQuery} />
      {categories.length > 2 && (
        <CategoryFilter values={categories} value={category} onChange={setCategory} />
      )}
      <div className="grid three section-space">
        {shown.map((d) => (
          <Card className="library-card" key={d.id}>
            <div className="card-top">
              <span className={`tile-icon ${kind === 'drawing' ? 'symbol' : ''}`}>
                {d.symbol || <Icon />}
              </span>
              {['machines', 'formulas', 'projects'].includes(kind) && (
                <BookmarkButton
                  lab={lab}
                  item={{
                    key: `${kind}/${d.id}`,
                    route: `${kind}/${d.id}`,
                    name: d.name,
                    type: kind.slice(0, -1),
                  }}
                />
              )}
            </div>
            <span className="meta">{d.category || d.type || kind}</span>
            <h3>
              <a href={`#/${kind}/${d.id}`}>{d.name}</a>
            </h3>
            {d.formula && <div className="formula-mini">{d.formula}</div>}
            <p>{d.overview || d.definition || d.objective || d.description || d.meaning}</p>
            {d.difficulty && (
              <span className="chip">
                {d.difficulty} · {d.budget}
              </span>
            )}
          </Card>
        ))}
      </div>
      {!shown.length && <EmptyState />}
    </>
  );
}
function ContentList({ title, items }) {
  return (
    <Card className="padded">
      <h2>{title}</h2>
      <ul>
        {items.map((v) => (
          <li key={v}>{v}</li>
        ))}
      </ul>
    </Card>
  );
}
function Detail({ kind, data: d }) {
  const [component, setComponent] = useState(0);
  if (kind === 'machines')
    return (
      <>
        <div className="detail-grid">
          <Card className="padded">
            <h2>Working principle</h2>
            <p>{d.principle}</p>
            <h2 className="section-space">Main components</h2>
            <div className="component-buttons">
              {d.components.map((c, i) => (
                <button
                  className={`chip ${component === i ? 'selected' : ''}`}
                  aria-pressed={component === i}
                  key={c.name}
                  onClick={() => setComponent(i)}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <div className="component-detail" aria-live="polite">
              <Cog size={30} />
              <h3>{d.components[component].name}</h3>
              <p>{d.components[component].description}</p>
            </div>
            {d.id === 'engine' && (
              <a className="button primary" href="#/visualizer">
                Open interactive 3D engine
              </a>
            )}
          </Card>
          <div className="stack">
            <ContentList title="Applications" items={d.applications} />
            <ContentList title="Common failures" items={d.failures} />
          </div>
        </div>
        <div className="grid three section-space">
          <ContentList title="Advantages" items={d.advantages} />
          <ContentList title="Disadvantages" items={d.disadvantages} />
          <ContentList title="Maintenance" items={d.maintenance} />
        </div>
      </>
    );
  if (kind === 'manufacturing')
    return (
      <>
        <div className="detail-grid">
          <Card className="padded">
            <h2>Process sequence</h2>
            <ol className="steps">
              {d.process.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
            <h3>Machine used</h3>
            <p>{d.machine}</p>
            <h3>Typical materials</h3>
            <p>{d.materials.join(' · ')}</p>
          </Card>
          <ContentList title="Tools & equipment" items={d.tools} />
        </div>
        <div className="grid three section-space">
          <ContentList title="Applications" items={d.applications} />
          <ContentList title="Advantages" items={d.advantages} />
          <ContentList title="Limitations" items={d.limitations} />
        </div>
        <div className="safety">
          <strong>Safety considerations</strong>
          <p>{d.safety}</p>
        </div>
      </>
    );
  if (kind === 'drawing')
    return (
      <div className="detail-grid">
        <Card className="padded">
          <span className="gdt-large">{d.symbol}</span>
          <h2>Reading the drawing</h2>
          <p>{d.meaning}</p>
          <h3>Example</h3>
          <p>{d.example}</p>
          <h3>Where it is used</h3>
          <p>{d.use}</p>
          {d.type === 'legacy' && (
            <p className="safety">
              Legacy control: verify the governing edition. ASME Y14.5-2018 removed this control.
            </p>
          )}
          <a
            href="https://www.asme.org/codes-standards/find-codes-standards/y14-5-dimensiones-y-tolerancias/2018"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            ASME Y14.5 reference
          </a>
        </Card>
        <Card className="padded">
          <h2>Concept diagram</h2>
          <DrawingDiagram type={d.type} id={d.id} />
          <p className="muted">
            Schematic only. Blue indicates the nominal feature; dashed cyan lines indicate a
            conceptual zone or reference. Read the example for this control’s actual tolerance-zone
            definition.
          </p>
          <div className="feature-frame">
            {d.symbol} <span>0.05</span>
            {['orientation', 'location', 'runout', 'legacy'].includes(d.type) && <span>A</span>}
          </div>
          <p className="muted">
            Illustrative frame; datum requirements, diameter symbols and modifiers depend on the
            actual feature.
          </p>
        </Card>
      </div>
    );
  if (kind === 'formulas')
    return (
      <div className="detail-grid">
        <Card className="padded">
          <div className="equation">{d.formula}</div>
          <h2>Variables & units</h2>
          <ul>
            {d.variables.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </Card>
        <Card className="padded">
          <h2>Worked example</h2>
          <p className="worked-example">{d.example}</p>
          <h3>Assumptions</h3>
          <p>{d.description}</p>
          {d.calculator && (
            <a className="button primary" href={`#/calculators/${d.calculator}`}>
              Use this calculator
            </a>
          )}
        </Card>
      </div>
    );
  return (
    <>
      <div className="detail-grid">
        <Card className="padded">
          <span className="chip">{d.difficulty}</span>
          <h2>Working principle</h2>
          <p>{d.principle}</p>
          <div className="project-budget">
            <span>Estimated parts budget</span>
            <strong>{d.budget} USD</strong>
            <small>Illustrative small-prototype range; location, tools and shipping vary.</small>
          </div>
        </Card>
        <ContentList title="Components" items={d.components} />
      </div>
      <div className="grid two section-space">
        <ContentList title="Skills required" items={d.skills} />
        <ContentList title="Possible improvements" items={d.improvements} />
      </div>
      <p className="safety">
        Use supervised low-energy prototypes. Validate structural capacity, guarding and electrical
        protection before operation; this idea is not a construction specification.
      </p>
    </>
  );
}
function DrawingDiagram({ type, id }) {
  const round = ['circularity', 'cylindricity', 'concentricity', 'runout'].includes(id);
  return (
    <svg
      viewBox="0 0 400 230"
      className="drawing-diagram"
      role="img"
      aria-label={`${id} concept schematic`}
    >
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="currentColor" opacity=".12" />
        </pattern>
      </defs>
      <rect width="400" height="230" fill="url(#grid)" />
      {id === 'position' ? (
        <g fill="none">
          <rect x="80" y="45" width="240" height="140" stroke="currentColor" strokeWidth="3" />
          <path d="M80 115H320M200 45V185" stroke="currentColor" strokeDasharray="5 4" />
          <circle cx="200" cy="115" r="31" stroke="#08a3bc" strokeWidth="2" strokeDasharray="6 5" />
          <circle cx="207" cy="108" r="7" fill="#1479ee" stroke="#1479ee" />
          <path d="M195 108H219M207 96V120" stroke="#1479ee" strokeWidth="2" />
          <text x="88" y="35" fill="currentColor" fontSize="13">
            Basic location from datums
          </text>
          <text x="241" y="123" fill="#08a3bc" fontSize="12">
            Axis zone
          </text>
        </g>
      ) : id === 'perpendicularity' ? (
        <g fill="none">
          <path d="M200 40V180" stroke="#1479ee" strokeWidth="8" />
          <path d="M180 40V180M220 40V180" stroke="#08a3bc" strokeWidth="2" strokeDasharray="6 5" />
          <path d="M65 185H335M200 165H220V185" stroke="currentColor" strokeWidth="3" />
          <text x="280" y="175" fill="currentColor" fontSize="13">
            Datum A
          </text>
        </g>
      ) : id === 'flatness' ? (
        <g fill="none">
          <path
            d="M85 105L250 65L320 110L155 150Z"
            fill="#1479ee22"
            stroke="#1479ee"
            strokeWidth="3"
          />
          <path
            d="M85 85L250 45L320 90L155 130ZM85 125L250 85L320 130L155 170Z"
            stroke="#08a3bc"
            strokeWidth="2"
            strokeDasharray="6 5"
          />
          <text x="80" y="195" fill="currentColor" fontSize="13">
            Two parallel planes · no datum
          </text>
        </g>
      ) : id === 'cylindricity' ? (
        <g fill="none">
          <ellipse cx="200" cy="65" rx="66" ry="23" stroke="#1479ee" strokeWidth="3" />
          <ellipse cx="200" cy="170" rx="66" ry="23" stroke="#1479ee" strokeWidth="3" />
          <path d="M134 65V170M266 65V170" stroke="#1479ee" strokeWidth="3" />
          <ellipse cx="200" cy="65" rx="77" ry="29" stroke="#08a3bc" strokeDasharray="6 5" />
          <ellipse cx="200" cy="170" rx="77" ry="29" stroke="#08a3bc" strokeDasharray="6 5" />
          <path d="M123 65V170M277 65V170M200 22V202" stroke="#08a3bc" strokeDasharray="6 5" />
        </g>
      ) : round ? (
        <>
          <circle cx="200" cy="110" r="70" fill="none" stroke="#1479ee" strokeWidth="8" />
          <circle cx="200" cy="110" r="82" fill="none" stroke="#08a3bc" strokeDasharray="6 5" />
          <circle cx="200" cy="110" r="58" fill="none" stroke="#08a3bc" strokeDasharray="6 5" />
          <path
            d="M110 110H290M200 20V200"
            stroke="currentColor"
            opacity=".5"
            strokeDasharray="4"
          />
        </>
      ) : (
        <>
          <path
            d={id === 'angularity' ? 'M65 175L325 55' : 'M65 120H335'}
            stroke="#1479ee"
            strokeWidth="10"
          />
          <path
            d={id === 'angularity' ? 'M65 160L310 47M80 183L340 63' : 'M65 99H335M65 141H335'}
            stroke="#08a3bc"
            strokeWidth="2"
            strokeDasharray="6 5"
          />
          <path d="M50 185H350" stroke="currentColor" strokeWidth="3" />
          {type === 'orientation' && (
            <path d="M200 185V35" stroke="currentColor" strokeDasharray="5 4" />
          )}
        </>
      )}
      <text x="20" y="216" fill="currentColor" fontSize="14">
        {id === 'position'
          ? 'View along axis · conceptual location zone'
          : round
            ? 'Cross-section · conceptual tolerance zone'
            : 'Nominal feature · conceptual reference'}
      </text>
    </svg>
  );
}

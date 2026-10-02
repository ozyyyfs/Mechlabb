import { useState, useEffect } from 'react';
import {
  Search,
  Calculator,
  Layers3,
  Cog,
  Factory,
  Ruler,
  ChartNoAxesCombined,
  GraduationCap,
  FolderKanban,
  Box,
  Activity,
  Sigma,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react';
import { Card, BookmarkButton } from '../components/UI.jsx';
import { calculators } from '../calculators/registry.js';
import { materials } from '../data/materials.js';
import { machines } from '../data/machines.js';
import { manufacturing } from '../data/manufacturing.js';
import { drawing } from '../data/drawing.js';
import { questions } from '../data/quizzes.js';
const quick = [
  ['engine-designer', 'Engine Designer', 'Build a custom engine concept', Cog],
  ['calculators', 'Calculators', 'Solve with confidence', Calculator],
  ['materials', 'Materials', 'Know your material', Layers3],
  ['machines', 'Machines', 'See how it works', Cog],
  ['manufacturing', 'Manufacturing', 'Make it happen', Factory],
  ['drawing', 'Engineering Drawing', 'Read every detail', Ruler],
  ['charts', 'Charts', 'Visualize relationships', ChartNoAxesCombined],
  ['quizzes', 'Quizzes', 'Challenge yourself', GraduationCap],
  ['projects', 'Projects', 'Build your next idea', FolderKanban],
];
function Counter({ value }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(value);
      return;
    }
    let start = performance.now(),
      id;
    const step = (t) => {
      const p = Math.min(1, (t - start) / 750);
      setN(Math.round(value * (1 - (1 - p) ** 3)));
      if (p < 1) id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [value]);
  return n;
}
export default function Dashboard({ lab, openSearch }) {
  return (
    <>
      <div className="dashboard-intro">
        <div>
          <div className="eyebrow">YOUR ENGINEERING WORKSPACE</div>
          <h1>
            Mechanical Engineering,
            <br />
            <span>Reimagined.</span>
          </h1>
          <p>
            Interactive tools, engineering knowledge, visualizations, materials, machines and
            learning resources — all in one place.
          </p>
          <button className="hero-search" onClick={() => openSearch('')}>
            <Search size={21} />
            <span>Search tools, machines, materials, formulas...</span>
            <kbd>Ctrl K</kbd>
          </button>
          <div className="hero-tags">
            <span>
              <span className="tiny-dot" />
              Built for curious engineers
            </span>
            <span>Explore. Calculate. Understand. Build.</span>
          </div>
        </div>
        <div className="hero-blueprint">
          <div className="blueprint-label">
            <Box size={16} />
            INTERACTIVE ENGINEERING
          </div>
          <svg
            viewBox="0 0 350 255"
            role="img"
            aria-label="Technical schematic of a crank and piston mechanism"
          >
            <defs>
              <pattern id="bluegrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0H0V20" fill="none" stroke="#6fa6c4" opacity=".13" />
              </pattern>
            </defs>
            <rect width="350" height="255" fill="url(#bluegrid)" />
            <g fill="none" strokeLinecap="round">
              <path d="M125 32H225V139H125Z" stroke="#9bc4dd" strokeWidth="2" />
              <path d="M134 74H216V99H134Z" fill="#2d6583" stroke="#6cd9ef" strokeWidth="2" />
              <path d="M134 82H216M134 91H216" stroke="#a1e4ee" />
              <path d="M175 98L206 179" stroke="#7db2cc" strokeWidth="13" />
              <path d="M175 98L206 179" stroke="#b4ddea" strokeWidth="3" />
              <circle cx="175" cy="193" r="38" stroke="#6acde1" strokeWidth="2" />
              <circle cx="175" cy="193" r="12" stroke="#7db2cc" strokeWidth="8" />
              <path d="M175 193L206 179" stroke="#97ccdc" strokeWidth="14" />
              <circle cx="206" cy="179" r="7" fill="#14394e" stroke="#c2e9f2" strokeWidth="2" />
              <path d="M175 10V242M107 193H248" stroke="#43829a" strokeDasharray="5 5" />
              <path
                d="M105 32V139M99 32H111M99 139H111M125 18H225M125 12V24M225 12V24"
                stroke="#5b9aac"
              />
              <path d="M127 32L115 15M220 32L233 15" stroke="#b6dce6" strokeWidth="5" />
            </g>
            <g fill="#8db8cc" fontSize="10" fontFamily="monospace">
              <text x="38" y="89">
                STROKE
              </text>
              <text x="151" y="12">
                Ø BORE
              </text>
              <text x="239" y="74">
                PISTON
              </text>
              <text x="239" y="163">
                CON ROD
              </text>
              <text x="234" y="217">
                CRANK
              </text>
            </g>
          </svg>
          <div className="blueprint-footer">
            <span>FOUR-STROKE ENGINE</span>
            <a href="#/visualizer">Open 3D lab</a>
          </div>
        </div>
      </div>
      <div className="stats-strip">
        {[
          [calculators.length, 'Engineering tools'],
          [materials.length, 'Materials'],
          [machines.length, 'Machines'],
          [manufacturing.length + drawing.length, 'Topics'],
          [questions.length, 'Quiz questions'],
        ].map(([v, label]) => (
          <div key={label}>
            <strong>
              <Counter value={v} />
            </strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="section-heading">
        <div>
          <h2>Your engineering toolkit</h2>
          <p>One workspace. Every step of your process.</p>
        </div>
        <span className="meta">EXPLORE MECHLAB</span>
      </div>
      <div className="grid four quick-grid">
        {quick.map(([route, name, description, Icon]) => (
          <a className="card quick-card" href={`#/${route}`} key={route}>
            <span className="tile-icon">
              <Icon size={23} />
            </span>
            <h3>{name}</h3>
            <p>{description}</p>
          </a>
        ))}
      </div>
      <div className="section-heading">
        <div>
          <h2>Popular tools</h2>
          <p>Useful calculations, just a few inputs away.</p>
        </div>
        <a className="text-link" href="#/calculators">
          View all {calculators.length} tools
        </a>
      </div>
      <div className="grid three">
        {['torque', 'stress', 'reynolds'].map((id) => {
          const c = calculators.find((c) => c.id === id);
          return (
            <Card className="popular-card" key={id}>
              <div className="card-top">
                <span className="meta">{c.category}</span>
                <BookmarkButton
                  lab={lab}
                  item={{
                    key: `calculators/${id}`,
                    route: `calculators/${id}`,
                    name: c.name,
                    type: 'Calculator',
                  }}
                />
              </div>
              <h3>
                <a href={`#/calculators/${id}`}>{c.name} Calculator</a>
              </h3>
              <div className="formula-mini">{c.formula}</div>
              <p>{c.note}</p>
              <a className="text-link" href={`#/calculators/${id}`}>
                Open calculator
              </a>
            </Card>
          );
        })}
      </div>
      <div className="section-heading">
        <div>
          <h2>Explore mechanical engineering</h2>
          <p>Build understanding beyond the numbers.</p>
        </div>
      </div>
      <div className="grid two">
        <a className="explore-banner navy" href="#/visualizer">
          <Box size={34} />
          <span className="eyebrow">THE INTERACTIVE LAB</span>
          <h3>
            See the cycle.
            <br />
            Understand the motion.
          </h3>
          <p>Rotate, isolate and animate a four-stroke engine.</p>
          <span className="banner-link">Explore the 3D engine</span>
        </a>
        <a className="explore-banner pale" href="#/quizzes">
          <GraduationCap size={34} />
          <span className="eyebrow">PUT KNOWLEDGE TO WORK</span>
          <h3>
            A little challenge.
            <br />A deeper understanding.
          </h3>
          <p>8 disciplines. 3 difficulty levels. Explanations that stick.</p>
          <span className="banner-link">Start a quiz</span>
        </a>
      </div>
      <div className="section-heading">
        <div>
          <h2>Pick up where you left off</h2>
          <p>Your recent workspace activity.</p>
        </div>
        <a className="text-link" href="#/activity">
          View activity
        </a>
      </div>
      <Card className="activity-preview">
        {lab.activity.length ? (
          lab.activity.slice(0, 3).map((a) => (
            <a href={`#/${a.route}`} key={a.key}>
              <span className="tile-icon">
                <Activity size={19} />
              </span>
              <div>
                <strong>{a.name}</strong>
                <small>{a.type}</small>
              </div>
              <span className="meta">{new Date(a.time).toLocaleDateString()}</span>
            </a>
          ))
        ) : (
          <div className="start-note">
            <BookOpen size={26} />
            <p>
              Your journey starts here. Open a calculator, material or machine to build your recent
              activity.
            </p>
          </div>
        )}
      </Card>
    </>
  );
}

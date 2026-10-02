import { useState, useMemo } from 'react';
import { SearchBar, Modal, EmptyState } from './UI.jsx';
import { calculators } from '../calculators/registry.js';
import { materials } from '../data/materials.js';
import { machines } from '../data/machines.js';
import { manufacturing } from '../data/manufacturing.js';
import { drawing } from '../data/drawing.js';
import { formulas } from '../data/formulas.js';
import { projects } from '../data/projects.js';
import { questions } from '../data/quizzes.js';
const collections = {
  'Engine Designer': [
    'engine-designer',
    [
      {
        id: '',
        name: 'Engine Designer',
        description: 'Custom car engine design, parts and specifications',
      },
    ],
  ],
  Calculators: ['calculators', calculators],
  Materials: ['materials', materials],
  Machines: ['machines', machines],
  Manufacturing: ['manufacturing', manufacturing],
  'Engineering Drawing': ['drawing', drawing],
  Formulas: ['formulas', formulas],
  Projects: ['projects', projects],
  Quizzes: [
    'quizzes',
    [...new Set(questions.map((q) => q.category))].map((name) => ({
      id: '',
      name,
      category: name,
    })),
  ],
  'Engineering Topics': [
    'materials',
    [
      {
        id: 'aluminium-6061',
        name: 'Aluminium alloys',
        description: 'Heat-treated wrought aluminium: 6061 and 7075',
      },
    ],
  ],
};
export default function GlobalSearch({ initial, onClose, navigate }) {
  const [query, setQuery] = useState(initial);
  const matches = useMemo(
    () =>
      Object.entries(collections)
        .map(([group, [route, data]]) => ({
          group,
          items: data
            .filter((d) => JSON.stringify(d).toLowerCase().includes(query.toLowerCase().trim()))
            .slice(0, 6)
            .map((d) => ({
              name: d.name,
              description: d.category || d.description || group,
              route: `${route}${d.id ? '/' + d.id : ''}`,
            })),
        }))
        .filter((g) => g.items.length),
    [query],
  );
  return (
    <Modal title="Search MECHLAB" onClose={onClose}>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search tools, machines, materials, formulas…"
        label="Global search"
      />
      <div className="search-results">
        {query.trim() ? (
          matches.map((g) => (
            <section key={g.group}>
              <h3>{g.group}</h3>
              {g.items.map((i, index) => (
                <button
                  key={i.route + index}
                  onClick={() => {
                    navigate(i.route);
                    onClose();
                  }}
                >
                  <strong>{i.name}</strong>
                  <small>{i.description}</small>
                </button>
              ))}
            </section>
          ))
        ) : (
          <div className="search-suggestions">
            <p className="muted">Try a tool, material or engineering concept.</p>
            {['Torque', 'Aluminium', 'Pump', 'Position', 'Heat transfer'].map((s) => (
              <button className="chip" key={s} onClick={() => setQuery(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
        {query.trim() && !matches.length && <EmptyState />}
      </div>
    </Modal>
  );
}

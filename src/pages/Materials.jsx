import { useState, useEffect } from 'react';
import { Layers3, Scale } from 'lucide-react';
import { materials, materialProperties, materialSources } from '../data/materials.js';
import {
  PageHeading,
  Card,
  SearchBar,
  CategoryFilter,
  EmptyState,
  BookmarkButton,
  Button,
  Modal,
} from '../components/UI.jsx';
export default function Materials({ selected, lab }) {
  const [query, setQuery] = useState(''),
    [filter, setFilter] = useState('All'),
    [compare, setCompare] = useState([]),
    [showCompare, setShowCompare] = useState(false);
  const material = materials.find((m) => m.id === selected);
  const item = material
    ? {
        key: `materials/${material.id}`,
        route: `materials/${material.id}`,
        name: material.name,
        type: 'Material',
      }
    : null;
  useEffect(() => {
    if (item) lab.record(item);
  }, [selected]);
  const toggle = (id) => {
    if (compare.includes(id)) setCompare(compare.filter((v) => v !== id));
    else if (compare.length < 4) setCompare([...compare, id]);
    else lab.notify('Compare up to four materials. Remove one to add another.');
  };
  if (material)
    return (
      <>
        <PageHeading
          eyebrow={material.category.toUpperCase()}
          title={material.name}
          description={material.condition}
        >
          <BookmarkButton lab={lab} item={item} />
        </PageHeading>
        <div className="grid three">
          {materialProperties.map(([key, label, unit]) => (
            <Card className="property" key={key}>
              <span className="meta">{label}</span>
              <strong>{material[key] ?? 'Not defined'}</strong>
              <span>{material[key] === null ? 'Brittle material' : unit}</span>
            </Card>
          ))}
        </div>
        <div className="grid three section-space">
          {['applications', 'advantages', 'limitations'].map((k) => (
            <Card className="padded" key={k}>
              <h2 className="capitalize">{k}</h2>
              <ul>
                {material[k].map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <MaterialNote />
      </>
    );
  const shown = materials.filter(
    (m) =>
      (filter === 'All' || m.category === filter) &&
      `${m.name} ${m.condition}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow="MATERIAL INTELLIGENCE"
        title="Materials database"
        description="Find the right balance of strength, weight and manufacturability."
      >
        <Button disabled={compare.length < 2} onClick={() => setShowCompare(true)}>
          <Scale size={18} />
          Compare ({compare.length}/4)
        </Button>
      </PageHeading>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search materials, alloys or grades…"
      />
      <CategoryFilter
        values={['All', 'Ferrous', 'Non-ferrous']}
        value={filter}
        onChange={setFilter}
      />
      <div className="grid three">
        {shown.map((m) => (
          <Card className="material-card" key={m.id}>
            <div className="card-top">
              <span className="tile-icon">
                <Layers3 />
              </span>
              <BookmarkButton
                lab={lab}
                item={{
                  key: `materials/${m.id}`,
                  route: `materials/${m.id}`,
                  name: m.name,
                  type: 'Material',
                }}
              />
            </div>
            <span className="meta">{m.category}</span>
            <h3>
              <a href={`#/materials/${m.id}`}>{m.name}</a>
            </h3>
            <p className="muted">{m.condition}</p>
            <div className="material-metrics">
              <div>
                <small>Density</small>
                <strong>
                  {m.density}
                  <em>kg/m³</em>
                </strong>
              </div>
              <div>
                <small>Yield strength</small>
                <strong>
                  {m.yield ?? '—'}
                  <em>MPa</em>
                </strong>
              </div>
            </div>
            <label className="check-label">
              <input
                type="checkbox"
                checked={compare.includes(m.id)}
                onChange={() => toggle(m.id)}
              />
              Add to comparison
            </label>
          </Card>
        ))}
      </div>
      {!shown.length && <EmptyState />}
      <MaterialNote />
      {showCompare && (
        <Modal title="Material comparison" onClose={() => setShowCompare(false)}>
          <p className="muted">
            Representative room-temperature properties; product condition matters.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  {compare.map((id) => (
                    <th key={id}>{materials.find((m) => m.id === id).name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Condition</th>
                  {compare.map((id) => (
                    <td key={id}>{materials.find((m) => m.id === id).condition}</td>
                  ))}
                </tr>
                {materialProperties.map(([key, label, unit]) => (
                  <tr key={key}>
                    <th>
                      {label}
                      <small>{unit}</small>
                    </th>
                    {compare.map((id) => (
                      <td key={id}>
                        {materials.find((m) => m.id === id)[key] ?? 'No distinct yield'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </>
  );
}
function MaterialNote() {
  return (
    <div className="reference-note">
      <p>
        Values are illustrative room-temperature data, not certified design allowables. Product
        form, heat treatment, direction and temperature change properties. Check supplier
        certificates and the governing material specification before design.
      </p>
      <details>
        <summary>Source references</summary>
        {materialSources.map(([name, url]) => (
          <a key={url} href={url} target="_blank" rel="noreferrer">
            {name}
          </a>
        ))}
      </details>
    </div>
  );
}

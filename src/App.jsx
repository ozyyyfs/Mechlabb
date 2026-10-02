import { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import {
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Command,
  ChevronRight,
  PanelLeftClose,
  Settings2,
  Bookmark,
  History,
  LayoutDashboard,
  Calculator,
  Layers3,
} from 'lucide-react';
import { navigation } from './data/navigation.js';
import { calculators } from './calculators/registry.js';
import { useLab } from './hooks/useLab.js';
import { registerEngineeringTools } from './services/webmcp.js';
import {
  Card,
  PageHeading,
  EmptyState,
  BookmarkButton,
  Button,
  Toast,
  ErrorBoundary,
  LoadingState,
} from './components/UI.jsx';
import GlobalSearch from './components/GlobalSearch.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Calculators from './pages/Calculators.jsx';
import Converter from './pages/Converter.jsx';
import Materials from './pages/Materials.jsx';
import Library from './pages/Library.jsx';
import BeamLab from './pages/BeamLab.jsx';
import Standards from './pages/Standards.jsx';
const Quiz = lazy(() => import('./pages/Quiz.jsx'));
const Charts = lazy(() => import('./charts/Charts.jsx'));
const Visualizer = lazy(() => import('./three/EngineViewer.jsx'));
const Troubleshooting = lazy(() => import('./pages/Troubleshooting.jsx'));
const parseRoute = () => {
  try {
    return decodeURIComponent(location.hash.replace(/^#\/?/, '') || 'dashboard');
  } catch {
    return 'not-found';
  }
};
export default function App() {
  useEffect(() => registerEngineeringTools(document.modelContext), []);
  const lab = useLab(),
    [route, setRoute] = useState(parseRoute),
    [mobile, setMobile] = useState(false),
    [search, setSearch] = useState(null);
  const [page, selected] = route.split('/'),
    nav = navigation.find((n) => n.id === page),
    NavIcon = nav?.icon;
  const navigate = useCallback((value) => {
    location.hash = '/' + value;
    setMobile(false);
  }, []);
  const closeSearch = useCallback(() => setSearch(null), []);
  useEffect(() => {
    if (!mobile) return;
    const sidebar = document.querySelector('.sidebar'),
      prior = document.activeElement,
      old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sidebar?.querySelector('button.mobile-close')?.focus();
    const trap = (e) => {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(sidebar?.querySelectorAll('a,button') || []),
        first = focusable[0],
        last = focusable.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', trap);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener('keydown', trap);
      prior?.focus();
    };
  }, [mobile]);
  useEffect(() => {
    const onHash = () => {
      setRoute(parseRoute());
      setMobile(false);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = lab.theme;
    document.documentElement.style.colorScheme = lab.theme;
  }, [lab.theme]);
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearch('');
      }
      if (e.key === 'Escape') setMobile(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  useEffect(() => {
    document.title = `${nav?.name || 'Not found'} · MECHLAB`;
  }, [page]);
  const showPage = () => {
    if (page === 'dashboard') return <Dashboard lab={lab} openSearch={setSearch} />;
    if (page === 'calculators')
      return <Calculators selected={selected} lab={lab} navigate={navigate} />;
    if (page === 'converter') return <Converter />;
    if (page === 'materials') return <Materials selected={selected} lab={lab} />;
    if (['machines', 'manufacturing', 'drawing', 'formulas', 'projects'].includes(page))
      return <Library key={page} kind={page} selected={selected} lab={lab} />;
    if (page === 'beamlab') return <BeamLab lab={lab} />;
    if (page === 'standards') return <Standards lab={lab} />;
    if (page === 'quizzes') return <Quiz lab={lab} />;
    if (page === 'charts') return <Charts />;
    if (page === 'visualizer') return <Visualizer lab={lab} />;
    if (page === 'troubleshooting') return <Troubleshooting />;
    if (['favorites', 'activity'].includes(page)) {
      const list = page === 'favorites' ? lab.favorites : lab.activity;
      return (
        <>
          <PageHeading
            title={nav.name}
            description={
              page === 'favorites'
                ? 'Your personal collection of tools and references.'
                : 'Your last 20 viewed tools, references and quiz attempts.'
            }
          >
            {page === 'activity' && list.length > 0 && (
              <Button variant="secondary" onClick={lab.clearActivity}>
                Clear activity
              </Button>
            )}
          </PageHeading>
          {list.length ? (
            <div className="grid three">
              {list.map((item) => (
                <Card className="padded" key={item.key}>
                  <div className="card-top">
                    <span className="tile-icon">
                      {page === 'favorites' ? <Bookmark /> : <History />}
                    </span>
                    {page === 'favorites' && <BookmarkButton item={item} lab={lab} />}
                  </div>
                  <span className="meta">{item.type}</span>
                  <h3>
                    <a href={`#/${item.route}`}>{item.name}</a>
                  </h3>
                  {item.time && <p>{new Date(item.time).toLocaleString()}</p>}
                  {item.score !== undefined && (
                    <p>
                      Last score: {item.score}/{item.total}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title={page === 'favorites' ? 'Your library is ready to grow' : 'No activity yet'}
              description={
                page === 'favorites'
                  ? 'Save a calculator, material, machine, formula or project using its bookmark icon.'
                  : 'Explore a calculator, material, machine or quiz to start your history.'
              }
            />
          )}
        </>
      );
    }
    return (
      <>
        <PageHeading title="Page not found" description="This workspace address does not exist." />
        <a className="button primary" href="#/dashboard">
          Return to dashboard
        </a>
      </>
    );
  };
  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main-content').focus();
        }}
      >
        Skip to content
      </a>
      {mobile && <div className="drawer-scrim" onClick={() => setMobile(false)} />}
      <aside className={`sidebar ${mobile ? 'open' : ''}`} aria-label="Main navigation">
        <a className="brand" href="#/dashboard">
          <span className="brand-mark">
            <Settings2 size={24} />
          </span>
          <span>
            MECH<span className="brand-light">LAB</span>
            <small>ENGINEERING WORKSPACE</small>
          </span>
        </a>
        <button
          className="icon-button mobile-close"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        >
          <X />
        </button>
        <nav>
          {['Workspace', 'Explore & learn', 'Your library'].map((group) => (
            <div className="nav-group" key={group}>
              <span className="nav-label">{group}</span>
              {navigation
                .filter((n) => n.group === group)
                .map((n) => {
                  const Icon = n.icon;
                  return (
                    <a
                      className={page === n.id ? 'active' : ''}
                      href={`#/${n.id}`}
                      key={n.id}
                      aria-current={page === n.id ? 'page' : undefined}
                      onClick={() => setMobile(false)}
                    >
                      <Icon size={18} />
                      <span>{n.name}</span>
                      {n.id === 'calculators' && <em>{calculators.length}</em>}
                    </a>
                  );
                })}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="small-brand">MECHLAB</span>
          <p>
            Explore. Calculate.
            <br />
            Understand. Build.
          </p>
          <span className="meta">YOUR IDEAS, ENGINEERED.</span>
        </div>
      </aside>
      <div className="app-body">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button hamburger"
              aria-label="Open navigation"
              aria-expanded={mobile}
              onClick={() => setMobile(true)}
            >
              <Menu />
            </button>
            <a className="topbar-brand" href="#/dashboard" aria-label="MECHLAB home">
              <span className="brand-mark">
                <Settings2 size={18} />
              </span>
            </a>
            <div className="topbar-title">
              {NavIcon && (
                <span className="topbar-icon">
                  <NavIcon size={19} />
                </span>
              )}
              <div className="topbar-text">
                <span className="topbar-eyebrow">
                  {nav?.group || 'MECHLAB'}
                  {selected && <span className="crumb-detail"> · {selected.replaceAll('-', ' ')}</span>}
                </span>
                <strong>{nav?.name || 'Not found'}</strong>
              </div>
            </div>
          </div>
          <div className="topbar-actions">
            <button
              className="top-search"
              onClick={() => setSearch('')}
              aria-label="Search MECHLAB"
            >
              <Search size={17} />
              <span>Search anything</span>
              <kbd>⌘ K</kbd>
            </button>
            <button
              className="icon-button theme-toggle"
              onClick={lab.toggleTheme}
              aria-label={`Switch to ${lab.theme === 'dark' ? 'light' : 'dark'} theme`}
              title="Toggle theme"
            >
              {lab.theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            </button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} key={page} className="main-content">
          <ErrorBoundary key={route}>
            <Suspense fallback={<LoadingState />}>{showPage()}</Suspense>
          </ErrorBoundary>
        </main>
        <footer className="footer">
          <span>© {new Date().getFullYear()} MECHLAB · Explore. Calculate. Understand. Build.</span>
          <span>Educational tools · SI-first engineering</span>
        </footer>
      </div>
      <nav className="bottom-nav" aria-label="Quick navigation">
        {[
          ['dashboard', 'Home', LayoutDashboard],
          ['calculators', 'Calculate', Calculator],
          ['materials', 'Materials', Layers3],
        ].map(([id, label, Icon]) => (
          <a key={id} href={`#/${id}`} className={page === id ? 'active' : ''} aria-current={page === id ? 'page' : undefined}>
            <Icon size={21} />
            <span>{label}</span>
          </a>
        ))}
        <button onClick={() => setSearch('')} aria-label="Search MECHLAB">
          <Search size={21} />
          <span>Search</span>
        </button>
        <button onClick={() => setMobile(true)} aria-label="Open navigation">
          <Menu size={21} />
          <span>Menu</span>
        </button>
      </nav>
      {search !== null && (
        <GlobalSearch initial={search} onClose={closeSearch} navigate={navigate} />
      )}
      <Toast toast={lab.toast} onDismiss={() => lab.setToast(null)} />
    </>
  );
}

# MECHLAB

**Explore. Calculate. Understand. Build.**

A fully coded, responsive mechanical-engineering learning workspace built with React, Vite, Tailwind CSS, Lucide, Three.js and Recharts. No CMS, accounts, external APIs or paid services are required.

## Run locally

Install **Node.js 22.12+** (or Node 24 LTS). In this folder:

```bash
npm install
npm run dev
```

Open the local address printed by Vite, normally `http://127.0.0.1:5173`.

For a reproducible installation with the included lockfile, use **pnpm 11+**:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Production build and local production preview:

```bash
npm run build
npm run preview
```

The ZIP also contains a verified `dist/` build. Serve that directory over HTTP; opening `index.html` directly with `file://` does not support the module assets. Deploy `dist/` to a static host at the domain root. Hash-based routes work without server rewrites. To host under a subdirectory, set Vite's `base` and rebuild.

## Included features

- 52 calculators with labeled units, validation, formulas, variable definitions, actual numeric substitutions, reset controls and engineering notes.
- 16 unit-conversion categories, including explicitly distinguished US/Imperial gallons and mechanical/metric horsepower.
- 10 metal records, searchable and filterable, with 2–4-material comparisons and grade/condition information.
- 7 machine guides with selectable component explanations.
- Interactive Three.js four-stroke engine: linked slider-crank motion, rotate/zoom/pan, picking, component visibility, camera reset, stroke selection and variable animation speed.
- 10 manufacturing guides and 16 drawing/GD&T references, including 11 requested controls and conceptual diagrams.
- 6 interactive engineering charts with inspection, brush zoom, legend toggles and reset.
- Guided troubleshooting for a pump, gearbox, compressor and lathe, with branching observations and appropriate safety context.
- 32 explained quiz questions across 8 disciplines and 3 difficulty levels, with per-question timer, score, progress, review and restart.
- 42 searchable formula references and 11 project ideas.
- Categorized global search (`Ctrl/Cmd+K`), persistent light/dark themes, local bookmarks and the last 20 activities.
- Mobile navigation drawer, responsive tables, focus styles, keyboard-operable controls, reduced-motion support, modal focus management, notifications, loading, empty and recovery states.

## Engineering scope

MECHLAB is an educational application, not certified design software. Each calculator states its assumptions. Inputs use the labeled units; the converter is separate to keep dimensional choices explicit. Displayed results are rounded to seven significant digits.

Material data are representative at room temperature and depend on grade, temper, product form and supplier. Gray cast iron has no invented yield strength. References are linked inside the app. Obtain certified supplier data and applicable specifications for real designs.

The stress–strain, S–N and Fe–Fe₃C diagrams are explicitly illustrative. The Moody chart solves Colebrook–White in the turbulent range and omits the uncertain transition region. The psychrometric curves use a Magnus saturation-pressure approximation. The Mollier-style chart is an ideal-vapor teaching model without a saturation dome, not IAPWS steam-table data. These limits are visible beside each chart.

Concentricity and symmetry are marked as legacy ASME controls removed from Y14.5-2018. Drawing diagrams are conceptual rather than normative inspection specifications. The engine uses idealized valve timing, not a real combustion or performance model.

Troubleshooting identifies possible causes, not guaranteed diagnoses. Project budgets are illustrative USD parts ranges and project descriptions are learning briefs, not fabrication instructions.

## Architecture

```text
src/
  App.jsx                  Navigation shell and hash-route dispatch
  main.jsx                 React entry
  calculators/             Validated formula registry and worked steps
  charts/                  Chart models and lazy-loaded Recharts workspace
  components/              Shared UI and categorized search
  data/                    Engineering content, navigation and quiz bank
  hooks/                   Theme, bookmark, activity and toast state
  pages/                   Feature workspaces
  services/repository.js   Storage adapter
  styles/                  Theme tokens and responsive design
  three/                   Lazy-loaded model and pure kinematics
public/                    Brand favicon
tests/                     Numeric tests and browser regression suite
```

No backend is needed for this version: all engineering content is shipped with the app and user data are explicitly device-local. `src/services/repository.js` is the storage boundary for future persistence. For accounts and cross-device sync, replace the local adapter with an authenticated HTTP repository, then implement a Node/Express API backed by PostgreSQL or MongoDB. Do not put database credentials in frontend code. No `.env` is needed for the current app.

Theme, bookmarks and activity are stored under `mechlab:*` keys in localStorage. Clearing browser site data removes them. Storage errors show a notification and degrade to session-only state.

In browsers supporting the proposed WebMCP interface, the app optionally exposes two read-only tools using the same calculator and converter engines. Unsupported browsers simply skip registration. These tools do not modify saved or visible state.

## Verification

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

If Microsoft Edge is already installed, it can be used without downloading Chromium:

```powershell
$env:MECHLAB_BROWSER_CHANNEL = 'msedge'
npm run test:e2e
```

The browser suite checks all content detail routes, all 52 calculator forms, search, material filters/comparison, storage, themes, quizzes, troubleshooting, charts, engine controls and overflow at 320, 375, 390, 414, 768, 1024, 1440 and 1920 px. See `VERIFICATION.md` for the actual delivery checks and limits.

`npm run format` formats the source with Prettier. Production and development use Vite's native config loader for compatibility with restricted Windows environments.

## Deployment and performance

Heavy chart, quiz, diagnostic and Three.js views are loaded on demand. The engine caps device pixel ratio at 2 and disposes its resources when leaving the route. No network calls are required after the app assets load. Use HTTPS, compressed static assets and long-lived caching for hashed assets in production. WebGL is required for the 3D model; if unavailable, the app retains the explanatory controls and shows a clear error.

Browser support: current evergreen Chromium, Firefox and Safari with WebGL. Automated delivery verification uses Chromium/Edge; other engines require their own acceptance pass.

## Engine Designer

Open Engine Designer from the dashboard or navigation (`#/engine-designer`). It is a concept specification workspace, not manufacturing CAD.

- 68 editable settings across architecture, block/pistons, crank/bearings, head/valves, air/fuel, cooling/oil and performance.
- Inline, V and boxer layouts, 1–16 cylinders within supported counts; generic petrol/diesel/turbo presets.
- Parametric assembly preview with orbit, zoom, cutaway, exploded view, moving pistons and subsystem visibility. Preview animation is schematic and does not simulate the specified firing order, valve timing or combustion. Only key geometry controls affect the meshes; remaining specifications are kept in JSON and the report.
- Up to 100 custom component specification entries for dimensions, materials, clearances and assembly notes.
- Displacement, assumed-BMEP torque/power, mean piston speed, clearance volume, rod/stroke ratio and intake volume flow. Boost is recorded and does not independently predict power. Capture a baseline to compare power as assumptions change.
- Explicit device save/load, versioned JSON import/export and a text specification report. Unsaved edits are not automatically restored after reload. A new design leaves the saved device copy intact.
- Fixed mobile app shell. The designer uses paged fields and tabs without page scrolling; longer existing reference pages remain accessible through the main panel's internal scroll.

Use factory specifications to describe a particular vehicle engine. Generic presets are not verified factory data. Production design still requires detailed CAD, tolerance stacks, thermal/stress analysis, lubrication/combustion validation and physical testing.

Run `pnpm install`, `pnpm dev` for development or `pnpm build`, `pnpm preview` for the production build. The included `dist/` can be served by a static HTTP host with relative asset paths. Do not open `dist/index.html` directly through the file protocol.

# Delivery verification

Verified on **2 October 2026** using Node.js 24, Vite 7 and headless Microsoft Edge through Playwright on Windows.

## Results

- Production build: **passed**; all source modules compile and hashed assets are generated in `dist/`.
- Reproducible `pnpm install --frozen-lockfile --offline`: **passed** using the populated package cache. The dependency lockfile and explicit esbuild build permission are included.
- Numerical and data tests: **103 passed**, no failures.
- Browser regression suite: **10 passed**, no failures.
- Targeted final checks after the drawing-diagram and modal-focus refinements: search/modal behavior, every reference detail route, and responsive layouts checked again.
- Visual review: desktop dashboard and engine; phone dashboard, engine and calculator; dark-theme charts and calculator.
- No page exceptions or browser console errors in the passing browser suite or visual audit.

## Coverage

Calculator references cover all 39 formulas against independently specified expected results. Every input is checked for empty, non-finite and oversized values; nonnegative domains and all strict-positive denominators are tested. Additional checks cover impossible efficiencies, Carnot reservoir ordering, discrete gear teeth, bearing exponents and signed acceleration.

All 16 converter categories are tested across every unit-pair round trip, alongside independent reference values for inch/mm, pressure, torque, horsepower, absolute temperature and US gallon flow.

The slider-crank test verifies a fixed connecting-rod length throughout two crankshaft turns and the piston stroke at the dead centers. Chart tests check laminar Darcy friction, an independently specified turbulent friction result and humidity ratio. Quiz-bank integrity and material condition labeling are checked.

Browser tests exercise all 39 calculator forms and every material, machine, manufacturing, drawing, formula and project detail route. They cover categorized search and empty results, modal dismissal, material search/filter/comparison, bookmark addition/removal and reload persistence, unit swapping, dark-mode reload persistence, recent activity, quiz scoring/restart/history, troubleshooting branches, all six charts, engine animation and controls, and the mobile drawer.

Overflow checks cover **320, 375, 390, 414, 768, 1024, 1440 and 1920 px**, across dashboard, Bernoulli calculator, materials, converter, charts, engine, quizzes and position drawing views.

## Practical limits

Automated delivery tests use Edge/Chromium. Firefox, Safari, actual touch hardware, screen-reader combinations and a formal accessibility audit were not part of this run. Keyboard focus styles, modal focus management and reduced-motion behavior are implemented; this is not a WCAG certification.

Optional WebMCP tool registration and valid/error execution are tested with a registry harness. The browser used here does not expose a supported `document.modelContext`; native WebMCP integration validation is therefore unavailable. Ordinary app functionality does not depend on it.

Engineering model limitations and material-data conditions are stated in the UI and README. The phase, fatigue and stress–strain plots are illustrative, the Mollier-style plot uses an ideal-vapor model, and the engine uses idealized valve timing. No laboratory validation or certified design-data audit is implied.

The app stores preferences, bookmarks and activity locally; no backend, account system or database is required for this version. The repository adapter provides the boundary for later server persistence.

# Engine Designer verification — 2026-10-02

- Production build: passed with Vite.
- Unit tests: 132 passed, 0 failed. Includes independent displacement/torque/power references, preset validation and JSON import safety/roundtrip checks.
- Engine Designer browser tests: 7 passed in Microsoft Edge. Editing, invalid inputs, save/load, custom part persistence and JSON download were exercised.
- Fixed-screen checks: 320x568, 390x844, 768x1024, 844x390 landscape and 1440x900. All five tabs fit without document or panel overflow. Every subsystem field page was also checked at 320x568.
- Existing app browser regression checks completed successfully for dashboard/search, all calculators, content routes, persistence, converter/theme, quizzes, troubleshooting, charts, original engine lab and responsive horizontal overflow.
- Mobile and desktop preview screenshots were visually inspected; the camera now fits the assembly to the viewport's horizontal/vertical field of view.

Known scope: concept geometry and recorded specifications only. Firing order and valve timing notes are not used by the schematic animation. Text-only custom parts do not create meshes. Performance is based on assumed BMEP/VE and is not a measured or calibrated simulation. No manufacturing CAD, FEA, machining tolerances validation or emissions certification is generated.

The ZIP includes editable source and built dist assets. node_modules, temporary QA scripts, browser traces and local test logs are excluded.

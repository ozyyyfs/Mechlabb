const n = (key, label, value, min, max, step = 1) => ({
  key,
  label,
  value,
  min,
  max,
  step,
  type: 'number',
});
const s = (key, label, value, options) => ({ key, label, value, options, type: 'select' });
const t = (key, label, value = '') => ({ key, label, value, type: 'text' });
export const sections = [
  {
    name: 'Architecture',
    fields: [
      t('name', 'Design name', 'My 2.0L concept'),
      t('vehicle', 'Vehicle / application', 'Custom car'),
      s('layout', 'Cylinder layout', 'Inline', ['Inline', 'V', 'Boxer']),
      s('cylinders', 'Cylinders', 4, [1, 2, 3, 4, 6, 8, 10, 12, 16]),
      s('fuel', 'Fuel', 'Petrol', ['Petrol', 'Diesel', 'Ethanol', 'LPG', 'Hydrogen']),
      s('cycle', 'Cycle', 'Four-stroke', ['Four-stroke', 'Two-stroke']),
      n('bankAngle', 'V bank angle (°)', 60, 15, 120),
      t('firing', 'Firing order', '1-3-4-2'),
    ],
  },
  {
    name: 'Block & pistons',
    fields: [
      n('bore', 'Bore (mm)', 86, 30, 180, 0.1),
      n('stroke', 'Stroke (mm)', 86, 30, 200, 0.1),
      n('compression', 'Compression ratio', 10, 5, 25, 0.1),
      n('rod', 'Connecting rod (mm)', 145, 60, 350, 0.1),
      n('spacing', 'Bore spacing (mm)', 96, 35, 220, 0.1),
      n('deck', 'Deck height (mm)', 220, 80, 450, 0.1),
      n('pin', 'Wrist pin diameter (mm)', 22, 10, 50, 0.1),
      n('rings', 'Piston rings', 3, 1, 5),
      s('blockMaterial', 'Block material', 'Aluminium', [
        'Aluminium',
        'Cast iron',
        'Compacted graphite iron',
      ]),
      s('pistonMaterial', 'Piston material', 'Forged aluminium', [
        'Forged aluminium',
        'Cast aluminium',
        'Steel',
      ]),
      n('pistonClearance', 'Piston clearance (mm)', 0.04, 0.01, 0.3, 0.01),
      n('ringGap', 'Ring end gap (mm)', 0.3, 0.1, 1.5, 0.01),
    ],
  },
  {
    name: 'Crank & bearings',
    fields: [
      s('crankMaterial', 'Crankshaft material', 'Forged steel', [
        'Forged steel',
        'Cast iron',
        'Billet steel',
      ]),
      n('mainJournal', 'Main journal (mm)', 55, 20, 100, 0.1),
      n('rodJournal', 'Rod journal (mm)', 48, 20, 90, 0.1),
      n('bearingClearance', 'Bearing clearance (mm)', 0.04, 0.01, 0.2, 0.01),
      n('flywheel', 'Flywheel mass (kg)', 8, 1, 40, 0.1),
      t('balance', 'Balance / counterweight notes'),
      t('bearing', 'Bearing specification', 'Tri-metal'),
      t('crankNotes', 'Crankshaft & fastener details'),
    ],
  },
  {
    name: 'Head & valves',
    fields: [
      s('cam', 'Cam arrangement', 'DOHC', ['OHV', 'SOHC', 'DOHC']),
      s('valves', 'Valves per cylinder', 4, [2, 3, 4, 5]),
      n('intakeValve', 'Intake valve diameter (mm)', 34, 10, 60, 0.1),
      n('exhaustValve', 'Exhaust valve diameter (mm)', 29, 10, 60, 0.1),
      n('lift', 'Valve lift (mm)', 10, 2, 20, 0.1),
      n('duration', 'Cam duration (° crank)', 240, 150, 330),
      n('overlap', 'Valve overlap (°)', 25, 0, 120),
      s('timing', 'Timing drive', 'Chain', ['Chain', 'Belt', 'Gear']),
      s('vvt', 'Variable valve timing', 'Dual VVT', ['None', 'Intake VVT', 'Dual VVT']),
      t('headGasket', 'Head gasket thickness / specification', '1.0 mm MLS'),
      t('ports', 'Port / chamber details'),
      t('headBolts', 'Head bolts / torque procedure'),
    ],
  },
  {
    name: 'Air & fuel',
    fields: [
      s('aspiration', 'Aspiration', 'Naturally aspirated', [
        'Naturally aspirated',
        'Turbocharged',
        'Supercharged',
      ]),
      n('boost', 'Gauge boost (bar)', 0, 0, 4, 0.05),
      n('throttle', 'Throttle diameter (mm)', 60, 20, 140),
      s('injection', 'Injection system', 'Port injection', [
        'Carburettor',
        'Port injection',
        'Direct injection',
        'Common rail',
      ]),
      n('fuelPressure', 'Fuel pressure (bar)', 3, 1, 2500, 0.1),
      n('injector', 'Injector flow (cc/min)', 250, 50, 3000),
      n('afr', 'Target air / fuel mass ratio', 14.7, 5, 50, 0.1),
      n('runner', 'Intake runner length (mm)', 300, 50, 1000),
      s('intercooler', 'Intercooler', 'None', ['None', 'Air-to-air', 'Water-to-air']),
      t('turbo', 'Turbo / compressor specification'),
      t('ecu', 'ECU & ignition details'),
      t('exhaust', 'Exhaust manifold / catalyst details'),
    ],
  },
  {
    name: 'Cooling & oil',
    fields: [
      s('cooling', 'Cooling system', 'Liquid', ['Liquid', 'Air']),
      n('coolant', 'Coolant capacity (L)', 6, 0, 40, 0.1),
      n('thermostat', 'Thermostat opening (°C)', 88, 50, 120),
      n('oilCapacity', 'Oil capacity (L)', 4.5, 1, 30, 0.1),
      s('sump', 'Oil system', 'Wet sump', ['Wet sump', 'Dry sump']),
      t('oilGrade', 'Oil grade', '5W-30'),
      n('oilPressure', 'Target oil pressure (bar)', 4, 1, 12, 0.1),
      t('pump', 'Pump / radiator specification'),
    ],
  },
  {
    name: 'Performance',
    fields: [
      n('rpm', 'Design speed (RPM)', 6000, 500, 16000, 100),
      n('redline', 'Redline (RPM)', 7000, 1000, 18000, 100),
      n('bmep', 'Assumed BMEP (bar)', 12, 1, 40, 0.1),
      n('ve', 'Assumed volumetric efficiency (%)', 90, 20, 150),
      t('target', 'Performance target notes'),
      t('emissions', 'Emissions / certification target'),
      t('mounts', 'Engine mounts / packaging details'),
      t('ancillaries', 'Starter / alternator / accessory details'),
    ],
  },
];
export const defaults = Object.fromEntries(
  sections.flatMap((x) => x.fields.map((f) => [f.key, f.value])),
);
export const presets = {
  '2.0L inline four': {},
  '3.0L turbo inline six': {
    name: '3.0L turbo six concept',
    cylinders: 6,
    bore: 86,
    stroke: 86,
    aspiration: 'Turbocharged',
    boost: 1,
    compression: 9.5,
    bmep: 20,
    firing: '1-5-3-6-2-4',
    intercooler: 'Air-to-air',
  },
  '5.0L V8': {
    name: '5.0L V8 concept',
    layout: 'V',
    cylinders: 8,
    bankAngle: 90,
    bore: 93,
    stroke: 92,
    spacing: 103,
    rod: 155,
    deck: 235,
    firing: '1-8-4-3-6-5-7-2',
  },
  '2.0L boxer four': {
    name: '2.0L boxer concept',
    layout: 'Boxer',
    cylinders: 4,
    bore: 92,
    stroke: 75,
    spacing: 102,
    firing: '1-3-2-4',
  },
  '2.2L diesel': {
    name: '2.2L diesel concept',
    fuel: 'Diesel',
    bore: 86,
    stroke: 94,
    compression: 17,
    aspiration: 'Turbocharged',
    boost: 1.2,
    injection: 'Common rail',
    fuelPressure: 1600,
    rpm: 4000,
    redline: 5000,
    bmep: 18,
    afr: 22,
  },
};
export function validateDesign(d) {
  const issues = [];
  for (const f of sections.flatMap((s) => s.fields)) {
    if (
      f.type === 'number' &&
      (d[f.key] === '' ||
        !Number.isFinite(Number(d[f.key])) ||
        Number(d[f.key]) < f.min ||
        Number(d[f.key]) > f.max)
    )
      issues.push(`${f.label}: enter ${f.min}–${f.max}.`);
    if (f.type === 'select' && !f.options.some((v) => String(v) === String(d[f.key])))
      issues.push(`${f.label}: select a valid option.`);
  }
  if (d.layout !== 'Inline' && Number(d.cylinders) % 2)
    issues.push('V and boxer layouts need an even cylinder count.');
  if (Number(d.rod) <= Number(d.stroke) / 2)
    issues.push('Rod length must exceed the crank radius.');
  if (Number(d.spacing) <= Number(d.bore)) issues.push('Bore spacing must exceed bore diameter.');
  if (Number(d.redline) < Number(d.rpm)) issues.push('Redline must be at least the design speed.');
  if (Number(d.deck) < Number(d.rod) + Number(d.stroke) / 2)
    issues.push(
      'Deck height is below rod length + crank radius; review piston compression height.',
    );
  return issues;
}
export function metrics(d) {
  const displacement =
    ((Math.PI / 4) * Number(d.bore) ** 2 * Number(d.stroke) * Number(d.cylinders)) / 1e6;
  const torque =
    (Number(d.bmep) * 1e5 * (displacement / 1000)) / (d.cycle === 'Four-stroke' ? 4 : 2) / Math.PI;
  return {
    displacement,
    torque,
    power: (torque * Number(d.rpm) * 2 * Math.PI) / 60 / 1000,
    pistonSpeed: (((2 * Number(d.stroke)) / 1000) * Number(d.rpm)) / 60,
    clearance: (displacement * 1000) / Number(d.cylinders) / (Number(d.compression) - 1),
    rodRatio: Number(d.rod) / Number(d.stroke),
    airFlow:
      (((displacement * Number(d.rpm)) / (d.cycle === 'Four-stroke' ? 2 : 1)) * Number(d.ve)) / 100,
  };
}
export function decodeDesign(raw) {
  if (!raw || raw.version !== 1 || !raw.design || typeof raw.design !== 'object')
    throw new Error('Use a MECHLAB Engine Designer v1 JSON file.');
  const design = { ...defaults };
  for (const f of sections.flatMap((s) => s.fields))
    if (Object.hasOwn(raw.design, f.key)) {
      const v = raw.design[f.key];
      if (f.type === 'number') design[f.key] = typeof v === 'number' ? v : NaN;
      else if (f.type === 'select') design[f.key] = v;
      else {
        if (typeof v !== 'string' || v.length > 2000) throw new Error('Invalid text field.');
        design[f.key] = v;
      }
    }
  const issues = validateDesign(design);
  if (issues.length) throw new Error(issues[0]);
  const parts = Array.isArray(raw.parts)
    ? raw.parts
        .slice(0, 100)
        .map((p) => ({
          name: String(p.name || '').slice(0, 120),
          spec: String(p.spec || '').slice(0, 2000),
        }))
    : [];
  return { design, parts };
}

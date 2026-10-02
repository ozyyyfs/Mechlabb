const component = (name, description) => ({ name, description });
export const machines = [
  {
    id: 'engine',
    name: 'Internal Combustion Engine',
    category: 'Power systems',
    overview:
      'A reciprocating engine converts the chemical energy of fuel into mechanical shaft work. The four-stroke spark-ignition cycle takes two crankshaft revolutions.',
    principle:
      'The piston draws in a charge, compresses it, receives work from combustion, then pushes exhaust gases out. A connecting rod and crankshaft convert reciprocation to rotation.',
    components: [
      component(
        'Piston',
        'Moves in the cylinder, compresses the charge and receives combustion force.',
      ),
      component(
        'Cylinder',
        'Guides the piston and contains the pressure; cooling removes rejected heat.',
      ),
      component(
        'Connecting Rod',
        'Transfers piston force to the crankpin, alternating tension and compression.',
      ),
      component('Crankshaft', 'Converts rod motion into torque and carries rotating journals.'),
      component('Intake Valve', 'Opens during intake to admit the fresh charge.'),
      component('Exhaust Valve', 'Opens during exhaust to release combustion products.'),
      component(
        'Spark Plug',
        'Ignites the compressed air–fuel mixture in a spark-ignition engine.',
      ),
    ],
    applications: ['Vehicles', 'Generator sets', 'Small power equipment'],
    advantages: ['High power density', 'Portable fuel supply'],
    disadvantages: ['Emissions and noise', 'Waste heat and moving-part wear'],
    failures: ['Overheating', 'Loss of compression', 'Bearing wear', 'Ignition faults'],
    maintenance: [
      'Follow the manufacturer’s oil and filter intervals.',
      'Inspect cooling, belt condition and air filtration.',
      'Investigate unusual noise or temperature before operation.',
    ],
  },
  {
    id: 'lathe',
    name: 'Lathe',
    category: 'Machine tools',
    overview:
      'A lathe rotates a workpiece while a cutting tool removes material to create axisymmetric features.',
    principle:
      'The spindle supplies cutting motion; carriage and cross-slide feed the tool along or across the workpiece. Turning, facing, boring and threading use different tool paths.',
    components: [
      component('Headstock', 'Supports and drives the spindle.'),
      component('Chuck', 'Clamps the workpiece concentrically.'),
      component('Carriage', 'Moves the tool parallel to the bed.'),
      component('Cross-slide', 'Controls radial tool position.'),
      component('Tailstock', 'Supports long workpieces or holds axial tools.'),
    ],
    applications: ['Shafts', 'Bushings', 'Threaded parts'],
    advantages: ['Efficient round-part manufacture', 'Many operations in one setup'],
    disadvantages: ['Primarily rotational geometry', 'Slender parts may deflect'],
    failures: ['Chatter', 'Chuck runout', 'Slide wear'],
    maintenance: [
      'Keep ways clean and lubricated.',
      'Check clamping and tool condition before starting.',
      'Never leave a chuck key in the chuck.',
    ],
  },
  {
    id: 'milling-machine',
    name: 'Milling Machine',
    category: 'Machine tools',
    overview:
      'A milling machine removes material with a rotating multi-edge cutter while feeding a restrained workpiece.',
    principle:
      'The cutter’s teeth engage intermittently; controlled motion in X, Y and Z produces slots, faces, pockets and contours.',
    components: [
      component('Spindle', 'Drives and locates the cutter.'),
      component('Table', 'Supports workholding and feed motion.'),
      component('Column', 'Provides structural support.'),
      component('Tool holder', 'Locates and clamps the cutter.'),
      component('Coolant system', 'Controls heat and helps remove chips.'),
    ],
    applications: ['Prismatic parts', 'Tooling', 'Complex surfaces'],
    advantages: ['Flexible geometry', 'High productivity'],
    disadvantages: ['Requires rigid workholding', 'Complex setups and tool wear'],
    failures: ['Chatter', 'Tool breakage', 'Spindle runout'],
    maintenance: [
      'Check lubrication and coolant condition.',
      'Inspect holders and cutter edges.',
      'Remove chips only with the machine safely stopped.',
    ],
  },
  {
    id: 'gearbox',
    name: 'Gearbox',
    category: 'Transmission',
    overview:
      'A gearbox changes rotational speed, torque or direction through meshing gears and supporting shafts.',
    principle:
      'The tooth-count ratio sets speed reduction. Output torque increases with reduction, reduced by mechanical losses.',
    components: [
      component('Gears', 'Transmit torque through meshing tooth contact.'),
      component('Input shaft', 'Receives power from the driver.'),
      component('Output shaft', 'Delivers the transformed speed and torque.'),
      component('Bearings', 'Locate shafts and react loads.'),
      component('Housing', 'Supports alignment and contains lubricant.'),
    ],
    applications: ['Conveyors', 'Vehicles', 'Industrial drives'],
    advantages: ['Compact torque multiplication', 'Predictable speed ratio'],
    disadvantages: ['Noise and lubrication needs', 'Backlash and efficiency losses'],
    failures: ['Tooth pitting', 'Scuffing', 'Bearing damage', 'Seal leaks'],
    maintenance: [
      'Check oil specification and level.',
      'Monitor vibration and lubricant contamination.',
      'Inspect alignment and seals.',
    ],
  },
  {
    id: 'pump',
    name: 'Centrifugal Pump',
    category: 'Fluid systems',
    overview:
      'A centrifugal pump transfers shaft energy to a liquid with a rotating impeller and a pressure-recovery casing.',
    principle:
      'Liquid enters near the impeller eye, gains velocity and angular momentum, then slows in the volute or diffuser to increase pressure.',
    components: [
      component('Impeller', 'Adds energy to the liquid.'),
      component('Volute', 'Collects flow and recovers pressure.'),
      component('Shaft', 'Connects driver torque to the impeller.'),
      component('Mechanical seal', 'Limits leakage at the rotating shaft.'),
      component('Bearings', 'Support and locate the rotor.'),
    ],
    applications: ['Water supply', 'Cooling loops', 'Process liquid transfer'],
    advantages: ['Smooth continuous flow', 'Simple construction'],
    disadvantages: ['Requires adequate suction conditions', 'Efficiency depends on duty point'],
    failures: ['Cavitation', 'Misalignment', 'Seal leakage', 'Bearing wear'],
    maintenance: [
      'Monitor suction conditions and operating point.',
      'Inspect leakage, alignment and vibration.',
      'Isolate and depressurize before maintenance.',
    ],
  },
  {
    id: 'compressor',
    name: 'Compressor',
    category: 'Fluid systems',
    overview:
      'A compressor raises gas pressure using positive displacement or dynamic energy transfer.',
    principle:
      'Reciprocating and screw compressors reduce trapped volume; centrifugal compressors accelerate gas and recover pressure in a diffuser.',
    components: [
      component('Compression element', 'Raises gas pressure by displacement or dynamic action.'),
      component('Motor', 'Supplies shaft work.'),
      component('Inlet filter', 'Reduces contamination.'),
      component('Aftercooler', 'Rejects compression heat.'),
      component('Receiver', 'Buffers pressure and stores compressed gas.'),
    ],
    applications: ['Plant air', 'Refrigeration', 'Gas transport'],
    advantages: ['Enables pneumatic equipment', 'Flexible centralized supply'],
    disadvantages: ['High energy consumption', 'Heat, noise and condensate'],
    failures: ['Overheating', 'Air leaks', 'Oil carryover', 'Valve wear'],
    maintenance: [
      'Inspect filters and approved condensate drains.',
      'Monitor temperature and pressure.',
      'Service pressure systems only after isolation and depressurization.',
    ],
  },
  {
    id: 'steam-turbine',
    name: 'Steam Turbine',
    category: 'Power systems',
    overview:
      'A steam turbine extracts work from expanding steam through stationary and rotating blade rows.',
    principle:
      'Nozzles or stator blades accelerate and direct steam; rotor blades change its momentum and generate shaft torque across multiple stages.',
    components: [
      component('Rotor', 'Carries moving blades and transmits torque.'),
      component('Stator', 'Directs steam into rotor stages.'),
      component('Casing', 'Contains steam and locates stationary parts.'),
      component('Governor', 'Regulates steam admission and speed.'),
      component('Bearings', 'Support the rotor and axial thrust.'),
    ],
    applications: ['Power generation', 'Large process drives', 'Cogeneration'],
    advantages: ['High continuous output', 'Smooth rotation'],
    disadvantages: ['Complex steam plant', 'Poor small-scale economics'],
    failures: ['Blade erosion', 'Rotor imbalance', 'Lubrication faults', 'Overspeed'],
    maintenance: [
      'Monitor vibration, oil quality and steam conditions.',
      'Inspect protection systems per the manufacturer.',
      'Use qualified personnel for high-energy steam systems.',
    ],
  },
];

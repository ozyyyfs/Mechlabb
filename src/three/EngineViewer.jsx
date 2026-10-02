import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Play, Pause, RotateCcw, Box } from 'lucide-react';
import { PageHeading, Card, Button, ErrorMessage } from '../components/UI.jsx';
import { sliderCrank, strokeIndex, strokeNames } from './kinematics.js';
const parts = {
  Piston:
    'The piston travels in the cylinder, compressing the charge and transmitting combustion force to the connecting rod.',
  Cylinder:
    'The translucent cylinder guides the piston and contains the gas. Transparency is used here to reveal the mechanism.',
  'Connecting Rod':
    'The connecting rod joins the piston pin and crankpin. Its inclination changes as the crank rotates.',
  Crankshaft:
    'The rotating crank and offset crankpin convert reciprocating piston motion into shaft rotation.',
  'Intake Valve':
    'The inlet valve is open during the idealized intake stroke, allowing a fresh charge into the cylinder.',
  'Exhaust Valve':
    'The exhaust valve is open during the idealized exhaust stroke, allowing burnt gas to leave.',
  'Spark Plug':
    'In a spark-ignition engine, the spark plug ignites the compressed charge near the end of compression.',
};
const strokeDescriptions = [
  'The piston descends and the intake valve opens to admit the fresh charge.',
  'The piston rises with both valves closed, compressing the charge.',
  'Ignition near top dead center initiates combustion; expanding gas pushes the piston down.',
  'The piston rises while the exhaust valve opens to expel spent gases.',
];
export default function EngineViewer({ lab }) {
  const mount = useRef(null),
    api = useRef(null),
    state = useRef({
      playing: false,
      speed: 1,
      angle: 0,
      visible: Object.fromEntries(Object.keys(parts).map((k) => [k, true])),
    });
  const [playing, setPlaying] = useState(false),
    [speed, setSpeed] = useState(1),
    [stroke, setStroke] = useState(0),
    [selected, setSelected] = useState('Piston'),
    [visible, setVisible] = useState(state.current.visible),
    [error, setError] = useState('');
  useEffect(() => {
    state.current.playing = playing;
    state.current.speed = speed;
    state.current.visible = visible;
  }, [playing, speed, visible]);
  useEffect(() => {
    const host = mount.current;
    let renderer,
      frame,
      controls,
      observer,
      disposed = false,
      last = performance.now(),
      lastStroke = -1;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0d1e30');
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(5, 3.5, 6.5);
    const groups = {},
      meshes = [],
      resources = [];
    const mat = (color, options = {}) => {
      const m = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.35,
        metalness: 0.65,
        ...options,
      });
      resources.push(m);
      return m;
    };
    const steel = mat('#91a7bf'),
      blue = mat('#157cbb'),
      dark = mat('#38516d'),
      cyan = mat('#27c9dd'),
      glass = mat('#75b5d1', {
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
    const add = (part, geometry, material, parent = scene) => {
      resources.push(geometry);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData.part = part;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      meshes.push(mesh);
      return mesh;
    };
    const group = (part) => {
      const g = new THREE.Group();
      scene.add(g);
      groups[part] = g;
      return g;
    };
    const pistonG = group('Piston');
    add('Piston', new THREE.CylinderGeometry(0.69, 0.69, 0.35, 48), steel, pistonG);
    for (const y of [-0.1, 0, 0.1]) {
      const ring = add('Piston', new THREE.TorusGeometry(0.69, 0.025, 8, 48), dark, pistonG);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = y;
    }
    const pistonPin = add('Piston', new THREE.CylinderGeometry(0.1, 0.1, 1.65, 20), dark, pistonG);
    pistonPin.rotation.x = Math.PI / 2;
    const cylinderG = group('Cylinder');
    const cylinder = add(
      'Cylinder',
      new THREE.CylinderGeometry(0.79, 0.79, 2.05, 48, 1, true),
      glass,
      cylinderG,
    );
    cylinder.position.y = 0.7;
    for (const y of [-0.3, 1.7]) {
      const rim = add('Cylinder', new THREE.TorusGeometry(0.79, 0.035, 8, 48), blue, cylinderG);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = y;
    }
    const head = add('Cylinder', new THREE.BoxGeometry(1.95, 0.18, 1.6), dark, cylinderG);
    head.position.y = 1.85;
    const rodG = group('Connecting Rod');
    const rod = add('Connecting Rod', new THREE.CylinderGeometry(0.12, 0.12, 1, 20), steel, rodG);
    const crankG = group('Crankshaft');
    crankG.position.y = -1.5;
    const disk = add('Crankshaft', new THREE.CylinderGeometry(0.81, 0.81, 0.22, 48), blue, crankG);
    disk.rotation.x = Math.PI / 2;
    disk.position.z = -0.25;
    const shaft = add('Crankshaft', new THREE.CylinderGeometry(0.16, 0.16, 1.9, 24), steel, crankG);
    shaft.rotation.x = Math.PI / 2;
    const crankArm = add('Crankshaft', new THREE.BoxGeometry(0.24, 0.65, 0.22), steel, crankG);
    crankArm.position.y = 0.325;
    const crankpin = add(
      'Crankshaft',
      new THREE.CylinderGeometry(0.15, 0.15, 0.65, 24),
      cyan,
      crankG,
    );
    crankpin.rotation.x = Math.PI / 2;
    crankpin.position.y = 0.65;
    const valves = {};
    for (const [name, x, color] of [
      ['Intake Valve', -0.43, '#27c9dd'],
      ['Exhaust Valve', 0.43, '#ed8d57'],
    ]) {
      const g = group(name);
      g.position.set(x, 1.95, 0);
      const m = mat(color);
      add(name, new THREE.CylinderGeometry(0.035, 0.035, 0.65, 16), m, g);
      const cap = add(name, new THREE.CylinderGeometry(0.2, 0.2, 0.055, 24), m, g);
      cap.position.y = -0.3;
      valves[name] = g;
    }
    const sparkG = group('Spark Plug');
    sparkG.position.set(0, 2.08, 0.2);
    add('Spark Plug', new THREE.CylinderGeometry(0.075, 0.075, 0.45, 16), mat('#e5ebef'), sparkG);
    const sparkTip = add(
      'Spark Plug',
      new THREE.SphereGeometry(0.08, 16, 8),
      mat('#ffcb57', { emissive: '#ff8d23', emissiveIntensity: 0.05 }),
      sparkG,
    );
    sparkTip.position.y = -0.25;
    const gasMat = mat('#2aa9dc', {
      transparent: true,
      opacity: 0.13,
      metalness: 0,
      depthWrite: false,
    });
    const gas = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 1, 32), gasMat);
    resources.push(gas.geometry);
    scene.add(gas);
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.15, 2.1), dark);
    resources.push(base.geometry);
    base.position.y = -2.55;
    scene.add(base);
    const grid = new THREE.GridHelper(12, 24, '#2b4d6b', '#18354b');
    grid.position.y = -2.64;
    scene.add(grid);
    scene.add(new THREE.HemisphereLight('#c8e7ff', '#263e59', 2));
    const light = new THREE.DirectionalLight('#fff8e9', 4);
    light.position.set(4, 7, 6);
    scene.add(light);
    const rimLight = new THREE.DirectionalLight('#56cfff', 2);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);
    const resetCamera = () => {
      camera.position.set(5, 3.5, 6.5);
      controls?.target.set(0, 0.05, 0);
      controls?.update();
    };
    const update = (angle) => {
      const k = sliderCrank(angle),
        s = strokeIndex(angle);
      pistonG.position.y = k.pistonY;
      crankG.rotation.z = -angle;
      const bottom = new THREE.Vector3(k.pinX, k.pinY, 0),
        top = new THREE.Vector3(0, k.pistonY, 0),
        diff = top.clone().sub(bottom);
      rod.position.copy(top.clone().add(bottom).multiplyScalar(0.5));
      rod.scale.y = diff.length();
      rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), diff.normalize());
      valves['Intake Valve'].position.y = 1.95 - (s === 0 ? 0.15 * Math.sin(angle % Math.PI) : 0);
      valves['Exhaust Valve'].position.y = 1.95 - (s === 3 ? 0.15 * Math.sin(angle % Math.PI) : 0);
      const gasBottom = k.pistonY + 0.19,
        gasTop = 1.73;
      heightGas(gasBottom, gasTop, s);
      sparkTip.material.emissiveIntensity = s === 2 && angle % Math.PI < 0.25 ? 4 : 0.05;
      for (const [name, g] of Object.entries(groups)) g.visible = state.current.visible[name];
      gas.visible = state.current.visible.Cylinder;
      if (lastStroke !== s) {
        lastStroke = s;
        setStroke(s);
      }
    };
    function heightGas(bottom, top, s) {
      gas.scale.y = Math.max(0.01, top - bottom);
      gas.position.y = (top + bottom) / 2;
      gasMat.color.set(['#2aa9dc', '#b48aee', '#ff8051', '#9ba9b6'][s]);
    }
    let startPointer = null;
    const pointerDown = (e) => {
      startPointer = { x: e.clientX, y: e.clientY };
    };
    const selectPart = (e) => {
      if (!startPointer || Math.hypot(e.clientX - startPointer.x, e.clientY - startPointer.y) > 6)
        return;
      const rect = renderer.domElement.getBoundingClientRect(),
        pointer = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          (-(e.clientY - rect.top) / rect.height) * 2 + 1,
        );
      const ray = new THREE.Raycaster();
      ray.setFromCamera(pointer, camera);
      const hits = ray.intersectObjects(meshes.filter((m) => groups[m.userData.part]?.visible));
      if (hits[0]) setSelected(hits[0].object.userData.part);
    };
    const lost = (e) => {
      e.preventDefault();
      setError('The graphics context was interrupted. Reload this page to restore the 3D viewer.');
    };
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      host.appendChild(renderer.domElement);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.minDistance = 3;
      controls.maxDistance = 14;
      controls.target.set(0, 0.05, 0);
      controls.update();
      observer = new ResizeObserver(() => {
        if (!disposed) {
          const { width, height } = host.getBoundingClientRect();
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      });
      observer.observe(host);
      renderer.domElement.addEventListener('pointerdown', pointerDown);
      renderer.domElement.addEventListener('pointerup', selectPart);
      renderer.domElement.addEventListener('webglcontextlost', lost);
      api.current = {
        resetCamera,
        setAngle(angle) {
          state.current.angle = angle;
          update(angle);
        },
      };
      const render = (t) => {
        if (disposed) return;
        const dt = Math.min((t - last) / 1000, 0.05);
        last = t;
        if (state.current.playing)
          state.current.angle =
            (state.current.angle + dt * state.current.speed * 1.5) % (4 * Math.PI);
        update(state.current.angle);
        controls.update();
        renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
      };
      frame = requestAnimationFrame(render);
    } catch (e) {
      setError(
        '3D graphics could not start on this device. Enable WebGL or try a browser with hardware acceleration. The stroke explanations below remain available.',
      );
    }
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      controls?.dispose();
      if (renderer) {
        renderer.domElement.removeEventListener('pointerdown', pointerDown);
        renderer.domElement.removeEventListener('pointerup', selectPart);
        renderer.domElement.removeEventListener('webglcontextlost', lost);
        renderer.dispose();
        renderer.domElement.remove();
      }
      resources.forEach((r) => r.dispose());
      grid.geometry.dispose();
      if (Array.isArray(grid.material)) grid.material.forEach((m) => m.dispose());
      else grid.material.dispose();
      api.current = null;
    };
  }, []);
  const setStage = (i) => {
    setPlaying(false);
    state.current.playing = false;
    api.current?.setAngle(i * Math.PI + 0.5);
    setStroke(i);
  };
  return (
    <>
      <PageHeading
        eyebrow="THE INTERACTIVE LAB"
        title="Four-stroke engine"
        description="Two revolutions. Four strokes. One elegant conversion of energy."
      />
      <ErrorMessage>{error}</ErrorMessage>
      <div className="engine-layout">
        <div>
          <div className="engine-canvas" ref={mount}>
            <div className="viewer-overlay">
              CURRENT STROKE<strong>{strokeNames[stroke]}</strong>
            </div>
            <div className="viewer-hint">
              Drag to rotate · Scroll / pinch to zoom · Right drag / two fingers to pan · Click a
              component
            </div>
          </div>
          <div className="stroke-tabs">
            {strokeNames.map((name, i) => (
              <button
                key={name}
                className={`stroke-tab ${stroke === i ? 'active' : ''}`}
                aria-pressed={stroke === i}
                onClick={() => setStage(i)}
              >
                <strong>
                  {i + 1}. {name}
                </strong>
                <small>
                  {i * 180}°–{(i + 1) * 180}° crank angle
                </small>
              </button>
            ))}
          </div>
        </div>
        <Card className="padded engine-controls">
          <div>
            <h2>Animation controls</h2>
            <Button onClick={() => setPlaying((p) => !p)} disabled={!!error}>
              {playing ? <Pause size={17} /> : <Play size={17} />}{' '}
              {playing ? 'Pause cycle' : 'Animate cycle'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => api.current?.resetCamera()}
              disabled={!!error}
            >
              <RotateCcw size={17} />
              Reset camera
            </Button>
            <label className="section-space">
              Animation speed · {speed}×
              <input
                type="range"
                min="0.25"
                max="2"
                step="0.25"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              />
            </label>
          </div>
          <div>
            <h3>Show components</h3>
            {Object.keys(parts).map((name) => (
              <label className="check-label" key={name}>
                <input
                  type="checkbox"
                  checked={visible[name]}
                  onChange={(e) => setVisible({ ...visible, [name]: e.target.checked })}
                />
                {name}
              </label>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid two section-space">
        <Card className="padded">
          <span className="eyebrow">{strokeNames[stroke].toUpperCase()} STROKE</span>
          <h2>What happens now?</h2>
          <p>{strokeDescriptions[stroke]}</p>
          <p className="chart-description">
            Idealized valve timing and slider-crank motion. Real engines use valve lead, lag and
            overlap; combustion is a finite-duration process.
          </p>
        </Card>
        <Card className="padded">
          <span className="eyebrow">COMPONENT INSPECTOR</span>
          <label>
            Selected component
            <select value={selected} onChange={(e) => setSelected(e.target.value)}>
              {Object.keys(parts).map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <p className="section-space" aria-live="polite">
            {parts[selected]}
          </p>
        </Card>
      </div>
      <div className="reference-note">
        <p>
          Simplified teaching model, not manufacturing-grade CAD. The visible gas colors identify
          stages, not measured temperatures.
        </p>
        <a
          className="text-link"
          href="https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/compression-stroke/"
          target="_blank"
          rel="noreferrer"
        >
          NASA Glenn — four-stroke cycle reference
        </a>
      </div>
    </>
  );
}

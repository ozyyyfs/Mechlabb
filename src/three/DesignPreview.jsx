import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export default function DesignPreview({ design: d, exploded, cutaway, playing, layer }) {
  const host = useRef(null),
    motion = useRef(playing),
    [error, setError] = useState('');
  useEffect(() => {
    motion.current = playing;
  }, [playing]);
  useEffect(() => {
    const mount = host.current;
    let renderer, controls, observer, frame;
    const resources = [];
    setError('');
    try {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#101c30');
      const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 100);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      mount.appendChild(renderer.domElement);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      scene.add(new THREE.HemisphereLight(0xc7edff, 0x26364e, 3));
      const light = new THREE.DirectionalLight(0xffffff, 4);
      light.position.set(3, 5, 4);
      scene.add(light);
      const assembly = new THREE.Group();
      scene.add(assembly);
      function mesh(geo, color, parent, position, transparent = false) {
        const mat = new THREE.MeshStandardMaterial({
          color,
          metalness: 0.5,
          roughness: 0.35,
          transparent,
          opacity: transparent ? 0.2 : 1,
          depthWrite: !transparent,
        });
        const obj = new THREE.Mesh(geo, mat);
        obj.position.set(...position);
        parent.add(obj);
        resources.push(geo, mat);
        return obj;
      }
      const count = Number(d.cylinders),
        banks = d.layout === 'Inline' ? 1 : 2,
        rows = count / banks;
      const bore = Number(d.bore) / 100,
        stroke = Number(d.stroke) / 100,
        pitch = Number(d.spacing) / 100,
        rodLen = Number(d.rod) / 100;
      const radius = stroke / 2,
        headY = rodLen + radius + 0.6;
      const moving = [];
      const crankParts = [];
      for (let b = 0; b < banks; b++) {
        const bank = new THREE.Group();
        assembly.add(bank);
        bank.rotation.z =
          banks === 1
            ? 0
            : (b === 0 ? 1 : -1) *
              (d.layout === 'Boxer' ? Math.PI / 2 : (Number(d.bankAngle) * Math.PI) / 360);
        for (let i = 0; i < rows; i++) {
          const z = (i - (rows - 1) / 2) * pitch;
          if (layer === 'All' || layer === 'Block')
            mesh(
              new THREE.CylinderGeometry(bore * 0.59, bore * 0.59, headY - 0.3, 32, 1, true),
              0x6597b4,
              bank,
              [0, headY / 2, z],
              cutaway,
            );
          if (layer === 'All' || layer === 'Moving parts') {
            const piston = mesh(
              new THREE.CylinderGeometry(bore * 0.48, bore * 0.48, 0.32, 24),
              0xe0e8ee,
              bank,
              [0, 0, z],
            );
            const rod = mesh(new THREE.CylinderGeometry(0.065, 0.065, 1, 12), 0xe7b865, bank, [
              0,
              0,
              z,
            ]);
            moving.push({ piston, rod, z, phase: ((i + b * rows) * Math.PI * 2) / count });
          }
          if (layer === 'All' || layer === 'Head') {
            const offset = exploded ? 0.7 : 0;
            mesh(new THREE.BoxGeometry(bore * 1.17, 0.28, pitch * 0.94), 0x94aabb, bank, [
              0,
              headY + offset,
              z,
            ]);
            for (let v = 0; v < (d.cycle === 'Four-stroke' ? Number(d.valves) : 0); v++) {
              const x = (v % 2 === 0 ? -1 : 1) * bore * 0.22;
              const vz = z + (Math.floor(v / 2) - (Math.ceil(Number(d.valves) / 2) - 1) / 2) * 0.22;
              const diameter = Number(v % 2 === 0 ? d.intakeValve : d.exhaustValve) / 100;
              mesh(
                new THREE.CylinderGeometry(diameter / 2, diameter / 2, 0.04, 16),
                v % 2 === 0 ? 0x33c8d7 : 0xf49575,
                bank,
                [x, headY - 0.17 + offset, vz],
              );
              mesh(
                new THREE.CylinderGeometry(0.025, 0.025, Number(d.lift) / 100 + 0.25, 8),
                0xd6e2ea,
                bank,
                [x, headY + 0.05 + offset, vz],
              );
            }
          }
        }
        if (layer === 'All' || layer === 'Air system')
          for (const side of [-1, 1])
            mesh(
              new THREE.BoxGeometry(0.18, 0.23, rows * pitch),
              side < 0 ? 0x33b8cf : 0xda775a,
              bank,
              [side * bore * 0.8, headY - 0.15 + (exploded ? 0.5 : 0), 0],
            );
      }
      if (layer === 'All' || layer === 'Moving parts') {
        const crank = mesh(
          new THREE.CylinderGeometry(
            Number(d.mainJournal) / 200,
            Number(d.mainJournal) / 200,
            rows * pitch + 0.5,
            24,
          ),
          0x96a9bb,
          assembly,
          [0, 0, 0],
        );
        crank.rotation.x = Math.PI / 2;
        for (let i = 0; i < rows; i++) {
          const g = new THREE.Group();
          g.position.z = (i - (rows - 1) / 2) * pitch;
          assembly.add(g);
          mesh(new THREE.BoxGeometry(0.16, stroke, 0.13), 0x7d8a9b, g, [0, 0, 0]);
          crankParts.push(g);
        }
      }
      if (layer === 'All' || layer === 'Block')
        mesh(new THREE.BoxGeometry(bore * 1.4, 0.35, rows * pitch + 0.2), 0x3e5976, assembly, [
          0,
          -0.6 - (exploded ? 0.7 : 0),
          0,
        ]);
      if ((layer === 'All' || layer === 'Air system') && d.aspiration !== 'Naturally aspirated')
        mesh(new THREE.TorusGeometry(0.3, 0.14, 12, 24), 0xd7bd84, assembly, [
          bore * 1.3,
          1,
          (rows * pitch) / 2,
        ]);
      const box = new THREE.Box3().setFromObject(assembly),
        center = box.getCenter(new THREE.Vector3()),
        size = box.getSize(new THREE.Vector3()).length();
      const reset = () => {
        const verticalFov = THREE.MathUtils.degToRad(camera.fov);
        const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
        const distance = (size * 0.55) / Math.sin(Math.min(verticalFov, horizontalFov) / 2);
        camera.position
          .copy(center)
          .add(new THREE.Vector3(0.9, 0.5, 0.9).normalize().multiplyScalar(distance));
        controls.target.copy(center);
        controls.update();
      };
      reset();
      mount.resetCamera = reset;
      observer = new ResizeObserver(() => {
        const { width, height } = mount.getBoundingClientRect();
        if (width && height) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
          reset();
        }
      });
      observer.observe(mount);
      let angle = 0,
        last = 0;
      const render = (now) => {
        if (motion.current) angle += Math.min((now - last) / 1000, 0.05) * 2;
        last = now;
        for (const m of moving) {
          const a = angle + m.phase,
            x = radius * Math.sin(a),
            y = radius * Math.cos(a),
            top = y + Math.sqrt(rodLen ** 2 - x ** 2) + (exploded ? 0.5 : 0);
          m.piston.position.y = top;
          const delta = new THREE.Vector3(-x, top - y, 0);
          m.rod.position.set(x / 2, (top + y) / 2, m.z);
          m.rod.scale.y = delta.length();
          m.rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
        }
        crankParts.forEach((g) => (g.rotation.z = -angle));
        controls.update();
        renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
      };
      frame = requestAnimationFrame(render);
    } catch {
      setError('3D preview unavailable. Design settings and calculations remain available.');
    }
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      controls?.dispose();
      resources.forEach((r) => r.dispose());
      renderer?.dispose();
      renderer?.domElement.remove();
      delete mount.resetCamera;
    };
  }, [
    d.cycle,
    d.layout,
    d.cylinders,
    d.bankAngle,
    d.bore,
    d.stroke,
    d.rod,
    d.spacing,
    d.mainJournal,
    d.valves,
    d.intakeValve,
    d.exhaustValve,
    d.lift,
    d.aspiration,
    exploded,
    cutaway,
    layer,
  ]);
  return (
    <div className="design-preview" ref={host}>
      <span className="design-preview-label">
        {d.layout} {d.cylinders} · {d.aspiration}
      </span>
      {error && (
        <p className="preview-error" role="status">
          {error}
        </p>
      )}
      <button
        className="design-camera"
        onClick={() => host.current.resetCamera?.()}
        aria-label="Reset camera"
      >
        Reset view
      </button>
      <small className="design-preview-hint">
        Drag to orbit · Pinch to zoom · Concept geometry
      </small>
    </div>
  );
}

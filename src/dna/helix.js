// The double helix behind /dna. It is laid out in page pixels and scrolled 1:1
// with the document, so a base pair at page-y P stays level with whatever HTML
// sits at P. main.js measures the page and calls build(); every frame it calls
// render(scrollY) and asks project(pair) where to wire each card to.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const PAIRS_PER_TURN = 10.5;
const GROOVE = Math.PI * 0.78; // offset between the strands: major and minor grooves
const R = 1.5;                 // strand radius in world units; Rpx sets the world/pixel scale

// Deterministic, so the "sequence" is the same on every visit
function rng(seed) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
}

export function createHelix(canvas, { reduced = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  scene.add(key, key.target);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xeee6d8, 0.6));

  // a wide lens, so the near strand swings out toward you and the far one recedes
  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 500);
  const spin = new THREE.Group();
  scene.add(spin);

  const ivory = new THREE.Color('#efe8dc');
  const neutralA = new THREE.Color('#d6cdbf');
  const neutralB = new THREE.Color('#e9e3d8');
  const white = new THREE.Color('#ffffff');

  let L = null;   // current layout
  let S = null;   // current strand meshes + per-pair data
  let k = 1;      // world units per page pixel
  let grow = reduced ? 1 : 0;
  let hovered = -1;
  let drift = 0;   // slow idle turn, on top of the scroll-driven one
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), dir = new THREE.Vector3(), v = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  // layout: { vw, vh, axisPx, Rpx, risePx, P0, P1, bg, genes: [{ top, bottom, color }], anchors: Set<pair> }
  function build(layout) {
    dispose();
    L = layout;
    k = R / L.Rpx;
    const riseW = L.risePx * k;
    const twist = (Math.PI * 2) / (PAIRS_PER_TURN * riseW);
    const pairs = Math.max(2, Math.floor((L.P1 - L.P0) / L.risePx) + 1);
    const y0 = -L.P0 * k, y1 = -(L.P0 + (pairs - 1) * L.risePx) * k;

    const geneAt = (P) => L.genes.findIndex((g) => P >= g.top && P <= g.bottom);
    const colors = L.genes.map((g) => new THREE.Color(g.color));

    // backbones, tinted per gene through vertex colours
    class Strand extends THREE.Curve {
      constructor(phase) { super(); this.phase = phase; }
      getPoint(t, out = new THREE.Vector3()) {
        const y = y0 + (y1 - y0) * t;
        const a = twist * y + this.phase;
        return out.set(R * Math.cos(a), y, R * Math.sin(a));
      }
    }
    const backMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.32, metalness: 0.05, clearcoat: 0.7, clearcoatRoughness: 0.25 });
    const tubes = [0, GROOVE].map((phase, n) => {
      const geo = new THREE.TubeGeometry(new Strand(phase), Math.ceil((pairs / PAIRS_PER_TURN) * 40), 0.085, 10, false);
      const pos = geo.attributes.position;
      const col = new Float32Array(pos.count * 3);
      const c = new THREE.Color();
      for (let i = 0; i < pos.count; i++) {
        const g = geneAt(-pos.getY(i) / k);
        if (g < 0) c.copy(n ? neutralB : neutralA).lerp(ivory, 0.3);
        else c.copy(colors[g]).lerp(ivory, n ? 0.45 : 0.15);
        col.set([c.r, c.g, c.b], i * 3);
      }
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      return new THREE.Mesh(geo, backMat);
    });

    // base pairs: two half-rungs meeting in the middle, and a bead on each strand
    const rungMat = new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0 });
    const rungs = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.05, 0.05, 1, 10, 1, true).translate(0, 0.5, 0), rungMat, pairs * 2);
    const beadMat = new THREE.MeshPhysicalMaterial({ roughness: 0.25, clearcoat: 0.8, clearcoatRoughness: 0.2 });
    const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.13, 20, 14), beadMat, pairs * 2);

    const rand = rng(1618);
    const data = [];
    for (let i = 0; i < pairs; i++) {
      const y = y0 - i * riseW;
      const a = twist * y;
      const pa = new THREE.Vector3(R * Math.cos(a), y, R * Math.sin(a));
      const pb = new THREE.Vector3(R * Math.cos(a + GROOVE), y, R * Math.sin(a + GROOVE));
      const mid = pa.clone().add(pb).multiplyScalar(0.5);
      const g = geneAt(L.P0 + i * L.risePx);
      const anchored = L.anchors.has(i);
      let ca, cb;
      if (g < 0) { ca = neutralA; cb = neutralB; }
      else {
        ca = colors[g];
        cb = anchored ? colors[g] : colors[g].clone().lerp(white, 0.55);
      }
      if (rand() < 0.5) [ca, cb] = [cb, ca]; // either orientation, like A–T / T–A
      rungs.setColorAt(i * 2, ca);
      rungs.setColorAt(i * 2 + 1, cb);
      beads.setColorAt(i * 2, ca);
      beads.setColorAt(i * 2 + 1, cb);
      data.push({ pa, pb, mid, y, bead: anchored ? 1.45 : 1 });
    }
    S = { tubes, rungs, beads, data, pairs, mats: [backMat, rungMat, beadMat] };
    placeAll();
    spin.add(...tubes, rungs, beads);
    spin.position.x = (L.axisPx - L.vw / 2) * k;

    // the camera frames exactly one viewport of the page at the helix's depth
    renderer.setSize(L.vw, L.vh, false);
    camera.aspect = L.vw / L.vh;
    const D = (L.vh * k) / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.position.z = D;
    camera.near = D * 0.2;
    camera.far = D * 3;
    camera.updateProjectionMatrix();
    // depth cue: the far side of the helix fades toward the page colour
    scene.fog = new THREE.Fog(new THREE.Color(L.bg), D - R, D + R * 4.5);
  }

  function placePair(i, g = 1) {
    const d = S.data[i];
    const b = d.bead * (i === hovered ? 1.7 : 1) * g;
    [d.pa, d.pb].forEach((from, h) => {
      dir.subVectors(d.mid, from);
      const len = dir.length();
      q.setFromUnitVectors(up, dir.normalize());
      S.rungs.setMatrixAt(i * 2 + h, m.compose(from, q, s.set(g, len * g, g)));
      S.beads.setMatrixAt(i * 2 + h, m.compose(from, q.identity(), s.setScalar(Math.max(b, 0.001))));
    });
  }
  function placeAll(scaleOf) {
    for (let i = 0; i < S.pairs; i++) placePair(i, scaleOf ? scaleOf(i) : 1);
    S.rungs.instanceMatrix.needsUpdate = S.beads.instanceMatrix.needsUpdate = true;
  }

  function dispose() {
    if (!S) return;
    spin.remove(...S.tubes, S.rungs, S.beads);
    S.tubes.forEach((t) => t.geometry.dispose());
    S.rungs.geometry.dispose();
    S.beads.geometry.dispose();
    S.mats.forEach((mt) => mt.dispose());
    S = null;
  }

  let last = performance.now();
  canvas.classList.add('on');

  function render(scrollY) {
    if (!S) return;
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const cy = -(scrollY + L.vh / 2) * k;
    camera.position.set(0, cy, camera.position.z);
    camera.lookAt(0, cy, 0);
    key.position.set(-4, cy + 6, camera.position.z);
    key.target.position.set(0, cy, 0);
    // the strand screws round as you read down it: about one turn per 1.5 screens
    if (!reduced) drift += dt * 0.06;
    spin.rotation.y = drift + (scrollY / L.vh) * 4.2;

    // assemble on load: base pairs grow out from the middle of the screen
    if (grow < 1) {
      grow = Math.min(1, grow + dt / 1.8);
      const reach = THREE.MathUtils.smootherstep(grow, 0, 1) * (L.vh * k * 0.8);
      placeAll(grow < 1 ? (i) => THREE.MathUtils.smoothstep(reach - Math.abs(S.data[i].y - cy), 0, 1.2) : null);
    }
    renderer.render(scene, camera);
  }

  // Screen positions of a pair's two beads (z: larger is nearer the viewer)
  function project(i) {
    const d = S?.data[i];
    if (!d) return null;
    return [d.pa, d.pb].map((p) => {
      v.copy(p).applyMatrix4(spin.matrixWorld);
      const z = v.z;
      v.project(camera);
      return { x: ((v.x + 1) / 2) * L.vw, y: ((1 - v.y) / 2) * L.vh, z };
    });
  }

  function highlight(i) {
    if (!S || i === hovered) return;
    const prev = hovered;
    hovered = i;
    if (prev >= 0 && prev < S.pairs) placePair(prev);
    if (i >= 0 && i < S.pairs) placePair(i);
    S.rungs.instanceMatrix.needsUpdate = S.beads.instanceMatrix.needsUpdate = true;
  }

  return { build, render, project, highlight };
}

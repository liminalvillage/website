// Hero network for regenerativa.earth: a living graph, not a starry sky.
// Every space is a hub with its own cluster of people, projects and resources;
// faint rings are places still to join. Hubs are linked to each other and
// neighbouring clusters cross-link, so the whole thing is one connected mesh.
// Flows travel continuously along multi-hop routes, lighting the links and
// nodes they pass through. Static under prefers-reduced-motion.

// Small deterministic PRNG so the network is the same on every visit.
function rng(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

// Places still to join (unit coordinates of the canvas).
const FUTURE = [
  { x: 0.5, y: 0.16 },
  { x: 0.94, y: 0.2 },
  { x: 0.97, y: 0.86 },
  { x: 0.46, y: 0.88 },
  { x: 0.3, y: 0.55 },
  { x: 0.14, y: 0.22 },
  { x: 0.12, y: 0.86 },
];

const GOLD = '221,185,121';
const CREAM = '244,239,228';
const MOSS = '143,175,120';

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ spaces: {name: string, x: number, y: number}[], reduced: boolean }} opts
 * @returns {() => void} cleanup
 */
export function network(canvas, { spaces, reduced }) {
  const ctx = canvas.getContext('2d');
  const rand = rng(21062025);
  let w = 0, h = 0, dpr = 1, raf = 0, visible = true;

  // Nodes: hubs sit at unit coordinates; members orbit a hub at a pixel offset
  // (scaled to the canvas), so clusters keep their shape on any aspect ratio.
  const nodes = [];
  const hubs = [
    ...spaces.map((s) => ({ ...s, kind: 'hub' })),
    ...FUTURE.map((f) => ({ ...f, kind: 'future' })),
  ];
  hubs.forEach((hb) => {
    hb.id = nodes.length;
    nodes.push({ kind: hb.kind, hub: hb.id, ux: hb.x, uy: hb.y, ox: 0, oy: 0, r: hb.kind === 'hub' ? 6 : 4, ph: rand() * 6.28, glow: 0 });
    const count = hb.kind === 'hub' ? 11 + Math.floor(rand() * 4) : 4 + Math.floor(rand() * 2);
    const reach = hb.kind === 'hub' ? 80 : 48;
    const turn = rand() * 6.28;
    hb.members = [];
    for (let k = 0; k < count; k++) {
      const a = turn + (k / count) * 6.283 + (rand() - 0.5) * 0.6;
      const d = reach * (k % 2 ? 0.5 + rand() * 0.25 : 0.85 + rand() * 0.3);
      hb.members.push(nodes.length);
      nodes.push({ kind: hb.kind === 'hub' ? 'member' : 'seed', hub: hb.id, ux: hb.x, uy: hb.y, ox: Math.cos(a) * d, oy: Math.sin(a) * d, r: 1.6 + rand() * 1.4, ph: rand() * 6.28, glow: 0 });
    }
  });

  // Links, built once in a 1600×1000 reference frame so the topology never changes.
  const links = [];
  const adj = nodes.map(() => []);
  const seen = new Set();
  const link = (a, b, type) => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (a === b || seen.has(key)) return;
    seen.add(key);
    adj[a].push(links.length);
    adj[b].push(links.length);
    links.push({ a, b, type, heat: 0 });
  };
  const ref = (n) => [n.ux * 1600 + n.ox, n.uy * 1000 + n.oy];
  const dist = (i, j) => { const [x1, y1] = ref(nodes[i]); const [x2, y2] = ref(nodes[j]); return Math.hypot(x1 - x2, y1 - y2); };

  // Within a cluster: spokes to the hub and a ring among members.
  hubs.forEach((hb) => {
    hb.members.forEach((m, k) => {
      // Inner members hang off the hub, outer ones off their inner neighbours.
      if (k % 2 || hb.kind === 'future') link(hb.id, m, 'local');
      link(m, hb.members[(k + 1) % hb.members.length], 'local');
      if (rand() < 0.4) link(m, hb.members[(k + 2) % hb.members.length], 'local');
    });
  });

  // Between hubs: each hub joins its nearest hubs; the spaces always join each other.
  hubs.forEach((hb, i) => {
    hubs
      .map((o, j) => ({ j, d: dist(hb.id, o.id) }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2)
      .forEach(({ j }) => link(hb.id, hubs[j].id, hb.kind === 'hub' && hubs[j].kind === 'hub' ? 'backbone' : 'bridge'));
  });
  for (let i = 0; i < spaces.length; i++) link(hubs[i].id, hubs[(i + 1) % spaces.length].id, 'backbone');

  // Across clusters: members reach the nearest member of a different cluster.
  nodes.forEach((n, i) => {
    if (n.kind === 'hub' || n.kind === 'future' || rand() < 0.3) return;
    let best = -1, bd = Infinity;
    nodes.forEach((o, j) => {
      if (o.hub === n.hub || o.kind === 'hub' || o.kind === 'future') return;
      const d = dist(i, j);
      if (d < bd) { bd = d; best = j; }
    });
    if (best >= 0 && bd < 230) link(i, best, 'cross');
  });

  // Flows: random walks across several hops, never doubling straight back.
  const flows = [];
  const spawn = () => {
    const starts = rand() < 0.6 ? hubs.slice(0, spaces.length).map((hb) => hb.id) : nodes.map((_, i) => i);
    let at = starts[Math.floor(rand() * starts.length)];
    const path = [at];
    let prev = -1;
    const hops = 4 + Math.floor(rand() * 5);
    for (let s = 0; s < hops; s++) {
      const options = adj[at].filter((li) => links[li].a !== prev && links[li].b !== prev);
      if (!options.length) break;
      const li = options[Math.floor(rand() * options.length)];
      prev = at;
      at = links[li].a === at ? links[li].b : links[li].a;
      path.push(at);
    }
    if (path.length > 1) flows.push({ path, seg: 0, t: 0, speed: 1.6 + rand() * 1.2 });
  };

  let scale = 1;
  const pos = (n, time) => {
    const sway = reduced ? 0 : 1;
    return [
      n.ux * w + n.ox * scale + Math.sin(time * 0.00035 + n.ph) * 3 * sway,
      n.uy * h + n.oy * scale + Math.cos(time * 0.0003 + n.ph) * 3 * sway,
    ];
  };

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width;
    h = r.height;
    scale = Math.max(0.6, Math.min(w / 1600, h / 1000) * 1.2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduced) draw(0);
  }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);
    const P = nodes.map((n) => pos(n, time));

    // Links: the base mesh, then whatever a flow has warmed up.
    for (const l of links) {
      const [x1, y1] = P[l.a];
      const [x2, y2] = P[l.b];
      const base = l.type === 'backbone' ? `rgba(${GOLD},0.42)`
        : l.type === 'bridge' ? `rgba(${GOLD},0.2)`
        : l.type === 'cross' ? `rgba(${MOSS},0.32)`
        : `rgba(${CREAM},0.24)`;
      ctx.lineWidth = l.type === 'backbone' ? 1.4 : l.type === 'bridge' ? 1 : 0.8;
      ctx.setLineDash(l.type === 'bridge' && (nodes[l.a].kind === 'future' || nodes[l.b].kind === 'future') ? [4, 5] : []);
      ctx.strokeStyle = base;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      if (l.heat > 0.01) {
        ctx.setLineDash([]);
        ctx.strokeStyle = `rgba(${GOLD},${0.55 * l.heat})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);

    // Flows: a bright head with a short trail behind it.
    for (const f of flows) {
      const [x1, y1] = P[f.path[f.seg]];
      const [x2, y2] = P[f.path[f.seg + 1]];
      const x = x1 + (x2 - x1) * f.t;
      const y = y1 + (y2 - y1) * f.t;
      const tail = Math.max(0, f.t - 0.35);
      const grad = ctx.createLinearGradient(x1 + (x2 - x1) * tail, y1 + (y2 - y1) * tail, x, y);
      grad.addColorStop(0, `rgba(${GOLD},0)`);
      grad.addColorStop(1, `rgba(${GOLD},0.9)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1 + (x2 - x1) * tail, y1 + (y2 - y1) * tail);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.fillStyle = 'rgba(248,226,178,1)';
      ctx.beginPath();
      ctx.arc(x, y, 2.4, 0, 6.283);
      ctx.fill();
    }

    // Nodes: solid points with a rim; hubs are rings; future places are open circles.
    nodes.forEach((n, i) => {
      const [x, y] = P[i];
      if (n.glow > 0.02) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, n.r * 5);
        g.addColorStop(0, `rgba(${GOLD},${0.45 * n.glow})`);
        g.addColorStop(1, `rgba(${GOLD},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, n.r * 5, 0, 6.283);
        ctx.fill();
      }
      if (n.kind === 'hub') {
        ctx.strokeStyle = `rgba(${GOLD},0.85)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, n.r + 5, 0, 6.283);
        ctx.stroke();
        ctx.fillStyle = '#f3dcaa';
        ctx.beginPath();
        ctx.arc(x, y, n.r, 0, 6.283);
        ctx.fill();
      } else if (n.kind === 'future') {
        ctx.fillStyle = '#141a16';
        ctx.strokeStyle = `rgba(${GOLD},0.45)`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(x, y, n.r + 2, 0, 6.283);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        const a = n.kind === 'member' ? 0.75 : 0.4;
        ctx.fillStyle = n.glow > 0.02 ? `rgba(248,226,178,${a + (1 - a) * n.glow})` : `rgba(${CREAM},${a})`;
        ctx.beginPath();
        ctx.arc(x, y, n.r, 0, 6.283);
        ctx.fill();
      }
    });

    // Keep the left side calm behind the headline.
    ctx.globalCompositeOperation = 'destination-out';
    const fade = ctx.createLinearGradient(0, 0, w * 0.6, 0);
    fade.addColorStop(0, 'rgba(0,0,0,0.78)');
    fade.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, w * 0.6, h);
    ctx.globalCompositeOperation = 'source-over';
  }

  let last = 0, prevTime = 0;
  function frame(time) {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min(48, time - (prevTime || time));
    prevTime = time;
    if (time - last > 520 && flows.length < 10) { spawn(); last = time; }

    for (const l of links) l.heat *= 0.97;
    for (const n of nodes) n.glow *= 0.95;

    const P = nodes.map((n) => pos(n, time));
    for (let i = flows.length - 1; i >= 0; i--) {
      const f = flows[i];
      const a = f.path[f.seg], b = f.path[f.seg + 1];
      const len = Math.max(1, Math.hypot(P[b][0] - P[a][0], P[b][1] - P[a][1]));
      f.t += (f.speed * dt * 0.06) / len;
      const li = adj[a].find((k) => links[k].a === b || links[k].b === b);
      if (li !== undefined) links[li].heat = Math.max(links[li].heat, 1);
      if (f.t >= 1) {
        nodes[b].glow = 1;
        f.seg++;
        f.t = 0;
        if (f.seg >= f.path.length - 1) flows.splice(i, 1);
      }
    }
    draw(time);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(canvas);

  if (!reduced) raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
  };
}

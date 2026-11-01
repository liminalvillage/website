// The hero network told on the real H3 hierarchy around Castorano.
// Projects (resolution-8 cells) come online one at a time, mostly beside
// projects already running, so clusters grow and meet. Neighbouring projects
// exchange: their shared border lights up and a pulse crosses it. When four
// of a cell's seven H3 children are online, the parent cell one resolution up
// comes online too and starts exchanging with its own neighbours — r8 projects
// combine into r7 nuclei, r6 local networks, and finally the r5 territory.
// Then the whole fades and the story starts again. A tap brings the project
// under it online. Under reduced motion the finished network is drawn still.
import { latLngToCell, cellToParent, cellToChildren, gridRing, cellToLatLng, cellToBoundary } from 'h3-js';

const HOME = { lat: 42.8987, lng: 13.7277 }; // Castorano (AP)
const BASE_RES = 8;
const TOP_RES = 5;
const QUORUM = 4;          // online children (of 7) that bring a parent online
const STEP_MS = 330;       // one project comes online per step
const EXCHANGE_MS = 260;   // a new exchange starts this often
const HOLD_MS = 9000;      // the completed territory rests before fading
const FADE_MS = 3200;
const GOLD = '221, 185, 121';
const CREAM = '244, 239, 228';

export const LEVELS = [
  { res: 8, label: 'Progetti' },
  { res: 7, label: 'Nuclei' },
  { res: 6, label: 'Reti locali' },
  { res: 5, label: 'Territorio' },
];

export const HOME_CELL = latLngToCell(HOME.lat, HOME.lng, BASE_RES);
const TOP_CELL = cellToParent(HOME_CELL, TOP_RES);

export function hexmesh(canvas, { area = canvas.parentElement, reduced = false, onCell = () => {}, onStats = () => {} } = {}) {
  const ctx = canvas.getContext('2d');
  const grid = document.createElement('canvas');
  const gctx = grid.getContext('2d');
  const [lat0, lng0] = cellToLatLng(TOP_CELL);
  const cosLat = Math.cos((lat0 * Math.PI) / 180);

  let w = 0, h = 0, dpr = 1;
  let scale = 1, ox = 0, oy = 0;
  let levels = [];
  let exchanges = [];
  let edges = new Map();
  let phase = 'grow', phaseAt = 0, lastStep = 0, lastExchange = 0;
  let raf = 0, running = false, visible = true;
  let hovered = -1;
  let lastWidth = 0;

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const project = (lat, lng) => [ox + (lng - lng0) * cosLat * scale, oy - (lat - lat0) * scale];
  const unproject = (x, y) => [lat0 - (y - oy) / scale, lng0 + (x - ox) / (cosLat * scale)];

  function fit() {
    const b = cellToBoundary(TOP_CELL);
    const xs = b.map(([, lng]) => (lng - lng0) * cosLat);
    const ys = b.map(([lat]) => lat - lat0);
    const spanX = Math.max(...xs) - Math.min(...xs);
    const spanY = Math.max(...ys) - Math.min(...ys);
    const mobile = w < 700;
    // The territory cell sits right of the headline on desktop and fills the width on phones.
    const fitW = mobile ? w * 1.05 : Math.min(w * 0.5, 820);
    const fitH = mobile ? h * 0.7 : h * 0.84;
    scale = Math.min(fitW / spanX, fitH / spanY);
    ox = mobile ? w * 0.5 : w - Math.max(w * 0.06, 40) - (spanX * scale) / 2;
    oy = mobile ? h * 0.6 : h * 0.54;
  }

  function build() {
    fit();
    edges = new Map();
    levels = LEVELS.map(({ res }) => {
      const ids = res === TOP_RES ? [TOP_CELL] : cellToChildren(TOP_CELL, res);
      const at = new Map(ids.map((id, i) => [id, i]));
      const cells = ids.map((id) => {
        const [cx, cy] = project(...cellToLatLng(id));
        const verts = cellToBoundary(id).map(([lat, lng]) => project(lat, lng));
        const path = new Path2D();
        verts.forEach(([x, y], j) => (j ? path.lineTo(x, y) : path.moveTo(x, y)));
        path.closePath();
        let perimeter = 0;
        verts.forEach(([x, y], j) => {
          const [nx, ny] = verts[(j + 1) % verts.length];
          perimeter += Math.hypot(nx - x, ny - y);
        });
        return { id, cx, cy, verts, path, perimeter, nbrs: [], children: [], parent: -1, on: false, at: 0 };
      });
      cells.forEach((c) => {
        c.nbrs = gridRing(c.id, 1).map((n) => at.get(n)).filter((i) => i !== undefined);
      });
      return { res, at, cells };
    });
    levels.forEach((lvl, L) => {
      const up = levels[L + 1];
      if (!up) return;
      lvl.cells.forEach((c, i) => {
        c.parent = up.at.get(cellToParent(c.id, up.res)) ?? -1;
        if (c.parent >= 0) up.cells[c.parent].children.push(i);
      });
    });

    // The faint map: every project cell, and the territory's outline.
    grid.width = canvas.width;
    grid.height = canvas.height;
    gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gctx.lineWidth = 0.75;
    gctx.strokeStyle = `rgba(${CREAM}, 0.07)`;
    for (const c of levels[0].cells) gctx.stroke(c.path);
    gctx.setLineDash([3, 6]);
    gctx.strokeStyle = `rgba(${CREAM}, 0.16)`;
    gctx.stroke(levels[levels.length - 1].cells[0].path);
    gctx.setLineDash([]);

    restart(performance.now());
  }

  function restart(now) {
    levels.forEach((lvl) => lvl.cells.forEach((c) => { c.on = false; c.at = 0; }));
    exchanges = [];
    phase = 'grow';
    phaseAt = now;
    report();
  }

  function report() {
    onStats(levels.map((lvl, L) => ({
      ...LEVELS[L],
      online: lvl.cells.reduce((n, c) => n + c.on, 0),
      total: lvl.cells.length,
    })));
  }

  // Bring a cell online and let the quorum ripple up the hierarchy.
  function online(L, i, now) {
    const c = levels[L].cells[i];
    if (c.on) return;
    c.on = true;
    c.at = now;
    const up = levels[L + 1];
    if (up && c.parent >= 0) {
      const p = up.cells[c.parent];
      const count = p.children.reduce((n, k) => n + levels[L].cells[k].on, 0);
      if (count >= QUORUM) online(L + 1, c.parent, now);
    }
  }

  // Online siblings under the same parent: projects join where a nucleus is forming.
  function pull(i) {
    const c = levels[0].cells[i];
    if (c.parent < 0) return 1;
    return 1 + 3 * levels[1].cells[c.parent].children.reduce((n, k) => n + levels[0].cells[k].on, 0);
  }

  function weighted(options) {
    const weights = options.map(pull);
    let r = Math.random() * weights.reduce((a, b) => a + b, 0);
    for (let k = 0; k < options.length; k++) if ((r -= weights[k]) <= 0) return options[k];
    return options[options.length - 1];
  }

  // Mostly grow beside running projects; sometimes start a new cluster.
  function nextProject(now) {
    const base = levels[0].cells;
    const live = [];
    base.forEach((c, i) => c.on && live.push(i));
    let target = -1;
    if (!live.length) target = levels[0].at.get(HOME_CELL);
    for (let tries = 0; target < 0 && tries < 12; tries++) {
      if (Math.random() < 0.8) {
        const free = base[pick(live)].nbrs.filter((n) => !base[n].on);
        if (free.length) target = weighted(free);
      } else {
        const k = Math.floor(Math.random() * base.length);
        if (!base[k].on) target = k;
      }
    }
    if (target >= 0) {
      online(0, target, now);
      report();
    }
  }

  function sharedEdge(L, a, b) {
    const key = `${L}:${Math.min(a, b)}:${Math.max(a, b)}`;
    if (edges.has(key)) return edges.get(key);
    const A = levels[L].cells[a].verts;
    const B = levels[L].cells[b].verts;
    const tol = 0.5 + L * 0.5;
    const common = A.filter(([x, y]) => B.some(([u, v]) => Math.abs(u - x) < tol && Math.abs(v - y) < tol));
    const edge = common.length >= 2 ? [common[0], common[common.length - 1]] : null;
    edges.set(key, edge);
    return edge;
  }

  // Exchanges happen mostly between projects, less often between larger cells.
  function exchange(now) {
    const weights = [0.62, 0.26, 0.12];
    let r = Math.random(), L = 0;
    while (L < weights.length - 1 && r > weights[L]) { r -= weights[L]; L++; }
    const cells = levels[L].cells;
    const live = [];
    cells.forEach((c, i) => c.on && live.push(i));
    if (!live.length) return;
    const a = pick(live);
    const partners = cells[a].nbrs.filter((n) => cells[n].on);
    if (!partners.length) return;
    const b = pick(partners);
    exchanges.push({ L, a, b, start: now, dur: 1500 + L * 900, edge: sharedEdge(L, a, b) });
    if (exchanges.length > 36) exchanges.shift();
  }

  function update(now) {
    if (phase === 'grow') {
      if (now - lastStep > STEP_MS) {
        lastStep = now;
        nextProject(now);
      }
      if (levels[levels.length - 1].cells[0].on) {
        phase = 'hold';
        phaseAt = now;
      }
    } else if (phase === 'hold' && now - phaseAt > HOLD_MS) {
      phase = 'fade';
      phaseAt = now;
    } else if (phase === 'fade' && now - phaseAt > FADE_MS) {
      restart(now);
    }
    if (now - lastExchange > EXCHANGE_MS) {
      lastExchange = now;
      exchange(now);
    }
    exchanges = exchanges.filter((x) => now - x.start < x.dur);
  }

  function drawCells(now) {
    levels.forEach((lvl, L) => {
      for (const c of lvl.cells) {
        if (!c.on) continue;
        const age = (now - c.at) / 1000;
        const fresh = Math.exp(-age / (1.2 + L));
        if (L === 0) {
          ctx.fillStyle = `rgba(${GOLD}, ${0.12 + fresh * 0.4})`;
          ctx.fill(c.path);
          ctx.strokeStyle = `rgba(${GOLD}, ${0.45 + fresh * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke(c.path);
          continue;
        }
        // Larger cells draw their outline in as they come online.
        const drawIn = Math.min(1, age / (1.4 + L * 0.5));
        ctx.save();
        ctx.setLineDash([c.perimeter * drawIn, c.perimeter]);
        ctx.fillStyle = `rgba(${GOLD}, ${(0.04 + fresh * 0.08) * drawIn})`;
        ctx.fill(c.path);
        ctx.strokeStyle = L === levels.length - 1 ? `rgba(${CREAM}, ${0.55 + fresh * 0.4})` : `rgba(${GOLD}, ${0.5 + fresh * 0.45})`;
        ctx.lineWidth = 0.8 + L * 0.7;
        ctx.shadowColor = `rgba(${GOLD}, 0.6)`;
        ctx.shadowBlur = 4 + L * 4 + fresh * 10;
        ctx.stroke(c.path);
        ctx.restore();
      }
    });
  }

  function drawExchanges(now) {
    for (const x of exchanges) {
      const t = (now - x.start) / x.dur;
      const glow = Math.sin(Math.PI * t);
      const A = levels[x.L].cells[x.a];
      const B = levels[x.L].cells[x.b];
      if (x.edge) {
        const [[x1, y1], [x2, y2]] = x.edge;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(${CREAM}, ${glow * 0.9})`;
        ctx.lineWidth = 1.5 + x.L * 1.2;
        ctx.shadowColor = `rgba(${GOLD}, 0.9)`;
        ctx.shadowBlur = 10 + x.L * 6;
        ctx.stroke();
      }
      // The pulse eases from one centre, across the shared border, into the other.
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const px = A.cx + (B.cx - A.cx) * e;
      const py = A.cy + (B.cy - A.cy) * e;
      ctx.beginPath();
      ctx.arc(px, py, 1.6 + x.L * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CREAM}, ${0.35 + glow * 0.65})`;
      ctx.shadowColor = `rgba(${GOLD}, 1)`;
      ctx.shadowBlur = 8 + x.L * 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function draw(now) {
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(grid, 0, 0, w, h);
    ctx.globalAlpha = phase === 'fade' ? Math.max(0, 1 - (now - phaseAt) / FADE_MS) : 1;
    drawCells(now);
    drawExchanges(now);

    const home = levels[0].cells[levels[0].at.get(HOME_CELL)];
    if (home) {
      const pulse = reduced ? 0.6 : 0.5 + 0.5 * Math.sin(now / 900);
      ctx.fillStyle = `rgba(${GOLD}, ${0.3 + pulse * 0.25})`;
      ctx.fill(home.path);
      ctx.strokeStyle = `rgba(${GOLD}, 1)`;
      ctx.lineWidth = 1.25;
      ctx.stroke(home.path);
    }
    ctx.globalAlpha = 1;

    if (hovered >= 0) {
      ctx.strokeStyle = `rgba(${CREAM}, 0.85)`;
      ctx.lineWidth = 1.25;
      ctx.stroke(levels[0].cells[hovered].path);
    }
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    update(now);
    draw(now);
  }

  function play() {
    if (running || reduced || !visible || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(loop);
  }

  function pause() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    lastWidth = w;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
    if (reduced) {
      // Grow until the territory is online, with every cell settled.
      for (let s = 0; s < 400 && !levels[levels.length - 1].cells[0].on; s++) nextProject(-1e6);
      draw(0);
    }
  }

  function cellAt(e) {
    const r = canvas.getBoundingClientRect();
    const id = latLngToCell(...unproject(e.clientX - r.left, e.clientY - r.top), BASE_RES);
    return { id, i: levels[0].at.get(id) ?? -1 };
  }

  const onMove = (e) => {
    const p = cellAt(e);
    if (p.i === hovered) return;
    hovered = p.i;
    onCell(p.i >= 0 ? p.id : null);
    if (reduced) draw(0);
  };
  const onLeave = () => {
    hovered = -1;
    onCell(null);
    if (reduced) draw(0);
  };
  const onDown = (e) => {
    if (e.target.closest('a, button') || reduced) return;
    const p = cellAt(e);
    if (p.i < 0) return;
    const now = performance.now();
    if (phase === 'fade') restart(now);
    online(0, p.i, now);
    report();
  };
  const onVisibility = () => (document.hidden ? pause() : play());

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible ? play() : pause();
  });

  let resizeTimer = 0;
  const ro = new ResizeObserver(() => {
    // Mobile browsers resize the viewport height while scrolling; only rebuild on width changes.
    const width = canvas.getBoundingClientRect().width;
    if (lastWidth && Math.abs(width - lastWidth) < 2) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  });

  resize();
  ro.observe(canvas);
  io.observe(canvas);
  area.addEventListener('pointermove', onMove);
  area.addEventListener('pointerleave', onLeave);
  area.addEventListener('pointerdown', onDown);
  document.addEventListener('visibilitychange', onVisibility);
  play();

  return () => {
    pause();
    ro.disconnect();
    io.disconnect();
    clearTimeout(resizeTimer);
    area.removeEventListener('pointermove', onMove);
    area.removeEventListener('pointerleave', onLeave);
    area.removeEventListener('pointerdown', onDown);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}

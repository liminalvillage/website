// Hero sky for regenerativa.earth: the network as a constellation.
// Bright named stars are the spaces, faint ones are places still to join.
// Pulses of light travel along the links — events moving through the network,
// never all at once and never stopping. Static under prefers-reduced-motion.

// Small deterministic PRNG so the sky is the same on every visit.
function rng(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ spaces: {name: string, x: number, y: number}[], reduced: boolean }} opts
 * @returns {() => void} cleanup
 */
export function sky(canvas, { spaces, reduced }) {
  const ctx = canvas.getContext('2d');
  const rand = rng(21062025);
  let w = 0, h = 0, dpr = 1, raf = 0, visible = true;

  // Points in unit space; spaces are given, the rest scattered.
  const stars = spaces.map((s) => ({ ...s, r: 3.2, named: true, tw: rand() * 6.28 }));
  for (let i = 0; i < 46; i++) {
    stars.push({ x: rand(), y: rand(), r: 0.6 + rand() * 1.3, named: false, tw: rand() * 6.28 });
  }

  // Link each star to its nearest neighbours (in unit space, aspect corrected later is fine).
  const links = [];
  const seen = new Set();
  stars.forEach((a, i) => {
    const near = stars
      .map((b, j) => ({ j, d: (a.x - b.x) ** 2 + ((a.y - b.y) * 0.6) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, a.named ? 4 : 2);
    for (const { j, d } of near) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key) || d > 0.05) continue;
      seen.add(key);
      links.push({ a: i, b: j, named: a.named || stars[j].named });
    }
  });

  // The spaces are always linked to each other: the backbone of the network.
  const named = stars.map((s, i) => (s.named ? i : -1)).filter((i) => i >= 0);
  for (let i = 0; i < named.length; i++) {
    const a = named[i], b = named[(i + 1) % named.length];
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (!seen.has(key)) { seen.add(key); links.push({ a, b, named: true, backbone: true }); }
  }

  const pulses = [];
  const spawn = () => {
    const pool = rand() < 0.55 ? links.filter((l) => l.named) : links;
    const l = pool[Math.floor(rand() * pool.length)];
    const fwd = rand() < 0.5;
    pulses.push({ a: fwd ? l.a : l.b, b: fwd ? l.b : l.a, t: 0, speed: 0.0035 + rand() * 0.004 });
  };

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width;
    h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduced) draw(0);
  }

  const P = (s) => [s.x * w, s.y * h];

  function draw(time) {
    ctx.clearRect(0, 0, w, h);

    for (const l of links) {
      const [x1, y1] = P(stars[l.a]);
      const [x2, y2] = P(stars[l.b]);
      ctx.strokeStyle = l.backbone ? 'rgba(221,185,121,0.32)' : l.named ? 'rgba(221,185,121,0.16)' : 'rgba(244,239,228,0.07)';
      ctx.lineWidth = l.backbone ? 1.1 : 0.8;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    for (const p of pulses) {
      const [x1, y1] = P(stars[p.a]);
      const [x2, y2] = P(stars[p.b]);
      const x = x1 + (x2 - x1) * p.t;
      const y = y1 + (y2 - y1) * p.t;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 10);
      g.addColorStop(0, 'rgba(240,210,150,0.95)');
      g.addColorStop(1, 'rgba(240,210,150,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 6.283);
      ctx.fill();
    }

    for (const s of stars) {
      const [x, y] = P(s);
      const tw = reduced ? 1 : 0.7 + 0.3 * Math.sin(time * 0.0012 + s.tw);
      if (s.named) {
        const halo = ctx.createRadialGradient(x, y, 0, x, y, 26);
        halo.addColorStop(0, `rgba(221,185,121,${0.45 * tw})`);
        halo.addColorStop(1, 'rgba(221,185,121,0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, 26, 0, 6.283);
        ctx.fill();
        ctx.fillStyle = '#f3dcaa';
      } else {
        ctx.fillStyle = `rgba(244,239,228,${0.35 + 0.4 * tw})`;
      }
      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, 6.283);
      ctx.fill();
    }
  }

  let last = 0;
  function frame(time) {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    if (time - last > 650 && pulses.length < 9) { spawn(); last = time; }
    for (let i = pulses.length - 1; i >= 0; i--) {
      pulses[i].t += pulses[i].speed;
      if (pulses[i].t >= 1) pulses.splice(i, 1);
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

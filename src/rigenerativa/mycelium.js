// A growing mycelium on a <canvas>: tips wander, branch and leave thin gold
// threads that slowly fade. Threads lean toward the pointer, sprout where it
// moves, and burst where it taps. Under reduced motion one still web is drawn.

const MAX_TIPS = 240;
const GOLD = '221, 185, 121';
const CREAM = '244, 239, 228';

export function mycelium(canvas, { area = canvas.parentElement, reduced = false } = {}) {
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1;
  let tips = [];
  let frame = 0;
  let raf = 0;
  let running = false;
  let visible = true;
  const pointer = { x: 0, y: 0, active: false, lastSprout: 0 };

  const rand = (a, b) => a + Math.random() * (b - a);

  function tip(x, y, angle, width = rand(1.1, 1.9), gen = 0, life = rand(160, 320)) {
    return { x, y, angle, width, gen, life, color: Math.random() < 0.15 ? CREAM : GOLD };
  }

  function seed(n = 7) {
    for (let i = 0; i < n; i++) {
      const fromBottom = Math.random() < 0.7;
      if (fromBottom) tips.push(tip(rand(0, w), h + 4, -Math.PI / 2 + rand(-0.5, 0.5)));
      else {
        const left = Math.random() < 0.5;
        tips.push(tip(left ? -4 : w + 4, rand(h * 0.4, h), (left ? 0 : Math.PI) + rand(-0.4, 0.4)));
      }
    }
  }

  function sprout(x, y, n) {
    for (let i = 0; i < n && tips.length < MAX_TIPS; i++) {
      tips.push(tip(x, y, rand(0, Math.PI * 2), rand(0.5, 1.1), 3, rand(40, 110)));
    }
  }

  function node(x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color}, 0.85)`;
    ctx.shadowColor = `rgba(${GOLD}, 0.9)`;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function step() {
    const next = [];
    for (const t of tips) {
      t.angle += rand(-0.22, 0.22);
      if (pointer.active) {
        const dx = pointer.x - t.x, dy = pointer.y - t.y;
        const d = Math.hypot(dx, dy);
        if (d < 260 && d > 1) {
          let diff = Math.atan2(dy, dx) - t.angle;
          diff = Math.atan2(Math.sin(diff), Math.cos(diff));
          t.angle += diff * 0.04 * (1 - d / 260);
        }
      }
      const speed = 0.9 + t.width * 0.35;
      const nx = t.x + Math.cos(t.angle) * speed;
      const ny = t.y + Math.sin(t.angle) * speed;

      ctx.beginPath();
      ctx.moveTo(t.x, t.y);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = `rgba(${t.color}, ${0.4 + Math.min(t.width, 1.6) * 0.35})`;
      ctx.lineWidth = t.width;
      ctx.lineCap = 'round';
      ctx.stroke();

      t.x = nx; t.y = ny;
      t.width *= 0.9965;
      t.life -= 1;

      if (t.gen < 7 && tips.length + next.length < MAX_TIPS && Math.random() < 0.013) {
        const side = Math.random() < 0.5 ? -1 : 1;
        next.push(tip(t.x, t.y, t.angle + side * rand(0.35, 0.9), t.width * 0.72, t.gen + 1, t.life * rand(0.5, 0.9)));
      }

      const off = t.x < -20 || t.x > w + 20 || t.y < -20 || t.y > h + 20;
      if (t.life <= 0 || t.width < 0.18) {
        if (!off && Math.random() < 0.35) node(t.x, t.y, rand(1, 2.2), t.color);
      } else if (!off) next.push(t);
    }
    tips = next;
    if (tips.length < 5) seed(4);
  }

  function fade() {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    frame++;
    step();
    step();
    if (frame % 4 === 0) fade();
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
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tips = [];
    seed(w < 700 ? 5 : 9);
    if (reduced) for (let i = 0; i < 900; i++) step();
  }

  function local(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  const onMove = (e) => {
    const p = local(e);
    pointer.x = p.x; pointer.y = p.y; pointer.active = true;
    const now = performance.now();
    if (running && now - pointer.lastSprout > 90) {
      pointer.lastSprout = now;
      sprout(p.x, p.y, 1);
    }
  };
  const onLeave = () => { pointer.active = false; };
  const onDown = (e) => {
    if (e.target.closest('a, button')) return;
    const p = local(e);
    sprout(p.x, p.y, 14);
    node(p.x, p.y, 3, GOLD);
  };
  const onVisibility = () => (document.hidden ? pause() : play());

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible ? play() : pause();
  });

  let resizeTimer = 0;
  let lastWidth = 0;
  const ro = new ResizeObserver(() => {
    // Mobile browsers resize the viewport height while scrolling; only regrow on width changes.
    const width = canvas.getBoundingClientRect().width;
    if (Math.abs(width - lastWidth) < 2 && lastWidth) return;
    lastWidth = width;
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

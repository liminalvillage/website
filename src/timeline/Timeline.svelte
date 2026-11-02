<script>
  // /timeline: the village's lunations as a spiral to travel along: a circle
  // and a line at once. Each lunation stands at the angle of the season it
  // begins in (where the sun is at its new moon), so the same season always
  // points the same way, and time moves outwards, one turn a year: October
  // 2027 sits just outside October 2026. The line is coloured by the seasons,
  // the years are marked where they turn, the moon we are in says "now", and longer
  // stretches lie along it with their names written on them. Nothing is
  // placed where it could cross anything else.
  //
  // Scrolling zooms in to the lunation we are in, then carries on moon by
  // moon; a quick scroll back returns to the whole spiral. Close up, a
  // lunation reads in the same order every time: its themes and the goals it
  // serves, a stretch of the line with its weeks (as on the village's Miro
  // board), and what it brings personally, locally and globally. A small map
  // of the spiral in the corner shows where you are. The page takes on the
  // colours of whichever lunation you are at, by the site's seasonal rule.
  //
  // Nothing is added or changed on the website: that happens in Holons,
  // whose permissions decide who may note what, and who may see
  // members-only things. The page only shows. Fed by Holons later (see
  // source.js).
  import { onMount } from 'svelte';
  import { phase as moonNow } from 'lune';
  import { fly as rise } from 'svelte/transition';
  import gsap from 'gsap';
  import Ring from '../journey/Ring.svelte';
  import LunationArt from './LunationArt.svelte';
  import Mycelium from '../lib/Mycelium.svelte';
  import { loadTimeline, SPANS, PEOPLE, KINDS, STATUS, stretches, stays, festivals } from './source.js';
  import { leafFor } from './leaves.js';
  import Pick from './Pick.svelte';
  import { POINTS, QUARTERS, heatAt, lunarNewYear } from './compass.js';
  import { seasonColours } from '../theme/season.js';
  import { sunLongitude } from '../calendar/sun.js';

  let lunations = [];
  let live = false;
  // Nobody edits anything here: the timeline only shows. What is noted, and
  // who may see members-only things, is kept in Holons and decided by its
  // permissions. On the dev server only, ?member previews a member's view.
  const member = import.meta.env.DEV && new URLSearchParams(location.search).has('member');

  // --- the spiral, in world units --------------------------------------------
  const D = 240; // a lunation's circle
  const R0 = 1100; // the spiral's radius at the first lunation
  const TURN = 480; // how much further out each turn (a year) sits
  const rad = (a) => (a * Math.PI) / 180;
  // each lunation's angle: the sun's place at its new moon, winter at the
  // top, spring to the right, summer below, autumn to the left; unwound so
  // it keeps growing turn after turn
  let theta = [];
  function angles(ls) {
    const out = [];
    ls.forEach((l, i) => {
      const lon = sunLongitude(l.start);
      if (!i) out.push(rad(-90 + (lon - 270)));
      else out.push(out[i - 1] + rad(((lon - sunLongitude(ls[i - 1].start)) % 360 + 360) % 360));
    });
    return out;
  }
  // the angle at any point along the line, between lunations too
  function thetaAt(t) {
    const n = theta.length;
    if (!n) return 0;
    const step = n > 1 ? (theta[n - 1] - theta[0]) / (n - 1) : 0.5;
    if (t <= 0) return theta[0] + t * step;
    if (t >= n - 1) return theta[n - 1] + (t - n + 1) * step;
    const i = Math.floor(t);
    return theta[i] + (theta[i + 1] - theta[i]) * (t - i);
  }
  function at(t) {
    const a = thetaAt(t);
    const r = R0 + (TURN * (a - theta[0])) / (Math.PI * 2);
    return { x: r * Math.cos(a), y: r * Math.sin(a), a, r };
  }
  // a point beside the line, outwards (positive) or inwards
  function out(t, by) {
    const p = at(t);
    return { x: p.x + by * Math.cos(p.a), y: p.y + by * Math.sin(p.a) };
  }
  // a slow, gentle sway, so the line reads drawn by hand but flows
  const wob = (u) => 5 * Math.sin(u * 0.004) + 2 * Math.sin(u * 0.0093 + 1);
  function stretch(t0, t1, steps = 30, off = 0) {
    return Array.from({ length: steps + 1 }, (_, k) => {
      const p = at(t0 + ((t1 - t0) * k) / steps);
      const w = wob((p.x + p.y) * 1.3) + off;
      return `${k ? 'L' : 'M'}${(p.x + w * Math.cos(p.a)).toFixed(1)} ${(p.y + w * Math.sin(p.a)).toFixed(1)}`;
    }).join('');
  }

  // --- the seasons compass ---------------------------------------------------
  // On by default; it can be put away. Remembered in this browser only.
  let compass = true;
  let phone = false;
  let small = false;
  let keyOpen = false;
  try {
    compass = localStorage.getItem('lv-timeline-compass') !== 'off';
  } catch {}
  function toggleCompass() {
    compass = !compass;
    try {
      localStorage.setItem('lv-timeline-compass', compass ? 'on' : 'off');
    } catch {}
    fly();
  }
  const lonAngle = (lon) => rad(-90 + (lon - 270));
  // how far in and out the spiral (with its stretches, its labels and the
  // fading moons beyond) reaches in a direction, so the compass's lines and
  // words stay clear of all of it
  function reachAt(a) {
    let lo = Infinity;
    let hi = 0;
    for (let t = -0.5; t <= lunations.length - 1 + FUTURE; t += 0.04) {
      const p = at(t);
      const d = Math.abs(((p.a - a) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
      if (d < 0.3) {
        lo = Math.min(lo, p.r);
        hi = Math.max(hi, p.r);
      }
    }
    return { inner: lo - 175 - 120, outer: hi + D / 2 + 130 };
  }
  // the hub's words in the middle are wide and low
  const hubClear = (a) => (Math.abs(Math.cos(a)) > 0.5 ? 740 : 230);
  function buildRose() {
    const points = POINTS.map((pt) => {
      const a = lonAngle(pt.lon);
      return { ...pt, a, ...reachAt(a) };
    });
    const quarters = QUARTERS.map((q) => {
      const a = lonAngle(q.from + 45);
      return { ...q, a, a0: lonAngle(q.from), a1: lonAngle(q.to), ...reachAt(a) };
    });
    const reach = Math.max(...points.map((p) => p.outer + 420), ...quarters.map((q) => q.outer + 420));
    // how far the words reach, across and up and down (a word is about
    // 650 across and 160 high, at the size the whole year is seen at)
    if (phone) {
      // only the four points, close in; their words are sized on screen
      for (const p of points) p.at = p.outer + 40;
      const halfW = Math.max(...points.map((p) => Math.abs(p.at * Math.cos(p.a))));
      const halfH = Math.max(...points.map((p) => Math.abs(p.at * Math.sin(p.a))));
      return { points, quarters: quarters.map((q) => ({ ...q, hidden: true })), reach, solstices: [], halfW, halfH };
    }
    for (const p of points) p.at = p.outer + 190;
    const ext = [...points.map((p) => ({ a: p.a, r: p.at })), ...quarters.map((q) => ({ a: q.a, r: q.outer + 120 }))];
    const halfW = Math.max(...ext.map((e) => Math.abs(e.r * Math.cos(e.a)) + (Math.abs(Math.cos(e.a)) > 0.35 ? 680 : 340)));
    const halfH = Math.max(...ext.map((e) => Math.abs(e.r * Math.sin(e.a)) + (Math.abs(Math.sin(e.a)) > 0.35 ? 170 : 90)));
    // where the solar year turns along the spiral: each winter solstice
    const solstices = [];
    for (let m = -1; m < 4; m++) {
      const target = -Math.PI / 2 + Math.PI * 2 * m;
      const i = theta.findIndex((th, k) => k < theta.length - 1 && th <= target && theta[k + 1] > target);
      if (i >= 0) solstices.push(i + (target - theta[i]) / (theta[i + 1] - theta[i]));
    }
    return { points, quarters, reach, solstices, halfW, halfH };
  }
  let rose = null;
  const wedge = (a0, a1, r) => `M0 0L${r * Math.cos(a0)} ${r * Math.sin(a0)}A${r} ${r} 0 0 1 ${r * Math.cos(a1)} ${r * Math.sin(a1)}Z`;
  // which way a word leans out from its point, so it grows away from the spiral
  const anchor = (a) => `${Math.cos(a) > 0.35 ? 0 : Math.cos(a) < -0.35 ? -100 : -50}%, ${Math.sin(a) > 0.35 ? 0 : Math.sin(a) < -0.35 ? -100 : -50}%`;
  $: newYears = lunations.filter((l) => l.lny);
  // the band in small steps, each in the warmth of its own days, so its
  // colour flows along the year instead of changing moon by moon
  $: bandBits = lunations.flatMap((l, i) =>
    i === n - 1
      ? []
      : Array.from({ length: 10 }, (_, k) => ({
          t0: i + k / 10 - 0.012,
          t1: i + (k + 1) / 10 + 0.012,
          colour: heatAt(l.start + ((k + 0.5) / 10) * (l.end - l.start)),
        })),
  );
  // the eight days of the wheel of the year, as small wheels threaded on the
  // line, never closer to a moon than its circle allows
  $: wheelDays = theta.length
    ? lunations.flatMap((l, i) =>
        l.items
          .filter((it) => it.wheel)
          .map((it) => {
            const room = i < lunations.length - 1 ? gap(i) + 60 / Math.hypot(at(i + 1).x - at(i).x, at(i + 1).y - at(i).y) : 0.2;
            const t = Math.min(Math.max(i + (it.at - l.start) / (l.end - l.start), i + room), i + 1 - room);
            return { ...it, t, turn: /solstice|equinox/i.test(it.title) };
          }),
      )
    : [];

  // the line stops short of each moon's circle, so nothing crosses it
  function gap(i) {
    const a = at(i);
    const b = at(i + 1);
    return (D / 2 + 16) / Math.hypot(b.x - a.x, b.y - a.y);
  }

  const tintOf = (ms) => {
    const [paper, ember, rose, sprout] = seasonColours(ms).map(([, v]) => v);
    return { paper, ember, rose, sprout };
  };

  // --- the camera ------------------------------------------------------------
  let world;
  let vw = 1200;
  let vh = 800;
  let cam = { x: 0, y: 0, ls: Math.log(0.2) };
  let level = 0;
  let li = 0;
  let busy = false;
  const TOP = 90;
  const BOTTOM = 90;

  function frame() {
    if (level === 0 && compass) {
      // the whole compass, its words included, in view
      // on a phone the words keep their own size on screen, so room is
      // kept for them in pixels around the spiral instead
      if (phone) return { x: 0, y: 0, w: 2 * rose.halfW, h: 2 * rose.halfH, side: 34, sideY: 40 };
      return { x: 0, y: 0, w: 2 * rose.halfW, h: 2 * rose.halfH, side: vw < 900 ? 12 : 250 };
    }
    if (level === 0) {
      const r = R0 + TURN * ((theta[theta.length - 1] - theta[0]) / (Math.PI * 2)) + D / 2 + 140;
      return { x: 0, y: 0, w: 2 * r, h: 2 * r };
    }
    const p = at(li);
    return { x: p.x, y: p.y, w: D * 1.2, h: D * 1.2 };
  }

  function apply() {
    if (!world) return;
    const s = Math.exp(cam.ls);
    const cy = TOP + (vh - TOP - BOTTOM) / 2;
    world.style.transform = `translate(${vw / 2 - cam.x * s}px, ${cy - cam.y * s}px) scale(${s})`;
    world.style.setProperty('--inv', 1 / s);
  }

  // Close up, the lunation's own circle grows until its paper fills the
  // screen, and its page rises inside it; going on to the next moon eases
  // back a little, glides along the spiral, and grows into the next one
  const fill = () => (Math.hypot(vw, vh) * 1.12) / D;
  let travelling = false;
  function fly(instant = false, from = null) {
    if (!theta.length) return;
    const f = frame();
    // beside the compass, room for the map and the key on either side
    const s = level === 1 ? fill() : Math.min((vw - 2 * (f.side ?? vw * 0.03)) / f.w, ((vh - TOP - BOTTOM - 2 * (f.sideY ?? 0)) * 0.96) / f.h);
    const to = { x: f.x, y: f.y, ls: Math.log(s) };
    // seen from afar with the moons drawn small, they show only their numbers
    if (level === 0) small = s * D < 30;
    gsap.killTweensOf(cam);
    if (instant) {
      Object.assign(cam, to);
      return apply();
    }
    // between two moons close up, the page steps aside, the camera eases
    // back just enough to see the curve, glides round the spiral along the
    // line itself, and grows into the next moon: one circular movement
    if (level === 1 && from !== null && from !== li && Math.abs(cam.ls - to.ls) < 0.2) {
      const near = to.ls;
      const far = Math.log(Math.min(vw, vh - TOP - BOTTOM) / (D * 2.8));
      const t0 = from;
      const t1 = li;
      const o = { p: 0 };
      busy = true;
      travelling = true;
      gsap.to(o, {
        p: 1,
        duration: Math.min(1.9 + 0.35 * (Math.abs(t1 - t0) - 1), 3.2),
        ease: 'sine.inOut',
        onUpdate() {
          const q = at(t0 + (t1 - t0) * o.p);
          cam.x = q.x;
          cam.y = q.y;
          cam.ls = near + (far - near) * Math.sin(Math.PI * o.p) ** 0.8;
          apply();
        },
        onComplete() {
          Object.assign(cam, to);
          apply();
          travelling = false;
          busy = false;
        },
      });
      return;
    }
    busy = true;
    gsap.to(cam, { ...to, duration: 1.5, ease: 'sine.inOut', onUpdate: apply, onComplete: () => (busy = false) });
  }

  // the title and the three below change one after the other: the old
  // fades away, then the new comes in, so they never sit over each other
  const fadeOut = (node) => ({ duration: 260, css: (t) => `opacity: ${t}` });
  const fadeIn = (node) => ({ delay: 280, duration: 420, css: (t) => `opacity: ${t}; transform: translateY(${(1 - t) * 6}px)` });

  function go(l, i = li) {
    const from = level === 1 && l === 1 ? li : null;
    level = l;
    li = Math.max(0, Math.min(lunations.length - 1, i));
    fly(false, from);
  }

  function step(dir) {
    const n = lunations.length;
    if (level === 0) return dir > 0 ? go(1, nowIndex) : null;
    if (dir > 0) return li < n - 1 ? go(1, li + 1) : go(0);
    return li > 0 ? go(1, li - 1) : go(0);
  }

  // Scrolling steps one moon at a time; a quick, long scroll back (or a
  // pinch out) returns at once to the whole spiral
  let acc = 0;
  let accTimer;
  let burst = 0;
  let burstTimer;
  function canScroll(el, dy) {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      if (e.scrollHeight > e.clientHeight + 2 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)) {
        if (dy > 0 && e.scrollTop + e.clientHeight < e.scrollHeight - 2) return true;
        if (dy < 0 && e.scrollTop > 2) return true;
      }
    }
    return false;
  }
  function onWheel(e) {
    if (canScroll(e.target, e.deltaY)) return;
    e.preventDefault();
    if (level === 1 && linear && !e.ctrlKey) return pan(pos + (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) / segPx);
    if (level === 1 && e.ctrlKey && e.deltaY > 0) return go(0);
    burst += e.deltaY;
    clearTimeout(burstTimer);
    burstTimer = setTimeout(() => (burst = 0), 400);
    if (level === 1 && burst < -450) {
      burst = 0;
      return go(0);
    }
    if (busy) return;
    acc += e.deltaY;
    clearTimeout(accTimer);
    accTimer = setTimeout(() => (acc = 0), 200);
    if (Math.abs(acc) > 60) {
      step(Math.sign(acc));
      acc = 0;
    }
  }

  function onKey(e) {
    if (e.target.closest?.('input, textarea, select')) return;
    if (level === 1 && linear && ['ArrowRight', 'ArrowLeft'].includes(e.key)) {
      pan(pos + (e.key === 'ArrowRight' ? 0.25 : -0.25));
      return e.preventDefault();
    }
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) step(1);
    else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) step(-1);
    else if (e.key === 'Escape') go(0);
    else return;
    e.preventDefault();
  }

  let touch = null;
  const onTouchStart = (e) => (touch = { x: e.touches[0].clientX, y: e.touches[0].clientY });
  function onTouchEnd(e) {
    if (!touch) return;
    const dx = touch.x - e.changedTouches[0].clientX;
    const dy = touch.y - e.changedTouches[0].clientY;
    touch = null;
    const d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
    if (Math.abs(d) > 50) step(Math.sign(d));
  }

  function resize() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    const was = phone;
    phone = vw < 640;
    if (theta.length && (was !== phone || !rose)) rose = buildRose();
    fly(true);
  }

  // --- the colours of where you are ------------------------------------------
  let page;
  let nowIndex = 0;
  $: shown = lunations[level === 1 ? li : nowIndex];
  $: if (page && shown) {
    for (const [k, v] of Object.entries(shown.tint)) page.style.setProperty(`--tl-${k}`, v);
  }

  // --- what is on --------------------------------------------------------------
  const visible = (it) => member || it.visibility !== 'members';
  const itemsOf = (l) => l.items.filter(visible);
  const idx = (index) => lunations.findIndex((l) => l.index === index);

  // the notes with a day grow from the line at that day, as leaves on
  // twigs, their words beside them. Each first tries the lowest row,
  // its twig bending right when an earlier one is in the way (a twig stays
  // under the leaves of its row, so it never crosses one); only when there
  // is no room does it rise a row, on a straight twig clear of everything
  // below. No leaf or its words ever touch another, and no twig crosses one.
  const LIFT = 34;
  const ROW = 64;
  // measured, not guessed: the width of one lunation's stretch of line on
  // this screen, and on narrow screens, narrower words
  let segW = 0;
  // Two ways to read the close-up: moon by moon, or along the line, where
  // two lunations stand side by side and the line can be dragged, scrolled
  // sideways or slid along, back and forth through the year (as on the Miro)
  let linear = false;
  const SCALE = 0.5; // along the line, at rest, a lunation is half the width
  // how many lunations are in view: two at rest; sliding fast, the line
  // eases out to see many at once, and back in as it slows
  const REST = 1 / SCALE;
  const WIDEST = 8;
  let vis = REST;
  let pos = 0; // along the line: the lunation at the left edge (fractional)
  let panning = false;
  let panTimer;
  const clampPos = (p) => Math.max(-0.5, Math.min(lunations.length - vis + 0.5, p));
  const centreOf = () => Math.max(0, Math.min(lunations.length - 1, Math.floor(pos + vis / 2)));
  // speed of sliding, in lunations a second, smoothed
  let speed = 0;
  let lastPan = 0;
  let zoomFrame = 0;
  function zoomLoop() {
    const idle = performance.now() - lastPan > 90;
    if (idle) speed *= 0.86;
    const target = Math.min(WIDEST, REST + Math.max(0, speed - 1.2) * 1.4);
    const centre = pos + vis / 2;
    vis += (target - vis) * 0.12;
    pos = clampPos(centre - vis / 2);
    li = centreOf();
    if (Math.abs(vis - REST) < 0.01 && speed < 0.05) {
      vis = REST;
      pos = clampPos(pos);
      zoomFrame = 0;
      return;
    }
    zoomFrame = requestAnimationFrame(zoomLoop);
  }
  const pan = (to) => {
    const t = performance.now();
    const next = clampPos(to);
    const dt = Math.max(8, t - lastPan) / 1000;
    if (t - lastPan < 250) speed = speed * 0.6 + (Math.abs(next - pos) / dt) * 0.4;
    lastPan = t;
    pos = next;
    li = centreOf();
    panning = true;
    clearTimeout(panTimer);
    panTimer = setTimeout(() => (panning = false), 160);
    if (!zoomFrame) zoomFrame = requestAnimationFrame(zoomLoop);
  };
  function setLinear(on) {
    linear = on;
    dayOpen = null;
    vis = REST;
    speed = 0;
    if (on) pos = Math.max(-0.5, li + 0.5 - REST / 2);
  }
  // zoomed out, the leaves step aside so only the line and its bands show
  $: wide = linear && vis > REST + 0.35;
  // along the line, the moon behind stays the middle one, without a journey
  $: if (linear && level === 1 && theta.length && li >= 0) fly(true);
  // the pinned names sit at the screen's own left edge, where the line runs out
  let lanesEl;
  let lanesInset = 0;
  $: if (lanesEl && vw && linear) lanesInset = lanesEl.getBoundingClientRect().left;
  let scrubEl;
  let scrubbing = false;
  function scrubTo(e) {
    const r = scrubEl.getBoundingClientRect();
    pan(((e.clientX - r.left) / r.width) * n - vis / 2);
  }
  function scrubStart(e) {
    scrubbing = true;
    scrubTo(e);
  }
  let drag = null;
  function dragStart(e) {
    if (!linear || e.button !== 0 || e.target.closest('.leaf, button, a')) return;
    drag = { x: e.clientX, pos, moved: false };
  }
  function dragMove(e) {
    if (scrubbing) return scrubTo(e);
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4) drag.moved = true;
    if (drag.moved) pan(drag.pos - dx / segPx);
  }
  function dragEnd() {
    scrubbing = false;
    if (drag?.moved) setTimeout(() => (drag = null));
    else drag = null;
  }
  $: offset = linear ? pos : li;
  $: trackW = linear ? (n / vis) * 100 : n * 100;
  $: segPx = (segW || 320) * (linear ? SCALE : 1);
  $: compact = segPx < 640;
  $: WORDS = compact ? 0 : 120;
  $: NOTE = compact ? 46 : 42 + WORDS + 14; // the leaf, its words, and a little air
  $: SLIDE = compact ? 70 : Math.max(240, segPx * 0.36);
  $: ROWS = compact ? 2 : 3; // as many as fit above the line
  let picked = null;
  function pinRows(L, list, segPx, NOTE, SLIDE, ROWS) {
    const placed = [];
    return list
      .slice()
      .sort((a, b) => a.at - b.at)
      .map((it, k) => {
        const x = (it.at - L.start) / (L.end - L.start);
        const px = x * segPx;
        for (let row = 0; row < ROWS; row++) {
          const right = Math.max(linear ? 4 : -40, ...placed.filter((p) => p.row === row).map((p) => p.left + NOTE + 10));
          // near the end of the moon, a leaf leans back left so its words stay on screen
          let left = Math.max(px - 16, right);
          if (left + NOTE > segPx) left = segPx - NOTE;
          if (left < right) continue;
          const slid = Math.abs(left - (px - 16)) > 1;
          if (slid && (row > 0 || Math.abs(left - px) > SLIDE)) continue;
          const lo = Math.min(px, left + 16) - 6;
          const hi = Math.max(px, slid ? left + 32 : px) + 6;
          const crossesLower = placed.some((p) => p.row < row && hi > p.left && lo < p.left + NOTE);
          const coversHigher = placed.some((p) => p.row > row && p.px > left - 6 && p.px < left + NOTE + 6);
          if (crossesLower || coversHigher) continue;
          placed.push({ px, row, left });
          const h = LIFT + row * ROW;
          const tx = left - px + 16;
          // on a moon's mark (or the lunation's start), the twig starts just above it
          const marks = [0, ...L.quarters.slice(1).map((q) => ((q.start - L.start) / (L.end - L.start)) * segPx)];
          const y0 = marks.some((m) => Math.abs(m - px) < 16) ? -15 : 0;
          // a twig: straight up with a little sway, or bending over to its leaf
          const twig = slid ? `M0 ${y0} C0 ${-h * 0.75} ${tx * 0.35} ${-h} ${tx} ${-h}` : `M0 ${y0} Q${k % 2 ? 4 : -4} ${-h / 2} 0 ${-h}`;
          return { it, x, row, onMark: y0 < 0, dx: left - px, twig, tilt: slid ? 18 : ((k * 37) % 21) - 10, leaf: { ...leafFor(it.symbol), pigment: KINDS[it.kind]?.colour ?? leafFor(it.symbol).pigment } };
        }
        return null;
      })
      .filter(Boolean);
  }

  // --- filters: which moons to bring forward ---------------------------------
  const CAPITALS = ['Financial', 'Material', 'Living', 'Social', 'Intellectual', 'Experiential', 'Spiritual', 'Cultural'];
  let lean = '';
  let capital = '';
  let person = '';
  let kind = '';
  const capitalsOf = (l) => new Set([...(l.capitals ?? []), ...l.goals.map((g) => g.capital)]);
  $: matches = (l) =>
    (!lean || l.lean === lean) &&
    (!capital || capitalsOf(l).has(capital)) &&
    (!person || PEOPLE[person].some((c) => capitalsOf(l).has(c))) &&
    (!kind || kindsOf(l).has(kind));
  $: filtering = !!(lean || capital || person || kind);
  $: matching = lunations.filter((l) => matches(l)).length;

  // --- the kinds of time, stretches, and who is here ---------------------------
  const LUNE = 29.53 * 86_400_000;
  // samples until Holons answers; then only what Holons holds
  let allStretches = [...stretches(), ...festivals()];
  const allStays = stays();
  // rhythms: recurring quests (the kiosk's orbits), each series with its beats
  let rhythms = [];
  const overlaps = (it, l) => it.at <= l.end && (it.until ?? it.at) >= l.start;
  const kindsOf = (l) => new Set([...l.items.map((it) => it.kind), ...allStretches.filter((x) => overlaps(x, l)).map((x) => x.kind)]);
  $: ofKind = (it) => !kind || it.kind === kind;
  // rows for things that last a while: none touches another, its words
  // included (they stand at its start)
  function lanesOf(list, segPx) {
    const ends = [];
    return list
      .slice()
      .sort((a, b) => a.at - b.at)
      .map((it) => {
        const text = it.who ?? `${it.title}${it.where ? ` · ${it.where}` : ''}${it.status ? ` · ${it.status}` : ''}`;
        const words = ((text.length * 6.4 + 30) / segPx) * LUNE;
        let row = ends.findIndex((e) => e <= it.at - 86_400_000);
        if (row < 0) row = ends.length;
        ends[row] = Math.max(it.until, it.at + words);
        return { it, row };
      });
  }
  // a stretch's part in one lunation
  function inLunation(L, laned) {
    const span = L.end - L.start;
    return laned
      .filter(({ it }) => overlaps(it, L))
      .map(({ it, row }) => ({
        it,
        row,
        x0: (Math.max(it.at, L.start) - L.start) / span,
        x1: (Math.min(it.until, L.end) - L.start) / span,
        cont: it.at < L.start,
      }));
  }
  // laid out for the moon you are at and its neighbours, so no row stands empty
  const near = (it) => lunations.slice(Math.max(0, li - 2), li + 3).some((l) => overlaps(it, l));
  // Under the line, the kinds of time lie as strata, each named, in the same
  // order every time: its stretches, then its rhythms
  const beatsNear = (r) => r.beats.some((b) => lunations.slice(Math.max(0, li - 1), li + 2).some((l) => b.at >= l.start && b.at <= l.end));
  $: strata = lunations.length
    ? (() => {
        let top = 0;
        return Object.keys(KINDS)
          .map((key) => {
            const lanes = lanesOf(allStretches.filter((x) => x.kind === key && near(x, li)), segPx);
            const rows = Math.max(0, ...lanes.map((x) => x.row + 1));
            const beats = rhythms.filter((r) => r.kind === key && beatsNear(r));
            return { key, lanes, rows, beats };
          })
          .filter((g) => g.lanes.length || g.beats.length)
          .map((g) => {
            const at = top;
            top += 18 + g.rows * 26 + g.beats.length * 22 + 8;
            return { ...g, top: at };
          });
      })()
    : [];
  $: strataH = strata.reduce((h, g) => h + 18 + g.rows * 26 + g.beats.length * 22 + 8, 0);
  // what each kind of time holds in this moon
  $: kindCount = here
    ? Object.fromEntries(
        Object.keys(KINDS).map((key) => [
          key,
          itemsOf(here).filter((it) => it.kind === key).length +
            allStretches.filter((x) => x.kind === key && overlaps(x, here)).length +
            rhythms.filter((r) => r.kind === key && r.beats.some((b) => b.at >= here.start && b.at <= here.end)).length,
        ]),
      )
    : {};
  const EVERY = { daily: 'every day', weekly: 'every week', biweekly: 'every two weeks', monthly: 'every month', quarterly: 'every season', sixmonths: 'twice a year', yearly: 'every year' };
  $: stayLanes = member && lunations.length ? lanesOf(allStays.filter((x) => near(x, li)), segPx) : [];
  $: stayRows = Math.max(0, ...stayLanes.map((s) => s.row + 1));
  // how many are here on each day of a lunation
  function headcount(L) {
    const days = Math.round((L.end - L.start) / 86_400_000);
    return Array.from({ length: days }, (_, d) => {
      const t = L.start + (d + 0.5) * 86_400_000;
      return allStays.filter((x) => x.role !== 'keeping' && x.at <= t && x.until >= t).length;
    });
  }
  const ROLE = { host: '#8a6a4a', keeping: '#9a8fb0', volunteer: '#7fa65a', guest: '#d7745c', steward: '#c9a54a' };
  // what stands where in this moon, and the same season a year apart
  $: tally = here
    ? (() => {
        const all = [...itemsOf(here), ...allStretches.filter((x) => overlaps(x, here))];
        const by = (st) => all.filter((it) => it.status === st).length;
        return { remembered: by('remembered'), committed: by('committed'), imagined: by('imagined'), questions: all.filter((it) => it.question).length };
      })()
    : null;
  const YEAR_MS = 365.25 * 86_400_000;
  const sameSeason = (i, dir) => lunations.findIndex((l) => Math.abs(l.start - (lunations[i].start + dir * YEAR_MS)) < 16 * 86_400_000);
  $: yearBefore = here ? sameSeason(li, -1) : -1;
  $: yearAfter = here ? sameSeason(li, 1) : -1;

  // beyond the hundredth: more moons, fading, and then a drift of stipple,
  // still, as in the pattern-language drawings
  const FUTURE = 10;
  let stars = [];
  function starfield() {
    let seed = 3;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const far = at(lunations.length + FUTURE * 0.6).r;
    return Array.from({ length: 140 }, () => {
      // most of them out where the spiral fades, a few anywhere around
      const t = lunations.length - 1 + rand() * (FUTURE + 6);
      const p = at(t);
      const spread = rand() < 0.75 ? (rand() - 0.5) * 700 : (rand() - 0.2) * far;
      return {
        x: p.x + spread * Math.cos(p.a + (rand() - 0.5)),
        y: p.y + spread * Math.sin(p.a + (rand() - 0.5)),
        size: 0.4 + rand() * 1.4,
        tw: 2 + rand() * 4,
        delay: -rand() * 6,
      };
    });
  }

  // a day, opened by tapping the line: everything on it, in one list, as the
  // kiosk lists a day when you hover it
  let dayOpen = null;
  function openDay(e) {
    if (e.target.closest('.leaf, button, a') || drag?.moved) return;
    const r = e.currentTarget.getBoundingClientRect();
    const f = (e.clientX - r.left) / r.width;
    if (f < 0 || f > 1 || !here) return;
    const u = linear ? pos + f * vis : li + f;
    const L = lunations[Math.floor(u)];
    if (!L) return;
    const t = L.start + (u - Math.floor(u)) * (L.end - L.start);
    const d = new Date(t);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    dayOpen = dayOpen === start ? null : start;
  }
  $: if (!linear && here && dayOpen && (dayOpen < here.start - 86_400_000 || dayOpen > here.end)) dayOpen = null;
  $: dayL = dayOpen ? lunations.find((l) => dayOpen + 43_200_000 >= l.start && dayOpen + 43_200_000 <= l.end) ?? here : here;
  $: dayList = dayOpen
    ? (() => {
        const end = dayOpen + 86_400_000;
        const on = (a, b = a) => a < end && b >= dayOpen;
        return [
          ...itemsOf(dayL).filter((it) => on(it.at)).map((it) => ({ what: it.title, how: [it.where, it.status && STATUS[it.status].label].filter(Boolean).join(' · ') })),
          ...rhythms.flatMap((r) => r.beats.filter((b) => on(b.at)).map((b) => ({ what: r.title, how: `${fmt(b.at, { hour: '2-digit', minute: '2-digit' })} · ${EVERY[r.frequency] ?? r.frequency}` }))),
          ...allStretches.filter((x) => on(x.at, x.until)).map((x) => ({ what: x.where ? `${x.title} · ${x.where}` : x.title, how: `${day(x.at)} to ${day(x.until)}${x.status ? ` · ${STATUS[x.status].label}` : ''}` })),
          ...(member ? allStays.filter((x) => on(x.at, x.until)).map((x) => ({ what: x.who, how: 'here · members only' })) : []),
        ];
      })()
    : [];

  let today = null;
  const nowMs = Date.now();
  // the moon tonight, as the kiosk shows it: its phase and how much is lit
  const tonight = (() => {
    const p = moonNow(new Date());
    const f = p.phase;
    const name = f < 0.03 || f > 0.97 ? 'New moon' : f < 0.22 ? 'Waxing crescent' : f < 0.28 ? 'First quarter' : f < 0.47 ? 'Waxing gibbous' : f < 0.53 ? 'Full moon' : f < 0.72 ? 'Waning gibbous' : f < 0.78 ? 'Last quarter' : 'Waning crescent';
    return { name, lit: Math.round(p.illuminated * 100) };
  })();
  onMount(async () => {
    document.body.dataset.ownScroll = '';
    for (const name of ['paper', 'ember', 'rose', 'sprout']) {
      try {
        CSS.registerProperty({ name: `--tl-${name}`, syntax: '<color>', inherits: true, initialValue: '#fffaf2' });
      } catch {}
    }
    const data = await loadTimeline();
    lunations = data.lunations.map((l) => ({ ...l, tint: tintOf(l.start), heat: heatAt((l.start + l.end) / 2), lny: lunarNewYear(l.start) }));
    theta = angles(lunations);
    rose = buildRose();
    stars = starfield();
    live = data.live;
    if (live) allStretches = [...data.spans, ...festivals()];
    const bySeries = new Map();
    for (const b of data.rhythms) {
      if (!bySeries.has(b.series)) bySeries.set(b.series, { ...b, id: b.series, beats: [] });
      bySeries.get(b.series).beats.push(b);
    }
    rhythms = [...bySeries.values()];
    nowIndex = Math.max(0, lunations.findIndex((l) => l.now));
    li = nowIndex;
    const nowL = lunations[nowIndex];
    if (nowL?.now) today = nowIndex - 0.5 + (Date.now() - nowL.start) / (nowL.end - nowL.start);
    resize();
    world.parentElement.addEventListener('wheel', onWheel, { passive: false });
    // arriving from elsewhere with ?at=now (or ?at=86): show the spiral a
    // moment, then glide into that lunation
    const want = new URLSearchParams(location.search).get('at');
    if (want) {
      const i = want === 'now' ? nowIndex : idx(Number(want));
      if (i >= 0) setTimeout(() => go(1, i), 900);
    }
  });

  // --- dates, and what a lunation brings --------------------------------------
  const fmt = (ms, o) => new Date(ms).toLocaleDateString('en-GB', { timeZone: 'Europe/Rome', ...o });
  const day = (ms) => fmt(ms, { day: 'numeric', month: 'short' });
  const yearOf = (ms) => fmt(ms, { year: 'numeric' });
  $: n = lunations.length;
  $: here = lunations[li];
  $: next = lunations[li + 1];
  $: years = lunations.slice(1).flatMap((l, k) => (yearOf(l.start) !== yearOf(lunations[k].start) ? [{ t: k + 0.5, year: yearOf(l.start) }] : []));
  $: along = (ms) => (here ? (ms - here.start) / (here.end - here.start) : 0);
  const hm = (min) => `${Math.floor(Math.abs(min) / 60) ? `${Math.floor(Math.abs(min) / 60)} h ` : ''}${Math.abs(min) % 60} min`;
  const turning = (s) => /solstice|equinox/i.test(s);
  // personal, local and global, always in that order
  function realms(l) {
    const phases = l.quarters.map((q) => `${q.name}, ${day(q.start)}`);
    return [
      {
        key: 'personal',
        title: 'Personal',
        lines: [l.sky?.newMoon, l.sky?.fullMoon, ...(l.sky?.sun ?? []).filter((s) => !turning(s))].filter(Boolean),
        note: 'The sky everyone shares. Signed in with Holons, this becomes personal: read with your own chart and Gene Keys.',
      },
      {
        key: 'local',
        title: 'Local',
        lines: [
          ...(l.local ?? []),
          `The sun over the village: ${l.sunAt.first.rise}–${l.sunAt.first.set} at the start, ${l.sunAt.last.rise}–${l.sunAt.last.set} by the end; the days grow ${l.sunAt.change >= 0 ? 'longer' : 'shorter'} by ${hm(l.sunAt.change)}.`,
        ],
      },
      {
        key: 'global',
        title: 'Global',
        lines: [...(l.sky?.sun ?? []).filter(turning), ...phases, ...(l.global ?? [])],
      },
    ];
  }
</script>

<svelte:window on:resize={resize} on:keydown={onKey} on:pointermove={dragMove} on:pointerup={dragEnd} />

<main class="tl" class:close={level === 1 && !travelling} bind:this={page} on:touchstart|passive={onTouchStart} on:touchend={onTouchEnd}>
  <div class="glow" aria-hidden="true"></div>
  <svg width="0" height="0" style="position: absolute" aria-hidden="true">
    <filter id="tl-wash" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="4" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" />
    </filter>
  </svg>
  <div class="threads"><Mycelium opacity={0.2} /></div>
  <div class="world" class:phone class:small bind:this={world} data-level={level}>
    {#if n && compass && rose}
      <svg class="path compass" viewBox="-5000 -5000 10000 10000" aria-hidden="true">
        <defs>
          <radialGradient id="rose-fade" cx="0" cy="0" r={rose.reach} gradientUnits="userSpaceOnUse">
            <stop offset="0.08" stop-color="#fff" stop-opacity="0" />
            <stop offset="0.3" stop-color="#fff" stop-opacity="1" />
            <stop offset="0.8" stop-color="#fff" stop-opacity="0.85" />
            <stop offset="1" stop-color="#fff" stop-opacity="0" />
          </radialGradient>
          <mask id="rose-mask" maskUnits="userSpaceOnUse" x="-5000" y="-5000" width="10000" height="10000">
            <rect x="-5000" y="-5000" width="10000" height="10000" fill="url(#rose-fade)" />
          </mask>
        </defs>
        <!-- the four quarters of the year, each in its own wash -->
        <g mask="url(#rose-mask)">
          {#each rose.quarters as q}<path class="quarter" d={wedge(q.a0, q.a1, rose.reach)} style="fill: {q.colour}" />{/each}
        </g>
        <!-- the cross of solstices and equinoxes, never over the spiral or its words -->
        {#each rose.points as pt}
          {@const c = Math.cos(pt.a)}
          {@const s = Math.sin(pt.a)}
          <path class="axis" d="M{hubClear(pt.a) * c} {hubClear(pt.a) * s}L{pt.inner * c} {pt.inner * s}" />
          {#if !phone}<path class="axis" d="M{pt.outer * c} {pt.outer * s}L{(pt.outer + 150) * c} {(pt.outer + 150) * s}" />{/if}
        {/each}
        <!-- where the solar year turns along the line -->
        {#each rose.solstices as t}
          {@const a = out(t, -38)}
          {@const b = out(t, -112)}
          <path class="solar" d="M{a.x} {a.y}L{b.x} {b.y}" />
        {/each}
        <!-- the Chinese New Year, a seal by its moon -->
        {#each phone ? [] : newYears as l}
          {@const p = out(idx(l.index), -(D / 2 + 72))}
          <circle class="seal" cx={p.x} cy={p.y} />
        {/each}
      </svg>
      {#each rose.points as pt}
        {@const r = pt.at}
        <div class="label cmp" class:east={Math.cos(pt.a) > 0.9} class:west={Math.cos(pt.a) < -0.9} style="transform: translate({r * Math.cos(pt.a)}px, {r * Math.sin(pt.a)}px)">
          <div style="transform: translate({anchor(pt.a)})"><b>{pt.name}</b><span>{pt.note}</span></div>
        </div>
      {/each}
      {#each rose.quarters.filter((q) => !q.hidden) as q}
        {@const r = q.outer + 120}
        <div class="label cmp quarter-name" style="transform: translate({r * Math.cos(q.a)}px, {r * Math.sin(q.a)}px)">
          <div style="transform: translate({anchor(q.a)}); --c: {q.colour}">{q.name}</div>
        </div>
      {/each}
    {/if}
    {#if n}
      <svg class="path" viewBox="-5000 -5000 10000 10000" aria-hidden="true">
        <!-- the line, each lunation's stretch in its season's colour -->
        <!-- one band, its colour flowing with the warmth of the year, and one
             thread along it; the moons sit on top -->
        <g class="bands">
          {#each bandBits as b}<path d={stretch(b.t0, b.t1, 4)} style="stroke: {b.colour}" />{/each}
        </g>
        <path class="thread" d={stretch(0, n - 1, 600)} />
        {#each wheelDays as w}
          {@const p = at(w.t)}
          <g class="wheel-day" class:turn={w.turn} style="transform: translate({p.x}px, {p.y}px) scale(var(--inv, 1))">
            <title>{w.title}, {day(w.at)}</title>
            <circle r="6.5" />
            {#each Array(8) as _, k}<path d="M0 0L{6.5 * Math.cos((k * Math.PI) / 4)} {6.5 * Math.sin((k * Math.PI) / 4)}" />{/each}
          </g>
        {/each}
        <!-- and on beyond the hundredth: the spiral fades out into the stars -->
        {#each Array(FUTURE * 4) as _, k}
          <path class="future" d={stretch(n - 1 + k / 4, n - 1 + (k + 1) / 4, 6)} style="opacity: {0.5 * (1 - k / (FUTURE * 4)) ** 1.3}" />
        {/each}
        {#each years as y}
          <path class="year-tick" d={`M${at(y.t).x} ${at(y.t).y}L${out(y.t, -90).x} ${out(y.t, -90).y}`} />
        {/each}
        <!-- longer stretches, between the turns, their names along them -->
        {#each SPANS as sp, k}
          {#if idx(sp.from) >= 0 && idx(sp.to) >= 0}
            {@const upright = Math.sin(thetaAt((idx(sp.from) + idx(sp.to)) / 2)) > 0}
            <path id="span-{k}" class="span" d={upright ? stretch(idx(sp.to) + 0.4, idx(sp.from) - 0.4, 40, D / 2 + 70) : stretch(idx(sp.from) - 0.4, idx(sp.to) + 0.4, 40, D / 2 + 70)} style="stroke: {sp.colour}" />
            <text class="span-text"><textPath href="#span-{k}" startOffset="50%" text-anchor="middle">{sp.title}</textPath></text>
          {/if}
        {/each}
      </svg>

      {#each years as y}
        {@const p = out(y.t, -175)}
        <span class="label year" style="transform: translate({p.x}px, {p.y}px)">{y.year}</span>
      {/each}

      {#each Array(FUTURE) as _, k}
        {@const p = at(n + k)}
        <span class="ghost" style="transform: translate({p.x}px, {p.y}px); opacity: {0.6 * (1 - k / FUTURE) ** 1.4}; --s: {1 - k / (FUTURE * 1.6)}">
          {#if k < 4}<b>{lunations[n - 1].index + k + 1}</b>{/if}
        </span>
      {/each}
      <svg class="path" viewBox="-5000 -5000 10000 10000" aria-hidden="true">
        {#each stars as st}<circle class="speck" cx={st.x} cy={st.y} r={st.size * 4} />{/each}
      </svg>

      <div class="hub">
        <p class="hub-eyebrow">the village's year in moons</p>
        <p class="hub-title">Lunation {lunations[0].index} → {lunations[n - 1].index}</p>
        <button class="hub-now" on:click={() => go(1, nowIndex)}>go to now →</button>
      </div>
    {/if}

    {#each lunations as l, i}
      {@const p = at(i)}
      <button
        class="moon"
        class:now={l.now}
        class:hundred={l.index === 100}
        class:dim={!matches(l)}
        class:focused={level === 1 && li === i}
        style="transform: translate({p.x - D / 2}px, {p.y - D / 2}px); --glow: color-mix(in srgb, {l.heat} 55%, #fffaf2); --glow2: color-mix(in srgb, {l.heat} 45%, transparent)"
        on:click={() => go(1, i)}
        aria-label="Lunation {l.index}: {l.name}, from {day(l.start)}"
      >
        <Ring seed={i + 40} />
        <span class="num">{l.index}</span>
        <span class="when">{l.now ? 'now' : day(l.start)}</span>
      </button>
    {/each}
  </div>

  <!-- close up: the same order every time -->
  {#if level === 1 && here}
      <section class="closeup" class:linear class:wide class:away={travelling} on:scroll={(e) => e.currentTarget.scrollLeft && (e.currentTarget.scrollLeft = 0)} out:rise={{ y: 16, duration: 220 }}>
        <!-- the title and the three below change in place, one after the
             other (never over each other), as the line flows on -->
        <!-- along the line, no single moon heads the page: each names itself on
             the line, and only the kinds of time stay up here -->
        {#if linear}
          <div class="line-head">
            <span>kinds of time</span>
            {#each Object.entries(KINDS) as [key, k]}
              <button type="button" class="kind-chip" class:on={kind === key} style="--c: {k.colour}" title={k.note} on:click={() => (kind = kind === key ? '' : key)} aria-pressed={kind === key}><i></i>{k.label}</button>
            {/each}
          </div>
        {/if}
        {#key linear ? -1 : here.index}
        <header class="title" in:fadeIn out:fadeOut>
          <LunationArt l={here} size={124} />
          <div>
            <h2>Lunation {here.index} <span class="name">{here.name}</span></h2>
            <p class="meta">{here.from} – {here.to} {here.year} · {here.season}{#if here.now} · tonight: {tonight.name.toLowerCase()}, {tonight.lit}% lit{/if}</p>
            <dl class="facts">
              <div>
                <dt>Themes</dt>
                <dd>
                  <span class="theme">{here.theme}</span>
                  {#each SPANS.filter((sp) => here.index >= sp.from && here.index <= sp.to) as sp}
                    <span class="tag" style="--c: {sp.colour}">{sp.title}</span>
                  {/each}
                  {#if here.presence}
                    <span class="tag lantern" title="{here.presence.note} The details are for members only, kept by Holons' permissions.">{here.presence.public}</span>
                  {/if}
                </dd>
              </div>
              <div>
                <dt>Goals</dt>
                <dd>
                  {#each here.goals as g}
                    <span class="goal"><b>{g.capital}</b> {g.item}</span>
                  {/each}
                </dd>
              </div>
              <div>
                <dt>Kinds of time</dt>
                <dd class="kinds">
                  {#each Object.entries(KINDS) as [key, k]}
                    <button type="button" class="kind-chip" class:on={kind === key} class:none={!kindCount[key]} style="--c: {k.colour}" title={k.note} on:click={() => (kind = kind === key ? '' : key)} aria-pressed={kind === key}>
                      <i></i>{k.label}<small>{kindCount[key] ?? 0}</small>
                    </button>
                  {/each}
                </dd>
              </div>
              {#if tally}
                <div>
                  <dt>This moon</dt>
                  <dd class="tally">
                    {#if tally.remembered}<span>{tally.remembered} remembered</span>{/if}
                    {#if tally.committed}<span>{tally.committed} committed</span>{/if}
                    {#if tally.imagined}<span>{tally.imagined} imagined</span>{/if}
                    {#if tally.questions}<span>{tally.questions} {tally.questions === 1 ? 'question' : 'questions'} to decide</span>{/if}
                    {#if !tally.remembered && !tally.committed && !tally.imagined}<span>nothing of the village's own yet</span>{/if}
                  </dd>
                </div>
              {/if}
              {#if yearBefore >= 0 || yearAfter >= 0}
                <div>
                  <dt>Across years</dt>
                  <dd class="years">
                    {#if yearBefore >= 0}<button type="button" on:click={() => go(1, yearBefore)}>← the same season a year before: Lunation {lunations[yearBefore].index}</button>{/if}
                    {#if yearAfter >= 0}<button type="button" on:click={() => go(1, yearAfter)}>the same season a year on: Lunation {lunations[yearAfter].index} →</button>{/if}
                  </dd>
                </div>
              {/if}
            </dl>
          </div>
        </header>

        {/key}

        <!-- the line of the weeks: every lunation end to end, as one ribbon
             that flows along to the next, like moving round the spiral -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="line-area" class:grab={linear} bind:clientWidth={segW} on:click={openDay} on:pointerdown={dragStart}>
          <div class="track" class:panning style="width: {trackW}%; transform: translateX({(-offset * 100) / n}%)">
          <svg class="line" viewBox="0 0 1000 20" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 10 C200 8 400 12 600 9 S860 11 1000 10" />
          </svg>
          {#each lunations as L, li2}
          <div class="seg" class:here={linear ? li2 >= Math.floor(pos) && li2 <= Math.ceil(pos + 1) : li2 === li} class:first={li2 === Math.max(0, Math.floor(pos))} style="left: {(li2 * 100) / n}%; width: {100 / n}%">
          <div class="end start"><i></i><span>{#if linear}<button type="button" class="moon-name" on:click={() => (setLinear(false), go(1, li2))} title="read this moon">Lunation {L.index} · {L.name}</button>{:else}Lunation {L.index}{/if}<br />{day(L.start)}</span></div>
          {#each L.quarters as q, k}
            {@const x0 = (q.start - L.start) / (L.end - L.start)}
            {@const x1 = (q.end - L.start) / (L.end - L.start)}
            {#if k > 0}
              <div class="phase-mark" class:today={L.now && Math.abs(((nowMs - L.start) / (L.end - L.start) - x0) * segPx) < 22} style="left: {x0 * 100}%">
                <svg viewBox="-10 -10 20 20" aria-hidden="true">
                  <circle r="8" class="dark" />
                  {#if k === 1}<path d="M0 -8 A8 8 0 0 1 0 8Z" class="lit" />{/if}
                  {#if k === 2}<circle r="8" class="lit" />{/if}
                  {#if k === 3}<path d="M0 -8 A8 8 0 0 0 0 8Z" class="lit" />{/if}
                </svg>
                <span>{day(q.start)}</span>
              </div>
            {/if}
          {/each}
          {#if dayOpen && dayOpen + 43_200_000 >= L.start && dayOpen + 43_200_000 < L.end}
            <div class="day-band" style="left: {((dayOpen - L.start) / (L.end - L.start)) * 100}%; width: {(86_400_000 / (L.end - L.start)) * 100}%"></div>
          {/if}
          {#if L.now && !L.quarters.slice(1).some((q) => Math.abs(((nowMs - q.start) / (L.end - L.start)) * segPx) < 22)}
            <div class="today-mark" style="left: {((nowMs - L.start) / (L.end - L.start)) * 100}%" title="today"></div>
          {/if}
          {#each pinRows(L, itemsOf(L).filter((it) => it.at), segPx, NOTE, SLIDE, ROWS) as pn, k (pn.it.id)}
            <div class="pin {pn.it.status ?? ''}" class:faded={kind && pn.it.kind !== kind} class:on-mark={pn.onMark} style="--ww: {WORDS}px; left: {pn.x * 100}%; --row: {pn.row}; --dx: {pn.dx}px; --d: {250 + k * 140}ms">
              <svg class="stem" aria-hidden="true">
                <path class="twig" d={pn.twig} />
                <g class="leaf" role="button" tabindex="-1" aria-label={pn.it.title} on:click={() => (picked = pn.it)} on:keydown={() => (picked = pn.it)} transform="translate({pn.dx + 16} {-(LIFT + pn.row * ROW)}) rotate({pn.tilt}) scale(1.5)" style="--pig: {pn.leaf.pigment}">
                  <g class="unfurl">
                    <path class="blade" d={pn.leaf.shape} />
                    {#each pn.leaf.veins as v}<path class="vein" d={v} />{/each}
                  </g>
                </g>
              </svg>
              <div class="words" class:hidden={compact} title={pn.it.title}>
                <b>{pn.it.title}</b><small>{day(pn.it.at)}{#if pn.it.where} · {pn.it.where}{/if}{#if pn.it.status} · {STATUS[pn.it.status].label}{/if}{#if pn.it.visibility === 'members'} · members{/if}</small>
              </div>
            </div>
          {/each}
          </div>
          {/each}
          </div>
        </div>

        <!-- under the line: what lasts a while (the land's work, residencies,
             reflection), and, for members, who is here and for how long -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="lanes" bind:this={lanesEl} class:grab={linear} on:pointerdown={dragStart} style="height: {strataH + (member ? 34 + stayRows * 22 + 22 : 0)}px">
          {#if linear}
            <!-- along the line, each kind and rhythm keeps its name at the left -->
            <div class="pinned-names" style="left: {-lanesInset}px">
              {#each strata as g (g.key)}
                <p class="stratum-name" class:faded={kind && kind !== g.key} style="top: {g.top}px; --c: {KINDS[g.key].colour}">{KINDS[g.key].label} time</p>
                {#each g.beats as r, k (r.id)}
                  <p class="rhythm-name" class:faded={kind && kind !== g.key} style="top: {g.top + 18 + g.rows * 26 + k * 22}px">{r.title} · {EVERY[r.frequency] ?? r.frequency}</p>
                {/each}
              {/each}
            </div>
          {/if}
          <div class="track" class:panning style="width: {trackW}%; transform: translateX({(-offset * 100) / n}%)">
            {#each lunations as L, li2}
              <div class="seg" class:here={linear ? li2 >= Math.floor(pos) && li2 <= Math.ceil(pos + 1) : li2 === li} class:first={li2 === Math.max(0, Math.floor(pos))} style="left: {(li2 * 100) / n}%; width: {100 / n}%">
                {#each strata as g (g.key)}
                  <div class="stratum" class:faded={kind && kind !== g.key} style="top: {g.top}px; --c: {KINDS[g.key].colour}">
                    <p class="stratum-name">{KINDS[g.key].label} time</p>
                    {#each inLunation(L, g.lanes) as b (b.it.id)}
                      <div class="stretch {b.it.status ?? 'land'}" style="left: {b.x0 * 100}%; width: {(b.x1 - b.x0) * 100}%; top: {18 + b.row * 26}px" title="{b.it.title}, {day(b.it.at)} to {day(b.it.until)}{b.it.status ? ` · ${STATUS[b.it.status].label}` : ''}">
                        <span class:cont={b.cont}>{b.it.title}{#if b.it.where} · {b.it.where}{/if}{#if b.it.status && !b.cont} · {STATUS[b.it.status].label}{/if}</span><i></i>
                      </div>
                    {/each}
                    {#each g.beats as r, k (r.id)}
                      <div class="rhythm" style="top: {18 + g.rows * 26 + k * 22}px" title="{r.title}, {EVERY[r.frequency] ?? r.frequency}">
                        <span>{r.title} · {EVERY[r.frequency] ?? r.frequency}</span>
                        {#each r.beats.filter((b) => b.at >= L.start && b.at <= L.end) as b (b.id)}
                          <i class:done={b.done} style="left: {((b.at - L.start) / (L.end - L.start)) * 100}%"></i>
                        {/each}
                      </div>
                    {/each}
                  </div>
                {/each}
                {#if member}
                  <p class="who-here" style="top: {strataH + 8}px">who is here · members only</p>
                  {#each inLunation(L, stayLanes) as b (b.it.id)}
                    <div class="stay" class:keeping={b.it.role === 'keeping'} style="left: {b.x0 * 100}%; width: {(b.x1 - b.x0) * 100}%; top: {strataH + 30 + b.row * 22}px; --c: {ROLE[b.it.role]}" title="{b.it.who}, {day(b.it.at)} to {day(b.it.until)}">
                      <span class:cont={b.cont}>{b.it.who}</span><i></i>
                    </div>
                  {/each}
                  <div class="headcount" style="top: {strataH + 34 + stayRows * 22}px" title="how many are here, day by day">
                    {#each headcount(L) as c}<i style="height: {2 + c * 3}px"></i>{/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </div>

        <!-- on a narrow screen the leaves stand alone; a tap reads one here -->
        <!-- along the line: the whole year in small, the part in view marked;
             drag it, or tap a moon to go there -->
        {#if linear}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <button type="button" class="to-spiral" title="back to the whole spiral" aria-label="Back to the whole spiral" on:click={() => go(0)}><svg viewBox="-10 -10 20 20" aria-hidden="true"><path d="M0 0 C0 -1.6 2 -1.6 2 0 C2 2.6 -2.6 3 -3 0 C-3.4 -4 3.6 -4.6 4.6 0 C5.6 5 -4.8 6 -6 0 C-7 -6 4 -8 8 -3" /></svg></button>
          <div class="scrub" bind:this={scrubEl} on:pointerdown={scrubStart}>
            {#each lunations as L, i}
              <span class:now={L.now} style="left: {((i + 0.5) / n) * 100}%">{L.index}</span>
            {/each}
            <i class="scrub-window" style="left: {(pos / n) * 100}%; width: {(vis / n) * 100}%"></i>
          </div>
        {/if}

        <div class="below">
          {#if dayOpen}
            <section class="day-sheet" aria-live="polite">
              <h4>{fmt(dayOpen, { weekday: 'long', day: 'numeric', month: 'long' })}<button type="button" on:click={() => (dayOpen = null)} aria-label="Close the day">×</button></h4>
              {#if dayList.length}
                <ul>{#each dayList as d}<li><b>{d.what}</b>{#if d.how}<span>{d.how}</span>{/if}</li>{/each}</ul>
              {:else}
                <p>Nothing noted on this day.</p>
              {/if}
            </section>
          {/if}
          <ul class="legend" aria-label="How to read the line">
            <li><svg viewBox="-12 -30 24 32" class="lg committed"><path d="M0 0 C-11 -8 -12 -22 0 -31 C12 -22 11 -8 0 0Z" /></svg>committed</li>
            <li><svg viewBox="-12 -30 24 32" class="lg imagined"><path d="M0 0 C-11 -8 -12 -22 0 -31 C12 -22 11 -8 0 0Z" /></svg>imagined</li>
            <li><svg viewBox="-12 -30 24 32" class="lg remembered"><path d="M0 0 C-11 -8 -12 -22 0 -31 C12 -22 11 -8 0 0Z" /></svg>remembered</li>
            <li><svg viewBox="-13 -29 26 31" class="lg question"><path d="M-1 0 L1 -6 C-9 -6 -13 -13 -11 -20 C-9 -28 9 -28 11 -20 C13 -13 9 -6 4 -6Z" /><path class="q" d="M-3 -19 C-3 -24 4 -24 4 -20 C4 -17 0 -17 0 -13M0 -10 L0 -9.6" /></svg>a question to decide</li>
            <li><i class="lg-today"></i>today</li>
            <li class="lg-note">tap the line to open a day · samples until Holons holds the village's own</li>
          </ul>
          {#if compact && itemsOf(here).some((it) => it.at)}
            <p class="picked">
              {#if picked && picked.lunation === here.index}{picked.title} · {day(picked.at)}{:else}tap a leaf to read it{/if}
            </p>
          {/if}
          {#if !itemsOf(here).filter((it) => !it.pinned && !it.sample).length}
            {#if member}
              <p class="quiet">Nothing noted in Holons for this lunation yet.</p>
            {:else}
              <p class="quiet">
                This lunation may already be in planning, and what's on will show here.
                Would you like to co-create it with us? <a href="/apply">Apply to visit or to join as a member</a>.
              </p>
            {/if}
          {/if}
        </div>

        <!-- personal, local, global: always these three -->
        {#key linear ? -1 : here.index}
        <div class="realms" in:fadeIn out:fadeOut>
          {#each realms(here) as r}
            <section class="realm" class:lean={here.lean === r.key}>
              <h3>{r.title}{#if here.lean === r.key}<span class="leans">this moon leans here</span>{/if}</h3>
              <ul>
                {#each r.lines as line}<li>{line}</li>{/each}
              </ul>
              {#if r.note}<p class="note">{r.note}</p>{/if}
            </section>
          {/each}
        </div>
        {/key}
      </section>
  {/if}

  <!-- the spiral in small, to know where you are -->
  {#if n}
    <nav class="map" aria-label="The year">
      <svg viewBox="-60 -60 120 120">
        {#if compass}
          {#each QUARTERS as q}<path class="map-quarter" d={wedge(lonAngle(q.from), lonAngle(q.to), 58)} style="fill: {q.colour}" />{/each}
          {#each POINTS as pt}<path class="map-axis" d="M{22 * Math.cos(lonAngle(pt.lon))} {22 * Math.sin(lonAngle(pt.lon))}L{60 * Math.cos(lonAngle(pt.lon))} {60 * Math.sin(lonAngle(pt.lon))}" />{/each}
        {/if}
        <path class="map-line" d={Array.from({ length: 121 }, (_, k) => {
          const t = -0.5 + ((n) * k) / 120;
          const p = at(t);
          const s = 46 / (R0 + TURN * 1.4);
          return `${k ? 'L' : 'M'}${(p.x * s).toFixed(1)} ${(p.y * s).toFixed(1)}`;
        }).join('')} />
        {#each lunations as l, i}
          {@const p = at(i)}
          {@const s = 46 / (R0 + TURN * 1.4)}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <circle class="map-dot" class:here={level === 1 && i === li} class:now={l.now} class:dim={!matches(l)} cx={p.x * s} cy={p.y * s} r={level === 1 && i === li ? 5.5 : 3.2} style="fill: {l.heat}" on:click={() => go(1, i)}>
            <title>Lunation {l.index}</title>
          </circle>
        {/each}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <g class="map-centre" on:click={() => go(0)}>
          <circle r="20" />
          <text y="3">{level === 1 && here ? here.index : '84–100'}</text>
        </g>
      </svg>
      {#if level === 1}<button class="map-back" on:click={() => go(0)}>the whole year</button>{/if}
    </nav>
  {/if}

  <!-- a few ways to look at the year -->
  <form class="filters" on:submit|preventDefault aria-label="Filter the moons">
    <span>show moons</span>
    <Pick bind:value={lean} label="Leaning" options={[{ value: '', label: 'leaning anywhere' }, ...['personal', 'local', 'global'].map((v) => ({ value: v, label: `leaning ${v}` }))]} />
    <Pick bind:value={capital} label="Goal" options={[{ value: '', label: 'for any goal' }, ...CAPITALS.map((c) => ({ value: c, label: `for ${c.toLowerCase()} capital` }))]} />
    <Pick bind:value={kind} label="Kind of time" options={[{ value: '', label: 'every kind of time' }, ...Object.entries(KINDS).map(([k, v]) => ({ value: k, label: `${v.label} time` }))]} />
    <Pick bind:value={person} label="Who you are" options={[{ value: '', label: 'for anyone' }, ...Object.keys(PEOPLE).map((p) => ({ value: p, label: `for ${p.toLowerCase()}` }))]} />
    {#if filtering}
      <span class="count">{matching} of {n}</span>
      <button type="button" on:click={() => ((lean = ''), (capital = ''), (person = ''), (kind = ''))}>clear</button>
    {/if}
  </form>

  <!-- close up: moon by moon, or along the line -->
  {#if level === 1}
    <div class="view-switch" role="radiogroup" aria-label="How to read the moons">
      <button type="button" role="radio" aria-checked="false" title="back to the whole spiral" on:click={() => go(0)}><svg viewBox="-10 -10 20 20" aria-hidden="true"><path d="M0 0 C0 -1.6 2 -1.6 2 0 C2 2.6 -2.6 3 -3 0 C-3.4 -4 3.6 -4.6 4.6 0 C5.6 5 -4.8 6 -6 0 C-7 -6 4 -8 8 -3" /></svg>spiral</button>
      <button type="button" role="radio" aria-checked={!linear} class:on={!linear} on:click={() => setLinear(false)}><svg viewBox="-10 -10 20 20" aria-hidden="true"><circle r="6.5" /><path d="M0 -6.5 A6.5 6.5 0 0 1 0 6.5 A4 6.5 0 0 0 0 -6.5Z" class="fill" /></svg>moon by moon</button>
      <button type="button" role="radio" aria-checked={linear} class:on={linear} on:click={() => setLinear(true)}><svg viewBox="-10 -10 20 20" aria-hidden="true"><path d="M-9 0 H9" /><circle cx="-5" r="1.8" class="fill" /><circle cx="2" r="1.8" class="fill" /><circle cx="7.5" r="1.2" class="fill" /></svg>along the line</button>
    </div>
  {/if}

  <!-- the compass's key, and its switch -->
  {#if n && level === 0}
    <aside class="key">
      <button type="button" class="key-switch" on:click={toggleCompass} aria-pressed={compass}>
        <svg viewBox="-10 -10 20 20" aria-hidden="true"><circle r="8" /><path d="M0 -8V8M-8 0H8" /></svg>
        seasons compass {compass ? 'on' : 'off'}
      </button>
      {#if compass}
        <button type="button" class="key-open" on:click={() => (keyOpen = !keyOpen)} aria-expanded={keyOpen}>{keyOpen ? 'close the key' : 'key'}</button>
      {/if}
      {#if compass && keyOpen}
        <ul>
          <li><i class="k-solar"></i>the solar year turns at the winter solstice</li>
          <li><b>2027</b> the calendar year, from 1 January</li>
          <li><svg class="k-wheel" viewBox="-8 -8 16 16" aria-hidden="true"><circle r="6.5" />{#each Array(8) as _, k}<path d="M0 0L{6.5 * Math.cos((k * Math.PI) / 4)} {6.5 * Math.sin((k * Math.PI) / 4)}" />{/each}</svg>the wheel of the year: Samhain, Yule, Imbolc, Ostara, Beltane, Litha, Lughnasadh and Mabon</li>
          <li><i class="k-seal"></i>Chinese New Year: {newYears.map((l) => `${l.lny.animal}, ${day(l.start)} ${l.lny.year}`).join(' · ')}</li>
          <li><i class="k-heat"></i>colours follow the felt warmth, weeks behind the sun: coldest late January, hottest early August</li>
        </ul>
      {/if}
    </aside>
  {/if}

  <p class="hint">
    {level === 0 ? 'scroll in to travel moon by moon' : 'scroll on through the moons · scroll back quickly for the whole year'}
    {#if !live}<br /><span>draft themes · Holons not connected yet{member ? ' · member view' : ''}</span>{/if}
  </p>
</main>

<style>
  :global(body) {
    overflow: hidden;
  }

  .tl {
    position: fixed;
    inset: 0;
    overflow: hidden;
    color: var(--bark-900);
    font-family: 'Quicksand', system-ui, sans-serif;
    background: var(--tl-paper, #fffaf2);
    transition: --tl-paper 1.6s ease, --tl-ember 1.6s ease, --tl-rose 1.6s ease, --tl-sprout 1.6s ease;
    touch-action: none;
  }

  .glow {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 55% at 22% 30%, color-mix(in srgb, var(--tl-ember, #fdd7bb) 80%, transparent), transparent 70%),
      radial-gradient(ellipse 55% 50% at 82% 70%, color-mix(in srgb, var(--tl-rose, #fec9bd) 75%, transparent), transparent 70%),
      radial-gradient(ellipse 50% 45% at 70% 10%, color-mix(in srgb, var(--tl-sprout, #dee8c2) 70%, transparent), transparent 70%);
    pointer-events: none;
  }

  /* the timeline paints its own paper, so its mycelium sits just above it */
  .threads :global(.mycelium) {
    position: absolute;
    z-index: 0;
  }

  .world {
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: 0 0;
    transition: opacity 0.5s ease;
  }

  /* Zooming in, everything but the chosen moon quietly clears away, so
     nothing large sweeps past; zooming out, it settles back in just after
     the camera starts to pull away */
  .path,
  .label,
  .ghost,
  .hub,
  .moon {
    transition-property: opacity, box-shadow, filter;
    transition-duration: 0.9s, 0.3s, 0.5s;
    transition-timing-function: ease;
    transition-delay: 0.35s, 0s, 0s;
  }

  .close .path,
  .close .label,
  .close .ghost,
  .close .hub,
  .close .moon:not(.focused) {
    opacity: 0;
    transition-delay: 0s, 0s, 0s;
    transition-duration: 0.6s, 0.3s, 0.5s;
  }

  /* close up, the moon's own words step aside for its page */
  .moon .num,
  .moon .when {
    transition: opacity 0.5s ease;
  }

  /* and while close up, no moon shows its number at all (so moving on to
     the next never flashes its giant number behind the page) */
  .close .moon .num,
  .close .moon .when {
    opacity: 0;
    transition: none;
  }

  .tl :global(.ring path) {
    stroke: color-mix(in srgb, var(--bark-900) 45%, transparent);
  }

  /* --- the spiral -------------------------------------------------------------- */
  .path {
    position: absolute;
    left: -5000px;
    top: -5000px;
    width: 10000px;
    height: 10000px;
    overflow: visible;
    pointer-events: none;
  }

  .path path {
    fill: none;
    stroke-linecap: round;
  }

  .bands {
    opacity: 0.85;
  }

  .bands path {
    stroke-width: 56;
    stroke-linecap: butt;
  }

  .thread {
    stroke: color-mix(in srgb, var(--bark-900) 40%, transparent);
    stroke-width: calc(1.2px * var(--inv, 1));
  }

  /* --- the seasons compass ---------------------------------------------------- */
  .quarter {
    opacity: 0.16;
  }

  .axis {
    stroke: #3f4a7a;
    stroke-opacity: 0.55;
    stroke-width: calc(1.6px * var(--inv, 1));
    stroke-dasharray: calc(6px * var(--inv, 1)) calc(5px * var(--inv, 1));
  }

  .solar {
    stroke: #e3a92f;
    stroke-width: calc(3.5px * var(--inv, 1));
    stroke-linecap: round;
  }

  .seal {
    r: calc(4px * var(--inv, 1));
    fill: #b8322a;
  }

  .cmp {
    display: block;
  }

  .cmp > div {
    position: absolute;
    left: 0;
    top: 0;
    display: grid;
    justify-items: inherit;
    gap: calc(2px * var(--inv, 1));
    white-space: nowrap;
    text-align: center;
  }

  .cmp b {
    font: 300 max(52px, calc(15px * var(--inv, 1))) 'Outfit', system-ui, sans-serif;
    color: #2f3760;
  }

  .cmp span {
    font: 300 max(34px, calc(10.5px * var(--inv, 1))) 'Playpen Sans', 'Quicksand', sans-serif;
    color: color-mix(in srgb, #2f3760 75%, transparent);
  }

  .quarter-name > div {
    padding: 0 calc(6px * var(--inv, 1));
    border-bottom: calc(2px * var(--inv, 1)) solid color-mix(in srgb, var(--c) 70%, transparent);
    font: 300 max(36px, calc(11px * var(--inv, 1))) 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--bark-800, #4a3828);
  }

  /* on a phone, the whole year is drawn small: just the moons' numbers,
     and the compass's names in a small size, east and west written up
     the sides */
  .phone .when,
  .phone .span-text,
  .phone .cmp span,
  .phone .label.year,
  .phone .ghost b,
  .small .when,
  .small .span-text,
  .small .ghost b {
    display: none;
  }

  .phone .num,
  .small .num {
    font-size: calc(11px * var(--inv, 1));
  }

  .small .label.year {
    font-size: calc(11px * var(--inv, 1));
  }

  .phone .cmp b {
    font-size: calc(12px * var(--inv, 1));
  }

  .phone .cmp.east > div {
    transform-origin: 0 0;
    transform: rotate(90deg) translate(-50%, -100%) !important;
  }

  .phone .cmp.west > div {
    transform-origin: 0 0;
    transform: rotate(-90deg) translate(-50%, -100%) !important;
  }

  .phone :global(.ring) {
    display: none;
  }

  .map-quarter {
    opacity: 0.2;
  }

  .map-axis {
    stroke: #3f4a7a;
    stroke-opacity: 0.5;
    stroke-width: 0.6;
    stroke-dasharray: 2 1.6;
  }

  .key {
    position: fixed;
    left: 24px;
    bottom: 92px;
    z-index: 5;
    max-width: 220px;
    font: 300 11.5px/1.45 'Quicksand', system-ui, sans-serif;
    color: var(--bark-700, #5a4632);
  }

  .key-switch {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    border: 0;
    background: none;
    color: #2f3760;
    font: 300 12.5px 'Playpen Sans', 'Quicksand', sans-serif;
    cursor: pointer;
  }

  .key-switch svg {
    width: 16px;
    height: 16px;
  }

  .key-switch circle {
    fill: none;
    stroke: currentColor;
  }

  .key-switch path {
    stroke: currentColor;
    stroke-dasharray: 2 1.5;
  }

  .key-switch[aria-pressed='false'] {
    opacity: 0.6;
  }

  .key-open {
    margin: 4px 0 0 22px;
    padding: 0;
    border: 0;
    border-bottom: 1px dashed currentColor;
    background: none;
    color: var(--bark-700, #5a4632);
    font: 300 11.5px 'Playpen Sans', 'Quicksand', sans-serif;
    cursor: pointer;
  }

  /* the key opens as a small sheet of paper of its own, above the spiral */
  .key ul {
    position: absolute;
    left: 0;
    bottom: calc(100% + 8px);
    display: grid;
    gap: 4px;
    width: 230px;
    margin: 0;
    padding: 12px 14px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--tl-paper, #fffaf2) 96%, transparent);
    box-shadow: 0 8px 28px color-mix(in srgb, var(--bark-900) 14%, transparent);
    list-style: none;
  }

  .key li {
    display: flex;
    gap: 7px;
    align-items: baseline;
  }

  .key b {
    font: 500 11px 'Outfit', system-ui, sans-serif;
  }

  .key i {
    flex: none;
    display: inline-block;
    width: 9px;
    height: 9px;
    border-radius: 50%;
  }

  .k-solar {
    width: 3px !important;
    height: 11px !important;
    border-radius: 2px !important;
    background: #e3a92f;
  }

  .k-seal {
    width: 7px !important;
    height: 7px !important;
    background: #b8322a;
  }

  .wheel-day circle,
  .k-wheel circle {
    fill: #f3e2b0;
    stroke: var(--bark-900);
    stroke-width: 0.8;
  }

  .wheel-day.turn circle {
    fill: #e9b448;
  }

  .wheel-day path,
  .k-wheel path {
    stroke: color-mix(in srgb, var(--bark-900) 70%, transparent);
    stroke-width: 0.6;
  }

  .wheel-day {
    pointer-events: auto;
  }

  .k-wheel {
    flex: none;
    width: 11px;
    height: 11px;
    overflow: visible;
  }

  .k-heat {
    width: 22px !important;
    height: 6px !important;
    border-radius: 3px !important;
    background: linear-gradient(90deg, #6f8fc0, #9cc48a, #f0c24f, #e2502f, #d9893a, #9a86b8);
  }

  .year-tick {
    stroke: var(--bark-900);
    stroke-width: calc(1.5px * var(--inv, 1));
  }

  .span {
    stroke-width: 54;
    opacity: 0.8;
  }

  .span-text {
    font: 300 max(34px, calc(11px * var(--inv, 1))) 'Playpen Sans', 'Quicksand', sans-serif;
    fill: var(--bark-800, #4a3828);
    dominant-baseline: central;
  }

  .label {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 0;
    display: grid;
    place-items: center;
    white-space: nowrap;
    pointer-events: none;
  }

  .year {
    font: 500 max(64px, calc(17px * var(--inv, 1))) 'Outfit', system-ui, sans-serif;
  }

  .today {
    font: 300 max(32.5px, calc(12px * var(--inv, 1))) 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--rust, #c4463c);
  }

  /* the moons still to come, and the stars they fade into */
  .future {
    stroke: color-mix(in srgb, var(--bark-900) 40%, transparent);
    stroke-width: calc(1.2px * var(--inv, 1));
  }

  .ghost {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 0;
    display: grid;
    place-items: center;
    pointer-events: none;
  }

  .ghost::before {
    content: '';
    position: absolute;
    width: calc(200px * var(--s));
    height: calc(200px * var(--s));
    border: calc(1px * var(--inv, 1)) dashed color-mix(in srgb, var(--bark-900) 60%, transparent);
    border-radius: 50%;
  }

  .ghost b {
    font: 300 calc(56px * var(--s)) 'Outfit', system-ui, sans-serif;
    color: var(--bark-700, #5a4632);
  }

  .speck {
    fill: color-mix(in srgb, var(--bark-900) 55%, transparent);
  }


  .hub {
    position: absolute;
    left: 0;
    top: 0;
    width: 1800px;
    margin: -150px 0 0 -900px;
    text-align: center;
    white-space: nowrap;
  }

  .hub-eyebrow {
    margin: 0;
    font: 300 52px 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--bark-700, #5a4632);
  }

  .hub-title {
    margin: 0 0 24px;
    font: 200 120px 'Outfit', system-ui, sans-serif;
  }

  .hub-now {
    padding: 0;
    border: 0;
    border-bottom: 3px solid currentColor;
    background: none;
    color: inherit;
    font: 300 47.5px 'Playpen Sans', 'Quicksand', sans-serif;
    cursor: pointer;
  }

  /* a lunation from afar: its number and its date, in its season's glow */
  .moon {
    position: absolute;
    left: 0;
    top: 0;
    width: 240px;
    height: 240px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: radial-gradient(circle closest-side, #fffdf8 0%, color-mix(in srgb, #fffdf8 65%, var(--glow)) 55%, var(--glow) 100%);
    box-shadow: 0 10px 36px color-mix(in srgb, var(--glow2) 60%, transparent);
    color: inherit;
    cursor: pointer;
    transition: box-shadow 0.3s ease;
  }

  .moon:hover {
    box-shadow: 0 10px 60px var(--glow2);
  }

  .num {
    font: 300 max(70px, calc(18px * var(--inv, 1))) / 1 'Outfit', system-ui, sans-serif;
  }

  .when {
    font-size: max(30px, calc(10px * var(--inv, 1)));
    color: var(--bark-700, #5a4632);
  }

  .now {
    box-shadow: 0 0 0 calc(3px * var(--inv, 1)) var(--rust, #c4463c), 0 10px 50px color-mix(in srgb, var(--glow2) 80%, transparent);
  }

  .now .when {
    font: 300 max(29.5px, calc(10.5px * var(--inv, 1))) 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--rust, #c4463c);
  }

  .moon.dim {
    opacity: 0.22;
    filter: grayscale(0.6);
  }

  .moon {
    transition: box-shadow 0.3s ease, opacity 0.5s ease, filter 0.5s ease;
  }

  .hundred {
    box-shadow: 0 0 0 10px color-mix(in srgb, var(--glow) 60%, transparent), 0 0 120px var(--glow2);
  }

  /* --- close up ----------------------------------------------------------------- */
  /* the page rises inside the moon, a part at a time, once it has grown */
  /* the page rises inside the moon once it has grown */
  .closeup {
    animation: rise-in 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.9s backwards;
  }

  /* while gliding round the spiral to the next moon, the page steps aside */
  .closeup {
    transition: opacity 0.5s ease;
  }

  .closeup.away {
    opacity: 0;
    pointer-events: none;
    transition-duration: 0.3s;
  }

  @keyframes rise-in {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
  }

  .closeup {
    position: fixed;
    top: 84px;
    left: 0;
    right: 0;
    bottom: 76px;
    z-index: 4;
    display: grid;
    grid-template-rows: auto minmax(300px, 1fr) auto auto auto auto;
    gap: 10px;
    padding: 4px 4% 0;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none;
  }

  .title {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    padding-left: 120px;
  }

  .title h2 {
    margin: 0;
    font: 300 40px/1 'Outfit', system-ui, sans-serif;
    text-transform: none;
  }

  .title h2 .name {
    display: block;
    margin-top: 6px;
    font: 300 22px/1.1 'Outfit', system-ui, sans-serif;
    letter-spacing: 0.01em;
    color: var(--bark-600, #7a6550);
  }

  .meta {
    margin: 6px 0 10px;
    font-size: 12.5px;
    color: var(--bark-600, #7a6550);
  }

  .facts {
    display: grid;
    gap: 6px;
    margin: 0;
  }

  .facts > div {
    display: grid;
    grid-template-columns: 64px 1fr;
    align-items: baseline;
    gap: 10px;
  }

  .facts dt {
    font-size: 12px;
    color: var(--bark-600, #7a6550);
  }

  .facts dd {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px 12px;
    margin: 0;
    font-size: 14px;
  }

  .theme {
    font-weight: 500;
  }

  .tag {
    padding: 1px 9px 2px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--c, #fff) 70%, transparent);
    font-size: 12px;
  }

  .tag.lantern {
    background: none;
    border-bottom: 1px dashed color-mix(in srgb, var(--bark-900) 50%, transparent);
  }

  .goal {
    font-size: 13px;
  }

  .goal b {
    font-weight: 600;
  }

  .goal + .goal::before {
    content: '·';
    margin-right: 12px;
    color: var(--bark-600, #7a6550);
  }

  /* the line across, with its weeks, as on the Miro: a ribbon of every
     lunation, flowing along to the one you are at */
  .line-area {
    position: relative;
    min-height: 300px;
    margin: 0 3%;
    overflow: visible;
  }

  .track {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    transition: transform 1.1s cubic-bezier(0.65, 0, 0.35, 1);
  }

  .seg {
    position: absolute;
    top: 0;
    bottom: 0;
    transition: opacity 0.8s ease;
  }

  .seg:not(.here) {
    opacity: 0.35;
  }

  .seg .start span {
    text-align: center;
  }

  .line-area .line {
    position: absolute;
    left: 0;
    right: 0;
    top: 70%;
    width: 100%;
    height: 20px;
    margin-top: -10px;
    pointer-events: none;
  }

  .line path {
    fill: none;
    stroke: var(--bark-900);
    stroke-width: 1.4;
    vector-effect: non-scaling-stroke;
  }

  .end {
    position: absolute;
    top: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    transform: translate(-50%, -10px);
  }

  .end i {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--bark-900);
  }

  .end span {
    font-size: 11.5px;
  }

  .start {
    left: 0;
  }

  .finish {
    left: 100%;
    opacity: 0.55;
    cursor: pointer;
  }

  .finish:hover {
    opacity: 1;
  }

  .phase-mark {
    position: absolute;
    top: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    transform: translate(-50%, -10px);
    pointer-events: none;
  }

  .phase-mark svg {
    width: 20px;
    height: 20px;
  }

  .phase-mark span {
    font-size: 11px;
    color: var(--bark-600, #7a6550);
  }

  .dark {
    fill: #fffaf0;
    stroke: var(--bark-900);
    stroke-width: 0.8;
  }

  .lit {
    fill: #fff1b8;
    stroke: var(--bark-900);
    stroke-width: 0.8;
  }

  /* notes pinned on their day: a stem up from the line, a small card */
  .pin {
    position: absolute;
    top: 70%;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .stem {
    position: absolute;
    left: 0;
    top: 0;
    width: 1px;
    height: 1px;
    overflow: visible;
  }

  .twig {
    fill: none;
    stroke: color-mix(in srgb, var(--bark-900) 55%, transparent);
    stroke-width: 1;
    stroke-linecap: round;
  }

  /* a leaf: a soft wash of its pigment, a fine ink edge, its veins */
  .blade {
    fill: color-mix(in srgb, var(--pig) 62%, transparent);
    stroke: color-mix(in srgb, var(--bark-900) 70%, transparent);
    stroke-width: 0.6;
    stroke-linejoin: round;
    filter: url(#tl-wash);
  }

  .vein {
    fill: none;
    stroke: color-mix(in srgb, var(--bark-900) 40%, transparent);
    stroke-width: 0.45;
    stroke-linecap: round;
  }

  .pin::before {
    content: '';
    position: absolute;
    left: -2.5px;
    top: -2.5px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--bark-900);
  }

  .pin.on-mark::before {
    display: none;
  }

  /* the words beside the leaf, no box: just the paper showing through */
  .words {
    position: absolute;
    left: calc(var(--dx) + 42px);
    bottom: calc(var(--lift) + var(--row) * var(--rowh) - 2px);
    width: var(--ww, 120px);
    font-size: 12px;
    line-height: 1.3;
    text-shadow: 0 0 4px var(--tl-paper, #fffaf2), 0 0 2px var(--tl-paper, #fffaf2);
    pointer-events: auto;
  }

  .words b {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-weight: 400;
  }

  .words small {
    display: block;
    margin-top: 1px;
    font: 300 10.5px 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--bark-600, #7a6550);
  }

  /* arriving at a moon, its leaves grow one after another: the twig
     draws up, the leaf unfurls, the words come after */
  .pin {
    --lift: 34px;
    --rowh: 64px;
  }

  .seg.here .twig {
    stroke-dasharray: 400;
    animation: grow-twig 0.7s ease-out var(--d) backwards;
  }

  .seg.here .unfurl {
    transform-box: fill-box;
    transform-origin: 50% 100%;
    animation: unfurl 0.6s cubic-bezier(0.2, 1.3, 0.4, 1) calc(var(--d) + 0.45s) backwards;
  }

  .seg.here .words {
    animation: words-in 0.5s ease calc(var(--d) + 0.7s) backwards;
  }

  @keyframes grow-twig {
    from {
      stroke-dashoffset: 400;
    }
  }

  @keyframes unfurl {
    from {
      opacity: 0;
      transform: scale(0.2);
    }
  }

  @keyframes words-in {
    from {
      opacity: 0;
    }
  }

  /* --- imagined, remembered, questions ---------------------------------------- */
  .pin.imagined .blade {
    fill: color-mix(in srgb, var(--pig) 10%, transparent);
    stroke-dasharray: 1.6 1.4;
  }

  .pin.imagined .twig {
    stroke-dasharray: 3 3;
  }

  .seg.here .pin.imagined .twig {
    animation: none;
  }

  .pin.remembered .blade {
    fill: color-mix(in srgb, var(--pig) 30%, #e8e0d2);
    stroke: color-mix(in srgb, var(--bark-900) 40%, transparent);
  }

  .pin.remembered .vein {
    stroke: color-mix(in srgb, var(--bark-900) 25%, transparent);
  }

  .pin.remembered .words b {
    color: var(--bark-700, #5a4632);
  }

  /* --- the lanes under the line ------------------------------------------------ */
  .lanes {
    position: relative;
    margin: -14px 3% 0;
    font-size: 11.5px;
  }

  .stretch,
  .stay {
    position: absolute;
    height: 22px;
  }

  /* the neighbouring moons show their line and bands, but no words or
     leaves, so nothing of theirs reaches into the moon you are at */
  .seg:not(.here) .pin,
  .seg:not(.here) .stretch span,
  .seg:not(.here) .stay span {
    visibility: hidden;
  }

  .stretch i,
  .stay i {
    position: absolute;
    left: 1px;
    right: 1px;
    bottom: 2px;
    height: 6px;
    border-radius: 4px;
    background: color-mix(in srgb, var(--c) 55%, transparent);
  }

  .stretch.land i {
    background: color-mix(in srgb, var(--c) 32%, transparent);
  }

  .stretch.imagined i {
    background: none;
    border: 1px dashed color-mix(in srgb, var(--c) 90%, transparent);
  }

  .stretch.remembered i {
    background: color-mix(in srgb, var(--c) 22%, #ddd4c4);
  }

  .stretch span,
  .stay span {
    position: absolute;
    left: 2px;
    bottom: 9px;
    white-space: nowrap;
    color: var(--bark-800, #4a3828);
    text-shadow: 0 0 3px var(--tl-paper, #fffaf2);
  }

  .stretch span.cont,
  .stay span.cont {
    max-width: calc(100% - 4px);
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--bark-600, #7a6550);
  }

  .stretch span.cont::before,
  .stay span.cont::before {
    content: '… ';
  }

  .stay {
    height: 20px;
  }

  .stay i {
    height: 2px;
    bottom: 3px;
    background: var(--c);
  }

  .stay.keeping i {
    background: none;
    border-top: 2px dotted var(--c);
  }

  .stay span {
    bottom: 6px;
    font-size: 11px;
  }

  .seg:not(.here) .who-here {
    display: none;
  }

  .who-here {
    position: absolute;
    left: 0;
    margin: 0;
    font: 300 11px 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--bark-600, #7a6550);
  }

  .seg:not(.here) .who-here {
    display: none;
  }

  .headcount {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    align-items: flex-end;
    gap: 1px;
    height: 18px;
  }

  .headcount i {
    flex: 1;
    border-radius: 1px;
    background: color-mix(in srgb, var(--bark-900) 22%, transparent);
  }

  /* --- along the line ------------------------------------------------------------ */
  .track.panning {
    transition: none;
  }

  .grab {
    cursor: grab;
  }

  .grab:active {
    cursor: grabbing;
  }

  .linear .seg {
    opacity: 1 !important;
  }

  /* sliding fast, zoomed out: leaves and words step aside, then return */
  .linear .pin,
  .linear .stretch span {
    transition: opacity 0.3s ease;
  }

  .wide .pin,
  .wide .stretch span,
  .wide .phase-mark span,
  .wide .end span {
    opacity: 0;
  }

  .linear .title,
  .linear .realms {
    display: none;
  }

  .line-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    padding: 6px 0 0 120px;
    padding-right: 380px;
  }

  .line-head > span {
    margin-right: 6px;
    font: 300 12px 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--bark-600, #7a6550);
  }

  .moon-name {
    padding: 0;
    border: 0;
    border-bottom: 1px dashed color-mix(in srgb, var(--bark-900) 35%, transparent);
    background: none;
    color: var(--bark-900);
    font: inherit;
    white-space: nowrap;
    cursor: pointer;
  }

  /* room for the year's slider above the menu */
  .closeup.linear {
    bottom: 120px;
  }

  /* along the line, a stretch names itself where it starts; kinds and
     rhythms keep their names pinned at the left */
  .linear .stretch span.cont,
  .linear .rhythm span,
  .linear .seg .stratum-name {
    visibility: hidden;
  }

  .pinned-names {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    pointer-events: none;
  }

  .pinned-names p {
    position: absolute;
    left: 0;
    margin: 0;
    padding: 0 10px 1px 14px;
    white-space: nowrap;
    background: color-mix(in srgb, var(--tl-paper, #fffaf2) 92%, transparent);
    border-radius: 0 8px 8px 0;
  }

  .pinned-names .stratum-name::after {
    display: none;
  }

  .rhythm-name {
    margin-top: 2px !important;
    font-size: 11px;
    color: var(--bark-700, #5a4632);
  }

  .linear .seg:not(.here) .pin {
    visibility: hidden;
  }

  .view-switch {
    position: fixed;
    top: 86px;
    right: 24px;
    z-index: 6;
    display: flex;
    gap: 2px;
    padding: 3px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--bark-900) 6%, transparent);
  }

  .view-switch button {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px 4px 9px;
    border: 0;
    border-radius: 999px;
    background: none;
    color: var(--bark-700, #5a4632);
    font: 300 12px 'Playpen Sans', 'Quicksand', sans-serif;
    cursor: pointer;
  }

  .view-switch svg,
  .to-spiral svg {
    width: 15px;
    height: 15px;
    overflow: visible;
  }

  .view-switch path,
  .view-switch circle,
  .to-spiral path {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.3;
    stroke-linecap: round;
  }

  .view-switch .fill {
    fill: currentColor;
    stroke: none;
  }

  .view-switch button:hover {
    color: var(--bark-900);
  }

  .to-spiral {
    position: fixed;
    left: calc(50% - min(380px, 43vw) - 40px);
    bottom: 82px;
    z-index: 6;
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border: 1px solid color-mix(in srgb, var(--bark-900) 20%, transparent);
    border-radius: 50%;
    background: var(--tl-paper, #fffaf2);
    color: var(--bark-800, #4a3828);
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .to-spiral:hover {
    transform: rotate(-30deg);
  }

  .view-switch button.on {
    background: var(--tl-paper, #fffaf2);
    color: var(--bark-900);
    box-shadow: 0 1px 4px color-mix(in srgb, var(--bark-900) 12%, transparent);
  }

  .scrub {
    position: fixed;
    left: 50%;
    bottom: 84px;
    z-index: 6;
    width: min(760px, 86vw);
    height: 26px;
    transform: translateX(-50%);
    background: color-mix(in srgb, var(--tl-paper, #fffaf2) 85%, transparent);
    border-top: 1px solid color-mix(in srgb, var(--bark-900) 25%, transparent);
    cursor: pointer;
    touch-action: none;
  }

  .scrub span {
    position: absolute;
    top: 6px;
    font-size: 10.5px;
    color: var(--bark-600, #7a6550);
    transform: translateX(-50%);
    pointer-events: none;
  }

  .scrub span.now {
    color: var(--rust, #c4463c);
  }

  .scrub-window {
    position: absolute;
    top: -4px;
    bottom: 0;
    z-index: -1;
    border-bottom: 2px solid var(--bark-900);
    border-radius: 6px 6px 0 0;
    background: color-mix(in srgb, var(--tl-ember, #fdd7bb) 55%, transparent);
    pointer-events: none;
  }

  /* --- the kinds of time ------------------------------------------------------ */
  .kinds {
    gap: 6px !important;
  }

  .kind-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 10px 3px 8px;
    border: 1px solid color-mix(in srgb, var(--c) 45%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--c) 12%, transparent);
    color: var(--bark-900);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
    transition: background 0.3s ease, opacity 0.3s ease;
  }

  .kind-chip i {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--c);
  }

  .kind-chip small {
    font-size: 11px;
    color: var(--bark-600, #7a6550);
  }

  .kind-chip.none {
    opacity: 0.5;
  }

  .kind-chip.on {
    background: color-mix(in srgb, var(--c) 40%, transparent);
    border-color: var(--c);
  }

  .faded {
    opacity: 0.16;
    transition: opacity 0.4s ease;
  }

  .stratum {
    position: absolute;
    left: 0;
    right: 0;
    transition: opacity 0.4s ease;
  }

  .stratum-name {
    position: absolute;
    left: 0;
    top: 0;
    margin: 0;
    font: 300 10.5px 'Playpen Sans', 'Quicksand', sans-serif;
    letter-spacing: 0.04em;
    text-transform: lowercase;
    color: color-mix(in srgb, var(--c) 80%, var(--bark-900));
  }

  .stratum-name::after {
    content: '';
    display: inline-block;
    width: 60px;
    margin-left: 8px;
    vertical-align: middle;
    border-top: 1px solid color-mix(in srgb, var(--c) 35%, transparent);
  }

  .seg:not(.here) .stratum-name {
    visibility: hidden;
  }

  /* rhythms: recurring quests, a beat on each day they come round */
  .rhythm {
    position: absolute;
    left: 0;
    right: 0;
    height: 20px;
  }

  .rhythm::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 5px;
    border-top: 1px dotted color-mix(in srgb, var(--c) 60%, transparent);
  }

  .rhythm i {
    position: absolute;
    bottom: 2px;
    width: 7px;
    height: 7px;
    margin-left: -3.5px;
    border-radius: 50%;
    background: var(--c);
  }

  .rhythm i.done {
    background: none;
    box-shadow: inset 0 0 0 1.5px var(--c);
  }

  .rhythm span {
    position: absolute;
    left: 2px;
    bottom: 8px;
    font-size: 11px;
    white-space: nowrap;
    color: var(--bark-700, #5a4632);
    text-shadow: 0 0 3px var(--tl-paper, #fffaf2);
  }

  .seg:not(.here) .rhythm span {
    visibility: hidden;
  }

  /* today, a ring on the line */
  .today-mark {
    position: absolute;
    top: 70%;
    width: 14px;
    height: 14px;
    margin: -7px 0 0 -7px;
    border: 2px solid var(--rust, #c4463c);
    border-radius: 50%;
    background: var(--tl-paper, #fffaf2);
    pointer-events: none;
  }

  /* today falling on a moon's mark: the mark wears today's ring */
  .phase-mark.today svg {
    border-radius: 50%;
    box-shadow: 0 0 0 2px var(--tl-paper, #fffaf2), 0 0 0 4px var(--rust, #c4463c);
  }

  .lg-today {
    width: 10px;
    height: 10px;
    border: 1.5px solid var(--rust, #c4463c);
    border-radius: 50%;
  }

  /* a day opened from the line */
  .line-area {
    cursor: pointer;
  }

  .day-band {
    position: absolute;
    top: 0;
    bottom: 0;
    background: color-mix(in srgb, var(--tl-ember, #fdd7bb) 35%, transparent);
    pointer-events: none;
  }

  .day-sheet {
    width: min(460px, 100%);
    padding: 12px 16px;
    border: 1px solid color-mix(in srgb, var(--bark-900) 12%, transparent);
    border-radius: 14px;
    background: color-mix(in srgb, var(--tl-paper, #fffaf2) 97%, #fff);
    box-shadow: 0 8px 26px color-mix(in srgb, var(--bark-900) 10%, transparent);
  }

  .day-sheet h4 {
    display: flex;
    justify-content: space-between;
    margin: 0 0 6px;
    font: 300 15px 'Outfit', system-ui, sans-serif;
  }

  .day-sheet h4 button {
    padding: 0 4px;
    border: 0;
    background: none;
    color: var(--bark-700, #5a4632);
    font-size: 16px;
    cursor: pointer;
  }

  .day-sheet ul {
    display: grid;
    gap: 4px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .day-sheet li {
    display: flex;
    flex-wrap: wrap;
    gap: 2px 8px;
    font-size: 13px;
  }

  .day-sheet b {
    font-weight: 400;
  }

  .day-sheet span,
  .day-sheet p {
    margin: 0;
    font: 300 11.5px 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--bark-600, #7a6550);
  }

  /* how to read the line */
  .legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px 16px;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 11.5px;
    color: var(--bark-700, #5a4632);
  }

  .legend li {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .lg {
    width: 12px;
    height: 16px;
    overflow: visible;
  }

  .lg path {
    fill: color-mix(in srgb, #d7745c 62%, transparent);
    stroke: color-mix(in srgb, var(--bark-900) 70%, transparent);
    stroke-width: 1.2;
  }

  .lg.imagined path {
    fill: color-mix(in srgb, #d7745c 10%, transparent);
    stroke-dasharray: 2.4 2;
  }

  .lg.remembered path {
    fill: color-mix(in srgb, #d7745c 30%, #e8e0d2);
    stroke: color-mix(in srgb, var(--bark-900) 40%, transparent);
  }

  .lg.question path {
    fill: color-mix(in srgb, #a9c6dc 62%, transparent);
  }

  .lg.question path.q {
    fill: none;
    stroke-linecap: round;
  }

  .lg-note {
    font: 300 11px 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--bark-600, #7a6550);
  }

  .tally {
    gap: 4px 14px;
    font-size: 13px;
  }

  .tally span + span::before {
    content: '·';
    margin-right: 10px;
    color: var(--bark-600, #7a6550);
  }

  .years button {
    padding: 0;
    border: 0;
    border-bottom: 1px dashed color-mix(in srgb, var(--bark-900) 40%, transparent);
    background: none;
    color: var(--bark-900);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
  }

  .below {
    display: grid;
    justify-items: center;
    gap: 8px;
  }

  .words.hidden {
    display: none;
  }

  .leaf {
    pointer-events: auto;
    cursor: pointer;
    outline: none;
  }

  .quiet {
    width: min(460px, 100%);
    margin: 0;
    font-size: 13.5px;
    line-height: 1.5;
    color: var(--bark-700, #5a4632);
    text-align: center;
  }

  .quiet a {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: color-mix(in srgb, var(--bark-900) 40%, transparent);
    text-underline-offset: 3px;
  }

  /* personal, local, global */
  .realms {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    padding-bottom: 8px;
  }

  .realm h3 {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin: 0 0 6px;
    padding-bottom: 4px;
    border-bottom: 1px solid color-mix(in srgb, var(--bark-900) 30%, transparent);
    font: 400 20px 'Outfit', system-ui, sans-serif;
    text-transform: none;
  }

  .realm.lean h3 {
    border-bottom: 2px solid var(--bark-900);
  }

  .leans {
    font: 300 12px 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--rust, #c4463c);
  }

  .realm ul {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 13px;
    line-height: 1.45;
  }

  .realm li {
    margin-bottom: 3px;
  }

  .realm.lean ul {
    font-size: 14px;
  }

  .realm .note {
    margin: 6px 0 0;
    font: 300 11px/1.2 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--bark-600, #7a6550);
  }

  /* --- the map of the spiral, top right -------------------------------------- */
  /* the map sits in the top left corner, under the logo */
  .map {
    position: fixed;
    top: 74px;
    left: 22px;
    z-index: 5;
    width: 104px;
    text-align: center;
  }

  .map svg {
    display: block;
    width: 104px;
    height: 104px;
    overflow: visible;
  }

  .map-line {
    fill: none;
    stroke: color-mix(in srgb, var(--bark-900) 40%, transparent);
    stroke-width: 0.8;
  }

  .map-dot {
    stroke: var(--bark-900);
    stroke-width: 0.6;
    cursor: pointer;
  }

  .map-dot.dim {
    opacity: 0.25;
  }

  .map-dot.now {
    stroke: var(--rust, #c4463c);
    stroke-width: 1.2;
  }

  .map-dot.here {
    stroke-width: 1.4;
  }

  .map-centre {
    cursor: pointer;
  }

  .map-centre circle {
    fill: color-mix(in srgb, #fffdf8 70%, transparent);
    stroke: color-mix(in srgb, var(--bark-900) 25%, transparent);
    stroke-width: 0.6;
  }

  .map-centre text {
    font: 300 11px 'Outfit', system-ui, sans-serif;
    text-anchor: middle;
    fill: var(--bark-900);
  }

  .map-back {
    margin-top: 2px;
    padding: 0;
    border: 0;
    border-bottom: 1px solid currentColor;
    background: none;
    color: var(--bark-700, #5a4632);
    font: 300 11px 'Playpen Sans', 'Quicksand', sans-serif;
    cursor: pointer;
  }

  .filters {
    position: fixed;
    top: 92px;
    left: 150px;
    z-index: 5;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 12px;
    max-width: calc(100vw - 200px);
    font: 300 13.5px 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--bark-700, #5a4632);
  }

  .filters select {
    padding: 0 2px;
    border: 0;
    border-bottom: 1px dashed color-mix(in srgb, var(--bark-900) 45%, transparent);
    border-radius: 0;
    background: none;
    color: var(--bark-900);
    font: inherit;
    cursor: pointer;
    appearance: none;
  }

  .filters .count {
    color: var(--rust, #c4463c);
  }

  .filters button {
    padding: 0;
    border: 0;
    border-bottom: 1px solid currentColor;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  .close .filters {
    display: none;
  }

  .hint {
    position: fixed;
    right: 24px;
    bottom: 92px;
    z-index: 5;
    margin: 0;
    font: 300 12px 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--bark-600, #7a6550);
    text-align: right;
  }

  .close .hint {
    display: none;
  }

  .hint span {
    font: 400 11px 'Quicksand', system-ui, sans-serif;
  }

  @media (max-width: 860px) {
    .title {
      padding-left: 92px;
    }

    .title :global(.art) {
      width: 72px;
      height: 72px;
    }

    .realms {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .map,
    .map svg {
      width: 86px;
    }

    .map svg {
      height: 86px;
    }

    .hint,
    .key ul {
      display: none;
    }

    .stickies li {
      max-width: 120px;
      font-size: 10.5px;
    }
  }

  @media (max-width: 640px) {
    .title {
      padding-left: 104px;
    }

    .title :global(.art) {
      display: none;
    }

    .title h2 {
      font-size: 28px;
    }

    .title h2 .name {
      font-size: 17px;
    }

    .facts > div {
      grid-template-columns: 1fr;
      gap: 2px;
    }

    .line-area {
      min-height: 220px;
    }
  }
</style>

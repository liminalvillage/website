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
  import { onMount, tick } from 'svelte';
  import { phase as moonNow } from 'lune';
  import { fly as rise } from 'svelte/transition';
  import gsap from 'gsap';
  import Ring from '../journey/Ring.svelte';
  import Mycelium from '../lib/Mycelium.svelte';
  import { loadTimeline, SPANS, PEOPLE, KINDS, STATUS, CHILDREN, stretches, stays, festivals } from './source.js';
  import { leafFor } from './leaves.js';
  import Pick from './Pick.svelte';
  import MoonCycle from './MoonCycle.svelte';
  import Spiral3D from './Spiral3D.svelte';
  import Nested from './Nested.svelte';
  import Preview from './Preview.svelte';
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
  // the four turnings' images, in the concept-art style (scripts/concept-art.py)
  const SEASON_NAME = { 270: 'winter', 0: 'spring', 90: 'summer', 180: 'autumn' };
  // the seasons as one band round the rim, each painting its quarter and
  // dissolving into the next at the edges
  const IMG_R = 4400;
  let seasonHover = null;
  const BAND_IN = 220;
  const BAND_OUT = 2600;
  const RAY_OUT = 900;
  const annulus = (a0, a1, r0, r1) =>
    `M${r0 * Math.cos(a0)} ${r0 * Math.sin(a0)}L${r1 * Math.cos(a0)} ${r1 * Math.sin(a0)}A${r1} ${r1} 0 0 1 ${r1 * Math.cos(a1)} ${r1 * Math.sin(a1)}L${r0 * Math.cos(a1)} ${r0 * Math.sin(a1)}A${r0} ${r0} 0 0 0 ${r0 * Math.cos(a0)} ${r0 * Math.sin(a0)}Z`;
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
    // the rim of the whole circle: just beyond the outermost moons
    const rim = Math.max(...lunations.map((l, i) => at(i).r)) + D / 2 + 30;
    // how far the words reach, across and up and down (a word is about
    // 650 across and 160 high, at the size the whole year is seen at)
    if (phone) {
      // only the four points, close in; their words are sized on screen
      for (const p of points) p.at = p.outer + 40;
      const halfW = Math.max(...points.map((p) => Math.abs(p.at * Math.cos(p.a))));
      const halfH = Math.max(...points.map((p) => Math.abs(p.at * Math.sin(p.a))));
      return { points, quarters: quarters.map((q) => ({ ...q, hidden: true })), reach, solstices: [], halfW, halfH, rim };
    }
    // the words stand just beyond each turning's image
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
    return { points, quarters, reach, solstices, halfW, halfH, rim };
  }
  let rose = null;
  const wedge = (a0, a1, r) => `M0 0L${r * Math.cos(a0)} ${r * Math.sin(a0)}A${r} ${r} 0 0 1 ${r * Math.cos(a1)} ${r * Math.sin(a1)}Z`;
  // which way a word leans out from its point, so it grows away from the spiral
  const anchor = (a) => `${Math.cos(a) > 0.35 ? 0 : Math.cos(a) < -0.35 ? -100 : -50}%, ${Math.sin(a) > 0.35 ? 0 : Math.sin(a) < -0.35 ? -100 : -50}%`;
  $: newYears = lunations.filter((l) => l.lny);
  // stipple along the outside of the band, denser where the year is warm
  $: specks = theta.length
    ? (() => {
        let k = 11;
        const r = () => ((k = (k * 16807) % 2147483647) / 2147483647);
        const out_ = [];
        // soft clouds here and there along the outside, thinning outwards
        for (let t = 0.6; t <= n - 1.6; t += 1.4 + r() * 1.6) {
          const size = 14 + Math.round(r() * 14);
          for (let j = 0; j < size; j++) {
            const g = (r() + r() + r()) / 3 - 0.5;
            const p = out(t + g * 0.35, 40 + r() ** 2.2 * 75);
            out_.push({ x: p.x, y: p.y, r: 0.45 + r() * 0.7 });
          }
        }
        return out_;
      })()
    : [];

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
            const room = i < lunations.length - 1 ? gap(i) + 120 / Math.hypot(at(i + 1).x - at(i).x, at(i + 1).y - at(i).y) : 0.2;
            const t = Math.min(Math.max(i + (it.at - l.start) / (l.end - l.start), i + room), i + 1 - room);
            return { ...it, t, turn: /solstice|equinox/i.test(it.title) };
          }),
      )
    : [];

  // the past: m lunations back from the first, at the same angular pace,
  // its radius closing in towards the heart (never into the hub's words)
  const PAST_FLOOR = 600;
  function pastAt(m) {
    const n0 = theta.length;
    const step = n0 > 1 ? (theta[n0 - 1] - theta[0]) / (n0 - 1) : 0.5;
    const a = theta[0] - m * step;
    const r = PAST_FLOOR + (R0 - PAST_FLOOR) * Math.exp(-m / 16);
    return { x: r * Math.cos(a), y: r * Math.sin(a), r };
  }
  $: firstIndex = lunations[0]?.index ?? 84;
  $: pastMoons = theta.length ? Array.from({ length: firstIndex - 1 }, (_, k) => {
    const m = k + 1;
    const p = pastAt(m);
    return { index: firstIndex - m, x: p.x, y: p.y, r: Math.max(10, (D / 2) * 0.32 * (p.r / R0)) };
  }) : [];
  $: pastPath = theta.length ? Array.from({ length: (firstIndex - 1) * 8 + 1 }, (_, k) => {
    const p = pastAt(k / 8);
    return `${k ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }).join('') : '';

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
  let cam = { x: 0, y: 0, ls: Math.log(0.2), tilt: 0 };
  // a first step towards 3D: the whole spiral laid back in perspective
  let tilted = false;
  // the spiral as a 3D cone, rising through time
  let three = false;
  let lineKey = false; // the lunation's key, folded away until asked for
  $: if (level === 1 && three) three = false;
  // the solar view with everything in it: rings within rings. Pinching in
  // grows it out of the spiral (0, the spiral, to 1, the rings), following
  // the fingers, and it settles to whichever is nearer when they stop
  let grow = 0;
  const growing = { v: 0 };
  let growTimer;
  $: nested = grow > 0.001;
  let nestFrame = null;
  // zoomed in the spiral of everything, the solar view behind moves with it
  let nestZoom = { z: 1, x: 0, y: 0 };
  $: if (!nested) nestZoom = { z: 1, x: 0, y: 0 };
  // the solar view behind doesn't travel with it: it stays on the sun and
  // fades back as the spiral grows in front (scaling it would cut its soft
  // light into hard boxes)
  $: bgFade = 0.3 + 0.7 / (1 + (nestZoom.z - 1) * 0.9);
  // its words step aside sooner, so they never sit on the spiral's
  $: labelFade = 1 / (1 + (nestZoom.z - 1) * 6);
  // one pinch opens the spiral and rests there; zooming on in takes another
  let lastWheel = 0;
  let gestureAt = 0;
  let openedAt = 0;
  $: if (grow === 1) openedAt = Date.now();
  let nestRef;
  // measured afresh each time it opens, from where the spiral is now
  function setGrow(v) {
    gsap.killTweensOf(growing);
    if (!grow && v > 0) nestFrame = measure();
    growing.v = grow = Math.max(0, Math.min(1, v));
  }
  function growTo(v, duration = 0.9) {
    if (!grow && v > 0) nestFrame = measure();
    gsap.killTweensOf(growing);
    gsap.to(growing, { v, duration, ease: 'power2.inOut', onUpdate: () => (grow = growing.v) });
  }
  // it finishes the way the fingers were going, once they have gone a little
  function growBy(d) {
    setGrow(grow + d);
    clearTimeout(growTimer);
    growTimer = setTimeout(() => growTo((d > 0 ? grow > 0.12 : grow > 0.88) ? 1 : 0, 0.6), 160);
  }
  const openNest = () => ((three = false), growTo(1));
  const closeNest = () => growTo(0);
  // where the flat spiral sits on screen: its centre, and pixels per unit
  function measure() {
    const el = world?.querySelector('svg.path');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const s = r.width / 10000;
    return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, s, rim: (rose?.rim ?? (n ? at(n - 1).r + D : 2000)) * s, outer: n ? at(n - 1).r * s : 300 };
  }
  // the 3D cone opens exactly where the flat spiral is, then tips away
  let flat3 = null;
  function open3D() {
    flat3 = measure();
    setGrow(0);
    three = true;
  }
  // a glimpse of the lunation under the pointer, on the spiral flat or in 3D
  let peek = null;
  let peekX = 0;
  let peekY = 0;
  const peekAt = (i, e) => {
    peek = i === null || i === undefined ? null : lunations[i];
    if (e) [peekX, peekY] = [e.clientX, e.clientY];
  };
  $: if (level !== 0) peek = null;
  $: if (level === 1 && grow) setGrow(0);
  $: if (!three) tipFrom = null;
  function toggleTilt() {
    tilted = !tilted;
    gsap.to(cam, { tilt: tilted ? 52 : 0, duration: 1.2, ease: 'sine.inOut', onUpdate: apply });
  }
  $: if (level === 1 && tilted) {
    tilted = false;
    gsap.to(cam, { tilt: 0, duration: 0.6, onUpdate: apply });
  }
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

  // --inv (lines and words kept a steady size on screen) restyles the whole
  // drawing, so on the way between moons it is set only now and then
  let invLs = null;
  function apply(final = false) {
    if (!world) return;
    const s = Math.exp(cam.ls);
    const cy = TOP + (vh - TOP - BOTTOM) / 2;
    world.style.transform = cam.tilt
      ? `translate(${vw / 2}px, ${cy}px) scale(1, ${Math.cos((cam.tilt * Math.PI) / 180).toFixed(4)}) translate(${-cam.x * s}px, ${-cam.y * s}px) scale(${s})`
      : `translate(${vw / 2 - cam.x * s}px, ${cy - cam.y * s}px) scale(${s})`;
    if (final || !travelling || invLs === null || Math.abs(cam.ls - invLs) > 0.35) {
      world.style.setProperty('--inv', 1 / s);
      invLs = cam.ls;
    }
  }

  // Close up, the lunation's own circle grows until its paper fills the
  // screen, and its page rises inside it; going on to the next moon eases
  // back a little, glides along the spiral, and grows into the next one
  const fill = () => (Math.hypot(vw, vh) * 1.12) / D;
  let travelling = false;
  // a new lunation always opens at its top, never part-way down
  let closeupEl;
  let shownIndex = null;
  $: if (level === 1 && li !== shownIndex) {
    shownIndex = li;
    if (closeupEl) closeupEl.scrollTop = 0;
    if (typeof window !== 'undefined' && window.scrollY) window.scrollTo({ top: 0 });
  }
  function fly(instant = false, from = null) {
    if (!theta.length) return;
    const f = frame();
    // beside the compass, room for the map and the key on either side
    const s = level === 1 ? fill() : Math.min((vw - 2 * (f.side ?? vw * 0.03)) / f.w, ((vh - TOP - BOTTOM - 2 * (f.sideY ?? 0)) * 0.96) / f.h);
    let to = { x: f.x, y: f.y, ls: Math.log(s) };
    // lunar: the spiral's moon lands exactly on the lunation's circle, at
    // its size and place on screen, so the one becomes the other
    const target = level === 1 && !linear ? moonRect() : null;
    if (target) {
      const ms = target.size / D;
      const cy = TOP + (vh - TOP - BOTTOM) / 2;
      to = { x: f.x - (target.x - vw / 2) / ms, y: f.y - (target.y - cy) / ms, ls: Math.log(ms) };
    }
    // seen from afar with the moons drawn small, they show only their numbers
    if (level === 0) small = s * D < 30;
    gsap.killTweensOf(cam);
    if (instant) {
      Object.assign(cam, to);
      apply();
      if (level === 1) landed = true;
      return;
    }
    landed = false;
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
        duration: Math.min(1.05 + 0.22 * (Math.abs(t1 - t0) - 1), 1.7),
        ease: 'power2.inOut',
        onUpdate() {
          const q = at(t0 + (t1 - t0) * o.p);
          cam.x = q.x + (to.x - at(t1).x) * o.p;
          cam.y = q.y + (to.y - at(t1).y) * o.p;
          cam.ls = near + (far - near) * Math.sin(Math.PI * o.p) ** 0.8;
          apply();
        },
        onComplete() {
          Object.assign(cam, to);
          travelling = false;
          apply(true);
          busy = false;
          landed = true;
        },
      });
      return;
    }
    busy = true;
    gsap.to(cam, { ...to, duration: 1.5, ease: 'sine.inOut', onUpdate: apply, onComplete: () => ((busy = false), (landed = level === 1)) });
  }

  // the title and the three below change one after the other: the old
  // fades away, then the new comes in, so they never sit over each other
  const fadeOut = (node) => ({ duration: 260, css: (t) => `opacity: ${t}` });
  // the moon gives way to the line: it stays round, drawing in and fading
  // as the line comes, never squashed into an oval
  const unroll = () => ({ duration: 480, css: (t) => `transform: scale(${0.55 + t * 0.45}); opacity: ${t * t}` });
  const fadeIn = (node) => ({ delay: 280, duration: 420, css: (t) => `opacity: ${t}; transform: translateY(${(1 - t) * 6}px)` });

  // where the lunation's night circle sits on screen, once it is laid out
  function moonRect() {
    const c = document.querySelector('.moon-view .mc-ground');
    if (!c) return null;
    const r = c.getBoundingClientRect();
    return r.width ? { x: r.left + r.width / 2, y: r.top + r.height / 2, size: r.width } : null;
  }
  // lunar: once the spiral's moon has landed, it hands over to the lunar circle
  let landed = false;
  async function go(l, i = li) {
    const from = level === 1 && l === 1 ? li : null;
    level = l;
    li = Math.max(0, Math.min(lunations.length - 1, i));
    if (l === 1 && !linear) await tick();
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
    const sideways = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    // a pinch (the trackpad sends it as a scroll with Ctrl held) zooms first
    if (level === 1 && e.ctrlKey) {
      e.preventDefault();
      return pinch(e.deltaY);
    }
    const t = Date.now();
    if (t - lastWheel > 250) gestureAt = t;
    lastWheel = t;
    if (level === 1 && acrossYears) {
      e.preventDefault();
      yearAcc += e.deltaY;
      clearTimeout(yearTimer);
      yearTimer = setTimeout(() => (yearAcc = 0), 250);
      if (Math.abs(yearAcc) > 90) {
        stepYear(yearAcc > 0 ? 1 : -1);
        yearAcc = -Math.sign(yearAcc) * 400; // one year per swipe
      }
      return;
    }
    if (level === 0 && grow === 1 && nestRef) {
      if (openedAt > gestureAt) return e.preventDefault();
      return nestRef.wheel(e);
    }
    if (level === 0 && e.ctrlKey) {
      e.preventDefault();
      return pinch(e.deltaY);
    }
    if (level === 0 && (nested || three)) return e.preventDefault();
    if (!(sideways && level === 1) && canScroll(e.target, e.deltaY)) return;
    e.preventDefault();
    // a sideways swipe close up slides along the line straight away
    if (level === 1 && !linear && !e.ctrlKey && Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 3) setLinear(true);
    if (level === 1 && linear && !e.ctrlKey) return pan(pos + (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) / segPx);
    if (level === 1 && e.ctrlKey) return pinch(e.deltaY);
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
  let pinchFrom = 0;
  const fingers = (e) => Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
  function onTouchStart(e) {
    if (e.touches.length === 2) {
      touch = null;
      pinchFrom = fingers(e);
    } else touch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  function onTouchMove(e) {
    if (e.touches.length !== 2 || !pinchFrom) return;
    const d = fingers(e);
    pinch(-Math.log(d / pinchFrom) / 0.012);
    pinchFrom = d;
  }
  function onTouchEnd(e) {
    if (e.touches.length < 2) pinchFrom = 0;
    if (!touch) return;
    const dx = touch.x - e.changedTouches[0].clientX;
    const dy = touch.y - e.changedTouches[0].clientY;
    touch = null;
    if (acrossYears && Math.abs(dy) > Math.abs(dx)) return Math.abs(dy) > 40 ? stepYear(Math.sign(dy)) : null;
    const d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
    if (Math.abs(d) > 50) step(Math.sign(d));
  }

  function resize() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    // the rings follow the spiral to wherever it sits now
    if (grow) requestAnimationFrame(() => (nestFrame = measure()));
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
  // How many lunations are in view. `rest` is where a pinch leaves it (two
  // to begin with); sliding fast, the line eases out beyond it to see many
  // at once, and back to it as it slows.
  const FIRST_REST = 2;
  const NEAREST = 0.75;
  const FARTHEST = 13;
  let rest = FIRST_REST;
  let vis = rest;
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
    const target = Math.min(FARTHEST, rest + Math.max(0, speed - 1.2) * 1.4);
    const centre = pos + vis / 2;
    vis += (target - vis) * 0.12;
    pos = clampPos(centre - vis / 2);
    li = centreOf();
    if (Math.abs(vis - rest) < 0.01 && speed < 0.05) {
      vis = rest;
      pos = clampPos(pos);
      zoomFrame = 0;
      return;
    }
    zoomFrame = requestAnimationFrame(zoomLoop);
  }
  const pan = (to, steady = false) => {
    if (steady) {
      pos = clampPos(to);
      li = centreOf();
      panning = true;
      clearTimeout(panTimer);
      panTimer = setTimeout(() => (panning = false), 160);
      return;
    }
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
    if (!on && linear) tick().then(() => fly(true));
    linear = on;
    dayOpen = null;
    rest = FIRST_REST;
    vis = rest;
    speed = 0;
    if (on) pos = Math.max(-0.5, li + 0.5 - rest / 2);
  }
  // zoomed out, the leaves step aside so only the line and its bands show
  // zoomed out (sliding fast, or pinched far out), leaves and words step aside
  $: wide = linear && (vis > rest + 0.35 || rest > 4.5);

  // Pinching: out shows more moons, in fewer. Pinching out from moon by moon
  // opens the line; past the whole year it returns to the spiral; pinching in
  // past one moon returns to moon by moon.
  let pinchEdge = 0;
  function pinch(dy) {
    // pinching in on the solar view opens it out into rings within rings
    if (level === 0) {
      if (!three) growBy(-dy * 0.016);
      return;
    }
    if (level !== 1) return;
    if (!linear) {
      if (dy > 0) setLinear(true);
      return;
    }
    const centre = pos + vis / 2;
    const next = Math.max(NEAREST, Math.min(FARTHEST, rest * Math.exp(dy * 0.012)));
    if ((next === FARTHEST && dy > 0) || (next === NEAREST && dy < 0)) {
      pinchEdge += dy;
      if (pinchEdge > 160) return ((pinchEdge = 0), go(0));
      if (pinchEdge < -160) return ((pinchEdge = 0), setLinear(false));
    } else pinchEdge = 0;
    rest = next;
    vis = next;
    pos = clampPos(centre - vis / 2);
    li = centreOf();
    panning = true;
    clearTimeout(panTimer);
    panTimer = setTimeout(() => (panning = false), 160);
  }
  // along the line, the moon behind stays the middle one, without a journey
  $: if (linear && level === 1 && theta.length && li >= 0) fly(true);
  // the pinned names sit at the screen's own left edge, where the line runs out
  let lanesEl;
  let lanesInset = 0;
  $: if (lanesEl && vw && linear) lanesInset = lanesEl.getBoundingClientRect().left;
  // the view switch lives in the header row, above the site header's frosted
  // strip, so it is lifted out to the page's top level
  const toTop = (node) => {
    document.body.appendChild(node);
    return { destroy: () => node.remove() };
  };
  // zoomed out along the line: month names, and dots for what is noted
  const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  function monthsIn(L) {
    const out_ = [];
    const d = new Date(L.start);
    for (let m = new Date(d.getFullYear(), d.getMonth() + 1, 1); m.getTime() < L.end; m = new Date(m.getFullYear(), m.getMonth() + 1, 1)) {
      out_.push({ x: (m.getTime() - L.start) / (L.end - L.start), name: MONTH[m.getMonth()] });
    }
    return out_;
  }
  function dotsIn(L) {
    const px = (segW || 320) / vis;
    const last = [];
    return itemsOf(L)
      .filter((it) => it.at && !off.has(it.kind))
      .sort((a, b) => a.at - b.at)
      .map((it) => {
        const x = (it.at - L.start) / (L.end - L.start);
        let row = 0;
        while (last[row] !== undefined && (x - last[row]) * px < 11) row++;
        last[row] = x;
        return { it, x, row, colour: tint(it) };
      });
  }
  // the small map: hovering a moon shows its number in the middle; the middle
  // itself is the way back to the whole spiral
  let mapHover = null;
  let noteClosed = false;
  $: inviting = level === 1 && !linear && !!here && !member && !noteClosed && !itemsOf(here).filter((it) => !it.pinned && !it.sample).length;
  let scrubEl;
  let scrubbing = false;
  // the slider moves the line directly (no zoom), at most once a frame
  let scrubX = null;
  let scrubFrame = 0;
  function scrubTo(e) {
    scrubX = e.clientX;
    if (scrubFrame) return;
    scrubFrame = requestAnimationFrame(() => {
      scrubFrame = 0;
      const r = scrubEl.getBoundingClientRect();
      pan(((scrubX - r.left) / r.width) * n - vis / 2, true);
    });
  }
  function scrubStart(e) {
    scrubbing = true;
    scrubTo(e);
  }
  // on the solar view, pulling the spiral up or down tips it into 3D, the
  // drag carrying straight on into the cone
  let tip = null;
  let tipFrom = null;
  function tipStart(e) {
    if (level !== 0 || three || nested || e.button !== 0 || e.pointerType === 'touch' || e.target.closest('button, a, input, .views, .map, .filters, .key')) return;
    tip = { x: e.clientX, y: e.clientY };
  }
  function tipMove(e) {
    if (!tip) return;
    if (Math.abs(e.clientY - tip.y) > 14 && Math.abs(e.clientY - tip.y) > Math.abs(e.clientX - tip.x)) {
      tipFrom = { x: tip.x, y: tip.y };
      tip = null;
      open3D();
    }
  }
  let drag = null;
  function dragStart(e) {
    if (level !== 1 || e.button !== 0 || e.target.closest('.leaf, button, a')) return;
    drag = { x: e.clientX, pos, moved: false };
  }
  function dragMove(e) {
    tipMove(e);
    if (scrubbing) return scrubTo(e);
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4 && !drag.moved) {
      drag.moved = true;
      // dragging the line moon by moon slides into the line view
      if (!linear) {
        setLinear(true);
        drag = { ...drag, x: e.clientX, pos };
        return;
      }
    }
    if (drag.moved) pan(drag.pos - (e.clientX - drag.x) / segPx);
  }
  function dragEnd() {
    tip = null;
    scrubbing = false;
    if (drag?.moved) setTimeout(() => (drag = null));
    else drag = null;
  }
  $: offset = linear ? pos : li;
  $: trackW = linear ? (n / vis) * 100 : n * 100;
  $: segPx = (segW || 320) / (linear ? rest : 1);
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
          return { it, x, row, onMark: y0 < 0, dx: left - px, twig, tilt: slid ? 18 : ((k * 37) % 21) - 10, leaf: { ...leafFor(it.symbol), pigment: tint(it) ?? leafFor(it.symbol).pigment } };
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
  // Each person keeps the kinds of time that matter for their part in the
  // village: every kind can be switched off and on. The children's lens
  // brings forward everything about the children, in one blue. Marks can be
  // simple (a coloured dot) or lively (the drawn symbols). Remembered here.
  let off = new Set();
  let children = false;
  let lively = true;
  try {
    off = new Set(JSON.parse(localStorage.getItem('lv-timeline-off') ?? '[]'));
    lively = localStorage.getItem('lv-timeline-marks') !== 'simple';
  } catch {}
  function toggleKind(key) {
    off.has(key) ? off.delete(key) : off.add(key);
    off = new Set(off);
    try {
      localStorage.setItem('lv-timeline-off', JSON.stringify([...off]));
    } catch {}
  }
  function setLively(on) {
    lively = on;
    try {
      localStorage.setItem('lv-timeline-marks', on ? 'lively' : 'simple');
    } catch {}
  }
  const OWN = { cross: '#7d4f9e', birthday: '#d9709e' };
  const tint = (it) => (it.children ? CHILDREN : OWN[it.symbol] ?? KINDS[it.kind]?.colour);
  // the small drawn icons of the kinds, after the Scale of Permanence sheet
  const ICON = {
    sparkle: 'M0 -7 C0.8 -1.5 1.5 -0.8 7 0 C1.5 0.8 0.8 1.5 0 7 C-0.8 1.5 -1.5 0.8 -7 0 C-1.5 -0.8 -0.8 -1.5 0 -7Z',
    sprig: 'M-6 6 C-2 2 2 -2 6 -6 M-2 2 C-5 1 -6 -2 -5 -4 C-2 -3 -1 -1 -2 2Z M2 -2 C2 -5 4 -7 6 -7 C6 -4 5 -2 2 -2Z',
    bunting: 'M-7 -4 C-2 -1 2 -1 7 -4 M-5 -3 L-3.5 2 L-2 -2 M0 -1.6 L1.5 3 L3 -1.8 M4.5 -2.6 L6 1.4',
    people: 'M-4 -3 a1.6 1.6 0 1 0 0.01 0 M4 -3 a1.6 1.6 0 1 0 0.01 0 M0 -4.5 a1.8 1.8 0 1 0 0.01 0 M-6.5 5 C-6.5 1 -1.5 1 -1.5 5 M1.5 5 C1.5 1 6.5 1 6.5 5 M-3 5 C-3 0 3 0 3 5',
    cubes: 'M-6 1 L-3 -0.5 L0 1 L0 4.5 L-3 6 L-6 4.5Z M0 1 L3 -0.5 L6 1 L6 4.5 L3 6 L0 4.5Z M-3 -4.5 L0 -6 L3 -4.5 L3 -1 L0 0.5 L-3 -1Z',
    spiral: 'M0 0 C0 -1.5 2 -1.5 2 0 C2 2.5 -2.5 3 -3 0 C-3.5 -4 3.5 -4.5 4.5 0 C5.5 5 -5 6 -6 0',
  };
  $: dimmed = (it) => (kind && it.kind !== kind) || (children && !it.children);
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
          .filter((g) => !off.has(g.key) && (g.lanes.length || g.beats.length))
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
  const ROLE = { host: '#8a6a4a', keeping: '#9a8fb0', volunteer: '#9b8ad0', guest: '#9b8ad0', steward: '#9b8ad0' };
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
  // across years: the lunar circle tips back, and the same time of year in
  // the years before and after stacks above and below it, to step through
  // without leaving the moon. Years the timeline doesn't hold yet are faint.
  let acrossYears = false;
  $: if (level !== 1 || linear) acrossYears = false;
  $: yearStack = here && acrossYears ? [-2, -1, 1, 2].map((k) => {
    const i = sameSeason(li, k);
    if (i >= 0) return { k, i, index: lunations[i].index, name: lunations[i].name, start: lunations[i].start, heat: lunations[i].heat };
    const start = here.start + k * YEAR_MS;
    return { k, i: -1, index: Math.round(here.index + k * 12.368), name: '', start, heat: here.heat, ghost: true };
  }) : [];
  function stepYear(dir) {
    const next = yearStack.find((y) => y.k === dir && !y.ghost);
    if (!next) return;
    li = next.i;
    fly(true);
  }
  let yearAcc = 0;
  let yearTimer;

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

<main class="tl" class:travel={travelling} class:landed={level === 1 && !linear && landed} class:close={level === 1 && !travelling} bind:this={page} on:pointerdown={tipStart} on:touchstart|passive={onTouchStart} on:touchmove|passive={onTouchMove} on:touchend={onTouchEnd}>
  <div class="glow" aria-hidden="true"></div>
  <svg width="0" height="0" style="position: absolute" aria-hidden="true">
    <filter id="tl-wash" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="4" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" />
    </filter>
  </svg>
  <div class="threads"><Mycelium opacity={0.2} /></div>
  {#if peek && level === 0}<Preview lunation={peek} x={peekX} y={peekY} />{/if}
  {#if nested && level === 0}
    <Nested
      {lunations}
      {rhythms}
      washes={rose?.quarters ?? []}
      turnings={rose?.points ?? []}
      bind:this={nestRef}
      {grow}
      frame={nestFrame}
      onOpen={(i) => (setGrow(0), go(1, i))}
      onClose={closeNest}
      onPinchOut={(dy) => growBy(-dy * 0.016)}
      onZoom={(z) => (nestZoom = z)}
    />
  {/if}
  {#if three && level === 0}
    <Spiral3D
      known={lunations.map((l, i) => ({ index: l.index, angle: theta[i], heat: l.heat, now: l.now, when: l.now ? 'now' : day(l.start) }))}
      {firstIndex}
      onPick={(i) => ((three = false), (peek = null), go(1, i))}
      onFlat={() => ((three = false), (tipFrom = null))}
      flat={flat3}
      onPeek={peekAt}
      grab={tipFrom}
      quarters={rose?.quarters ?? []}
      points={rose?.points ?? []}
      art={SEASON_NAME}
    />
  {/if}
  <div class="world" class:three={three && level === 0} class:nesting={nested && level === 0} style:--grow={grow} style:translate={nestZoom.z > 1 ? `${nestZoom.x}px ${nestZoom.y}px` : null} style:scale={nestZoom.z > 1 ? nestZoom.z : null} style:--label-fade={labelFade} class:phone class:small bind:this={world} data-level={level}>
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
        <!-- the sun: the spiral sits at its golden heart, faint rays all round -->
        <radialGradient id="sun-heart" cx="0" cy="0" r={rose.reach * 0.62} gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.9" />
          <stop offset="0.2" stop-color="#fff3cc" stop-opacity="0.75" />
          <stop offset="0.55" stop-color="#ffe39a" stop-opacity="0.4" />
          <stop offset="1" stop-color="#fff6dc" stop-opacity="0" />
        </radialGradient>
        <circle class="sun-heart" r={rose.reach * 0.62} fill="url(#sun-heart)" />

        <!-- the four quarters of the year, each in its own wash -->
        <g mask="url(#rose-mask)">
          {#each rose.quarters as q}<path class="quarter" d={wedge(q.a0, q.a1, rose.reach)} style="fill: {q.colour}" />{/each}
        </g>
        <radialGradient id="band-fade" cx="0" cy="0" r={rose.rim + BAND_OUT} gradientUnits="userSpaceOnUse">
          <stop offset={(rose.rim - BAND_IN) / (rose.rim + BAND_OUT)} stop-color="#fff" stop-opacity="0" />
          <stop offset={(rose.rim - BAND_IN * 0.3) / (rose.rim + BAND_OUT)} stop-color="#fff" stop-opacity="1" />
          <stop offset={(rose.rim + 400) / (rose.rim + BAND_OUT)} stop-color="#fff" stop-opacity="1" />
          <stop offset={(rose.rim + 1300) / (rose.rim + BAND_OUT)} stop-color="#fff" stop-opacity="0.5" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </radialGradient>
        <!-- a drawing for each turning of the sun, on the circle's edge, its
             edges feathered into the washes; it wakes when hovered -->
        {#if !phone}
          {#each rose.points as pt}
            {@const cx = (rose.rim + 70) * Math.cos(pt.a)}
            {@const cy = (rose.rim + 70) * Math.sin(pt.a)}
            <mask id="band-{pt.lon}" maskUnits="userSpaceOnUse" x="-5000" y="-5000" width="10000" height="10000">
              <!-- its quarter, fading in and out across the band, and in steps
                   into its neighbours on either side -->
              <path d={annulus(pt.a - 0.66, pt.a + 0.66, rose.rim - BAND_IN, rose.rim + BAND_OUT)} style="fill: url(#band-fade)" />
              {#each [0.8, 0.6, 0.4, 0.22, 0.1] as o, k}
                <path d={annulus(pt.a + 0.66 + k * 0.05, pt.a + 0.71 + k * 0.05, rose.rim - BAND_IN, rose.rim + BAND_OUT)} style="fill: url(#band-fade)" opacity={o} />
                <path d={annulus(pt.a - 0.71 - k * 0.05, pt.a - 0.66 - k * 0.05, rose.rim - BAND_IN, rose.rim + BAND_OUT)} style="fill: url(#band-fade)" opacity={o} />
              {/each}
            </mask>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <g class="season-art" class:awake={seasonHover === pt.lon} mask="url(#band-{pt.lon})">
              <image href="/images/concepts/season-{SEASON_NAME[pt.lon]}.svg" x={cx - IMG_R} y={cy - IMG_R} width={IMG_R * 2} height={IMG_R * 2} preserveAspectRatio="xMidYMid slice" />
              <!-- hovered, the season grows: snow falls, shoots sprout, mushrooms rise -->
              {#if seasonHover === pt.lon}
                <image class="more" href="/images/concepts/season-{SEASON_NAME[pt.lon]}-more.svg" x={cx - IMG_R} y={cy - IMG_R} width={IMG_R * 2} height={IMG_R * 2} preserveAspectRatio="xMidYMid slice" />
              {/if}
            </g>
          {/each}
          <!-- where each drawing can be woken: its own quarter of the band,
               outside the spiral, so the images never catch the pointer elsewhere -->
          {#each rose.points as pt}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <path class="season-hit" d={annulus(pt.a - 0.7, pt.a + 0.7, rose.rim + 60, rose.rim + BAND_OUT)} on:mouseenter={() => (seasonHover = pt.lon)} on:mouseleave={() => (seasonHover = null)} />
          {/each}
        {/if}
        <!-- its light: bright white at the heart, warming to yellow, and soft
             shafts of it reaching out past the rim, blurred, fading into the paper -->
        <radialGradient id="ray-fade" cx="0" cy="0" r={rose.rim + RAY_OUT} gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.95" />
          <stop offset="0.3" stop-color="#fff4cf" stop-opacity="0.8" />
          <stop offset={rose.rim / (rose.rim + RAY_OUT)} stop-color="#f9cf6a" stop-opacity="0.6" />
          <stop offset="1" stop-color="#f6c45a" stop-opacity="0" />
        </radialGradient>
        <filter id="ray-bloom" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox">
          <feGaussianBlur stdDeviation="70" />
        </filter>
        <g class="sun-rays" filter="url(#ray-bloom)">
          {#each Array(36) as _, k}
            {@const a = (k * Math.PI) / 18 + (k % 3 ? 0.03 : 0)}
            {@const r1 = rose.rim + RAY_OUT * (k % 4 === 0 ? 1 : k % 2 ? 0.55 : 0.78)}
            {@const w = k % 4 === 0 ? 0.07 : 0.045}
            <path d="M0 0L{r1 * Math.cos(a - w)} {r1 * Math.sin(a - w)}Q{(r1 + 60) * Math.cos(a)} {(r1 + 60) * Math.sin(a)} {r1 * Math.cos(a + w)} {r1 * Math.sin(a + w)}Z" />
          {/each}
        </g>
        <!-- the cross of solstices and equinoxes, never over the spiral or its words -->
        {#each rose.points as pt}
          {@const c = Math.cos(pt.a)}
          {@const s = Math.sin(pt.a)}
          {#if phone}<path class="axis" d="M{hubClear(pt.a) * c} {hubClear(pt.a) * s}L{pt.inner * c} {pt.inner * s}" />{/if}
          {#if !phone}<path class="axis" d="M{pt.outer * c} {pt.outer * s}L{(pt.outer + 150) * c} {(pt.outer + 150) * s}" />{/if}
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
        <!-- the band as watercolour: a pale wide wash, a deeper core laid a
             little off, and the pigment pooling at both edges -->
        <!-- one soft wash, laid as one, so its pieces never darken where they meet -->
        <g class="bands wash">
          {#each bandBits as b}<path d={stretch(b.t0, b.t1, 4)} style="stroke: {b.colour}" />{/each}
        </g>
        <!-- stipple gathering just outside the band, as in the diagrams -->
        <g class="stipple">
          {#each specks as d}<circle cx={d.x} cy={d.y} style="--r: {d.r}" />{/each}
        </g>
        <!-- the past, back to Lunation 1: the spiral carries on inwards in
             faint, tightening rings, like a tree's, until Holons holds what
             happened in them -->
        <path class="past-thread" d={pastPath} />
        {#each pastMoons as m}
          <circle class="past-moon" cx={m.x} cy={m.y} r={m.r}><title>Lunation {m.index}</title></circle>
        {/each}
        <!-- the line in fine ink -->
        <path class="thread" d={stretch(0, n - 1, 600)} />
        {#each wheelDays as w}
          {@const p = at(w.t)}
          <g class="wheel-day" class:turn={w.turn} style="transform: translate({p.x}px, {p.y}px) scale(var(--inv, 1))">
            <title>{w.title}, {day(w.at)}</title>
            <circle r="4.2" />
            {#each Array(8) as _, k}<path d="M0 0L{4.2 * Math.cos((k * Math.PI) / 4)} {4.2 * Math.sin((k * Math.PI) / 4)}" />{/each}
          </g>
        {/each}
        <!-- and on beyond the hundredth: the spiral fades out into the stars -->
        {#each Array(FUTURE * 4) as _, k}
          <path class="future" d={stretch(n - 1 + k / 4, n - 1 + (k + 1) / 4, 6)} style="opacity: {0.5 * (1 - k / (FUTURE * 4)) ** 1.3}" />
        {/each}
        <!-- longer stretches, between the turns, their names along them -->
        {#each SPANS as sp, k}
          {#if idx(sp.from) >= 0 && idx(sp.to) >= 0}
            {@const upright = Math.sin(thetaAt((idx(sp.from) + idx(sp.to)) / 2)) > 0}
            <path id="span-{k}" class="span" d={upright ? stretch(idx(sp.to) + 0.4, idx(sp.from) - 0.4, 40, D / 2 + 100) : stretch(idx(sp.from) - 0.4, idx(sp.to) + 0.4, 40, D / 2 + 100)} style="stroke: {sp.colour}" />
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
        <p class="hub-eyebrow">the solar cycle · the village's year in moons</p>
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
        on:click={() => ((peek = null), go(1, i))}
        on:mouseenter={(e) => level === 0 && peekAt(i, e)}
        on:mousemove={(e) => level === 0 && peekAt(i, e)}
        on:mouseleave={() => (peek = null)}
        aria-label="Lunation {l.index}: {l.name}, from {day(l.start)}"
      >
        <span class="wash-blob" style="--dx: {((i * 37) % 9) - 4}%; --dy: {((i * 53) % 9) - 4}%"></span>
        <Ring seed={i + 40} />
        <span class="inner"><Ring seed={i + 90} /></span>
        <span class="num">{l.index}</span>
        <span class="when">{l.now ? 'now' : day(l.start)}</span>
      </button>
    {/each}
  </div>

  <!-- close up: the same order every time -->
  {#if level === 1 && here}
      <section class="closeup" bind:this={closeupEl} class:has-invite={inviting} class:linear class:wide class:away={travelling} on:scroll={(e) => e.currentTarget.scrollLeft && (e.currentTarget.scrollLeft = 0)} out:rise={{ y: 16, duration: 220 }}>
        <!-- the title and the three below change in place, one after the
             other (never over each other), as the line flows on -->
        <!-- along the line, no single moon heads the page: each names itself on
             the line, and only the kinds of time stay up here -->
        <!-- the kinds of time across the top, along the line and by the moon alike;
             by the moon, with how many of each it holds -->
        <div class="line-head" class:resting={acrossYears}>
            <span>kinds of time</span>
            {#each Object.entries(KINDS) as [key, k]}
              <!-- by the moon, a longer name takes a line of its own -->
              {#if k.label.length > 14}<i class="br"></i>{/if}
              <button type="button" class="kind-chip" class:off={off.has(key)} class:none={!linear && !kindCount[key]} style="--c: {k.colour}" title="{k.note} · tap to switch {off.has(key) ? 'on' : 'off'}" on:click={() => toggleKind(key)} aria-pressed={!off.has(key)}><svg class="kind-icon" viewBox="-8 -8 16 16" aria-hidden="true"><path d={ICON[k.icon]} /></svg>{k.label}{#if !linear}<small>{kindCount[key] ?? 0}</small>{/if}</button>
              {#if k.label.length > 14}<i class="br"></i>{/if}
            {/each}
            <button type="button" class="kind-chip lens" class:on={children} style="--c: {CHILDREN}" on:click={() => (children = !children)} aria-pressed={children}><i></i>children</button>
          </div>
        {#key linear ? -1 : here.index}
        <header class="title" in:fadeIn out:fadeOut>
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
            </dl>
          </div>
        </header>

        {/key}
        <!-- a small note under the details, inviting visitors to co-create the moon -->
  {#if level === 1 && !linear && here && !member && !noteClosed && !itemsOf(here).filter((it) => !it.pinned && !it.sample).length}
    <aside class="invite" in:rise={{ y: 24, duration: 500, delay: 900 }} out:rise={{ y: 24, duration: 250 }}>
      <p><b>Lunation {here.index} may already be in planning.</b> Would you like to co-create it with us?</p>
      <a href="/apply">Apply to visit or join</a>
      <button type="button" class="invite-x" aria-label="Close the note" on:click={() => (noteClosed = true)}>×</button>
    </aside>
  {/if}

        {#if !linear}
          <!-- the lunation as a moon in four quarters; a sideways swipe or a
               drag unrolls it into the lunar cycle -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div class="moon-view" class:across={acrossYears} on:pointerdown={dragStart} out:unroll in:fadeIn>
            <!-- the same time of year before (behind, above) and after (in front, below) -->
            <!-- the same time of year across the years, as a small upright line
                 beside the moon: this one marked, the others a tap away -->
            {#if acrossYears}
              <ol class="year-line" transition:rise={{ y: 6, duration: 300 }}>
                {#each [...yearStack.filter((y) => y.k < 0), { k: 0, index: here.index, name: here.name, start: here.start, now: true }, ...yearStack.filter((y) => y.k > 0)] as y (y.k)}
                  <li class:here={y.now} class:ghost={y.ghost} style="--k: {y.k}" title={y.ghost ? 'not on the timeline yet' : null}>
                    <button type="button" disabled={y.now || y.ghost} on:click|stopPropagation={() => stepYear(y.k)}>
                      <i></i><b>{yearOf(y.start)}</b>
                      <span>Lunation {y.index}{y.name ? ` · ${y.name}` : ''}</span>
                    </button>
                  </li>
                {/each}
              </ol>
            {/if}
            {#key here.index}
              <MoonCycle
                L={here}
                items={itemsOf(here).filter((it) => it.at && !off.has(it.kind))}
                spans={allStretches.filter((x) => overlaps(x, here) && !off.has(x.kind))}
                beats={rhythms.filter((r) => !off.has(r.kind)).flatMap((r) => r.beats.filter((b) => b.at >= here.start && b.at <= here.end).map((b) => ({ at: b.at, title: r.title, colour: tint(r) })))}
                {tint}
                {lively}
                {day}
                {nowMs}
                onPick={(it) => (picked = it)}
              />
            {/key}
          </div>
        {:else}
        <!-- the lunar cycle: every lunation end to end, as one ribbon that
             flows along to the next, like moving round the spiral -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="line-area" class:grab={level === 1} bind:clientWidth={segW} on:click={openDay} on:pointerdown={dragStart}>
          <div class="track" class:panning style="width: {trackW}%; transform: translateX({(-offset * 100) / n}%)">
          <svg class="line" viewBox="0 0 1000 20" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 10 C200 8 400 12 600 9 S860 11 1000 10" />
          </svg>
          {#each lunations as L, li2}
          <div class="seg" class:here={linear ? li2 >= Math.floor(pos) && li2 <= Math.ceil(pos + 1) : li2 === li} class:first={li2 === Math.max(0, Math.floor(pos))} style="left: {(li2 * 100) / n}%; width: {100 / n}%">
          <div class="end start"><i></i><em class="short"><b>{L.index}</b> {L.name}</em><span>{#if linear}<button type="button" class="moon-name" on:click={() => (setLinear(false), go(1, li2))} title="read this moon">Lunation {L.index} · {L.name}</button>{:else}Lunation {L.index}{/if}<br />{day(L.start)}</span></div>
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
          {#if wide}
            <!-- zoomed out: the months along the line, and everything noted
                 as a dot in its colour, stacked where days are close -->
            {#each monthsIn(L) as m}
              <span class="month" style="left: {m.x * 100}%">{m.name}</span>
            {/each}
            {#each dotsIn(L) as d (d.it.id)}
              <button type="button" class="dot" class:faded={dimmed(d.it)} style="left: {d.x * 100}%; --row: {d.row}; --pig: {d.colour}" title="{d.it.title}, {day(d.it.at)}" aria-label="{d.it.title}, {day(d.it.at)}" on:click={() => (picked = d.it)}></button>
            {/each}
          {/if}
          {#each pinRows(L, itemsOf(L).filter((it) => it.at && !off.has(it.kind)), segPx, NOTE, SLIDE, ROWS) as pn, k (pn.it.id)}
            <div class="pin {pn.it.status ?? ''}" class:faded={dimmed(pn.it)} class:on-mark={pn.onMark} style="--ww: {WORDS}px; left: {pn.x * 100}%; --row: {pn.row}; --dx: {pn.dx}px; --d: {250 + k * 140}ms">
              <svg class="stem" aria-hidden="true">
                <path class="twig" d={pn.twig} />
                {#if !lively}
                  <circle class="mark-dot" cx={pn.dx + 16} cy={-(LIFT + pn.row * ROW) - 7} r="6.5" style="--pig: {pn.leaf.pigment}" />
                {:else}
                <g class="leaf" role="button" tabindex="-1" aria-label={pn.it.title} on:click={() => (picked = pn.it)} on:keydown={() => (picked = pn.it)} transform="translate({pn.dx + 16} {-(LIFT + pn.row * ROW)}) rotate({pn.tilt}) scale(1.5)" style="--pig: {pn.leaf.pigment}">
                  <g class="unfurl">
                    <path class="blade" d={pn.leaf.shape} />
                    {#each pn.leaf.veins as v}<path class="vein" d={v} />{/each}
                  </g>
                </g>
                {/if}
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
        <div class="lanes" bind:this={lanesEl} class:grab={level === 1} on:pointerdown={dragStart} style="height: {strataH + (member ? 34 + stayRows * 22 + 22 : 0)}px">
          {#if linear}
            <!-- along the line, each kind and rhythm keeps its name at the left -->
            <div class="pinned-names" style="left: {-lanesInset}px">
              {#each strata as g (g.key)}
                <p class="stratum-name" class:faded={kind && kind !== g.key} style="top: {g.top}px; --c: {KINDS[g.key].colour}">{KINDS[g.key].label}</p>
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
                  <div class="stratum" class:faded={(kind && kind !== g.key) || children} style="top: {g.top}px; --c: {KINDS[g.key].colour}">
                    <p class="stratum-name">{KINDS[g.key].label}</p>
                    {#each inLunation(L, g.lanes) as b (b.it.id)}
                      <div class="stretch {b.it.status ?? 'land'}" class:kids={b.it.children} style="{b.it.children ? `--c: ${CHILDREN};` : ''} left: {b.x0 * 100}%; width: {(b.x1 - b.x0) * 100}%; top: {18 + b.row * 26}px" title="{b.it.title}, {day(b.it.at)} to {day(b.it.until)}{b.it.status ? ` · ${STATUS[b.it.status].label}` : ''}">
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
                    <div class="stay" class:keeping={b.it.role === 'keeping'} class:arc={['guest', 'volunteer', 'steward'].includes(b.it.role)} style="left: {b.x0 * 100}%; width: {(b.x1 - b.x0) * 100}%; top: {strataH + 30 + b.row * 22}px; --c: {ROLE[b.it.role]}" title="{b.it.who}, {day(b.it.at)} to {day(b.it.until)}">
                      <span class:cont={b.cont}>{b.it.who}</span>
                      {#if ['guest', 'volunteer', 'steward'].includes(b.it.role)}
                        <!-- a guest's stay as an arc, from arrival to leaving -->
                        <svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><path d="M0 9.5 Q50 -4 100 9.5" /></svg>
                      {:else}<i></i>{/if}
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
        {/if}

        <!-- on a narrow screen the leaves stand alone; a tap reads one here -->
        <!-- along the line: the whole year in small, the part in view marked;
             drag it, or tap a moon to go there -->
        {#if linear}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
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
          <!-- the key, folded away until asked for -->
          <button type="button" class="key-toggle" on:click={() => (lineKey = !lineKey)} aria-expanded={lineKey}>{lineKey ? 'hide key' : 'show key'}</button>
          {#if lineKey}
          <ul class="legend marks" aria-label="The marks" transition:rise={{ y: 6, duration: 220 }}>
            <li><svg viewBox="-12 -30 24 32" class="lg mk" style="--p: #7d4f9e"><path d="M-2.4 -2 C-2.6 -8 -2.6 -11 -2.2 -12 C-6 -12 -9 -12 -10 -14.6 C-9 -17 -6 -17.2 -2.2 -17.2 C-2.6 -21 -2.6 -27 0 -29 C2.6 -27 2.6 -21 2.2 -17.2 C6 -17.2 9 -17 10 -14.6 C9 -12 6 -12 2.2 -12 C2.6 -11 2.6 -8 2.4 -2 C1.4 0 -1.4 0 -2.4 -2Z" /></svg>holy day</li>
            <li><svg viewBox="-13 -29 26 31" class="lg mk" style="--p: #d7745c"><path d="M0 -1 Q-2 -7 -8 -6 Q-6 -11 -12 -14 Q-6 -16 -8 -22 Q-2 -20 0 -27 Q2 -20 8 -22 Q6 -16 12 -14 Q6 -11 8 -6 Q2 -7 0 -1Z" /></svg>event</li>
            <li><svg viewBox="-11 -29 22 30" class="lg mk" style="--p: #d9709e"><path d="M0 -28 C2 -22 4 -20 10 -19.5 C5.5 -16 4.5 -13 6.2 -6.5 C1.6 -9.6 -1.6 -9.6 -6.2 -6.5 C-4.5 -13 -5.5 -16 -10 -19.5 C-4 -20 -2 -22 0 -28Z" /></svg>birthday</li>
            <li><svg viewBox="-13 -29 26 31" class="lg mk" style="--p: #7d9466"><path d="M0 0 C-4 -3 -9 -4 -8 -9 C-12 -11 -11 -15 -7 -16 C-10 -20 -7 -25 -3 -23 C-3 -28 3 -28 3 -23 C7 -25 10 -20 7 -16 C11 -15 12 -11 8 -9 C9 -4 4 -3 0 0Z" /></svg>the land</li>
            <li><svg viewBox="0 0 30 12" class="lg-arc"><path d="M1 11 Q15 -3 29 11" /></svg>a guest's stay</li>
            <li><i class="lg-kids"></i>children</li>
            <li class="marks-switch" role="radiogroup" aria-label="Marks">
              <button type="button" role="radio" aria-checked={!lively} class:on={!lively} on:click={() => setLively(false)}>simple</button>
              <button type="button" role="radio" aria-checked={lively} class:on={lively} on:click={() => setLively(true)}>lively</button>
            </li>
          </ul>
          <ul class="legend" aria-label="How to read the line" transition:rise={{ y: 6, duration: 220 }}>
            <li><svg viewBox="-12 -30 24 32" class="lg committed"><path d="M0 0 C-11 -8 -12 -22 0 -31 C12 -22 11 -8 0 0Z" /></svg>committed</li>
            <li><svg viewBox="-12 -30 24 32" class="lg imagined"><path d="M0 0 C-11 -8 -12 -22 0 -31 C12 -22 11 -8 0 0Z" /></svg>imagined</li>
            <li><svg viewBox="-12 -30 24 32" class="lg remembered"><path d="M0 0 C-11 -8 -12 -22 0 -31 C12 -22 11 -8 0 0Z" /></svg>remembered</li>
            <li><svg viewBox="-13 -29 26 31" class="lg question"><path d="M-1 0 L1 -6 C-9 -6 -13 -13 -11 -20 C-9 -28 9 -28 11 -20 C13 -13 9 -6 4 -6Z" /><path class="q" d="M-3 -19 C-3 -24 4 -24 4 -20 C4 -17 0 -17 0 -13M0 -10 L0 -9.6" /></svg>a question to decide</li>
            <li><i class="lg-today"></i>today</li>
            <li class="lg-note">tap the line to open a day · samples until Holons holds the village's own</li>
          </ul>
          {/if}
          {#if (compact || wide || !linear) && itemsOf(here).some((it) => it.at)}
            {#if picked && (wide || picked.lunation === here.index)}
              <p class="picked">{picked.title} · {day(picked.at)}{#if picked.where} · {picked.where}{/if}</p>
            {/if}
          {/if}
          {#if !itemsOf(here).filter((it) => !it.pinned && !it.sample).length}
            {#if member}
              <p class="quiet">Nothing noted in Holons for this lunation yet.</p>
            {/if}
          {/if}
        </div>

        <!-- personal, local, global: always these three -->
        {#key linear ? -1 : here.index}
        <div class="realms" in:fadeIn out:fadeOut>
          {#each realms(here) as r}
            <section class="realm" class:lean={here.lean === r.key}>
              <h3>{r.title}{#if here.lean === r.key}<span class="leans">this moon's focus</span>{/if}</h3>
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

  <!-- the spiral in small, to know where you are: close up only (on the
       whole spiral it would only repeat what is already there) -->
  {#if n && level === 1}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <nav class="map" aria-label="The year in small" use:toTop>
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
          <circle class="map-dot" class:here={level === 1 && i === li} class:now={l.now} class:dim={!matches(l)} cx={p.x * s} cy={p.y * s} r={level === 1 && i === li ? 5.5 : mapHover === i ? 4.6 : 3.2} style="fill: {l.heat}" on:click={() => go(1, i)} on:mouseenter={() => (mapHover = i)} on:mouseleave={() => (mapHover = null)} aria-label="Lunation {l.index}" />
        {/each}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <g class="map-centre" class:hovered={mapHover === 'centre'} on:click={() => go(0)} on:mouseenter={() => (mapHover = 'centre')} on:mouseleave={() => (mapHover = null)} aria-label="Back to the whole spiral">
          <circle r="20" />
          {#if mapHover === 'centre'}
            <path class="map-spiral" d="M0 0 C0 -2 2.6 -2 2.6 0 C2.6 3.4 -3.4 3.9 -3.9 0 C-4.4 -5.2 4.7 -6 6 0 C7.3 6.5 -6.2 7.8 -7.8 0" />
          {:else}
            <text y="3">{mapHover !== null ? lunations[mapHover].index : level === 1 && here ? here.index : '84–100'}</text>
          {/if}
        </g>
      </svg>
    </nav>
  {/if}

  <!-- a few ways to look at the year -->
  <form class="filters" class:hidden-close={level === 1} on:submit|preventDefault aria-label="Filter the moons" use:toTop>
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

  <!-- the timeline, as a round toggle beside the small map: on, the moons
       lie along the line; off, one lunation at a time -->
  {#if n}
    <!-- the three ways to see: the sun (the solar cycle), the moon (one
         lunation), the line (the lunar cycle) -->
    <nav class="views" class:alone={level === 0} aria-label="Ways to see the year" use:toTop>
      <button type="button" class:on={level === 0} aria-pressed={level === 0} title="solar: the year as a spiral round the sun" on:click={() => go(0)}>
        <svg viewBox="-12 -12 24 24" aria-hidden="true"><circle r="4.6" />{#each Array(8) as _, k}<path d="M{7 * Math.cos((k * Math.PI) / 4)} {7 * Math.sin((k * Math.PI) / 4)}L{9.6 * Math.cos((k * Math.PI) / 4)} {9.6 * Math.sin((k * Math.PI) / 4)}" />{/each}</svg>
        <span>solar</span>
      </button>
      <button type="button" class:on={level === 1 && !linear} aria-pressed={level === 1 && !linear} title="lunar: one lunation, its moon in four quarters" on:click={() => (level === 0 ? go(1, nowIndex) : setLinear(false))}>
        <svg viewBox="-12 -12 24 24" aria-hidden="true"><path class="fill" d="M2 -8.5 A8.5 8.5 0 1 0 2 8.5 A6.5 8.5 0 0 1 2 -8.5Z" /></svg>
        <span>lunar</span>
      </button>
      <button type="button" class:on={level === 1 && linear} aria-pressed={level === 1 && linear} title="linear: the moons along a line" on:click={() => (level === 0 ? (go(1, nowIndex), setTimeout(() => setLinear(true), 1600)) : setLinear(true))}>
        <svg viewBox="-12 -12 24 24" aria-hidden="true"><path d="M-10 0 H10" /><circle class="fill" cx="-5.5" r="2.4" /><circle class="fill" cx="1.5" r="2.4" /><circle class="fill" cx="7.5" r="1.6" /></svg>
        <span>linear</span>
      </button>
      <!-- by the moon only: the same time of year across the years -->
      {#if level === 1 && !linear}
        <button type="button" class="years-view" class:on={acrossYears} aria-pressed={acrossYears} title="years: the same time of year, the years before and after" on:click={() => (acrossYears = !acrossYears)} transition:rise={{ y: -6, duration: 250 }}>
          <svg viewBox="-12 -12 24 24" aria-hidden="true"><ellipse rx="8.5" ry="2.8" cy="-5.5" /><ellipse rx="8.5" ry="2.8" /><ellipse rx="8.5" ry="2.8" cy="5.5" /></svg>
          <span>years</span>
        </button>
      {/if}
    </nav>
  {/if}



  <!-- the compass's key, and its switch -->
  {#if n && level === 0}
    <aside class="key">
      <button type="button" class="key-switch" on:click={() => (three ? (three = false) : open3D())} aria-pressed={three}>
        <svg viewBox="-10 -10 20 20" aria-hidden="true"><ellipse rx="8" ry="3" cy="4" /><ellipse rx="5" ry="2" cy="-1" /><ellipse rx="2.5" ry="1" cy="-5" /></svg>
        {three ? 'the flat spiral' : 'the spiral in 3D'}
      </button>
      <button type="button" class="key-switch" on:click={() => (grow > 0.5 ? closeNest() : openNest())} aria-pressed={nested}>
        <svg viewBox="-10 -10 20 20" aria-hidden="true"><circle r="8.5" /><circle r="5.5" /><circle r="2.5" /></svg>
        {grow > 0.5 ? 'the spiral' : 'everything in one circle'}
      </button>
      <button type="button" class="key-switch" on:click={toggleCompass} aria-pressed={compass}>
        <svg viewBox="-10 -10 20 20" aria-hidden="true"><circle r="8" /><path d="M0 -8V8M-8 0H8" /></svg>
        seasons compass {compass ? 'on' : 'off'}
      </button>
      {#if compass}
        <button type="button" class="key-open" on:click={() => (keyOpen = !keyOpen)} aria-expanded={keyOpen}>{keyOpen ? 'close the key' : 'key'}</button>
      {/if}
      {#if compass && keyOpen}
        <ul>
          <li><i class="k-solar"></i>the solar year turns at the winter solstice (Yule, the gold wheel)</li>
          <li><b>2027</b> the calendar year, from 1 January</li>
          <li><svg class="k-wheel" viewBox="-8 -8 16 16" aria-hidden="true"><circle r="6.5" />{#each Array(8) as _, k}<path d="M0 0L{6.5 * Math.cos((k * Math.PI) / 4)} {6.5 * Math.sin((k * Math.PI) / 4)}" />{/each}</svg>the wheel of the year: Samhain, Yule, Imbolc, Ostara, Beltane, Litha, Lughnasadh and Mabon</li>
          <li><i class="k-seal"></i>Chinese New Year: {newYears.map((l) => `${l.lny.animal}, ${day(l.start)} ${l.lny.year}`).join(' · ')}</li>
          <li><i class="k-heat"></i>colours follow the felt warmth, weeks behind the sun: coldest late January, hottest early August</li>
        </ul>
      {/if}
    </aside>
  {/if}

  <p class="hint" class:hidden3d={three || nested}>
    {level === 0 ? 'scroll in to travel moon by moon' : 'scroll on through the moons · scroll back quickly for the whole year'}
    {#if !live}<br /><span>draft themes · Holons not connected yet{member ? ' · member view' : ''}</span>{/if}
  </p>
</main>

<style>
  :global(body) {
    overflow: hidden;
  }

  /* The timeline's colours are fixed in the code: they are what each kind
     and mark means (the cross is always purple). On screen they lean a
     little towards the season the site is in, so they sit with its paper
     (the biophilic seasonal rule), without ever becoming other colours. */
  .tl :global(*) {
    --cs: color-mix(in oklab, var(--c, #888) 86%, var(--tl-ember, #fdd7bb));
    --pigs: color-mix(in oklab, var(--pig, #888) 86%, var(--tl-ember, #fdd7bb));
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

  /* between moons the camera glides: the heaviest layers (the blurred rays,
     the paintings) rest for the journey and come back when it lands */
  .travel .world {
    will-change: transform;
  }

  .travel :global(.sun-rays),
  .travel :global(.season-art),
  .travel :global(.threads) {
    opacity: 0 !important;
    transition: opacity 0.2s ease;
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

  .landed .moon-view {
    opacity: 1;
  }

  .moon.focused {
    transition: opacity 0.6s ease 0.4s;
  }

  .landed .moon.focused {
    opacity: 0;
  }

  /* hidden, not just clear, so nothing in it (the season hover areas, the
     moons) catches the pointer over the cone */
  .world.three {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.45s ease, visibility 0s linear 0.45s;
  }

  /* growing into the rings: the compass, its light and paintings stay, and
     only the spiral itself gives way, as the rings fill the same space */
  .world.nesting .path:not(.compass),
  .world.nesting .moon,
  .world.nesting .ghost,
  .world.nesting .hub,
  .world.nesting .label.year {
    opacity: calc(1 - var(--grow));
    transition: none;
  }

  .world.nesting .moon,
  .world.nesting .hub {
    pointer-events: none;
  }

  /* the sun, washes and paintings zoom with the spiral as one picture; the
     blurred rays rest while it does (a blur that size, scaled, tiles into boxes) */
  .world.nesting {
    transition: scale 0.28s ease-out, translate 0.28s ease-out;
  }

  .world.nesting .sun-rays {
    opacity: calc(1 - var(--grow)) !important;
    animation: none;
  }

  .world.nesting .label.cmp {
    opacity: var(--label-fade, 1);
    transition: opacity 0.3s ease;
  }

  .bands path {
    fill: none;
    stroke-linecap: butt;
  }

  .bands.wash {
    opacity: 0.7;
  }

  .bands.wash path {
    stroke-width: 50;
  }

  .stipple circle {
    r: calc(var(--r) * 1px * var(--inv, 1));
    fill: color-mix(in srgb, var(--bark-900) 22%, transparent);
  }

  .past-thread {
    fill: none;
    stroke: color-mix(in srgb, var(--bark-900) 22%, transparent);
    stroke-width: calc(0.8px * var(--inv, 1));
  }

  .path .past-moon {
    fill: color-mix(in srgb, #fffdf8 70%, transparent);
    stroke: color-mix(in srgb, var(--bark-900) 25%, transparent);
    stroke-width: calc(0.6px * var(--inv, 1));
    pointer-events: visiblePainted;
  }

  .thread {
    stroke: color-mix(in srgb, var(--bark-900) 85%, transparent);
    stroke-width: calc(1px * var(--inv, 1));
  }

  /* --- the seasons compass ---------------------------------------------------- */
  .compass .sun-rays path {
    fill: url(#ray-fade);
    stroke: none;
  }

  /* the rays fade in as the page opens, then breathe slowly */
  .sun-rays {
    opacity: 0.75;
    animation: rays-in 2.4s ease-out both, rays-breathe 9s ease-in-out 2.4s infinite;
  }

  @keyframes rays-in {
    from {
      opacity: 0;
    }
  }

  @keyframes rays-breathe {
    50% {
      opacity: 0.5;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sun-rays {
      animation: none;
    }
  }

  /* each season a large painting in its quarter of the circle, faded
     behind the spiral and feathered into the washes; hovered, it wakes */
  /* each turning's image sits on the circle's edge, feathered into the
     washes, and comes forward when hovered */
  .compass .season-hit {
    fill: transparent;
    stroke: none;
    pointer-events: fill;
  }

  .season-art {
    pointer-events: none;
    cursor: default;
    opacity: 0.32;
    transition: opacity 0.8s ease;
  }

  .season-art.awake {
    opacity: 0.8;
  }

  /* the threads below the ground: faint, and bright when the drawing wakes */
  @keyframes sway {
    50% {
      transform: rotate(1.6deg);
    }
  }

  @keyframes drift {
    50% {
      translate: 3px 6px;
    }
  }

  /* the stretches on the spiral are colour only; hover shows their names */
  .span {
    pointer-events: stroke;
    cursor: default;
  }

  .span-text {
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .span:hover + .span-text {
    opacity: 1;
  }

  /* a small note in the corner */
  /* tucked into the bottom corner, below everything else: narrow and tall,
     the leaf above the words, so it covers nothing */
  .invite {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 8;
    display: grid;
    grid-template-columns: 1fr;
    gap: 6px;
    align-items: start;
    width: min(170px, 60vw);
    padding: 14px 28px 14px 14px;
    border: 1px solid color-mix(in srgb, var(--bark-900) 12%, transparent);
    border-radius: 16px 16px 4px 16px;
    background: color-mix(in srgb, var(--tl-paper, #fffaf2) 96%, #fff);
    box-shadow: 0 10px 30px color-mix(in srgb, var(--bark-900) 14%, transparent);
    font-size: 12.5px;
    line-height: 1.45;
  }

  .invite p {
    margin: 0;
  }

  .invite b {
    font-weight: 500;
  }

  .invite a {
    justify-self: start;
    color: var(--bark-900);
    font: 300 12px 'Playpen Sans', 'Quicksand', sans-serif;
    text-decoration: underline;
    text-decoration-color: color-mix(in srgb, var(--bark-900) 40%, transparent);
    text-underline-offset: 3px;
  }

  .invite-x {
    position: absolute;
    top: 6px;
    right: 8px;
    padding: 0 4px;
    border: 0;
    background: none;
    color: var(--bark-600, #7a6550);
    font-size: 16px;
    cursor: pointer;
  }

  .quarter {
    opacity: 0.1;
    mix-blend-mode: multiply;
  }

  .axis {
    stroke: #3f4a7a;
    stroke-opacity: 0.55;
    stroke-width: calc(1.6px * var(--inv, 1));
    stroke-dasharray: calc(6px * var(--inv, 1)) calc(5px * var(--inv, 1));
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

  /* a soft patch of paper behind each turning's words, so a painting never
     runs through them */
  .cmp > div {
    padding: calc(4px * var(--inv, 1)) calc(10px * var(--inv, 1));
    border-radius: 50%;
    background: radial-gradient(closest-side, color-mix(in srgb, var(--tl-paper, #fffaf2) 92%, transparent) 55%, transparent 100%);
  }

  .cmp b,
  .cmp span,
  .quarter-name > div {
    text-shadow: 0 0 calc(6px * var(--inv, 1)) var(--tl-paper, #fffaf2), 0 0 calc(3px * var(--inv, 1)) var(--tl-paper, #fffaf2);
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
    border-bottom: calc(2px * var(--inv, 1)) solid color-mix(in srgb, var(--cs) 70%, transparent);
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
    background: #e9b448;
    box-shadow: inset 0 0 0 1px var(--bark-900);
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

  .span {
    stroke-width: 46;
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
    background: radial-gradient(circle closest-side, #fffdf8 0%, #fffdf8 72%, color-mix(in srgb, #fffdf8 70%, var(--glow)) 100%);
    color: inherit;
    cursor: pointer;
    transition: box-shadow 0.3s ease;
  }

  /* a moon in the diagrams' hand: a wash laid a little off, its ink ring,
     a fainter ring within, and a crescent of stipple */
  .wash-blob {
    position: absolute;
    inset: -7%;
    z-index: -1;
    border-radius: 50%;
    background: radial-gradient(circle closest-side, var(--glow2) 0%, color-mix(in srgb, var(--glow2) 60%, transparent) 70%, transparent 100%);
    mix-blend-mode: multiply;
    transform: translate(var(--dx), var(--dy));
    transition: opacity 0.4s ease;
  }

  .inner {
    position: absolute;
    inset: 11%;
    opacity: 0.45;
  }

  .inner,
  /* close up, the moon is the page's paper: its drawing steps aside */
  .close .moon .inner,
  .close .moon .wash-blob {
    opacity: 0;
  }

  .moon:hover .wash-blob {
    opacity: 1.6;
    filter: saturate(1.3);
  }

  /* the number and day grow to stay readable when the spiral is small on
     screen, but never past what fits inside the moon */
  .num {
    font: 300 clamp(70px, calc(18px * var(--inv, 1)), 100px) / 1 'Outfit', system-ui, sans-serif;
  }

  .when {
    font-size: clamp(30px, calc(10px * var(--inv, 1)), 40px);
    color: var(--bark-700, #5a4632);
    white-space: nowrap;
  }

  /* drawn just inside the moon's own edge, so the line never crosses it */
  .moon.now::after {
    content: '';
    position: absolute;
    inset: 3%;
    border: calc(1.6px * var(--inv, 1)) solid var(--rust, #c4463c);
    border-radius: 50%;
    pointer-events: none;
  }

  .now .when {
    font: 300 clamp(29.5px, calc(10.5px * var(--inv, 1)), 40px) 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--rust, #c4463c);
  }

  .moon.dim {
    opacity: 0.22;
    filter: grayscale(0.6);
  }

  .moon {
    transition: box-shadow 0.3s ease, opacity 0.5s ease, filter 0.5s ease;
  }

  .moon.hundred::after {
    content: '';
    position: absolute;
    inset: 4%;
    border: calc(0.8px * var(--inv, 1)) solid color-mix(in srgb, var(--bark-900) 55%, transparent);
    border-radius: 50%;
    pointer-events: none;
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
    padding-right: 24px;
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

  /* each label above its content, so the content starts at the margin and
     has the whole width */
  .facts {
    display: grid;
    gap: 12px;
    margin: 0;
  }

  .facts > div {
    display: grid;
    gap: 3px;
  }

  .facts dt {
    font-size: 11.5px;
    color: var(--bark-600, #7a6550);
  }

  .facts dd {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px 8px;
    margin: 0;
    font-size: 14px;
  }

  .facts dd button {
    text-align: left;
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

  /* a goal to a line, so a long one never starts its second line indented */
  .goal {
    display: block;
    font-size: 13px;
  }

  .goal + .goal {
    margin-top: 3px;
  }

  .goal b {
    font-weight: 600;
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
    fill: color-mix(in srgb, var(--pigs) 62%, transparent);
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
    display: block;
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
    fill: color-mix(in srgb, var(--pigs) 10%, transparent);
    stroke-dasharray: 1.6 1.4;
  }

  .pin.imagined .twig {
    stroke-dasharray: 3 3;
  }

  .seg.here .pin.imagined .twig {
    animation: none;
  }

  .pin.remembered .blade {
    fill: color-mix(in srgb, var(--pigs) 30%, #e8e0d2);
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
    background: color-mix(in srgb, var(--cs) 55%, transparent);
  }

  .stretch.land i {
    background: color-mix(in srgb, var(--cs) 32%, transparent);
  }

  .stretch.imagined i {
    background: none;
    border: 1px dashed color-mix(in srgb, var(--cs) 90%, transparent);
  }

  .stretch.remembered i {
    background: color-mix(in srgb, var(--cs) 22%, #ddd4c4);
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
    background: var(--cs);
  }

  .stay.keeping i {
    background: none;
    border-top: 2px dotted var(--cs);
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

  /* zoomed out: the quarter moons, leaves and long labels step aside; each
     lunation keeps its number and name, the months show, and what is noted
     shows as dots */
  .wide .pin,
  .wide .phase-mark,
  .wide .end span,
  .wide .stretch span.cont {
    opacity: 0;
    pointer-events: none;
  }

  .end .short {
    display: none;
  }

  .wide .end .short {
    position: absolute;
    top: 26px;
    left: 50%;
    display: block;
    max-width: 150px;
    overflow: hidden;
    font-style: normal;
    font-size: 11px;
    white-space: nowrap;
    text-overflow: ellipsis;
    transform: translateX(-12px);
    text-align: left;
  }

  .wide .end .short b {
    font: 500 12px 'Outfit', system-ui, sans-serif;
  }

  .wide .end i {
    width: 12px;
    height: 12px;
  }

  .wide .stretch span {
    max-width: calc(100% - 4px);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .month {
    position: absolute;
    top: calc(70% - 30px);
    font: 300 11px 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--bark-600, #7a6550);
    transform: translateX(-50%);
  }

  .month::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 17px;
    height: 8px;
    border-left: 1px solid color-mix(in srgb, var(--bark-900) 30%, transparent);
  }

  .dot {
    position: absolute;
    padding: 0;
    border: 0;
    cursor: pointer;
    top: calc(70% - 46px - var(--row) * 11px);
    width: 9px;
    height: 9px;
    margin-left: -4.5px;
    border-radius: 50%;
    background: var(--pigs);
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--bark-900) 25%, transparent);
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
    padding: 6px 24px 0 0;
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
    border: 1px solid color-mix(in srgb, var(--cs) 45%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--cs) 12%, transparent);
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
    background: var(--cs);
  }

  .kind-chip small {
    font-size: 11px;
    color: var(--bark-600, #7a6550);
  }

  .kind-chip.none {
    opacity: 0.5;
  }

  .kind-icon {
    width: 14px;
    height: 14px;
    overflow: visible;
  }

  .kind-icon path {
    fill: none;
    stroke: var(--cs);
    stroke-width: 1.1;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .kind-chip.off {
    border-style: dashed;
    background: none;
    opacity: 0.55;
  }

  .kind-chip.off i {
    background: none;
    box-shadow: inset 0 0 0 1.5px var(--cs);
  }

  .kind-chip.lens {
    margin-left: 6px;
  }

  .kind-chip.on {
    background: color-mix(in srgb, var(--cs) 40%, transparent);
    border-color: var(--cs);
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
    color: color-mix(in srgb, var(--cs) 80%, var(--bark-900));
  }

  .stratum-name::after {
    content: '';
    display: inline-block;
    width: 60px;
    margin-left: 8px;
    vertical-align: middle;
    border-top: 1px solid color-mix(in srgb, var(--cs) 35%, transparent);
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
    border-top: 1px dotted color-mix(in srgb, var(--cs) 60%, transparent);
  }

  .rhythm i {
    position: absolute;
    bottom: 2px;
    width: 7px;
    height: 7px;
    margin-left: -3.5px;
    border-radius: 50%;
    background: var(--cs);
  }

  .rhythm i.done {
    background: none;
    box-shadow: inset 0 0 0 1.5px var(--cs);
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

  /* the marks, after the Miro legend */
  .lg.mk path {
    fill: color-mix(in srgb, var(--p) 62%, transparent);
  }

  .lg-arc {
    width: 26px;
    height: 11px;
  }

  .lg-arc path,
  .stay.arc path {
    fill: none;
    stroke: var(--c, #9b8ad0);
    stroke-width: 1.6;
    vector-effect: non-scaling-stroke;
  }

  .lg-kids {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #5f9fd6;
  }

  .stay.arc svg {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 2px;
    width: 100%;
    height: 10px;
    overflow: visible;
  }

  .mark-dot {
    fill: var(--pigs);
    stroke: color-mix(in srgb, var(--bark-900) 50%, transparent);
    stroke-width: 0.8;
    pointer-events: auto;
  }

  .marks-switch {
    gap: 2px !important;
    margin-left: 8px;
    padding: 2px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--bark-900) 6%, transparent);
  }

  .marks-switch button {
    padding: 1px 9px;
    border: 0;
    border-radius: 999px;
    background: none;
    color: var(--bark-700, #5a4632);
    font: 300 11px 'Playpen Sans', 'Quicksand', sans-serif;
    cursor: pointer;
  }

  .marks-switch button.on {
    background: var(--tl-paper, #fffaf2);
    color: var(--bark-900);
  }

  /* how to read the line */
  .key-toggle {
    justify-self: center;
    padding: 0;
    border: 0;
    border-bottom: 1px dashed color-mix(in srgb, var(--bark-900) 40%, transparent);
    background: none;
    color: var(--bark-700, #5a4632);
    font: 300 12px 'Playpen Sans', 'Quicksand', sans-serif;
    cursor: pointer;
  }

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

  /* where the moon leans: a soft wash of warm light behind it, like a
     highlighter's stroke, and a small note beside the name */
  .realm.lean h3 {
    border-bottom-color: color-mix(in srgb, #e8b94a 70%, transparent);
    border-bottom-width: 2px;
    background: linear-gradient(transparent 45%, color-mix(in srgb, #ffd98a 45%, transparent) 45%, color-mix(in srgb, #ffd98a 45%, transparent) 92%, transparent 92%) no-repeat 0 0 / 100% 100%;
  }

  .leans {
    padding: 0 8px;
    border-radius: 999px;
    background: color-mix(in srgb, #ffd98a 55%, var(--tl-paper, #fffaf2));
    font: 300 11.5px 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--bark-800, #4a3828);
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
  /* the small map and the timeline toggle live in the header's top right */
  .map {
    position: fixed;
    top: 10px;
    right: 22px;
    z-index: 1100;
    width: 76px;
    text-align: center;
  }

  .map svg {
    display: block;
    width: 76px;
    height: 76px;
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

  .map-centre.hovered circle {
    fill: var(--tl-paper, #fffaf2);
    stroke: color-mix(in srgb, var(--bark-900) 55%, transparent);
  }

  .map-spiral {
    fill: none;
    stroke: var(--bark-900);
    stroke-width: 0.9;
    stroke-linecap: round;
  }

  .views {
    position: fixed;
    top: 16px;
    right: 112px;
    z-index: 1200;
    display: flex;
    gap: 10px;
  }

  .views.alone {
    right: 24px;
  }

  .views button {
    display: grid;
    justify-items: center;
    gap: 3px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--bark-800, #4a3828);
    cursor: pointer;
  }

  .views svg {
    width: 40px;
    height: 40px;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid color-mix(in srgb, var(--bark-900) 22%, transparent);
    border-radius: 50%;
    background: color-mix(in srgb, #fffdf8 75%, transparent);
    overflow: visible;
    transition: background 0.3s ease, border-color 0.3s ease;
  }

  .views path,
  .views circle,
  .views ellipse {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.3;
    stroke-linecap: round;
  }

  .views .fill {
    fill: currentColor;
    stroke: none;
  }

  .views span {
    font: 300 11px 'Playpen Sans', 'Quicksand', sans-serif;
  }

  .views button:hover svg {
    border-color: color-mix(in srgb, var(--bark-900) 50%, transparent);
  }

  .views button.on svg {
    background: var(--bark-900);
    border-color: var(--bark-900);
    color: #fffaf2;
  }

  /* lunar: the details on the left, the whole moon beside them on the right,
     sized to the window; personal, local and global below */
  .closeup:not(.linear) {
    grid-template-columns: minmax(260px, 1fr) auto minmax(0, 1fr);
    grid-template-rows: auto;
    grid-auto-rows: auto;
    align-items: start;
    column-gap: 24px;
  }

  /* lunar: the kinds of time to the side, top right under the views,
     aligned to the right */
  .closeup:not(.linear) .line-head {
    position: fixed;
    top: 104px;
    right: 16px;
    z-index: 5;
    justify-content: flex-end;
    max-width: 300px;
    padding: 0;
  }

  .line-head .br {
    display: none;
  }

  /* while the years are out, the kinds of time step aside for them */
  .line-head {
    transition: opacity 0.3s ease;
  }

  .line-head.resting {
    opacity: 0;
    pointer-events: none;
  }

  .closeup:not(.linear) .line-head .br {
    display: block;
    flex-basis: 100%;
    height: 0;
  }

  /* narrow, close to the edge: a tag or two to a row, the label on its own */
  .closeup:not(.linear) .line-head > span {
    flex-basis: 100%;
    margin: 0 0 2px;
    text-align: right;
  }

  .closeup:not(.linear) .title {
    grid-column: 1;
    grid-row: 1;
  }

  /* the moon in the centre, the details beside it on the left */
  .closeup:not(.linear) .moon-view {
    grid-column: 2;
    grid-row: 1 / span 2;
  }

  .closeup:not(.linear) .moon-view :global(.moon-cycle) {
    width: auto;
    height: calc(100vh - 190px);
    max-width: 52vw;
  }

  /* while the note is open in the corner, the moon steps up out of its way */
  .closeup.has-invite .moon-view :global(.moon-cycle) {
    height: calc(100vh - 300px);
  }

  /* and the legend keeps clear of the corner it sits in */
  .closeup.has-invite .legend {
    padding-right: 190px;
  }

  .closeup:not(.linear) > :global(:not(.title):not(.moon-view):not(.invite)) {
    grid-column: 1 / -1;
  }

  @media (max-width: 900px) {
    .closeup:not(.linear) {
      grid-template-columns: 1fr;
    }

    /* one column: the moon comes straight after the title, before the details */
    .closeup:not(.linear) .moon-view {
      grid-column: 1;
      grid-row: 3;
    }

    /* one column: the kinds of time back in the flow, at the top */
    .closeup:not(.linear) .line-head {
      position: static;
      max-width: none;
      justify-content: flex-start;
      grid-column: 1;
      grid-row: 1;
    }

    .closeup:not(.linear) .moon-view :global(.moon-cycle) {
      width: 100%;
      height: auto;
      max-width: none;
    }

    .closeup:not(.linear) .title {
      grid-row: 2;
    }

    .closeup:not(.linear) .invite {
      grid-row: 4;
    }
  }

  /* on a phone: small view buttons in the corner, no labels, no small map */
  @media (max-width: 640px) {
    .views {
      top: 14px;
      right: 12px;
      gap: 6px;
    }

    .views svg {
      width: 34px;
      height: 34px;
      padding: 7px;
    }

    .views span {
      display: none;
    }

    .map {
      display: none;
    }
  }

  /* the lunation's circle shows once the spiral's moon has landed on it;
     then the spiral's moon steps away beneath it */
  .moon-view {
    position: relative;
    opacity: 0;
    transition: opacity 0.6s ease;
    padding: 8px 0 4px;
    display: grid;
    place-items: center;
    transform-origin: 50% 50%;
    cursor: grab;
  }

  .moon-view > :global(.moon-cycle) {
    grid-area: 1 / 1;
    transition: transform 0.7s cubic-bezier(0.3, 0.7, 0.2, 1);
  }

  /* across years: stepping to another year, its moon fades in */
  .moon-view.across > :global(.moon-cycle) {
    animation: year-fade 0.6s ease;
  }

  @keyframes year-fade {
    from {
      opacity: 0;
    }
  }

  /* the year line: flat, beside the stack, a dot and a year at the height
     of each ring, joined by a thread */
  .year-line {
    position: absolute;
    left: 100%;
    margin-left: 8px;
    top: 50%;
    margin: 0;
    padding: 0;
    list-style: none;
    z-index: 3;
  }

  .year-line::before {
    content: '';
    position: absolute;
    left: 4px;
    top: -220px;
    height: 440px;
    border-left: 1px dashed color-mix(in srgb, var(--bark-900) 30%, transparent);
  }

  .year-line li {
    position: absolute;
    left: 0;
    top: calc(var(--k) * 110px);
    transform: translateY(-50%);
  }

  .year-line button {
    display: grid;
    grid-template-columns: 10px auto;
    column-gap: 10px;
    align-items: baseline;
    padding: 0;
    border: 0;
    background: none;
    color: #2f3760;
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
  }

  .year-line button:disabled {
    cursor: default;
  }

  .year-line i {
    grid-row: span 2;
    align-self: center;
    width: 9px;
    height: 9px;
    border: 1px solid color-mix(in srgb, var(--bark-900) 55%, transparent);
    border-radius: 50%;
    background: var(--tl-paper, #fffaf2);
  }

  .year-line .here i {
    background: #2f3760;
    border-color: #2f3760;
    box-shadow: 0 0 0 4px color-mix(in srgb, #2f3760 15%, transparent);
  }

  .year-line b {
    font: 400 15px 'Outfit', system-ui, sans-serif;
  }

  .year-line .here b {
    font-weight: 500;
  }

  .year-line span {
    font: 300 11px 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--bark-700, #5a4632);
  }

  .year-line .ghost {
    opacity: 0.5;
  }

  .year-line button:not(:disabled):hover b {
    text-decoration: underline;
    text-underline-offset: 3px;
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

  /* in the header row, beside the logo */
  .filters {
    position: fixed;
    top: 30px;
    left: 230px;
    z-index: 1200;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 12px;
    max-width: calc(100vw - 460px);
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

  .filters.hidden-close {
    display: none;
  }

  @media (max-width: 900px) {
    .filters {
      top: 64px;
      left: 16px;
      max-width: calc(100vw - 32px);
    }
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

  .hint.hidden3d {
    display: none;
  }

  .close .hint {
    display: none;
  }

  .hint span {
    font: 400 11px 'Quicksand', system-ui, sans-serif;
  }

  @media (max-width: 860px) {
    .title {
      padding-right: 100px;
    }

      .realms {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .map,
    .map svg {
      width: 64px;
    }

    .map svg {
      height: 64px;
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
      padding-right: 96px;
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

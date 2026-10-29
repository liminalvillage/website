<script>
  // The lunation's eight phases as one shape that changes with the page.
  // In the hero they ring today's moon as a closed circle (the cycle loops).
  // Scrolling down unrolls the circle into an arc, the moon's path across the
  // sky, with new moon at both ends and full moon at the top, docked under
  // the header. Further down the arc fades out where it doesn't fit the
  // content and back in, in the same place, where it does.
  import { onMount } from 'svelte';
  import { phase } from 'lune';
  import { lunationAt } from '../calendar/lunation.js';

  const PHASES = ['New moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'];
  const DAY_MS = 86_400_000;

  // Sections where the arc belongs; elsewhere it rests out of sight
  const SHOW_IN = ['#about', '#lunations', '#network'];
  const ALL = ['#about', '#about .lead', '#thevillage', '#surroundings', '#lunations', '#network', '#contact'];

  const now = Date.now();
  const cycle = lunationAt(now);
  const moon = phase(new Date(now));
  const k = Math.floor(((moon.phase + 1 / 16) % 1) * 8);
  const length = cycle.to + 1 - cycle.from;
  const progress = Math.min(1, Math.max(0, (now - cycle.from) / length));
  const day = Math.floor((now - cycle.from) / DAY_MS) + 1;
  const days = Math.round(length / DAY_MS);

  // The lit part of a moon of radius r at (cx, cy), phase 0–1
  function litPath(p, cx, cy, r) {
    const top = `${cx.toFixed(1)} ${(cy - r).toFixed(1)}`;
    const bottom = `${cx.toFixed(1)} ${(cy + r).toFixed(1)}`;
    if (p < 0.02 || p > 0.98) return '';
    if (Math.abs(p - 0.5) < 0.02) return `M${top}A${r} ${r} 0 1 1 ${bottom}A${r} ${r} 0 1 1 ${top}Z`;
    const rx = (Math.abs(Math.cos(2 * Math.PI * p)) * r).toFixed(2);
    if (p < 0.5) return `M${top}A${r} ${r} 0 0 1 ${bottom}A${rx} ${r} 0 0 ${p < 0.25 ? 0 : 1} ${top}Z`;
    return `M${top}A${r} ${r} 0 0 0 ${bottom}A${rx} ${r} 0 0 ${p < 0.75 ? 0 : 1} ${top}Z`;
  }

  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const mix = (a, b, t) => a + (b - a) * t;

  let vw = 1280;
  let vh = 800;
  let m = 0; // 0 circle → 1 arc
  let visible = true;
  let ready = false;
  let circle = { cx: 640, cy: 400, r: 128, s: 1 };
  // 0–1: after the opening drawing, the phase moons grow out of today's
  // moon to their ring instead of simply appearing there
  let bloom = 1;

  // Where the hero draws today's moon: the circle wraps around it
  function readCircle() {
    const art = document.querySelector('.lt .art');
    if (!art) return;
    const r = art.getBoundingClientRect();
    const s = r.width / 320;
    circle = { cx: r.left + 160 * s, cy: r.top + 160 * s, r: 128 * s, s };
  }

  // The docked arc: full moon at the apex, new moon at both ends
  $: arcW = Math.min(560, vw * 0.62);
  // In the header row on wide screens (the live header has only the logo at
  // the left); just below the logo on phones, where the header is narrow
  $: arcTop = vw < 700 ? 74 : 22;
  $: arcR = arcW * 0.95;
  $: theta = Math.asin(Math.min(1, arcW / 2 / arcR));

  function place(t) {
    const a = t * Math.PI * 2;
    const rC = circle.r * ease(bloom);
    const cxC = circle.cx + rC * Math.sin(a);
    const cyC = circle.cy - rC * Math.cos(a);
    const phi = -theta + 2 * theta * t;
    const cxA = vw / 2 + arcR * Math.sin(phi);
    const cyA = arcTop + arcR - arcR * Math.cos(phi);
    const e = ease(m);
    return [mix(cxC, cxA, e), mix(cyC, cyA, e)];
  }

  function line(from, to) {
    let d = '';
    const n = 96;
    for (let i = 0; i <= n; i++) {
      const [x, y] = place(from + ((to - from) * i) / n);
      d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
  }

  $: orbit = (m, circle, vw, bloom, line(0, 1));
  $: trail = (m, circle, vw, bloom, line(0, Math.max(0.002, progress)));
  $: moonR = mix(9 * circle.s, 7, ease(m));
  $: moons = (m, circle, vw, bloom, Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    const [x, y] = place(t);
    return { i, x, y, d: litPath(t % 1, x, y, moonR), now: i % 8 === k };
  }));
  $: today = (m, circle, vw, bloom, place(progress));
  // While the phase moons grow out of today's moon they stay invisible over
  // it, and fade in only as they clear its edge (the hub moon's radius is 60
  // of its 320-unit artwork, plus a little of its halo)
  $: clear = Math.min(1, Math.max(0, (circle.r * ease(bloom) - 66 * circle.s - moonR) / (24 * circle.s)));
  // The line: the circle around the moons at the hub, and the docked arc,
  // but never while it unrolls across the moon in between
  $: lineOpacity = m === 0 ? clear : m >= 1 ? 1 : 0;

  // On the journey home page there is no page scroll: the camera's stops
  // drive the shape instead. At the hub it's the circle; leaving the hub
  // unrolls it into the arc, which rests where it doesn't fit.
  let journey = false;
  let targetM = 0;
  let raf = 0;
  const HIDE_ON = ['#thevillage', '#contact'];

  function onJourney(e) {
    journey = true;
    targetM = e.detail.index > 0 ? 1 : 0;
    visible = !HIDE_ON.includes(e.detail.href);
    settle = 0;
    if (!raf) raf = requestAnimationFrame(follow);
  }

  // Follows the camera while the shape moves, then rests until the next stop
  // (the circle still tracks the hub moon through the camera's flight)
  let settle = 0;
  function follow() {
    vw = innerWidth;
    vh = innerHeight;
    readCircle();
    const d = targetM - m;
    m = Math.abs(d) < 0.002 ? targetM : m + d * 0.07;
    settle = m === targetM ? settle + 1 : 0;
    raf = settle > 150 ? 0 : requestAnimationFrame(follow);
  }

  function update() {
    if (journey) return;
    vw = innerWidth;
    vh = innerHeight;
    readCircle();
    m = Math.min(1, Math.max(0, scrollY / (innerHeight * 0.6)));
    if (m < 1) {
      visible = true;
      return;
    }
    // Docked: show the arc only over the sections where it belongs
    const mid = innerHeight * 0.45;
    let here = null;
    for (const sel of ALL) {
      const el = document.querySelector(sel);
      if (el && el.getBoundingClientRect().top <= mid) here = sel;
    }
    visible = SHOW_IN.includes(here);
  }

  function grow() {
    bloom = 0;
    const t0 = performance.now() + 900;
    const step = (now) => {
      readCircle();
      bloom = Math.min(1, Math.max(0, (now - t0) / 1500));
      if (bloom < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  onMount(() => {
    if (document.documentElement.classList.contains('intro')) bloom = 0;
    addEventListener('intro-landed', grow);
    addEventListener('journey-stop', onJourney);
    update();
    requestAnimationFrame(() => (ready = true));
    return () => {
      removeEventListener('journey-stop', onJourney);
      removeEventListener('intro-landed', grow);
      cancelAnimationFrame(raf);
    };
  });
</script>

<svelte:window on:scroll={update} on:resize={update} />

<div class="moon-path" class:ready class:hidden={!visible} class:docked={m >= 1} aria-hidden="true">
  <svg viewBox="0 0 {vw} {vh}" width={vw} height={vh}>
    <!-- As fine and quiet as the journey's circles, a little brighter where
         the month has already gone -->
    <g class="line" style="opacity: {lineOpacity}">
      <path d={orbit} class="orbit" />
      <path d={trail} class="trail" />
      <circle cx={today[0]} cy={today[1]} r="3.5" class="today" />
    </g>
    <g style="opacity: {clear}">
    {#each moons as p (p.i)}
      <g class="pm" class:now={p.now} class:echo={p.i === 8} style="--i: {p.i}">
        <circle cx={p.x} cy={p.y} r={moonR} class="dark" />
        {#if p.d}<path d={p.d} class="lit" />{/if}
        {#if p.now}<circle cx={p.x} cy={p.y} r={moonR + 4} class="ring" />{/if}
      </g>
    {/each}
    </g>
  </svg>
  <p class="label" style="top: {arcTop + 30}px">Lunation {cycle.index} · {PHASES[k]} · day {day} of {days}</p>
</div>

<style>
  /* Above the header, whose blur would otherwise veil the docked arc */
  .moon-path {
    position: fixed;
    inset: 0;
    z-index: 1050;
    pointer-events: none;
    transition: opacity 0.8s ease;
  }

  .moon-path.hidden {
    opacity: 0;
  }

  svg {
    position: absolute;
    inset: 0;
    overflow: visible;
  }

  .line {
    transition: opacity 0.3s ease;
  }

  .orbit {
    fill: none;
    stroke: rgba(255, 255, 255, 0.32);
    stroke-width: 0.8;
  }

  .ring {
    fill: none;
    stroke: rgba(255, 255, 255, 0.5);
    stroke-width: 0.6;
  }

  .trail {
    fill: none;
    stroke: rgba(255, 250, 240, 0.7);
    stroke-width: 1;
    stroke-linecap: round;
  }

  /* The moons arrive one by one on load */
  .pm {
    opacity: 0;
    transition: opacity 0.7s ease calc(0.6s + var(--i) * 0.09s);
  }

  .ready .pm {
    opacity: 0.9;
  }

  /* In the closed circle the ninth moon sits on the first; it appears as
     the circle opens into the arc */
  .ready .pm.echo {
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .ready.docked .pm.echo {
    opacity: 0.9;
  }

  .dark {
    fill: rgba(255, 255, 255, 0.08);
    stroke: rgba(255, 255, 255, 0.5);
    stroke-width: 0.6;
  }

  .lit {
    fill: #fbf6e8;
    filter: drop-shadow(0 0 4px rgba(255, 245, 225, 0.7));
  }

  .today {
    fill: #fff;
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.9));
  }

  .label {
    position: absolute;
    left: 0;
    right: 0;
    margin: 0;
    text-align: center;
    font: 400 11px/1.4 var(--font-body);
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(251, 246, 238, 0.8);
    text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);
    opacity: 0;
    transform: translateY(-6px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .docked .label {
    opacity: 1;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .moon-path,
    .pm,
    .label {
      transition: none;
    }
  }
</style>

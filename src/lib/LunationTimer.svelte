<script>
  // Which lunation we are in and where in it — a live card, centred on the hero, that
  // links to the year in moons (/lunations). Cycle numbers follow
  // @holons/core's `lunationAt`, the bot's /newmoon count.
  import { onMount } from 'svelte';
  import { phase, phase_hunt } from 'lune';
  import { lunationAt } from '../calendar/lunation.js';

  const PHASES = [
    'New moon',
    'Waxing crescent',
    'First quarter',
    'Waxing gibbous',
    'Full moon',
    'Waning gibbous',
    'Last quarter',
    'Waning crescent',
  ];
  const DAY_MS = 86_400_000;

  let now = $state(Date.now());

  const cycle = $derived(lunationAt(now));
  const moon = $derived(phase(new Date(now)));
  // Centred bands, as the kiosk names them: 0 ± 1/16 is "new moon".
  const k = $derived(Math.floor(((moon.phase + 1 / 16) % 1) * 8));
  const fullAt = $derived(phase_hunt(new Date(cycle.from + DAY_MS)).full_date.getTime());
  const length = $derived(cycle.to + 1 - cycle.from);
  const progress = $derived((now - cycle.from) / length);
  const fullMark = $derived((fullAt - cycle.from) / length);
  const day = $derived(Math.floor((now - cycle.from) / DAY_MS) + 1);
  const days = $derived(Math.round(length / DAY_MS));
  const next = $derived(now < fullAt ? { name: 'Full moon', at: fullAt } : { name: 'New moon', at: cycle.to + 1 });

  function countdown(ms) {
    const mins = Math.max(0, Math.round(ms / 60_000));
    const d = Math.floor(mins / 1440);
    const h = Math.floor((mins % 1440) / 60);
    const m = mins % 60;
    return d ? `${d}d ${h}h` : h ? `${h}h ${m}m` : `${m}m`;
  }
  // The lit part of the moon for a phase from 0 (new) through 0.5 (full) to 1,
  // drawn on a disc of radius 30 centred in a 64×64 box
  function litPath(p) {
    const r = 30;
    const top = '32 2';
    const bottom = '32 62';
    if (p < 0.01 || p > 0.99) return '';
    if (Math.abs(p - 0.5) < 0.01) return `M${top}A${r} ${r} 0 1 1 ${bottom}A${r} ${r} 0 1 1 ${top}Z`;
    const rx = (Math.abs(Math.cos(2 * Math.PI * p)) * r).toFixed(2);
    if (p < 0.5) return `M${top}A${r} ${r} 0 0 1 ${bottom}A${rx} ${r} 0 0 ${p < 0.25 ? 0 : 1} ${top}Z`;
    return `M${top}A${r} ${r} 0 0 0 ${bottom}A${rx} ${r} 0 0 ${p < 0.75 ? 0 : 1} ${top}Z`;
  }
  const lit = $derived(litPath(moon.phase));

  const when = (ms) => new Date(ms).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  onMount(() => {
    const tick = setInterval(() => (now = Date.now()), 30_000);
    return () => clearInterval(tick);
  });
</script>

<a class="lt" href="/lunations" aria-label="Lunation {cycle.index}, {PHASES[k]}. See the year in moons.">
  <svg class="moon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="lt-surface" cx="0.38" cy="0.35" r="0.75">
        <stop offset="0" stop-color="#fffdf6" />
        <stop offset="1" stop-color="#e9e4d6" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="30" class="dark" />
    {#if lit}<path d={lit} fill="url(#lt-surface)" />{/if}
  </svg>

  <p class="eyebrow">Lunation {cycle.index}</p>
  <p class="phase">{PHASES[k]}</p>
  <p class="meta">{Math.round(moon.illuminated * 100)}% lit · day {day} of {days}</p>

  <div class="bar" aria-hidden="true">
    <span class="fill" style="width: {progress * 100}%"></span>
    <span class="mark full" style="left: {fullMark * 100}%" title="Full moon"></span>
    <span class="now" style="left: {progress * 100}%"></span>
  </div>
  <div class="ends" aria-hidden="true">
    <span>● {when(cycle.from)}</span>
    <span>○ {when(fullAt)}</span>
    <span>● {when(cycle.to + 1)}</span>
  </div>

  <p class="next"><strong>{next.name}</strong> in {countdown(next.at - now)}</p>
  <span class="cta">The year in moons →</span>
</a>

<style>
  /* A translucent disc on the video, with a faint dotted orbit turning around it */
  .lt {
    position: relative;
    width: 320px;
    height: 320px;
    margin-top: 36px;
    padding: 0 52px;
    border-radius: 50%;
    display: grid;
    align-content: center;
    justify-items: center;
    text-align: center;
    background: rgba(20, 18, 15, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.22);
    transition: background 0.5s ease, border-color 0.5s ease;
    color: #f7f4ec;
    text-decoration: none;
    text-shadow: 0 1px 12px rgba(0, 0, 0, 0.35);
    animation: rise 1.6s ease both 0.3s;
  }
  .lt::before {
    content: '';
    position: absolute;
    inset: -14px;
    border-radius: 50%;
    border: 1px dotted rgba(255, 255, 255, 0.3);
    animation: orbit 90s linear infinite;
    pointer-events: none;
  }
  .lt:hover { background: rgba(20, 18, 15, 0.4); border-color: rgba(255, 255, 255, 0.4); }
  .lt:focus-visible { outline: 1px solid currentColor; outline-offset: 20px; }
  @keyframes orbit { to { transform: rotate(360deg); } }
  @keyframes rise { from { opacity: 0; transform: translateY(14px); } }

  .moon {
    width: 48px;
    height: 48px;
    margin-bottom: 10px;
    overflow: visible;
    filter: drop-shadow(0 0 18px rgba(255, 250, 235, 0.35));
    animation: glow 7s ease-in-out infinite;
  }
  .dark { fill: rgba(255, 255, 255, 0.07); stroke: rgba(255, 255, 255, 0.18); stroke-width: 0.6; }
  @keyframes glow { 50% { filter: drop-shadow(0 0 28px rgba(255, 250, 235, 0.55)); } }
  .lt:hover .moon { animation-duration: 3s; }

  .eyebrow { margin: 0; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; opacity: 0.7; line-height: 1.4; }
  .phase { margin: 2px 0 0; font-family: var(--font-heading); font-size: 24px; font-weight: 200; letter-spacing: 0.5px; line-height: 1.1; }
  .meta { margin: 4px 0 0; font-size: 12px; letter-spacing: 0.5px; line-height: 1.4; opacity: 0.7; }

  .bar { position: relative; width: 100%; height: 1px; margin-top: 14px; background: rgba(255, 255, 255, 0.28); }
  .fill { position: absolute; inset: 0 auto 0 0; background: rgba(255, 255, 255, 0.85); }
  .mark.full { position: absolute; top: 50%; width: 7px; height: 7px; margin: -3.5px 0 0 -3.5px; border-radius: 50%; background: transparent; border: 1px solid rgba(255, 255, 255, 0.85); }
  .now { position: absolute; top: 50%; width: 5px; height: 5px; margin: -2.5px 0 0 -2.5px; border-radius: 50%; background: #fff; box-shadow: 0 0 10px rgba(255, 255, 255, 0.9); }
  .ends { display: flex; justify-content: space-between; width: 100%; margin-top: 8px; font-size: 10px; letter-spacing: 0.3px; opacity: 0.6; }

  .next { margin: 12px 0 0; font-size: 13px; letter-spacing: 0.5px; line-height: 1.4; opacity: 0.85; }
  .next strong { color: inherit; font-weight: 600; }
  .cta { margin-top: 8px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; padding-bottom: 2px; border-bottom: 1px solid rgba(255, 255, 255, 0.35); transition: border-color 0.4s ease; }
  .lt:hover .cta { border-color: rgba(255, 255, 255, 0.9); }

  @media (max-width: 768px) {
    .lt { width: 284px; height: 284px; margin-top: 28px; padding: 0 42px; }
    .moon { width: 40px; height: 40px; }
    .phase { font-size: 21px; }
    .ends { font-size: 9px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .lt, .lt::before, .moon { animation: none; }
  }
</style>

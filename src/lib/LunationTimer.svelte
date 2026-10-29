<script>
  // Which lunation we are in and where in it — a moon artwork centred on the
  // hero, with the details fading in beneath; it links to the year in moons
  // (/lunations). Cycle numbers follow
  // @holons/core's `lunationAt`, the bot's /newmoon count.
  import { onMount } from 'svelte';
  import { phase, phase_hunt } from 'lune';
  import { lunationAt } from '../calendar/lunation.js';
  import { litPath } from './moonShape.js';

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

  // The artwork: today's moon in the middle. The eight phases around it are
  // drawn by MoonPath, which unrolls them into an arc as the page scrolls.
  const C = 160;
  const MOON_R = 60;
  const lit = $derived(litPath(moon.phase, C, C, MOON_R));

  // Draw in once, on arrival
  let ready = $state(false);

  const when = (ms) => new Date(ms).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  onMount(() => {
    requestAnimationFrame(() => (ready = true));
    const tick = setInterval(() => (now = Date.now()), 30_000);
    return () => clearInterval(tick);
  });
</script>

<a class="lt" class:ready href="/lunations" aria-label="Lunation {cycle.index}, {PHASES[k]}. See the year in moons.">
  <svg class="art" viewBox="0 0 320 320" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="lt-surface" cx="0.36" cy="0.32" r="0.8">
        <stop offset="0" stop-color="#fffdf5" />
        <stop offset="0.65" stop-color="#f1ead8" />
        <stop offset="1" stop-color="#d9cfb8" />
      </radialGradient>
      <radialGradient id="lt-halo">
        <stop offset="0.45" stop-color="#fff6dc" stop-opacity="0.55" />
        <stop offset="1" stop-color="#fff6dc" stop-opacity="0" />
      </radialGradient>
      <!-- Soft crater texture -->
      <filter id="lt-craters" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="4" seed="11" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="linear" slope="1.6" intercept="-0.25" />
          <feFuncG type="linear" slope="1.6" intercept="-0.25" />
          <feFuncB type="linear" slope="1.6" intercept="-0.25" />
        </feComponentTransfer>
      </filter>
      <clipPath id="lt-disc"><circle cx={C} cy={C} r={MOON_R} /></clipPath>
      {#if lit}<clipPath id="lt-lit"><path d={lit} /></clipPath>{/if}
    </defs>


    <g class="moon">
      <circle cx={C} cy={C} r={MOON_R * 1.9} fill="url(#lt-halo)" class="halo" />
      <!-- the dark side, faintly lit by the earth -->
      <g clip-path="url(#lt-disc)">
        <circle cx={C} cy={C} r={MOON_R} class="earthshine" />
        <rect x={C - MOON_R} y={C - MOON_R} width={MOON_R * 2} height={MOON_R * 2} filter="url(#lt-craters)" class="texture faint" />
      </g>
      {#if lit}
        <g clip-path="url(#lt-lit)">
          <circle cx={C} cy={C} r={MOON_R} fill="url(#lt-surface)" />
          <rect x={C - MOON_R} y={C - MOON_R} width={MOON_R * 2} height={MOON_R * 2} filter="url(#lt-craters)" class="texture" />
        </g>
      {/if}
      <circle cx={C} cy={C} r={MOON_R} class="rim" />
    </g>
  </svg>

  <div class="info">
    <p class="line eyebrow" style="--d: 0">Lunation {cycle.index}</p>
    <p class="line phase" style="--d: 1">{PHASES[k]}</p>
    <p class="line meta" style="--d: 2">{Math.round(moon.illuminated * 100)}% lit · day {day} of {days}</p>
    <div class="line ends" style="--d: 3" aria-hidden="true">
      <span>● {when(cycle.from)}</span>
      <span>○ {when(fullAt)}</span>
      <span>● {when(cycle.to + 1)}</span>
    </div>
    <p class="line next" style="--d: 4"><strong>{next.name}</strong> in {countdown(next.at - now)}</p>
    <span class="line cta" style="--d: 5">The year in moons →</span>
  </div>
</a>

<style>
  .lt {
    width: min(340px, calc(100% - 32px));
    margin-top: 20px;
    display: grid;
    justify-items: center;
    text-align: center;
    color: #f7f4ec;
    text-decoration: none;
    text-shadow: 0 1px 12px rgba(0, 0, 0, 0.35);
  }
  .lt:focus-visible { outline: 1px solid currentColor; outline-offset: 10px; border-radius: 12px; }

  .art {
    width: min(300px, 62vw);
    height: auto;
    overflow: visible;
  }

  /* Today's moon rises out of the dark */
  .moon {
    opacity: 0;
    transform-box: fill-box;
    transform-origin: center;
    transform: scale(0.88);
    transition: opacity 1.4s ease 0.3s, transform 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s;
  }
  .ready .moon { opacity: 1; transform: scale(1); }
  .halo { transform-box: fill-box; transform-origin: center; animation: breathe 7s ease-in-out infinite; }
  .earthshine { fill: rgba(220, 225, 235, 0.1); }
  .texture { opacity: 0.22; mix-blend-mode: multiply; }
  .texture.faint { opacity: 0.08; mix-blend-mode: screen; }
  .rim { fill: none; stroke: rgba(255, 255, 255, 0.22); stroke-width: 0.6; }
  @keyframes breathe { 50% { transform: scale(1.06); opacity: 0.8; } }

  /* The details fade in one line after another */
  .info { display: grid; justify-items: center; width: 100%; margin-top: 6px; }
  .line {
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.9s ease calc(1.6s + var(--d) * 0.22s), transform 1s cubic-bezier(0.2, 0.8, 0.2, 1) calc(1.6s + var(--d) * 0.22s);
  }
  .ready .line { opacity: 1; transform: none; }
  .ready .eyebrow { opacity: 0.7; }
  .ready .meta { opacity: 0.75; }
  .ready .ends { opacity: 0.6; }
  .ready .next { opacity: 0.9; }

  .eyebrow { margin: 0; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; line-height: 1.4; }
  .phase { margin: 4px 0 0; font-family: var(--font-heading); font-size: 26px; font-weight: 200; letter-spacing: 0.5px; line-height: 1.1; }
  .meta { margin: 4px 0 0; font-size: 12px; letter-spacing: 0.5px; line-height: 1.4; }
  .ends { display: flex; justify-content: space-between; gap: 14px; margin-top: 10px; font-size: 10px; letter-spacing: 0.3px; }
  .next { margin: 10px 0 0; font-size: 13px; letter-spacing: 0.5px; line-height: 1.4; }
  .next strong { color: inherit; font-weight: 600; }
  .cta { margin-top: 8px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; padding-bottom: 2px; border-bottom: 1px solid rgba(255, 255, 255, 0.35); transition: border-color 0.4s ease; }
  .lt:hover .cta { border-color: rgba(255, 255, 255, 0.9); }
  .lt:hover .halo { animation-duration: 3s; }

  @media (max-width: 768px) {
    .lt { margin-top: 12px; }
    .phase { font-size: 22px; }
  }
  @media (max-height: 760px) {
    .art { width: min(220px, 62vw); }
  }
  @media (prefers-reduced-motion: reduce) {
    .moon, .line { transition: none; }
    .halo { animation: none; }
  }
</style>

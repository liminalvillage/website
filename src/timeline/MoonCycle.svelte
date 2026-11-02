<script>
  // A lunation as its own moon: the same four-part circle as the year,
  // one fractal step down. The new moon stands at the top and the cycle runs
  // clockwise through its four quarters (new, first quarter, full, last
  // quarter), each a quadrant with its days. Behind it, a faded moon. What
  // is noted on a day grows outwards from the rim in its mark and colour,
  // its words beside it, never touching another; what lasts a while lies as
  // an arc inside the rim; rhythms beat on a fine inner ring; today is a
  // rust dot on the rim.
  import { leafFor } from './leaves.js';
  import { phase as moonPhase } from 'lune';
  import { litPath } from '../lib/moonShape.js';

  export let L;
  export let items = []; // dated items of this lunation (already filtered)
  export let spans = []; // stretches overlapping it
  export let beats = []; // rhythm beats inside it: { at, colour, title }
  export let tint = () => '#888';
  export let lively = true;
  export let day = (ms) => '';
  export let nowMs = Date.now();
  export let onPick = () => {};

  const R = 190;
  $: frac = (ms) => Math.max(0, Math.min(1, (ms - L.start) / (L.end - L.start)));
  // an angle on the circle (radians, 0 at the top, clockwise)
  $: ang = (ms) => frac(ms) * Math.PI * 2;
  const pt = (a, r) => [r * Math.sin(a), -r * Math.cos(a)];
  const arc = (a0, a1, r) => {
    const [x0, y0] = pt(a0, r);
    const [x1, y1] = pt(a1, r);
    return `M${x0} ${y0}A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1}`;
  };
  const PHASE = ['New moon', 'First quarter', 'Full moon', 'Last quarter'];

  // the words around the rim: each takes the nearest ring outwards where it
  // touches no other (the words are about 150 wide, 30 high)
  $: marks = (() => {
    const placed = [];
    return items
      .slice()
      .sort((a, b) => a.at - b.at)
      .map((it) => {
        const a = ang(it.at);
        let ring = 0;
        const clash = (r) => placed.some((p) => p.ring === r && Math.abs(Math.sin((p.a - a) / 2)) * 2 * (R + 80 + r * 34) < 120);
        while (clash(ring) && ring < 4) ring++;
        placed.push({ a, ring });
        const side = Math.sin(a) > 0.2 ? 'start' : Math.sin(a) < -0.2 ? 'end' : 'middle';
        return { it, a, ring, side, leaf: { ...leafFor(it.symbol), pigment: tint(it) } };
      });
  })();
  // stretches as arcs inside the rim, a ring each where they would meet
  $: arcs = (() => {
    const rows = [];
    return spans
      .slice()
      .sort((a, b) => a.at - b.at)
      .map((x) => {
        const a0 = ang(Math.max(x.at, L.start));
        const a1 = Math.max(a0 + 0.04, ang(Math.min(x.until, L.end)));
        let row = rows.findIndex((end) => end < a0 - 0.05);
        if (row < 0) row = rows.length;
        rows[row] = a1;
        return { x, a0, a1, row };
      });
  })();
  $: quarters = L.quarters.map((q, k) => ({ ...q, k, a0: ang(q.start), a1: ang(Math.min(q.end, L.end)) }));
  $: nowA = nowMs >= L.start && nowMs <= L.end ? ang(nowMs) : null;
  // At the centre, the very moon of the home page (LunationTimer): tonight's
  // phase while we are in this lunation, otherwise full; its night sky is
  // the circle of the lunation itself, with a few faint stars.
  const MOON_R = 60;
  $: shown = nowMs >= L.start && nowMs <= L.end ? moonPhase(new Date(nowMs)).phase : 0.5;
  $: lit = litPath(shown, 0, 0, MOON_R);
  $: stars = (() => {
    let k = L.index * 131;
    const r = () => ((k = (k * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: 46 }, () => {
      const a = r() * Math.PI * 2;
      const d = MOON_R * 1.9 + r() * (R - MOON_R * 1.9 - 30);
      return { x: d * Math.cos(a), y: d * Math.sin(a), r: 0.4 + r() * 0.9 };
    });
  })();
</script>

<svg class="moon-cycle" viewBox="-360 -330 720 660" role="img" aria-label="Lunation {L.index} as a moon in four quarters">
  <defs>
    <!-- the moon of the home page (LunationTimer), the same surface, halo and craters -->
    <radialGradient id="mc-surface" cx="0.36" cy="0.32" r="0.8">
      <stop offset="0" stop-color="#fffdf5" />
      <stop offset="0.65" stop-color="#f1ead8" />
      <stop offset="1" stop-color="#d9cfb8" />
    </radialGradient>
    <radialGradient id="mc-halo">
      <stop offset="0.45" stop-color="#fff6dc" stop-opacity="0.55" />
      <stop offset="1" stop-color="#fff6dc" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="mc-night" cx="0" cy="0" r={R} gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#2c3150" />
      <stop offset="0.7" stop-color="#23273d" />
      <stop offset="1" stop-color="#1b1e2f" />
    </radialGradient>
    <filter id="mc-craters" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="4" seed="11" />
      <feColorMatrix type="saturate" values="0" />
      <feComponentTransfer>
        <feFuncR type="linear" slope="1.6" intercept="-0.25" />
        <feFuncG type="linear" slope="1.6" intercept="-0.25" />
        <feFuncB type="linear" slope="1.6" intercept="-0.25" />
      </feComponentTransfer>
    </filter>
    <clipPath id="mc-disc"><circle r={MOON_R} /></clipPath>
    {#if lit}<clipPath id="mc-lit"><path d={lit} /></clipPath>{/if}
  </defs>

  <!-- the lunation's night sky -->
  <circle class="mc-night" r={R} fill="url(#mc-night)" />
  {#each stars as st}<circle class="mc-star" cx={st.x} cy={st.y} r={st.r} />{/each}

  <!-- the moon, as on the home page -->
  <g class="mc-moon">
    <circle r={MOON_R * 1.9} fill="url(#mc-halo)" class="mc-halo" />
    <g clip-path="url(#mc-disc)">
      <circle r={MOON_R} class="mc-earthshine" />
      <rect x={-MOON_R} y={-MOON_R} width={MOON_R * 2} height={MOON_R * 2} filter="url(#mc-craters)" class="mc-texture faint" />
    </g>
    {#if lit}
      <g clip-path="url(#mc-lit)">
        <circle r={MOON_R} fill="url(#mc-surface)" />
        <rect x={-MOON_R} y={-MOON_R} width={MOON_R * 2} height={MOON_R * 2} filter="url(#mc-craters)" class="mc-texture" />
      </g>
    {/if}
    <circle r={MOON_R} class="mc-moon-rim" />
  </g>

  <!-- the four quarters, each a quadrant -->
  {#each quarters as q}
    {@const [x, y] = pt(q.a0, R)}
    {@const [lx, ly] = pt((q.a0 + q.a1) / 2, R * 0.68)}
    {@const [ix, iy] = pt(q.a0, MOON_R * 1.6)}
    <path class="mc-quarter-line" d="M{ix} {iy}L{x} {y}" />
    <text class="mc-quarter" x={lx} y={ly - 6}>{PHASE[q.k]}</text>
    <text class="mc-quarter-day" x={lx} y={ly + 10}>{day(q.start)}</text>
    <g transform="translate({x} {y})" class="mc-phase">
      <circle r="9" class="dark" />
      {#if q.k === 1}<path d="M0 -9 A9 9 0 0 1 0 9Z" class="lit" />{/if}
      {#if q.k === 2}<circle r="9" class="lit" />{/if}
      {#if q.k === 3}<path d="M0 -9 A9 9 0 0 0 0 9Z" class="lit" />{/if}
      {#if q.k === 0}<circle r="9" class="new" />{/if}
    </g>
  {/each}

  <!-- the rim, and the days on it -->
  <circle class="mc-rim" r={R} />

  <!-- what lasts a while: arcs inside the rim -->
  {#each arcs as s}
    <path class="mc-arc" class:imagined={s.x.status === 'imagined'} d={arc(s.a0, s.a1, R - 22 - s.row * 12)} style="--c: {tint(s.x)}">
      <title>{s.x.title}{s.x.where ? ` · ${s.x.where}` : ''}, {day(s.x.at)} to {day(s.x.until)}</title>
    </path>
  {/each}

  <!-- rhythms: beats on a fine inner ring -->
  {#each beats as b}
    {@const [x, y] = pt(ang(b.at), R - 10)}
    <circle class="mc-beat" cx={x} cy={y} r="3" style="--c: {b.colour}"><title>{b.title}, {day(b.at)}</title></circle>
  {/each}

  <!-- today -->
  {#if nowA !== null}
    {@const [x, y] = pt(nowA, R)}
    <circle class="mc-today" cx={x} cy={y} r="7" />
  {/if}

  <!-- what is noted on a day, growing out from the rim -->
  {#each marks as m (m.it.id)}
    {@const [bx, by] = pt(m.a, R + 13)}
    {@const [tx, ty] = pt(m.a, R + 62 + m.ring * 34)}
    {#if m.ring}
      {@const [sx, sy] = pt(m.a, R + 46)}
      <path class="mc-stem" d="M{sx} {sy}L{tx} {ty}" />
    {/if}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <g class="mc-mark" class:imagined={m.it.status === 'imagined'} class:remembered={m.it.status === 'remembered'} role="button" tabindex="-1" aria-label={m.it.title} on:click={() => onPick(m.it)} style="--pig: {m.leaf.pigment}">
      {#if lively}
        <g transform="translate({bx} {by}) rotate({(m.a * 180) / Math.PI}) scale(1.05)">
          <path class="blade" d={m.leaf.shape} />
          {#each m.leaf.veins as v}<path class="vein" d={v} />{/each}
        </g>
      {:else}
        {@const [dx, dy] = pt(m.a, R + 22)}
        <circle class="dot" cx={dx} cy={dy} r="6" />
      {/if}
      <text class="mc-word" x={tx} y={ty} text-anchor={m.side}>
        <tspan x={tx} dy="0">{m.it.title.length > 30 ? `${m.it.title.slice(0, 29)}…` : m.it.title}</tspan>
        <tspan x={tx} dy="13" class="mc-date">{day(m.it.at)}</tspan>
      </text>
    </g>
  {/each}
</svg>

<style>
  .moon-cycle {
    display: block;
    width: min(640px, 94vw);
    height: auto;
    margin: 0 auto;
    overflow: visible;
  }

  .mc-star {
    fill: #fff8e6;
    opacity: 0.55;
  }

  .mc-halo {
    transform-box: fill-box;
    transform-origin: center;
    animation: mc-breathe 7s ease-in-out infinite;
  }

  .moon-cycle:hover .mc-halo {
    animation-duration: 3s;
  }

  @keyframes mc-breathe {
    50% {
      transform: scale(1.06);
      opacity: 0.8;
    }
  }

  .mc-earthshine {
    fill: rgba(220, 225, 235, 0.1);
  }

  .mc-texture {
    opacity: 0.22;
    mix-blend-mode: multiply;
  }

  .mc-texture.faint {
    opacity: 0.08;
    mix-blend-mode: screen;
  }

  .mc-moon-rim {
    fill: none;
    stroke: rgba(255, 255, 255, 0.22);
    stroke-width: 0.6;
  }

  @media (prefers-reduced-motion: reduce) {
    .mc-halo {
      animation: none;
    }
  }

  .mc-rim {
    fill: none;
    stroke: color-mix(in srgb, var(--bark-900) 55%, transparent);
    stroke-width: 1;
  }

  /* on the night sky, the quarters are in light ink */
  .mc-quarter-line {
    stroke: rgba(255, 248, 230, 0.22);
    stroke-dasharray: 3 4;
  }

  .mc-quarter {
    font: 300 13px 'Outfit', system-ui, sans-serif;
    fill: #f6efde;
    text-anchor: middle;
  }

  .mc-quarter-day {
    font: 300 10.5px 'Playpen Sans', 'Quicksand', sans-serif;
    fill: rgba(246, 239, 222, 0.7);
    text-anchor: middle;
  }

  .mc-phase .dark,
  .mc-phase .new {
    fill: #fffaf0;
    stroke: var(--bark-900);
    stroke-width: 0.8;
  }

  .mc-phase .new {
    fill: var(--bark-900);
  }

  .mc-phase .lit {
    fill: #fff1b8;
    stroke: var(--bark-900);
    stroke-width: 0.8;
  }

  .mc-arc {
    fill: none;
    stroke: color-mix(in oklab, var(--c) 70%, #fff8e6);
    stroke-width: 7;
    stroke-linecap: round;
    opacity: 0.8;
  }

  .mc-arc.imagined {
    stroke-width: 2;
    stroke-dasharray: 4 4;
    opacity: 0.8;
  }

  .mc-beat {
    fill: color-mix(in oklab, var(--c) 60%, #fff8e6);
  }

  .mc-today {
    fill: var(--tl-paper, #fffaf2);
    stroke: var(--rust, #c4463c);
    stroke-width: 2.4;
  }

  .mc-stem {
    stroke: color-mix(in srgb, var(--bark-900) 35%, transparent);
    stroke-width: 0.8;
  }

  .mc-mark {
    cursor: pointer;
  }

  .mc-mark .blade {
    fill: color-mix(in srgb, color-mix(in oklab, var(--pig) 86%, var(--tl-ember, #fdd7bb)) 62%, transparent);
    stroke: color-mix(in srgb, var(--bark-900) 70%, transparent);
    stroke-width: 0.7;
  }

  .mc-mark .vein {
    fill: none;
    stroke: color-mix(in srgb, var(--bark-900) 40%, transparent);
    stroke-width: 0.5;
  }

  .mc-mark.imagined .blade {
    fill: color-mix(in srgb, var(--pig) 10%, transparent);
    stroke-dasharray: 1.6 1.4;
  }

  .mc-mark.remembered .blade {
    fill: color-mix(in srgb, var(--pig) 30%, #e8e0d2);
  }

  .mc-mark .dot {
    fill: color-mix(in oklab, var(--pig) 86%, var(--tl-ember, #fdd7bb));
    stroke: color-mix(in srgb, var(--bark-900) 40%, transparent);
  }

  .mc-word {
    font: 400 12px 'Quicksand', system-ui, sans-serif;
    fill: var(--bark-900);
    paint-order: stroke;
    stroke: var(--tl-paper, #fffaf2);
    stroke-width: 3px;
  }

  .mc-date {
    font: 300 10.5px 'Playpen Sans', 'Quicksand', sans-serif;
    fill: var(--bark-600, #7a6550);
  }

  .mc-mark:hover .mc-word {
    fill: #000;
  }
</style>

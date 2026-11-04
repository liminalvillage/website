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
  // the same arc drawn the other way round, so words along the lower half read upright
  const arcBack = (a0, a1, r) => {
    const [x1, y1] = pt(a1, r);
    const [x0, y0] = pt(a0, r);
    return `M${x1} ${y1}A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 0 ${x0} ${y0}`;
  };
  const RA = R + 28; // the stages' arcs, a little away from the rim
  const GAP = 0.09; // and from each other
  let stage = null; // the stage under the pointer, its words shown beside it
  const PHASE = ['New moon', 'First quarter', 'Full moon', 'Last quarter'];
  // the village's rhythm through the moon, as Roberto tells it: four
  // stretches, each in its own colour, and a turning at each quarter
  const STAGES = [
    { name: 'arrival & discovery', note: ['people arrive and land:', 'who is here, and what', 'could we do together?'], colour: '#7f93c6' },
    { name: 'opening loops', note: ['co-creation:', 'ideas flow freely,', 'anything can be tried'], colour: '#8fb46c' },
    { name: 'closing loops', note: ['choosing what worked:', 'focus, care', 'and delivery'], colour: '#dca052' },
    { name: 'harmonise & integrate', note: ['bringing it to a close;', 'what comes next', 'begins to stir'], colour: '#ad84b0' },
  ];
  const TURNS = ['the new moon: newcomers bring what is next', 'convergence: what we share sets us going', 'celebration: all that worked', 'from trying to choosing'];

  // a title wrapped onto short lines, never cut
  function wrap(t, width = 20) {
    const lines = [];
    for (const w of t.split(/\s+/)) {
      const last = lines[lines.length - 1];
      if (last && (last + ' ' + w).length <= width) lines[lines.length - 1] = last + ' ' + w;
      else lines.push(w);
    }
    return lines;
  }
  // the words around the rim: each takes the nearest ring outwards where it
  // touches no other (the words are about 130 wide, a few lines high)
  $: marks = (() => {
    const placed = [];
    return items
      .slice()
      .sort((a, b) => a.at - b.at)
      .map((it) => {
        const a = ang(it.at);
        let ring = 0;
        const clash = (r) => placed.some((p) => p.ring === r && Math.abs(Math.sin((p.a - a) / 2)) * 2 * (R + 110 + r * 58) < 130);
        while (clash(ring) && ring < 4) ring++;
        placed.push({ a, ring });
        const side = Math.sin(a) > 0.2 ? 'start' : Math.sin(a) < -0.2 ? 'end' : 'middle';
        return { it, a, ring, side, lines: wrap(it.title), leaf: { ...leafFor(it.symbol), pigment: tint(it) } };
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
  const MOON_R = 50;
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
    <!-- light, as the solar view: the moon's own glow in the middle, and each
         stretch of the cycle a wash of its colour, fading in towards the rim -->
    <radialGradient id="mc-glow" cx="0" cy="0" r={R} gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="0.45" stop-color="#fff8e8" stop-opacity="0.8" />
      <stop offset="1" stop-color="#fff2d6" stop-opacity="0.3" />
    </radialGradient>
    <radialGradient id="mc-wash-fade" cx="0" cy="0" r={R} gradientUnits="userSpaceOnUse">
      <stop offset="0.3" stop-color="#fff" stop-opacity="0" />
      <stop offset="0.75" stop-color="#fff" stop-opacity="0.75" />
      <stop offset="1" stop-color="#fff" stop-opacity="1" />
    </radialGradient>
    <mask id="mc-wash" maskUnits="userSpaceOnUse" x={-R} y={-R} width={R * 2} height={R * 2}>
      <rect x={-R} y={-R} width={R * 2} height={R * 2} style="fill: url(#mc-wash-fade)" />
    </mask>
    <!-- beyond the rim, as round the solar view's sun: the moon's light and
         each stretch's colour spilling out and fading into the page -->
    <radialGradient id="mc-beyond" cx="0" cy="0" r={R * 2.3} gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fffdf6" stop-opacity="0.9" />
      <stop offset="0.4" stop-color="#fff6e2" stop-opacity="0.65" />
      <stop offset="0.7" stop-color="#fdf0dc" stop-opacity="0.25" />
      <stop offset="1" stop-color="#fdf0dc" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="mc-spill-fade" cx="0" cy="0" r={R * 2.4} gradientUnits="userSpaceOnUse">
      <stop offset="0.3" stop-color="#fff" stop-opacity="0" />
      <stop offset="0.45" stop-color="#fff" stop-opacity="0.9" />
      <stop offset="0.65" stop-color="#fff" stop-opacity="0.45" />
      <stop offset="1" stop-color="#fff" stop-opacity="0" />
    </radialGradient>
    <mask id="mc-spill" maskUnits="userSpaceOnUse" x={-R * 2.4} y={-R * 2.4} width={R * 4.8} height={R * 4.8}>
      <rect x={-R * 2.4} y={-R * 2.4} width={R * 4.8} height={R * 4.8} style="fill: url(#mc-spill-fade)" />
    </mask>
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

  <!-- the light beyond, then the lunation's own light, its four stretches washed in -->
  <circle r={R * 2.3} style="fill: url(#mc-beyond)" class="mc-beyond" />
  <g mask="url(#mc-spill)" class="mc-spill">
    {#each quarters as q}
      {@const [x0, y0] = pt(q.a0, R * 2.4)}
      {@const [x1, y1] = pt(q.a1, R * 2.4)}
      <path d="M0 0L{x0} {y0}A{R * 2.4} {R * 2.4} 0 {q.a1 - q.a0 > Math.PI ? 1 : 0} 1 {x1} {y1}Z" style="fill: {STAGES[q.k].colour}" />
    {/each}
  </g>
  <circle class="mc-ground" r={R} />
  <g mask="url(#mc-wash)">
    {#each quarters as q}
      {@const [x0, y0] = pt(q.a0, R)}
      {@const [x1, y1] = pt(q.a1, R)}
      <path class="mc-wash" d="M0 0L{x0} {y0}A{R} {R} 0 {q.a1 - q.a0 > Math.PI ? 1 : 0} 1 {x1} {y1}Z" style="fill: {STAGES[q.k].colour}" />
    {/each}
  </g>
  <circle r={R} fill="url(#mc-glow)" />
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
    {@const [lx, ly] = pt((q.a0 + q.a1) / 2, R * 0.6)}
    {@const [ix, iy] = pt(q.a0, MOON_R * 1.6)}
    {@const mid = (q.a0 + q.a1) / 2}
    <path class="mc-quarter-line" d="M{ix} {iy}L{x} {y}" />
    <!-- the stage: an arc a little outside the rim in its colour, its name
         curving along it; hovered, what happens in it is written beside it -->
    {@const top = Math.cos(mid) > 0}
    {@const [ex, ey] = pt(q.a1 - GAP, RA)}
    {@const [sx0, sy0] = pt(q.a0 + GAP, RA)}
    {@const right = Math.sin(mid) > 0}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <g class="mc-stage-g" class:on={stage === q.k} style="--c: {STAGES[q.k].colour}" on:mouseenter={() => (stage = q.k)} on:mouseleave={() => (stage = null)}>
      <path class="mc-stage-hit" d={arc(q.a0 + GAP, q.a1 - GAP, RA + 6)} />
      <!-- the first stage, where the cycle begins at the new moon, glows a little -->
      {#if q.k === 0}<path class="mc-stage-glow" d={arc(q.a0 + GAP, q.a1 - GAP, RA)} />{/if}
      <path class="mc-stage" class:first={q.k === 0} d={arc(q.a0 + GAP, q.a1 - GAP, RA)} />
      <!-- and each runs on, clockwise, to the next: a small arrowhead at its end -->
      <path class="mc-stage-tip" d="M-4 -4L2 0L-4 4" transform="translate({ex} {ey}) rotate({((q.a1 - GAP) * 180) / Math.PI})" />
      {#if q.k === 0}<circle class="mc-stage-start" cx={sx0} cy={sy0} r="5" />{/if}
      <path id="mc-stage-{L.index}-{q.k}" d={top ? arc(q.a0 + GAP, q.a1 - GAP, RA + 18) : arcBack(q.a0 + GAP, q.a1 - GAP, RA + 18)} fill="none" />
      <text class="mc-stage-name"><textPath href="#mc-stage-{L.index}-{q.k}" startOffset="50%" text-anchor="middle">{STAGES[q.k].name}</textPath></text>
    </g>
    {#if stage === q.k}
      {@const [sx, sy] = pt(mid, RA + 52)}
      <g class="mc-stage-label" transform="translate({sx} {sy + (top ? -30 : 0)})" text-anchor={right ? 'start' : 'end'}>
        {#each STAGES[q.k].note as line, j}
          <text class="mc-quarter" y={j * 15}>{line}</text>
        {/each}
      </g>
    {/if}
    <!-- the moon's own name for where it is, and the day, just inside by its face -->
    {@const [px, py] = pt(q.a0, R * 0.62)}
    {@const side = Math.abs(Math.sin(q.a0)) > 0.5}
    {@const anchor = side ? (Math.sin(q.a0) > 0 ? 'end' : 'start') : 'middle'}
    <!-- beside the moon, the quarters' names wrap onto two short lines so
         they stay clear of it -->
    {@const words = side ? PHASE[q.k].split(' ') : [PHASE[q.k]]}
    {@const y0 = py + (side ? -16 : Math.cos(q.a0) > 0 ? 0 : 6)}
    <text class="mc-phase-name" x={px} y={y0} text-anchor={anchor}>{#each words as w, j}<tspan x={px} dy={j ? 14 : 0}>{w}</tspan>{/each}</text>
    <text class="mc-phase-day" x={px} y={y0 + words.length * 14} text-anchor={anchor}>{day(q.start)}</text>
    <g transform="translate({x} {y})" class="mc-phase"><title>{PHASE[q.k]}, {day(q.start)}: {TURNS[q.k]}</title>
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
    <path class="mc-arc" class:imagined={s.x.status === 'imagined'} d={arc(s.a0, s.a1, R - 30 - s.row * 9)} style="--c: {tint(s.x)}">
      <title>{s.x.title}{s.x.where ? ` · ${s.x.where}` : ''}, {day(s.x.at)} to {day(s.x.until)}</title>
    </path>
  {/each}

  <!-- rhythms: beats on a fine inner ring -->
  {#each beats as b}
    {@const [x, y] = pt(ang(b.at), R - 24)}
    <circle class="mc-beat" cx={x} cy={y} r="3" style="--c: {b.colour}"><title>{b.title}, {day(b.at)}</title></circle>
  {/each}

  <!-- today: in the lunation we are living, a dotted line from the moon out
       past the rim, and where it ends, we are here -->
  {#if nowA !== null}
    {@const [x0, y0] = pt(nowA, MOON_R + 8)}
    {@const [x1, y1] = pt(nowA, RA + 62)}
    {@const [lx, ly] = pt(nowA, RA + 76)}
    <path class="mc-here" d="M{x0} {y0}L{x1} {y1}" />
    <text class="mc-here-word" x={lx} y={ly + 4} text-anchor={Math.sin(nowA) > 0.3 ? 'start' : Math.sin(nowA) < -0.3 ? 'end' : 'middle'}>we are here</text>
    {@const [x, y] = pt(nowA, R)}
    <circle class="mc-today" cx={x} cy={y} r="7" />
  {/if}

  <!-- what is noted on a day, growing out from the rim -->
  {#each marks as m (m.it.id)}
    {@const [bx, by] = pt(m.a, R + 46)}
    {@const [tx, ty0] = pt(m.a, R + 100 + m.ring * 58)}
    <!-- above the circle the words grow upwards, below it downwards -->
    {@const ty = Math.cos(m.a) > 0.3 ? ty0 - (m.lines.length - 1) * 14 : ty0}
    {#if m.ring}
      {@const [sx, sy] = pt(m.a, R + 84)}
      <path class="mc-stem" d="M{sx} {sy}L{tx} {ty}" />
    {/if}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <g class="mc-mark" class:imagined={m.it.status === 'imagined'} class:remembered={m.it.status === 'remembered'} role="button" tabindex="-1" aria-label={m.it.title} on:click={() => onPick(m.it)} style="--pig: {m.leaf.pigment}">
      {#if lively}
        <g transform="translate({bx} {by}) rotate({(m.a * 180) / Math.PI}) scale(1.05)">
          <!-- each leaf sways on its stem in its own time, and jiggles when touched -->
          <g class="sway" style="--d: {-((m.a * 7) % 4).toFixed(2)}s">
            <path class="blade" d={m.leaf.shape} />
            {#each m.leaf.veins as v}<path class="vein" d={v} />{/each}
          </g>
        </g>
      {:else}
        {@const [dx, dy] = pt(m.a, R + 52)}
        <circle class="dot" cx={dx} cy={dy} r="6" />
      {/if}
      <text class="mc-word" x={tx} y={ty} text-anchor={m.side}>
        {#each m.lines as line, j}<tspan x={tx} dy={j ? 14 : 0}>{line}</tspan>{/each}
        <tspan x={tx} dy="14" class="mc-date">{day(m.it.at)}</tspan>
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

  .mc-ground {
    fill: var(--tl-paper, #fffaf2);
  }

  .mc-beyond,
  .mc-spill {
    pointer-events: none;
  }

  .mc-spill {
    opacity: 0.3;
  }

  .mc-wash {
    opacity: 0.42;
  }

  /* stipple, as in the diagrams, where the night sky had stars */
  .mc-star {
    fill: color-mix(in srgb, var(--bark-900) 30%, transparent);
  }

  .mc-stage {
    fill: none;
    stroke: var(--c);
    stroke-width: 4;
    stroke-linecap: round;
    opacity: 0.7;
    transition: opacity 0.25s ease, stroke-width 0.25s ease;
  }

  .mc-stage-name {
    font: 300 13.5px 'Playpen Sans', 'Quicksand', sans-serif;
    fill: #2f3760;
    letter-spacing: 0.03em;
  }

  .mc-phase-name,
  .mc-phase-day {
    paint-order: stroke;
    stroke: var(--tl-paper, #fffaf2);
    stroke-width: 3px;
    stroke-linejoin: round;
    pointer-events: none;
  }

  .mc-phase-name {
    font: 300 12.5px 'Outfit', system-ui, sans-serif;
    fill: #2f3760;
  }

  .mc-phase-day {
    font: 300 10.5px 'Playpen Sans', 'Quicksand', sans-serif;
    fill: var(--bark-700, #5a4632);
  }

  .mc-stage-g {
    cursor: default;
  }

  .mc-stage.first {
    stroke-width: 5;
    opacity: 0.9;
  }

  .mc-stage-glow {
    fill: none;
    stroke: var(--c);
    stroke-width: 16;
    stroke-linecap: round;
    opacity: 0.16;
    animation: mc-dawn 5s ease-in-out infinite;
  }

  @keyframes mc-dawn {
    50% {
      opacity: 0.3;
    }
  }

  .mc-stage-start {
    fill: #fffdf6;
    stroke: var(--c);
    stroke-width: 2;
  }

  .mc-stage-tip {
    fill: none;
    stroke: var(--c);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: 0.8;
  }

  /* a soft line of silver dots, like moonlight, out to where we are */
  .mc-here {
    stroke: #b4b9c6;
    stroke-width: 2.6;
    stroke-dasharray: 0.1 6;
    stroke-linecap: round;
    pointer-events: none;
  }

  .mc-here-word {
    font: 300 11.5px 'Playpen Sans', 'Quicksand', sans-serif;
    fill: #7d8394;
    paint-order: stroke;
    stroke: var(--tl-paper, #fffaf2);
    stroke-width: 3px;
    pointer-events: none;
  }

  .mc-stage-hit {
    fill: none;
    stroke: transparent;
    stroke-width: 34;
  }

  .mc-stage-g.on .mc-stage {
    opacity: 1;
    stroke-width: 6;
  }

  .mc-stage-label {
    animation: mc-note-in 0.25s ease-out;
    pointer-events: none;
  }

  @keyframes mc-note-in {
    from {
      opacity: 0;
    }
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
    stroke: color-mix(in srgb, var(--bark-900) 30%, transparent);
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

  /* in ink, as the solar view's words, on a halo of paper */
  .mc-quarter-line {
    stroke: color-mix(in srgb, var(--bark-900) 22%, transparent);
    stroke-dasharray: 3 4;
  }

  .mc-quarter,
  .mc-stage-name {
    paint-order: stroke;
    stroke: var(--tl-paper, #fffaf2);
    stroke-width: 3px;
    stroke-linejoin: round;
  }

  .mc-quarter {
    font: 300 13px 'Playpen Sans', 'Quicksand', sans-serif;
    fill: color-mix(in srgb, #2f3760 85%, transparent);
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
    stroke-width: 5;
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

  /* today on the rim: a pale moonlit point, at one with its line of dots */
  .mc-today {
    fill: #fffdf6;
    stroke: #a9afbd;
    stroke-width: 1.6;
    filter: drop-shadow(0 0 4px rgba(190, 196, 212, 0.9));
  }

  .mc-stem {
    stroke: color-mix(in srgb, var(--bark-900) 35%, transparent);
    stroke-width: 0.8;
  }

  .mc-mark {
    cursor: pointer;
  }

  .mc-mark .sway {
    transform-origin: 0 0;
    animation: mc-sway 4s ease-in-out var(--d, 0s) infinite;
  }

  .mc-mark:hover .sway {
    animation: mc-jiggle 0.7s ease-in-out;
  }

  @keyframes mc-sway {
    0%,
    100% {
      transform: rotate(-5deg);
    }
    50% {
      transform: rotate(5deg);
    }
  }

  @keyframes mc-jiggle {
    0% {
      transform: rotate(0) scale(1);
    }
    20% {
      transform: rotate(-16deg) scale(1.15);
    }
    40% {
      transform: rotate(13deg) scale(1.12);
    }
    60% {
      transform: rotate(-8deg) scale(1.08);
    }
    80% {
      transform: rotate(4deg) scale(1.04);
    }
    100% {
      transform: rotate(0) scale(1);
    }
  }

  /* the moons at the quarters bob a little when hovered, the beats twinkle */
  .mc-phase {
    transition: transform 0.3s ease;
  }

  .mc-beat {
    animation: mc-twinkle 3s ease-in-out infinite;
  }

  @keyframes mc-twinkle {
    50% {
      opacity: 0.45;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .mc-mark .sway,
    .mc-mark:hover .sway,
    .mc-beat,
    .mc-stage-glow {
      animation: none;
    }
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

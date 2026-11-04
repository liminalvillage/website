<script>
  // The year in three dimensions: the spiral as a cone, rising through time.
  // Lunation 1 sits at the narrow foot, the past climbing in faint rings, and
  // each turn above is a year, wider than the one before, each lunation at
  // the angle of its season (the same as on the flat spiral) and in the
  // colour of its warmth, up to the hundredth at the wide top. It turns
  // slowly by itself; drag to turn it or tip it; tap a moon to open it. It
  // opens seen from straight above, like the flat spiral, and tips up into
  // the cone; dragged back up to the top view, it lies flat again.
  // Drawn as SVG from a small 3D projection, so it stays in the site's hand.
  import { onMount, onDestroy } from 'svelte';

  export let known = []; // [{ index, angle, heat, now }], the lunations with data
  export let firstIndex = 84;
  export let onPick = () => {};
  export let onFlat = () => {};
  export let grab = null; // { x, y }: opened by pulling the flat spiral, the pull carries on here
  export let quarters = []; // the seasons compass: [{ a0, a1, colour, name }]
  export let points = []; // the solstices and equinoxes: [{ a, name, note, lon }]
  export let art = {}; // each turning's painting by its longitude: { 270: 'winter', ... }

  const FLAT = Math.PI / 2; // seen from straight above
  const TILT = 0.8;
  let w = 1200;
  let h = 800;
  let yaw = 0;
  let pitch = FLAT;
  let opening = true;
  let spin = true;
  let drag = null;
  let frame = 0;
  let hover = null;
  let artHover = null;

  const H = 7; // height per lunation
  const radiusOf = (index) => 26 + (index - 1) * 2.6;
  // every lunation from the first, with its angle: the known ones as on the
  // flat spiral, the past at the same pace backwards
  $: step = known.length > 1 ? (known[known.length - 1].angle - known[0].angle) / (known.length - 1) : 0.5;
  $: all = [
    ...Array.from({ length: firstIndex - 1 }, (_, k) => {
      const index = k + 1;
      return { index, angle: (known[0]?.angle ?? 0) - (firstIndex - index) * step, past: true };
    }),
    ...known.map((l, i) => ({ ...l, i })),
  ];
  $: top = all.length ? all[all.length - 1].index : 100;
  // fit both the width of the top ring and the height of the whole cone
  $: scale = Math.min(w / (2 * radiusOf(top) * 1.55), (h * 0.86) / (top * H * Math.cos(pitch) + 2 * radiusOf(top) * Math.sin(pitch)));

  const project = (index, angle) => place(radiusOf(index), angle, (index - top / 2) * H);
  function place(r, angle, z) {
    const x = r * Math.cos(angle);
    const y = -r * Math.sin(angle); // so the top view matches the flat spiral
    // turn round the axis, then tip towards the viewer
    const x1 = x * Math.cos(yaw) - y * Math.sin(yaw);
    const y1 = x * Math.sin(yaw) + y * Math.cos(yaw);
    const y2 = y1 * Math.cos(pitch) - z * Math.sin(pitch);
    const z2 = y1 * Math.sin(pitch) + z * Math.cos(pitch);
    const F = 900;
    const k = F / (F + y2);
    return { sx: w / 2 + x1 * scale * k, sy: h / 2 - z2 * scale * k * 0.9, depth: y2, k };
  }
  $: moons = (yaw, pitch, scale, all.map((l) => ({ ...l, ...project(l.index, l.angle) })));
  // the line between each moon and the next, far ones first
  $: segments = moons
    .slice(1)
    .map((p, k) => ({ a: moons[k], b: p, depth: (moons[k].depth + p.depth) / 2 }))
    .sort((s1, s2) => s2.depth - s1.depth);
  $: dots = moons.slice().sort((p1, p2) => p2.depth - p1.depth);
  // the seasons round the top of the cone, as on the compass: each quarter's
  // wash and the four turnings named, with a faint line down the cone
  $: rimR = radiusOf(top) * 1.22;
  $: zTop = (top / 2) * H;
  $: washes = (yaw, pitch, scale, quarters.map((q) => {
    const a1 = q.a1 > q.a0 ? q.a1 : q.a1 + Math.PI * 2;
    const ring = Array.from({ length: 25 }, (_, k) => place(rimR, q.a0 + ((a1 - q.a0) * k) / 24, zTop));
    const c = place(0, 0, zTop);
    return { colour: q.colour, d: `M${c.sx} ${c.sy}` + ring.map((p) => `L${p.sx} ${p.sy}`).join('') + 'Z' };
  }));
  // and all round its sides: the cone wrapped in the four washes, in thin
  // slices so it curves, the near side lighter than the far
  $: sides = (yaw, pitch, scale, quarters.flatMap((q) => {
    const a1 = q.a1 > q.a0 ? q.a1 : q.a1 + Math.PI * 2;
    const n = Math.max(2, Math.ceil((a1 - q.a0) / 0.14));
    return Array.from({ length: n }, (_, k) => {
      const b0 = q.a0 + ((a1 - q.a0) * k) / n;
      const b1 = q.a0 + ((a1 - q.a0) * (k + 1)) / n + 0.004;
      const c = [place(radiusOf(top) * 1.04, b0, zTop), place(radiusOf(top) * 1.04, b1, zTop), place(radiusOf(1), b1, -zTop), place(radiusOf(1), b0, -zTop)];
      const depth = (c[0].depth + c[1].depth) / 2;
      return { colour: q.colour, depth, d: 'M' + c.map((p) => `${p.sx} ${p.sy}`).join('L') + 'Z' };
    });
  }).sort((s1, s2) => s2.depth - s1.depth));
  // the colour of each season's painting, for the wash round its drawing
  const FIELD = { winter: '#4a5680', spring: '#4f6a48', summer: '#b88a40', autumn: '#9a5232' };
  const DRAW = 0.72; // the drawing, within its colour
  // each turning's painting floats beside the cone at its season, turning
  // round with it, nearer ones clearer, far ones faint; large enough that
  // neighbours melt into one another
  $: paintings = (yaw, pitch, scale, points.filter((pt) => art[pt.lon]).map((pt) => {
    const p = place(rimR * 1.3, pt.a, zTop * 0.25);
    return { ...pt, name: art[pt.lon], ...p, size: Math.min(w, h) * 0.78 * p.k, near: Math.max(0, Math.min(1, 0.5 - p.depth / (2 * rimR))) };
  }).sort((p1, p2) => p2.depth - p1.depth));
  $: turnings = (yaw, pitch, scale, points.map((pt) => ({
    name: pt.name,
    note: pt.note,
    label: place(rimR * 1.12, pt.a, zTop),
    top: place(rimR, pt.a, zTop),
    foot: place(radiusOf(1) * 1.5, pt.a, -zTop),
  })));

  function loop() {
    // tipping up out of the flat view, then turning slowly, but never
    // under the pointer, so a moon can be caught
    if (opening && !drag) {
      pitch += (TILT - pitch) * 0.06;
      if (Math.abs(pitch - TILT) < 0.005) opening = false;
    } else if (spin && !drag && !hover && artHover === null) yaw += 0.0025;
    frame = requestAnimationFrame(loop);
  }
  onMount(() => {
    if (grab) {
      opening = false;
      drag = { x: grab.x, y: grab.y, yaw, pitch: FLAT, fromFlat: true };
    }
    frame = requestAnimationFrame(loop);
  });
  onDestroy(() => cancelAnimationFrame(frame));

  function down(e) {
    opening = false;
    drag = { x: e.clientX, y: e.clientY, yaw, pitch };
  }
  function move(e) {
    if (!drag) return;
    yaw = drag.yaw + (e.clientX - drag.x) * 0.006;
    // pulled out of the flat view, either way up tips it
    const dy = drag.fromFlat ? -Math.abs(e.clientY - drag.y) : e.clientY - drag.y;
    pitch = Math.max(0.05, Math.min(FLAT, drag.pitch + dy * 0.004));
  }
  // let go near the top view, and it lies down flat again
  function up() {
    if (drag && pitch > FLAT - 0.12) onFlat();
    drag = null;
  }
</script>

<svelte:window on:pointermove={move} on:pointerup={up} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="cone" bind:clientWidth={w} bind:clientHeight={h} on:pointerdown={down} class:dragging={drag}>
  <svg viewBox="0 0 {w} {h}" aria-label="The lunations as a spiral cone, from Lunation 1 at the foot to {top} at the top">
    <defs>
      <radialGradient id="cone-sun">
        <stop offset="0" stop-color="#ffe7a0" stop-opacity="0.7" />
        <stop offset="1" stop-color="#fff6dc" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="cone-art-fade">
        <stop offset="0.1" stop-color="#fff" stop-opacity="1" />
        <stop offset="0.5" stop-color="#fff" stop-opacity="0.6" />
        <stop offset="0.8" stop-color="#fff" stop-opacity="0.15" />
        <stop offset="0.98" stop-color="#fff" stop-opacity="0" />
      </radialGradient>
      <mask id="cone-art" maskContentUnits="objectBoundingBox">
        <rect width="1" height="1" fill="url(#cone-art-fade)" />
      </mask>
    </defs>
    {#each paintings as pa (pa.lon)}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <g class="painting" mask="url(#cone-art)" style="opacity: {artHover === pa.lon ? 0.9 : 0.2 + 0.4 * pa.near}" on:mouseenter={() => (artHover = pa.lon)} on:mouseleave={() => (artHover = null)}>
        <!-- the season's colour at full size, and its drawing a little smaller within it -->
        <rect x={pa.sx - pa.size / 2} y={pa.sy - pa.size / 2} width={pa.size} height={pa.size} style="fill: {FIELD[pa.name]}" />
        <g mask="url(#cone-art)">
          <image href="/images/concepts/season-{pa.name}.svg" x={pa.sx - (pa.size * DRAW) / 2} y={pa.sy - (pa.size * DRAW) / 2} width={pa.size * DRAW} height={pa.size * DRAW} />
          {#if artHover === pa.lon}
            <image href="/images/concepts/season-{pa.name}-more.svg" x={pa.sx - (pa.size * DRAW) / 2} y={pa.sy - (pa.size * DRAW) / 2} width={pa.size * DRAW} height={pa.size * DRAW} />
          {/if}
        </g>
      </g>
    {/each}
    <!-- the sun's warmth round the cone's axis -->
    <ellipse cx={w / 2} cy={h / 2} rx={Math.min(w, h) * 0.42} ry={Math.min(w, h) * 0.46} fill="url(#cone-sun)" />
    {#each sides as sd}<path class="side" d={sd.d} style="fill: {sd.colour}; opacity: {0.1 + 0.14 * Math.max(0, Math.min(1, 0.5 - sd.depth / 600))}" />{/each}
    {#each washes as q}<path class="wash" d={q.d} style="fill: {q.colour}" />{/each}
    {#each turnings as t}<line class="turning" x1={t.top.sx} y1={t.top.sy} x2={t.foot.sx} y2={t.foot.sy} />{/each}
    {#each segments as s}
      {#if !s.b.past}<line class="seg-wash" x1={s.a.sx} y1={s.a.sy} x2={s.b.sx} y2={s.b.sy} style="stroke: {s.b.heat}; stroke-width: {16 * s.b.k}" />{/if}
      <line class="seg" class:past={s.a.past} x1={s.a.sx} y1={s.a.sy} x2={s.b.sx} y2={s.b.sy} style="stroke: {s.b.past ? '' : s.b.heat}; opacity: {Math.max(0.25, Math.min(1, 0.6 + (-s.depth / 400)))}" />
    {/each}
    {#each dots as p (p.index)}
      {#if p.past}
        <circle class="past" cx={p.sx} cy={p.sy} r={2.2 * p.k} on:mouseenter={() => (hover = p)} on:mouseleave={() => (hover = null)} />
      {:else}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <g class="moon" class:now={p.now} transform="translate({p.sx} {p.sy}) scale({p.k})" on:click|stopPropagation={() => onPick(p.i)} on:mouseenter={() => (hover = p)} on:mouseleave={() => (hover = null)} role="button" tabindex="-1" aria-label="Lunation {p.index}">
          <circle class="blob" r="19" cx={((p.index * 37) % 5) - 2} cy={((p.index * 53) % 5) - 2} style="fill: color-mix(in srgb, {p.heat} 50%, transparent)" />
          <circle class="paper" r="16" style="fill: color-mix(in srgb, {p.heat} 14%, #fffdf8)" />
          <circle class="ink" r="15" />
          <circle class="ink inner" r="12.5" />
          <text y="2">{p.index}</text>
          <text class="when" y="9.5">{p.when}</text>
        </g>
      {/if}
    {/each}
    {#each turnings as t}
      <text class="turning-name" x={t.label.sx} y={t.label.sy}>{t.name}</text>
      {#if t.note}<text class="turning-note" x={t.label.sx} y={t.label.sy + 14}>{t.note}</text>{/if}
    {/each}
  </svg>
  <p class="cone-note">
    {#if artHover !== null}{points.find((pt) => pt.lon === artHover)?.name ?? ''}{:else if hover}Lunation {hover.index}{#if hover.past} · before the timeline: its story comes from Holons{/if}{:else}drag to turn the spiral, up to lay it flat · tap a moon to open it{/if}
  </p>
  <button type="button" class="cone-spin" on:click={() => (spin = !spin)}>{spin ? 'pause' : 'turn'}</button>
</div>

<style>
  .cone {
    position: absolute;
    inset: 84px 0 90px;
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }

  .cone.dragging {
    cursor: grabbing;
  }

  /* the paintings fade out on their own: never cut off at the edge of the
     drawing, above the footer */
  svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .wash {
    opacity: 0.32;
  }

  .painting {
    cursor: default;
    transition: opacity 0.6s ease;
  }

  .side {
    mix-blend-mode: multiply;
    pointer-events: none;
  }

  .seg-wash {
    stroke-linecap: round;
    opacity: 0.32;
    mix-blend-mode: multiply;
  }

  .moon .blob {
    stroke: none;
    mix-blend-mode: multiply;
  }

  .moon .ink {
    fill: none;
  }

  .moon:hover .blob {
    filter: saturate(1.4);
  }

  .moon .ink.inner {
    opacity: 0.4;
  }

  .moon .when {
    font: 300 4.5px 'Outfit', system-ui, sans-serif;
    fill: var(--bark-700, #5a4632);
  }

  .moon.now .when {
    fill: var(--rust, #c4463c);
  }

  .turning-note {
    font: 300 10px 'Playpen Sans', 'Quicksand', sans-serif;
    fill: var(--bark-700, #5a4632);
    text-anchor: middle;
    paint-order: stroke;
    stroke: #fffdf8;
    stroke-width: 4px;
    pointer-events: none;
  }

  .turning {
    stroke: color-mix(in srgb, var(--bark-900) 22%, transparent);
    stroke-width: 1;
    stroke-dasharray: 3 5;
  }

  .turning-name {
    font: 300 13px 'Playpen Sans', 'Quicksand', sans-serif;
    fill: var(--bark-800, #4a3828);
    text-anchor: middle;
    paint-order: stroke;
    stroke: #fffdf8;
    stroke-width: 4px;
    pointer-events: none;
  }

  .seg {
    stroke: color-mix(in srgb, var(--bark-900) 70%, transparent);
    stroke-width: 2.4;
    stroke-linecap: round;
  }

  .seg.past {
    stroke: color-mix(in srgb, var(--bark-900) 30%, transparent);
    stroke-width: 1;
  }

  .past {
    fill: color-mix(in srgb, #fffdf8 70%, transparent);
    stroke: color-mix(in srgb, var(--bark-900) 35%, transparent);
    stroke-width: 0.6;
  }

  /* no browser box round a clicked moon; with the keyboard, its ring glows */
  .moon {
    cursor: pointer;
    outline: none;
  }

  .moon:focus-visible .ink:not(.inner) {
    stroke: var(--rust, #c4463c);
    stroke-width: 1.6;
  }

  .moon circle {
    stroke: none;
  }

  .moon .ink {
    stroke: color-mix(in srgb, var(--bark-900) 70%, transparent);
    stroke-width: 0.7;
  }

  .moon.now .ink:not(.inner) {
    stroke: var(--rust, #c4463c);
    stroke-width: 1.4;
  }

  .moon text {
    font: 300 11px 'Outfit', system-ui, sans-serif;
    fill: var(--bark-900);
    text-anchor: middle;
    pointer-events: none;
  }

  .cone-note {
    position: absolute;
    left: 50%;
    bottom: 6px;
    margin: 0;
    font: 300 12px 'Playpen Sans', 'Quicksand', sans-serif;
    color: var(--bark-700, #5a4632);
    transform: translateX(-50%);
    white-space: nowrap;
  }

  .cone-spin {
    position: absolute;
    right: 24px;
    bottom: 6px;
    padding: 2px 10px;
    border: 1px solid color-mix(in srgb, var(--bark-900) 25%, transparent);
    border-radius: 999px;
    background: none;
    color: var(--bark-800, #4a3828);
    font: 300 12px 'Playpen Sans', 'Quicksand', sans-serif;
    cursor: pointer;
  }
</style>

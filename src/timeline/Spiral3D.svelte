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
  export let quarters = []; // the seasons compass: [{ a0, a1, colour, name }]
  export let points = []; // the solstices and equinoxes: [{ a, name }]

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
  $: turnings = (yaw, pitch, scale, points.map((pt) => ({
    name: pt.name,
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
    } else if (spin && !drag && !hover) yaw += 0.0025;
    frame = requestAnimationFrame(loop);
  }
  onMount(() => (frame = requestAnimationFrame(loop)));
  onDestroy(() => cancelAnimationFrame(frame));

  function down(e) {
    opening = false;
    drag = { x: e.clientX, y: e.clientY, yaw, pitch };
  }
  function move(e) {
    if (!drag) return;
    yaw = drag.yaw + (e.clientX - drag.x) * 0.006;
    pitch = Math.max(0.05, Math.min(FLAT, drag.pitch + (e.clientY - drag.y) * 0.004));
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
    </defs>
    <!-- the sun's warmth round the cone's axis -->
    <ellipse cx={w / 2} cy={h / 2} rx={Math.min(w, h) * 0.42} ry={Math.min(w, h) * 0.46} fill="url(#cone-sun)" />
    {#each washes as q}<path class="wash" d={q.d} style="fill: {q.colour}" />{/each}
    {#each turnings as t}<line class="turning" x1={t.top.sx} y1={t.top.sy} x2={t.foot.sx} y2={t.foot.sy} />{/each}
    {#each segments as s}
      <line class="seg" class:past={s.a.past} x1={s.a.sx} y1={s.a.sy} x2={s.b.sx} y2={s.b.sy} style="stroke: {s.b.past ? '' : s.b.heat}; opacity: {Math.max(0.25, Math.min(1, 0.6 + (-s.depth / 400)))}" />
    {/each}
    {#each dots as p (p.index)}
      {#if p.past}
        <circle class="past" cx={p.sx} cy={p.sy} r={2.2 * p.k} on:mouseenter={() => (hover = p)} on:mouseleave={() => (hover = null)} />
      {:else}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <g class="moon" class:now={p.now} transform="translate({p.sx} {p.sy}) scale({p.k})" on:click|stopPropagation={() => onPick(p.i)} on:mouseenter={() => (hover = p)} on:mouseleave={() => (hover = null)} role="button" tabindex="-1" aria-label="Lunation {p.index}">
          <circle r="13" style="fill: color-mix(in srgb, {p.heat} 40%, #fffdf8)" />
          <text y="4">{p.index}</text>
        </g>
      {/if}
    {/each}
    {#each turnings as t}
      <text class="turning-name" x={t.label.sx} y={t.label.sy}>{t.name}</text>
    {/each}
  </svg>
  <p class="cone-note">
    {#if hover}Lunation {hover.index}{#if hover.past} · before the timeline: its story comes from Holons{/if}{:else}drag to turn the spiral, up to lay it flat · tap a moon to open it{/if}
  </p>
  <button type="button" class="cone-spin" on:click={() => (spin = !spin)}>{spin ? 'pause' : 'turn'}</button>
</div>

<style>
  .cone {
    position: absolute;
    inset: 84px 0 90px;
    cursor: grab;
    touch-action: none;
  }

  .cone.dragging {
    cursor: grabbing;
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  .wash {
    opacity: 0.32;
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

  .moon {
    cursor: pointer;
  }

  .moon circle {
    stroke: color-mix(in srgb, var(--bark-900) 55%, transparent);
    stroke-width: 0.8;
  }

  .moon.now circle {
    stroke: var(--rust, #c4463c);
    stroke-width: 2;
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

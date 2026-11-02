<script>
  // A lunation's picture, drawn like the site's pattern-language diagrams:
  // its season's colours as three overlapping soft circles, the cycle's days
  // as a fine ring with the moon's four phases on it (the new moon at the
  // top, then clockwise), a spiral opening out from the middle, and a cloud
  // of stipple at its heart, as in the pattern-language drawings. If the sun turns (a
  // solstice or an equinox) within it, a sun marks the day on the ring.

  export let l;
  export let size = 260;

  const C = 150;
  const R = 118;
  const DAY = 86400000;
  $: angleAt = (ms) => -90 + ((ms - l.start) / (l.end - l.start)) * 360;
  const pt = (a, r) => [C + r * Math.cos((a * Math.PI) / 180), C + r * Math.sin((a * Math.PI) / 180)];
  // the day the sun turns, if it does within this lunation
  $: turn = (l.sky?.sun ?? []).find((t) => /solstice|equinox/i.test(t));
  $: turnAngle = turn ? (() => {
    const m = /(\d{1,2}) (\w{3})/.exec(turn);
    if (!m) return null;
    const year = new Date(l.start).getFullYear();
    let d = new Date(`${m[1]} ${m[2]} ${year} 12:00`);
    if (d.getTime() < l.start) d = new Date(`${m[1]} ${m[2]} ${year + 1} 12:00`);
    return angleAt(d.getTime());
  })() : null;
  // a cloud of stipple at the heart, seeded by the lunation, so each differs
  $: heart = (() => {
    let k = l.index * 97;
    const r = () => ((k = (k * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: 60 }, () => {
      const a = r() * Math.PI * 2;
      const d = 34 * Math.sqrt(r());
      return { x: C + d * Math.cos(a), y: C + d * Math.sin(a), r: 0.6 + r() * 1.2 };
    });
  })();
  const spiral = Array.from({ length: 140 }, (_, i) => {
    const t = i / 139;
    const a = t * Math.PI * 2 * 3.2;
    const r = 8 + t * 92;
    return `${i ? 'L' : 'M'}${(C + r * Math.cos(a)).toFixed(1)} ${(C + r * Math.sin(a)).toFixed(1)}`;
  }).join('');
</script>

<svg class="art" viewBox="0 0 300 300" width={size} height={size} role="img" aria-label="Lunation {l.index}: {l.name}">
  <!-- the season's colours, overlapping softly -->
  <g class="wash">
    <circle cx="122" cy="128" r="84" style="fill: {l.tint.ember}" />
    <circle cx="178" cy="128" r="84" style="fill: {l.tint.rose}" />
    <circle cx="150" cy="176" r="84" style="fill: {l.tint.sprout}" />
  </g>
  <path class="spiral" d={spiral} />

  <!-- the cycle, and the moon's four phases on it -->
  <circle class="ring" cx={C} cy={C} r={R} />
  {#each l.quarters as q, k}
    {@const [x, y] = pt(angleAt(q.start), R)}
    <g transform="translate({x} {y})">
      <circle r="9" class="moon-dark" />
      {#if k === 1}<path d="M0 -9 A9 9 0 0 1 0 9Z" class="moon-lit" />{/if}
      {#if k === 2}<circle r="9" class="moon-lit" />{/if}
      {#if k === 3}<path d="M0 -9 A9 9 0 0 0 0 9Z" class="moon-lit" />{/if}
    </g>
  {/each}
  {#if turnAngle !== null}
    {@const [x, y] = pt(turnAngle, R + 22)}
    <g transform="translate({x} {y})" class="sun">
      <circle r="7" />
      {#each Array(8) as _, k}<path d="M{10 * Math.cos(k * Math.PI / 4)} {10 * Math.sin(k * Math.PI / 4)}L{14 * Math.cos(k * Math.PI / 4)} {14 * Math.sin(k * Math.PI / 4)}" />{/each}
    </g>
  {/if}

  <!-- at its heart, a little cloud of stipple, as in the pattern drawings -->
  {#each heart as d}<circle cx={d.x} cy={d.y} r={d.r} class="speck" />{/each}
</svg>

<style>
  .art {
    display: block;
    overflow: visible;
  }

  .wash circle {
    opacity: 0.75;
    mix-blend-mode: multiply;
  }

  .spiral {
    fill: none;
    stroke: color-mix(in srgb, var(--bark-900) 22%, transparent);
    stroke-width: 0.8;
  }

  .ring {
    fill: none;
    stroke: color-mix(in srgb, var(--bark-900) 55%, transparent);
    stroke-width: 0.8;
  }

  .moon-dark {
    fill: #fffaf0;
    stroke: var(--bark-900);
    stroke-width: 1;
  }

  .moon-lit {
    fill: #fff1b8;
    stroke: var(--bark-900);
    stroke-width: 1;
  }

  .sun circle {
    fill: #ffd98a;
    stroke: var(--bark-900);
    stroke-width: 1;
  }

  .sun path {
    stroke: var(--bark-900);
    stroke-width: 1.2;
    stroke-linecap: round;
  }

  .speck {
    fill: var(--bark-900);
    opacity: 0.7;
  }

  .ink path {
    fill: none;
    stroke: var(--bark-900);
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

</style>

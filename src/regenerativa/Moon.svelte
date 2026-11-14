<script>
  // The moon at a point in its cycle: phase 0 = new, 0.5 = full, 1 = new again.
  // Waxing light grows from the right, waning light shrinks to the left.
  export let phase = 0;
  export let size = 20;

  const r = 10;
  $: rx = Math.abs(Math.cos(phase * 2 * Math.PI)) * r;
  $: lit = phase < 0.5
    ? `M0,${-r} A${r},${r} 0 0 1 0,${r} A${rx},${r} 0 0 ${phase < 0.25 ? 0 : 1} 0,${-r}Z`
    : `M0,${-r} A${r},${r} 0 0 0 0,${r} A${rx},${r} 0 0 ${phase < 0.75 ? 0 : 1} 0,${-r}Z`;
</script>

<svg class="moon" width={size} height={size} viewBox="-11 -11 22 22" aria-hidden="true">
  <circle r={r} class="dark" />
  <path d={lit} class="lit" />
</svg>

<style>
  .moon { display: block; flex-shrink: 0; }
  .dark { fill: rgba(244, 239, 228, 0.12); stroke: rgba(244, 239, 228, 0.35); stroke-width: 0.6; }
  .lit { fill: #f3dcaa; }
</style>

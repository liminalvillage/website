<script>
  // A waxing moon, `lit` from 0 (new) to 1 (full): the lit right-hand half
  // plus a terminator ellipse that bulges right (crescent) or left (gibbous).
  let { lit = 0, size = 32 } = $props();
  const r = 10;
  const rx = $derived(Math.abs(1 - 2 * lit) * r);
  const sweep = $derived(lit > 0.5 ? 1 : 0);
</script>

<svg width={size} height={size} viewBox="-12 -12 24 24" aria-hidden="true">
  <circle r={r} class="dark" />
  {#if lit >= 1}
    <circle r={r} class="lit" />
  {:else if lit > 0}
    <path d="M0 {-r} A{r} {r} 0 0 1 0 {r} A{rx} {r} 0 0 {sweep} 0 {-r}Z" class="lit" />
  {/if}
</svg>

<style>
  svg { display: block; flex: none; filter: drop-shadow(0 1px 3px color-mix(in srgb, var(--accent-deep) 25%, transparent)); }
  .dark { fill: #2b2620; stroke: var(--accent); stroke-opacity: 0.35; stroke-width: 0.8; }
  .lit { fill: var(--moon-lit); }
  path, circle { transition: d 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
</style>

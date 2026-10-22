<script>
  // The kiosk's moon glyphs (apps/kiosk/src/lib/icons.ts): phase k of 8,
  // 0 = new, 4 = full — an outline with the lit part filled.
  export let k = 0;

  const CIRCLE = 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18Z';
  function lit(k) {
    if (k === 0) return '';
    if (k === 4) return CIRCLE;
    const r = 9;
    const rx = (Math.abs(Math.cos((Math.PI * k) / 4)) * r).toFixed(2);
    if (k < 4) return `M12 3A${r} ${r} 0 0 1 12 21A${rx} ${r} 0 0 ${k < 2 ? 0 : 1} 12 3Z`;
    return `M12 3A${r} ${r} 0 0 0 12 21A${rx} ${r} 0 0 ${k < 6 ? 0 : 1} 12 3Z`;
  }
  $: litPath = lit(k);
</script>

<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path d={CIRCLE} />
  {#if litPath}<path d={litPath} class="filled" />{/if}
</svg>

<style>
  .icon {
    width: 1em;
    height: 1em;
    flex: 0 0 auto;
    vertical-align: -0.125em;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linejoin: round;
    overflow: visible;
  }
  .filled {
    fill: currentColor;
    stroke: none;
  }
</style>

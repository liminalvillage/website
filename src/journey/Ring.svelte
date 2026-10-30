<script>
  // A circle's ring drawn as if by hand: a slightly uneven loop that closes
  // on itself (whole waves only, so start and end meet). The line stays one
  // screen pixel wide at any zoom (non-scaling stroke). Each ring has its
  // own seed, so no two are alike.
  export let seed = 1;

  let s = seed * 9301 + 49297;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const waves = [2, 3, 5].map((k) => ({ k, a: 0.25 + rand() * 0.35, p: rand() * Math.PI * 2 }));
  const start = rand() * Math.PI * 2;
  const sweep = Math.PI * 2;
  const N = 90;

  const d = Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N;
    const a = start + sweep * t;
    const r = 49 + waves.reduce((sum, w) => sum + w.a * Math.sin(w.k * a + w.p), 0) * 0.6;
    return `${i ? 'L' : 'M'}${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`;
  }).join('');
</script>

<svg class="ring" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
  <path {d} />
</svg>

<style>
  .ring {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
  }

  path {
    fill: none;
    stroke: rgba(255, 255, 255, calc(0.4 * var(--ring-a, 1)));
    stroke-width: 1;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }
</style>

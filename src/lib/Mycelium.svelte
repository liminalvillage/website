<script>
  // Faint mycelium in the background, grown as in the mycelium
  // pattern-language drawing (see hyphae.js), in ink: hyphae reaching in from
  // two corners of the screen with clouds of spores where they meet, fading
  // away before the middle, so they never sit under the words in any
  // strength. The same on every visit (a fixed seed).
  export let seed = 21;
  export let opacity = 0.22;

  import { hyphae } from './hyphae.js';
  // from the bottom left, growing up and in; from the top right, down and in
  let k = seed;
  const r = () => ((k = (k * 16807) % 2147483647) / 2147483647);
  const starts = [
    ...Array.from({ length: 6 }, () => [-30 + r() * 260, 1030, -Math.PI / 2 + 0.35 + (r() - 0.5) * 0.6, 1.6]),
    ...Array.from({ length: 5 }, () => [1380 + r() * 260, -30, Math.PI / 2 + 0.35 + (r() - 0.5) * 0.6, 1.6]),
  ];
  const { lines: threads, spores } = hyphae({ seed, starts, steps: 46 });
</script>

<svg class="mycelium" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" style="--o: {opacity}" aria-hidden="true">
  <defs>
    <radialGradient id="myc-bg-fade" cx="800" cy="500" r="760" gradientUnits="userSpaceOnUse">
      <stop offset="0.35" stop-color="#fff" stop-opacity="0" />
      <stop offset="0.85" stop-color="#fff" stop-opacity="1" />
    </radialGradient>
    <mask id="myc-bg-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000">
      <rect width="1600" height="1000" fill="url(#myc-bg-fade)" />
    </mask>
  </defs>
  <g mask="url(#myc-bg-mask)">
    {#each threads as t}<path d={t.d} style="stroke-width: {t.w * 0.6}" />{/each}
    {#each spores as sp}<circle cx={sp.x} cy={sp.y} r={sp.r} />{/each}
  </g>
</svg>

<style>
  .mycelium {
    position: fixed;
    inset: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    opacity: var(--o);
    pointer-events: none;
  }

  path {
    fill: none;
    stroke: var(--bark-900, #2a2219);
    stroke-linecap: round;
  }

  circle {
    fill: var(--bark-900, #2a2219);
  }

  @media print {
    .mycelium {
      display: none;
    }
  }
</style>

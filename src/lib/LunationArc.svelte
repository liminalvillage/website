<script>
  // A lunation as a moon flower: four overlapping petals for the phases
  // (Seed, Build, Celebrate, Harvest), ringed by one small moon per day, each
  // shaded to its phase. Lines are drawn with a slight hand-made wobble.
  import { onMount } from 'svelte';
  import { phase } from 'lune';

  const RING = 168; // radius of the ring of day moons in the 400×400 viewBox
  const DAYS = 29.53;
  const MOON_R = 12;
  const DAY_R = 4.6;
  const PETAL_R = 80;
  const PETAL_D = 58; // distance of each petal's centre from the middle

  const point = (deg, r) => {
    const a = (deg * Math.PI) / 180;
    return [200 + r * Math.sin(a), 200 - r * Math.cos(a)];
  };
  // Positions as % of the dial, for the HTML labels.
  const pos = (deg, r) => {
    const a = (deg * Math.PI) / 180;
    return `left:${(50 + (r / 4) * Math.sin(a)).toFixed(2)}%;top:${(50 - (r / 4) * Math.cos(a)).toFixed(2)}%`;
  };
  // The lit part of a moon of radius r at (cx, cy), for a phase from 0 (new)
  // through 0.5 (full) to 1
  const lit = (p, cx, cy, r) => {
    const top = `${cx.toFixed(2)} ${(cy - r).toFixed(2)}`;
    const bottom = `${cx.toFixed(2)} ${(cy + r).toFixed(2)}`;
    if (p < 0.02 || p > 0.98) return '';
    if (Math.abs(p - 0.5) < 0.02) return `M${top}A${r} ${r} 0 1 1 ${bottom}A${r} ${r} 0 1 1 ${top}Z`;
    const rx = (Math.abs(Math.cos(2 * Math.PI * p)) * r).toFixed(2);
    if (p < 0.5) return `M${top}A${r} ${r} 0 0 1 ${bottom}A${rx} ${r} 0 0 ${p < 0.25 ? 0 : 1} ${top}Z`;
    return `M${top}A${r} ${r} 0 0 0 ${bottom}A${rx} ${r} 0 0 ${p < 0.75 ? 0 : 1} ${top}Z`;
  };
  // A dotted spiral growing out from the middle ("upward spiralling")
  const spiral = (() => {
    let d = '';
    for (let t = 0; t <= 1; t += 0.004) {
      const [x, y] = point(t * 360 * 3, 14 + t * 136);
      d += `${d ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
  })();

  const MOONS = [
    { p: 0, name: 'New moon' },
    { p: 0.25, name: 'First quarter' },
    { p: 0.5, name: 'Full moon' },
    { p: 0.75, name: 'Last quarter' },
  ];

  const PHASES = [
    { name: 'Seed', from: 'New moon', to: 'first quarter', text: 'Arrive with the new moon. Meet the circle, set your personal, local and global intentions and agree your micro-agreements.' },
    { name: 'Build', from: 'First quarter', to: 'full moon', text: 'Co-create: take on quests and roles, start projects, gift the community a talk or a workshop.' },
    { name: 'Celebrate', from: 'Full moon', to: 'last quarter', text: 'Review together at the full moon: feedback circles, show what has been made, and celebrate it.' },
    { name: 'Harvest', from: 'Last quarter', to: 'new moon', text: 'Wrap up and document what you built, rest, and close the cycle so the next one can begin.' },
  ];

  const today = phase(new Date()).phase; // 0 = new, 0.5 = full
  const current = Math.floor(today * 4) % 4;
  const [todayX, todayY] = point(today * 360, RING);
  const onMoon = MOONS.some((m) => Math.abs(((today - m.p + 1.5) % 1) - 0.5) < 0.025);

  // Stippled "spore" clouds in each petal, as in the concept illustrations;
  // seeded so the dots stay put
  const seeded = (n) => {
    let a = n;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const stipple = PHASES.flatMap((_, i) => {
    const rnd = seeded(i + 7);
    const [cx, cy] = point(i * 90 + 45, PETAL_D + 34);
    return Array.from({ length: 46 }, () => {
      const a = rnd() * Math.PI * 2;
      const d = 34 * Math.sqrt(rnd());
      return { x: cx + d * Math.cos(a), y: cy + d * Math.sin(a), r: 0.5 + rnd() * 0.9, o: 0.3 + rnd() * 0.6, i };
    });
  });

  // Every day of the cycle, except where one of the four big moons sits
  const days = Array.from({ length: 30 }, (_, d) => d / DAYS)
    .filter((p) => p < 1 && MOONS.every((m) => Math.abs(((p - m.p + 1.5) % 1) - 0.5) > 0.03));

  // Bloom once the diagram scrolls into view; keep the lines still for
  // people who ask for less motion
  let figure;
  let shown = false;
  let boil = false;
  onMount(() => {
    boil = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          shown = true;
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(figure);
    return () => io.disconnect();
  });
</script>

<figure class="lunation-arc" class:shown bind:this={figure}>
  <div class="dial">
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <defs>
        <!-- A slight, slowly shifting wobble so lines read as drawn by hand -->
        <filter id="la-sketch" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="2">
            {#if boil}<animate attributeName="seed" values="2;5;8;11" dur="1.6s" calcMode="discrete" repeatCount="indefinite" />{/if}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="2.6" />
        </filter>
        <filter id="la-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <radialGradient id="la-glow">
          <stop offset="0" stop-color="var(--moon-lit)" stop-opacity="0.95" />
          <stop offset="1" stop-color="var(--moon-lit)" stop-opacity="0" />
        </radialGradient>
      </defs>

      <path d={spiral} class="spiral" />

      <g filter="url(#la-soft)">
        {#each PHASES as _, i}
          {@const [x, y] = point(i * 90 + 45, PETAL_D)}
          <circle cx={x} cy={y} r={PETAL_R * 0.8} class="petal petal-{i + 1}" class:now={i === current} style="--i: {i}" />
        {/each}
      </g>

      <g class="stipple">
        {#each stipple as d}
          <circle cx={d.x} cy={d.y} r={d.r} style="--i: {d.i}; --o: {d.o.toFixed(2)}" />
        {/each}
      </g>

      <g class="lines" filter="url(#la-sketch)">
        {#each PHASES as _, i}
          {@const [x, y] = point(i * 90 + 45, PETAL_D)}
          <circle cx={x} cy={y} r={PETAL_R} class="petal-line" style="--i: {i}" />
        {/each}
        <circle cx="200" cy="200" r={RING} class="ring" pathLength="1" />
        <circle cx="200" cy="200" r="46" class="heart-line" />
      </g>

      <circle cx="200" cy="200" r="58" fill="url(#la-glow)" class="heart" />

      {#each days as p, d}
        {@const [x, y] = point(p * 360, RING)}
        <g class="day" class:past={p <= today} style="--d: {d}">
          <circle cx={x} cy={y} r={DAY_R} class="moon-shadow" />
          {#if lit(p, x, y, DAY_R)}<path d={lit(p, x, y, DAY_R)} class="moon-lit" />{/if}
          <circle cx={x} cy={y} r={DAY_R} class="moon-rim" />
        </g>
      {/each}

      {#each MOONS as m, i}
        {@const [x, y] = point(m.p * 360, RING)}
        <g class="moon" style="--i: {i}">
          {#if m.p === 0.5}<circle cx={x} cy={y} r={MOON_R * 2.4} fill="url(#la-glow)" class="halo" />{/if}
          <circle cx={x} cy={y} r={MOON_R} class="moon-shadow" />
          {#if lit(m.p, x, y, MOON_R)}<path d={lit(m.p, x, y, MOON_R)} class="moon-lit" />{/if}
          <circle cx={x} cy={y} r={MOON_R} class="moon-rim" />
        </g>
      {/each}

      <circle cx={todayX} cy={todayY} r={onMoon ? MOON_R + 7 : DAY_R + 6} class="today-ripple" />
      <circle cx={todayX} cy={todayY} r={onMoon ? MOON_R + 4 : DAY_R + 3} class="today-ring" />
    </svg>

    {#each MOONS as m, i}
      <span class="moon-name" style={pos(i * 90, i % 2 ? 168 : 196)} class:side={i % 2 === 1}>{m.name}</span>
    {/each}

    {#each PHASES as p, i}
      <span class="phase-name" class:now={i === current} style={pos(i * 90 + 45, 92)}>{p.name}</span>
    {/each}

    <div class="center">
      <span class="big">1 lunation</span>
      <span class="small">≈ 29.5 days</span>
    </div>
  </div>

  <ol class="phases">
    {#each PHASES as p, i}
      <li class:now={i === current}>
        <span class="step">{i + 1}</span>
        <h3>{p.name}</h3>
        <p class="span">{p.from} → {p.to}</p>
        <p>{p.text}</p>
        {#if i === current}<span class="badge">We are here</span>{/if}
      </li>
    {/each}
  </ol>
  <figcaption><span class="dot"></span> where the moon is today</figcaption>
</figure>

<style>
  .lunation-arc {
    margin: 0 0 3rem;
    --line-soft: color-mix(in srgb, var(--ink) 16%, transparent);
    --line-strong: color-mix(in srgb, var(--ink) 55%, transparent);
  }

  .dial {
    position: relative;
    width: 100%;
    max-width: min(440px, calc(100% - 60px)); /* room for the side moons' names */
    aspect-ratio: 1;
    margin: 1.5rem auto 3.5rem;
  }

  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .spiral {
    fill: none;
    stroke: var(--line-soft);
    stroke-width: 0.8;
    stroke-dasharray: 0.5 6;
    stroke-linecap: round;
    transform-origin: 200px 200px;
    animation: turn 240s linear infinite;
  }

  /* Petals bloom open, then the current phase keeps breathing */
  .petal {
    mix-blend-mode: var(--orb-blend);
    transform-box: fill-box;
    transform-origin: center;
    transform: scale(0.35);
    opacity: 0;
    transition:
      transform 1.1s cubic-bezier(0.34, 1.4, 0.64, 1) calc(var(--i) * 0.18s),
      opacity 0.8s ease calc(var(--i) * 0.18s);
  }

  .petal-1 { fill: var(--tint-1); }
  .petal-2 { fill: var(--tint-2); }
  .petal-3 { fill: var(--tint-3); }
  .petal-4 { fill: var(--tint-4); }

  .shown .petal {
    transform: scale(1);
    opacity: 1;
  }

  .shown .petal.now {
    animation: breathe 6s ease-in-out 1.6s infinite;
  }

  .petal-line {
    fill: none;
    stroke: var(--line-strong);
    stroke-width: 1.1;
    opacity: 0;
    transition: opacity 1s ease calc(var(--i) * 0.18s + 0.4s);
  }

  .ring {
    fill: none;
    stroke: var(--line-soft);
    stroke-width: 1;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    transform: rotate(-90deg);
    transform-origin: 200px 200px;
    transition: stroke-dashoffset 2s cubic-bezier(0.65, 0, 0.35, 1) 0.3s;
  }

  .heart {
    opacity: 0.22;
  }

  .stipple circle {
    fill: var(--ink);
    opacity: 0;
    transition: opacity 0.8s ease calc(var(--i) * 0.18s + 0.9s);
  }

  .shown .stipple circle {
    opacity: var(--o, 0.6);
  }

  .heart-line {
    fill: none;
    stroke: var(--line-soft);
    stroke-width: 1;
  }

  .shown .petal-line {
    opacity: 1;
  }

  .shown .ring {
    stroke-dashoffset: 0;
  }

  /* The day moons appear one by one around the ring */
  .day {
    opacity: 0;
    transition: opacity 0.6s ease calc(var(--d) * 45ms + 0.9s);
  }

  .shown .day {
    opacity: 0.4;
  }

  .shown .day.past {
    opacity: 1;
  }

  .moon {
    opacity: 0;
    transition: opacity 0.9s ease calc(var(--i) * 0.2s + 0.5s);
  }

  .shown .moon {
    opacity: 1;
  }

  /* Moons drawn like the illustrations: a white outline and a white lit side */
  .moon-shadow {
    fill: color-mix(in srgb, var(--ink) 6%, transparent);
  }

  .moon-lit {
    fill: var(--ink);
    opacity: 0.9;
  }

  .moon-rim {
    fill: none;
    stroke: var(--line-strong);
    stroke-width: 0.8;
  }

  .halo {
    animation: breathe 6s ease-in-out infinite;
    transform-box: fill-box;
    transform-origin: center;
  }

  .today-ring {
    fill: none;
    stroke: var(--line-strong);
    stroke-width: 1;
    opacity: 0;
    transition: opacity 0.8s ease 2.4s;
  }

  .today-ripple {
    fill: none;
    stroke: var(--line-strong);
    stroke-width: 0.8;
    opacity: 0;
    transform-box: fill-box;
    transform-origin: center;
  }

  .shown .today-ring {
    opacity: 1;
  }

  .shown .today-ripple {
    animation: ripple 3.4s ease-out 2.6s infinite;
  }

  @keyframes turn {
    to { transform: rotate(360deg); }
  }

  @keyframes breathe {
    50% { transform: scale(1.05); }
  }

  @keyframes ripple {
    0% { transform: scale(0.6); opacity: 0.8; }
    100% { transform: scale(1.9); opacity: 0; }
  }

  .moon-name {
    position: absolute;
    transform: translate(-50%, -50%);
    font-size: 0.66rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
    white-space: nowrap;
  }

  /* The quarter moons' names sit just below their moons */
  .moon-name.side {
    transform: translate(-50%, 22px);
    max-width: 70px;
    white-space: normal;
    text-align: center;
    line-height: 1.3;
  }

  .phase-name {
    position: absolute;
    transform: translate(-50%, -50%);
    font-family: var(--font-heading);
    font-size: 1.1rem;
    font-weight: 300;
    color: var(--ink-soft);
    opacity: 0;
    transition: opacity 0.8s ease 1s, color 0.6s ease;
  }

  .shown .phase-name {
    opacity: 1;
  }

  .phase-name.now {
    color: var(--ink);
  }

  .center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.1rem;
    pointer-events: none;
  }

  .center .big {
    font-family: var(--font-heading);
    font-size: 1.05rem;
    font-weight: 300;
    color: var(--ink);
  }

  .center .small {
    font-size: 0.55rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
  }

  /* Wider than the text column so the four circles share one row */
  .phases {
    list-style: none;
    width: min(1040px, calc(100vw - 32px));
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.5rem 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .phases li {
    --size: min(244px, 86vw);
    position: relative;
    flex: none;
    width: var(--size);
    aspect-ratio: 1;
    border-radius: 50%;
    padding: 0 calc(var(--size) * 0.16);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 1px solid var(--orb-line);
    -webkit-mask-image: var(--orb-mask);
    mask-image: var(--orb-mask);
    mix-blend-mode: var(--orb-blend);
    animation: orb-drift 9s ease-in-out infinite;
    margin: -8px -14px;
  }

  .phases li:nth-child(4n + 1) {
    background:
      url(/images/concepts/stipple.svg) center / 80% no-repeat,
      radial-gradient(circle closest-side, var(--tint-1), transparent);
    animation-delay: -0s;
  }

  .phases li:nth-child(4n + 2) {
    background:
      url(/images/concepts/stipple.svg) center / 80% no-repeat,
      radial-gradient(circle closest-side, var(--tint-2), transparent);
    animation-delay: -2.25s;
  }

  .phases li:nth-child(4n + 3) {
    background:
      url(/images/concepts/stipple.svg) center / 80% no-repeat,
      radial-gradient(circle closest-side, var(--tint-3), transparent);
    animation-delay: -4.5s;
  }

  .phases li:nth-child(4n + 4) {
    background:
      url(/images/concepts/stipple.svg) center / 80% no-repeat,
      radial-gradient(circle closest-side, var(--tint-4), transparent);
    animation-delay: -6.75s;
  }

  /* A fine white ring, like the outlines in the concept illustrations */
  .phases li::after {
    content: '';
    position: absolute;
    inset: 7%;
    border-radius: 50%;
    border: 1px solid color-mix(in srgb, var(--ink) 40%, transparent);
    pointer-events: none;
  }

  .phases li.now::after {
    border-color: color-mix(in srgb, var(--ink) 75%, transparent);
  }

  .phases li.now {
    border-color: color-mix(in srgb, var(--ink) 50%, transparent);
  }

  .step {
    font-size: 0.7rem;
    letter-spacing: 2px;
    color: var(--muted);
  }

  .phases h3 {
    font-family: var(--font-heading);
    font-size: 1.4rem;
    font-weight: 300;
    color: var(--ink);
    margin: 0.1rem 0 0.2rem;
  }

  .phases p {
    font-size: 0.8rem;
    line-height: 1.5;
    margin: 0;
    text-align: center;
    color: var(--ink-soft);
  }

  .phases p.span {
    font-size: 0.7rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    color: var(--muted);
  }

  .badge {
    position: absolute;
    top: 13%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: 0.6rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--ink);
    border: 1px solid var(--line-strong);
    border-radius: 999px;
    padding: 2px 8px;
  }

  figcaption {
    margin-top: 1rem;
    font-size: 0.75rem;
    letter-spacing: 1px;
    color: var(--muted);
    text-align: center;
  }

  .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--ink);
    vertical-align: 0;
    margin-right: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .spiral,
    .phases li,
    .halo,
    .shown .petal.now,
    .shown .today-ripple {
      animation: none;
    }
  }

  @media (max-width: 480px) {
    .phases li + li {
      margin-top: -24px;
    }

    .moon-name {
      font-size: 0.58rem;
    }

    .phase-name {
      font-size: 0.9rem;
    }

    .center .big {
      font-size: 0.85rem;
    }

    .center .small {
      font-size: 0.48rem;
    }
  }
</style>

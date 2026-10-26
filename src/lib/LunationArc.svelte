<script>
  // The four phases of a lunation as one orbit: new moon → first quarter →
  // full moon → last quarter → new moon. A ring of day dots fills in up to
  // today, and a trail grows from the new moon to where the moon is now.
  import { onMount } from 'svelte';
  import { phase } from 'lune';

  const R = 150; // orbit radius in the 400×400 viewBox
  const GAP = 11; // degrees kept clear around each moon
  const DAYS = 30;
  const MOON_R = 15;

  const point = (deg, r = R) => {
    const a = (deg * Math.PI) / 180;
    return [200 + r * Math.sin(a), 200 - r * Math.cos(a)];
  };
  const arc = (from, to, r = R) => {
    const [x1, y1] = point(from, r);
    const [x2, y2] = point(to, r);
    const large = to - from > 180 ? 1 : 0;
    return `M${x1.toFixed(1)} ${y1.toFixed(1)}A${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  };
  // Positions as % of the dial, for the HTML labels.
  const pos = (deg, r = R) => {
    const a = (deg * Math.PI) / 180;
    return `left:${(50 + (r / 4) * Math.sin(a)).toFixed(2)}%;top:${(50 - (r / 4) * Math.cos(a)).toFixed(2)}%`;
  };
  // The lit part of a moon of radius r at (cx, cy), phase k of 8 (0 new, 4 full)
  const lit = (k, cx, cy, r) => {
    if (k === 0) return '';
    const top = `${cx} ${cy - r}`;
    const bottom = `${cx} ${cy + r}`;
    if (k === 4) return `M${top}A${r} ${r} 0 1 1 ${bottom}A${r} ${r} 0 1 1 ${top}Z`;
    const rx = (Math.abs(Math.cos((Math.PI * k) / 4)) * r).toFixed(2);
    if (k < 4) return `M${top}A${r} ${r} 0 0 1 ${bottom}A${rx} ${r} 0 0 ${k < 2 ? 0 : 1} ${top}Z`;
    return `M${top}A${r} ${r} 0 0 0 ${bottom}A${rx} ${r} 0 0 ${k < 6 ? 0 : 1} ${top}Z`;
  };

  const MOONS = [
    { k: 0, name: 'New moon' },
    { k: 2, name: 'First quarter' },
    { k: 4, name: 'Full moon' },
    { k: 6, name: 'Last quarter' },
  ];

  const PHASES = [
    { name: 'Seed', from: 'New moon', to: 'first quarter', text: 'Arrive with the new moon. Meet the circle, set your personal, local and global intentions and agree your micro-agreements.' },
    { name: 'Build', from: 'First quarter', to: 'full moon', text: 'Co-create: take on quests and roles, start projects, gift the community a talk or a workshop.' },
    { name: 'Celebrate', from: 'Full moon', to: 'last quarter', text: 'Review together at the full moon: feedback circles, show what has been made, and celebrate it.' },
    { name: 'Harvest', from: 'Last quarter', to: 'new moon', text: 'Wrap up and document what you built, rest, and close the cycle so the next one can begin.' },
  ];

  const today = phase(new Date()).phase; // 0 = new, 0.5 = full
  const current = Math.floor(today * 4) % 4;
  const todayDeg = today * 360;
  // When today falls on one of the four moons, ripple around that moon instead
  const onMoon = MOONS.findIndex((_, i) => Math.abs(((todayDeg - i * 90 + 540) % 360) - 180) < 8);
  const [dotX, dotY] = onMoon >= 0 ? point(onMoon * 90) : point(todayDeg);

  // Draw the orbit in once the diagram scrolls into view
  let figure;
  let shown = false;
  onMount(() => {
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
        <radialGradient id="la-glow">
          <stop offset="0" stop-color="var(--moon-lit)" stop-opacity="0.9" />
          <stop offset="1" stop-color="var(--moon-lit)" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- A slow, faint outer ring that keeps the dial breathing -->
      <circle cx="200" cy="200" r="188" class="drift-ring" />

      <!-- One dot per day; the days already lived fill in -->
      {#each Array(DAYS) as _, d}
        {@const [x, y] = point((d / DAYS) * 360 + 6, 172)}
        <circle cx={x} cy={y} r="1.6" class="day" class:past={d / DAYS <= today} style="--d: {d}" />
      {/each}

      {#each PHASES as _, i}
        <path d={arc(i * 90 + GAP, i * 90 + 90 - GAP)} class="orbit" pathLength="1" style="--i: {i}" />
      {/each}

      <path d={arc(GAP, Math.max(todayDeg, GAP + 1))} class="trail" pathLength="1" />

      {#each MOONS as m, i}
        {@const [x, y] = point(i * 90)}
        <g class="moon" style="--i: {i}">
          {#if m.k === 4}<circle cx={x} cy={y} r={MOON_R * 2.2} fill="url(#la-glow)" class="halo" />{/if}
          <circle cx={x} cy={y} r={MOON_R} class="moon-shadow" />
          {#if lit(m.k, x, y, MOON_R)}<path d={lit(m.k, x, y, MOON_R)} class="moon-lit" />{/if}
          <circle cx={x} cy={y} r={MOON_R} class="moon-rim" />
        </g>
      {/each}

      <circle cx={dotX} cy={dotY} r={onMoon >= 0 ? MOON_R + 8 : 14} class="today-ripple" />
      {#if onMoon < 0}<circle cx={dotX} cy={dotY} r="5" class="today" />{/if}
    </svg>

    {#each MOONS as m, i}
      <span class="moon-name" style={pos(i * 90, 196)} class:side={i % 2 === 1}>{m.name}</span>
    {/each}

    {#each PHASES as p, i}
      <span class="phase-name" class:now={i === current} style={pos(i * 90 + 45, 96)}>{p.name}</span>
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
    --line-soft: color-mix(in srgb, var(--ink) 14%, transparent);
    --line-strong: color-mix(in srgb, var(--ink) 55%, transparent);
  }

  .dial {
    position: relative;
    width: 100%;
    max-width: min(420px, calc(100% - 60px)); /* room for the side moons' names */
    aspect-ratio: 1;
    margin: 1rem auto 3rem;
  }

  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .drift-ring {
    fill: none;
    stroke: var(--line-soft);
    stroke-width: 0.75;
    stroke-dasharray: 1 7;
    stroke-linecap: round;
    transform-origin: 200px 200px;
    animation: turn 120s linear infinite;
  }

  .day {
    fill: var(--line-soft);
    opacity: 0;
    transition: opacity 0.6s ease calc(var(--d) * 35ms + 0.6s);
  }

  .day.past {
    fill: var(--line-strong);
  }

  .orbit {
    fill: none;
    stroke: var(--line-soft);
    stroke-width: 1.25;
    stroke-linecap: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    transition: stroke-dashoffset 1.4s cubic-bezier(0.65, 0, 0.35, 1) calc(var(--i) * 0.25s);
  }

  .trail {
    fill: none;
    stroke: var(--line-strong);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    transition: stroke-dashoffset 2.2s cubic-bezier(0.65, 0, 0.35, 1) 1.2s;
  }

  .moon {
    opacity: 0;
    transform-box: fill-box;
    transform-origin: center;
    transition: opacity 0.9s ease calc(var(--i) * 0.25s + 0.2s);
    animation: float 7s ease-in-out infinite;
    animation-delay: calc(var(--i) * -1.75s);
  }

  .moon-shadow {
    fill: var(--moon-shadow);
  }

  .moon-lit {
    fill: var(--moon-lit);
  }

  .moon-rim {
    fill: none;
    stroke: var(--line-soft);
    stroke-width: 1;
  }

  .halo {
    animation: breathe 6s ease-in-out infinite;
    transform-box: fill-box;
    transform-origin: center;
  }

  .today {
    fill: var(--ink);
    opacity: 0;
    transition: opacity 0.6s ease 3.2s;
  }

  .today-ripple {
    fill: none;
    stroke: var(--line-strong);
    stroke-width: 1;
    opacity: 0;
    transform-box: fill-box;
    transform-origin: center;
  }

  .shown .day,
  .shown .moon {
    opacity: 1;
  }

  .shown .orbit,
  .shown .trail {
    stroke-dashoffset: 0;
  }

  .shown .today {
    opacity: 1;
  }

  .shown .today-ripple {
    animation: ripple 3.2s ease-out 3.4s infinite;
  }

  @keyframes turn {
    to { transform: rotate(360deg); }
  }

  @keyframes float {
    50% { transform: translateY(-3px); }
  }

  @keyframes breathe {
    50% { transform: scale(1.12); opacity: 0.7; }
  }

  @keyframes ripple {
    0% { transform: scale(0.4); opacity: 0.8; }
    100% { transform: scale(1.8); opacity: 0; }
  }

  .moon-name {
    position: absolute;
    transform: translate(-50%, -50%);
    font-size: 0.68rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
    white-space: nowrap;
  }

  .moon-name.side {
    max-width: 70px;
    white-space: normal;
    text-align: center;
    line-height: 1.3;
  }

  .phase-name {
    position: absolute;
    transform: translate(-50%, -50%);
    font-family: var(--font-heading);
    font-size: 1.15rem;
    font-weight: 300;
    color: var(--muted);
    transition: color 0.6s ease;
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
    gap: 0.25rem;
    pointer-events: none;
  }

  .center .big {
    font-family: var(--font-heading);
    font-size: 1.7rem;
    font-weight: 200;
    color: var(--ink);
  }

  .center .small {
    font-size: 0.72rem;
    letter-spacing: 2px;
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
    mix-blend-mode: var(--orb-blend);
    animation: orb-drift 9s ease-in-out infinite;
    margin: -8px -14px;
  }

  .phases li:nth-child(4n + 1) {
    background: var(--tint-1);
    animation-delay: -0s;
  }

  .phases li:nth-child(4n + 2) {
    background: var(--tint-2);
    animation-delay: -2.25s;
  }

  .phases li:nth-child(4n + 3) {
    background: var(--tint-3);
    animation-delay: -4.5s;
  }

  .phases li:nth-child(4n + 4) {
    background: var(--tint-4);
    animation-delay: -6.75s;
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
    .drift-ring,
    .phases li,
    .moon,
    .halo,
    .shown .today-ripple {
      animation: none;
    }
  }


  @media (max-width: 480px) {
    .phases li + li {
      margin-top: -24px;
    }

    .moon-name {
      font-size: 0.6rem;
    }

    .phase-name {
      font-size: 1rem;
    }

    .center .big {
      font-size: 1.35rem;
    }
  }
</style>

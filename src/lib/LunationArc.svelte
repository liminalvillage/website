<script>
  // The four phases of a lunation as one arc: new moon → first quarter →
  // full moon → last quarter → new moon, with a dot where the moon is today.
  import { phase } from 'lune';
  import MoonIcon from '../calendar/MoonIcon.svelte';

  const R = 150; // ring radius in the 400×400 viewBox
  const GAP = 13; // degrees kept clear around each moon

  const point = (deg) => {
    const a = (deg * Math.PI) / 180;
    return [200 + R * Math.sin(a), 200 - R * Math.cos(a)];
  };
  const arc = (from, to) => {
    const [x1, y1] = point(from);
    const [x2, y2] = point(to);
    return `M${x1.toFixed(1)} ${y1.toFixed(1)}A${R} ${R} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  };
  // Positions as % of the dial, for the HTML moons and labels.
  const pos = (deg, r = R) => {
    const a = (deg * Math.PI) / 180;
    return `left:${(50 + (r / 4) * Math.sin(a)).toFixed(2)}%;top:${(50 - (r / 4) * Math.cos(a)).toFixed(2)}%`;
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
  const [dotX, dotY] = point(today * 360);
</script>

<figure class="lunation-arc">
  <div class="dial">
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <defs>
        <marker id="la-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10Z" fill="var(--primary-color)" />
        </marker>
      </defs>
      <circle cx="200" cy="200" r={R} class="track" />
      {#each PHASES as _, i}
        <path d={arc(i * 90 + GAP, i * 90 + 90 - GAP)} class="seg" class:now={i === current} marker-end="url(#la-head)" />
      {/each}
      <circle cx={dotX} cy={dotY} r="7" class="today" />
    </svg>

    {#each MOONS as m, i}
      <div class="moon" style={pos(i * 90)}>
        <span class="glyph"><MoonIcon k={m.k} /></span>
        <span class="moon-name">{m.name}</span>
      </div>
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
  }

  .dial {
    position: relative;
    width: 100%;
    max-width: min(380px, calc(100% - 60px)); /* room for the side moons' names */
    aspect-ratio: 1;
    margin: 0 auto 2.5rem;
  }

  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .track {
    fill: none;
    stroke: rgba(214, 161, 91, 0.15);
    stroke-width: 2;
  }

  .seg {
    fill: none;
    stroke: var(--primary-color);
    stroke-width: 3;
    stroke-linecap: round;
    opacity: 0.55;
  }

  .seg.now {
    stroke-width: 5;
    opacity: 1;
  }

  .today {
    fill: #fff;
    stroke: var(--primary-color);
    stroke-width: 3;
    animation: pulse 2.4s ease-in-out infinite;
  }

  @keyframes pulse {
    50% { stroke-width: 6; }
  }

  .moon {
    position: absolute;
    transform: translate(-50%, -22px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .glyph {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #222;
    color: #f3e3c3;
    font-size: 26px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  }

  .moon-name {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #222;
    white-space: nowrap;
  }

  .phase-name {
    position: absolute;
    transform: translate(-50%, -50%);
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.3rem;
    font-style: italic;
    color: #8a8274;
  }

  .phase-name.now {
    color: var(--primary-color);
    font-weight: 600;
  }

  .center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .center .big {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.6rem;
    color: #222;
  }

  .center .small {
    font-size: 0.75rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #8a8274;
  }

  .phases {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }

  .phases li {
    position: relative;
    background: #fff;
    border: 1px solid rgba(214, 161, 91, 0.25);
    border-radius: 12px;
    padding: 1.25rem 1.1rem;
  }

  .phases li.now {
    border-color: var(--primary-color);
    box-shadow: 0 6px 24px rgba(214, 161, 91, 0.18);
  }

  .step {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 2px;
    color: var(--primary-color);
  }

  .phases h3 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 500;
    color: #222;
    margin: 0.1rem 0 0.2rem;
  }

  .phases p {
    font-size: 0.85rem;
    line-height: 1.6;
    margin: 0;
    text-align: left;
  }

  .phases p.span {
    font-size: 0.7rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 0.6rem;
  }

  .badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #222;
    background: var(--primary-color);
    border-radius: 999px;
    padding: 3px 8px;
  }

  figcaption {
    margin-top: 1rem;
    font-size: 0.75rem;
    letter-spacing: 1px;
    color: #8a8274;
    text-align: center;
  }

  .dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid var(--primary-color);
    background: #fff;
    vertical-align: -1px;
  }

  @media (max-width: 900px) {
    .phases {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 480px) {
    .phases {
      grid-template-columns: minmax(0, 1fr);
    }

    .glyph {
      width: 36px;
      height: 36px;
      font-size: 21px;
    }

    .moon {
      transform: translate(-50%, -18px);
    }

    .moon-name {
      max-width: 64px;
      white-space: normal;
      text-align: center;
      line-height: 1.3;
      font-size: 0.62rem;
    }

    .phase-name {
      font-size: 1.1rem;
    }

    .center .big {
      font-size: 1.3rem;
    }
  }
</style>

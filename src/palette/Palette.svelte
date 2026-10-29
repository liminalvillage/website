<script>
  // /palette: the autumn colour system, in the spirit of foresight.org/demo:
  // every colour has a role, a ramp, and a rule for when to use it. Values are
  // read from the shared variables (src/theme/tokens.css), so this page never
  // drifts from what the site uses.
  import { onMount } from 'svelte';

  const STEPS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

  const CORE = [
    {
      key: 'rust',
      role: 'Primary',
      name: 'Rust',
      use: 'Action and emphasis: buttons, links, the active item, focus rings.',
      how: '600 for link text and button fills (with oat-100 text on top). 500 only for large marks. 100–300 for quiet highlighted fills.',
    },
    {
      key: 'olive',
      role: 'Secondary',
      name: 'Olive',
      use: 'Support: tags, secondary buttons, quiet coloured labels.',
      how: '700 for text and outlines (600 is too light to read), 100–200 for tag fills. Never in the same component as a rust button.',
    },
    {
      key: 'oat',
      role: 'Background',
      name: 'Oat',
      use: 'Pages and surfaces.',
      how: '100 is the page. 200–300 for raised areas and a change of section. 400 and up only for borders and illustration, never behind text.',
    },
    {
      key: 'bark',
      role: 'Neutral',
      name: 'Bark',
      use: 'Text and lines.',
      how: '900 for headings and body text, 600–700 for secondary text, 200–300 for hairlines.',
    },
  ];

  // One colour per lunation phase, like Foresight's colour per focus area
  const PHASES = [
    { key: 'sprout', phase: 'Seed', span: 'New moon → first quarter', id: 'seed', use: 'Beginnings: arriving, intentions, onboarding and applying.' },
    { key: 'ember', phase: 'Build', span: 'First quarter → full moon', id: 'build', use: 'Making: quests, roles, projects, talks and workshops.' },
    { key: 'rosehip', phase: 'Celebrate', span: 'Full moon → last quarter', id: 'celebrate', use: 'Gathering: events, feedback circles, showcases.' },
    { key: 'chestnut', phase: 'Harvest', span: 'Last quarter → new moon', id: 'harvest', use: 'Closing: documentation, media, reflection and rest.' },
  ];

  // Text-on-background pairs, checked live against WCAG 2.2
  const PAIRS = [
    ['bark-900', 'oat-100', 'Headings and body text'],
    ['bark-600', 'oat-100', 'Secondary text'],
    ['rust-600', 'oat-100', 'Links'],
    ['oat-100', 'rust-600', 'Primary button label'],
    ['olive-700', 'oat-100', 'Tags and secondary labels'],
    ['sprout-700', 'oat-100', 'Seed text'],
    ['ember-700', 'oat-100', 'Build text'],
    ['rosehip-700', 'oat-100', 'Celebrate text'],
    ['chestnut-700', 'oat-100', 'Harvest text'],
    ['bark-900', 'sprout-300', 'Text inside a Seed circle'],
    ['bark-900', 'ember-300', 'Text inside a Build circle'],
    ['ember-500', 'oat-100', 'Phase 500 as text: decoration only'],
  ];

  let hex = {};
  let pairs = [];

  const channel = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const luminance = (h) => {
    const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(h.slice(i, i + 2), 16)));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => {
    const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };

  onMount(() => {
    const css = getComputedStyle(document.documentElement);
    const read = {};
    for (const k of [...CORE, ...PHASES].map((c) => c.key)) {
      for (const s of STEPS) read[`${k}-${s}`] = css.getPropertyValue(`--${k}-${s}`).trim();
    }
    hex = read;
    pairs = PAIRS.map(([fg, bg, label]) => {
      const r = ratio(read[fg], read[bg]);
      return { fg, bg, label, r, grade: r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'Large only' : 'Fails' };
    });
  });
</script>

<main class="palette">
  <header class="intro">
    <p class="eyebrow">Design system · Colour</p>
    <h1>An autumn palette</h1>
    <p>
      Warm, earthy colours for a village that lives by the moon. Every colour has one job:
      use it for that job, and the site stays calm and easy to read.
    </p>
  </header>

  <section>
    <h2>Core colours</h2>
    <p class="lede">Four roles carry every page. Each ramp runs from 100 (lightest) to 900 (darkest); 500 is the base.</p>
    {#each CORE as c}
      <article class="row">
        <div class="meta">
          <p class="role">{c.role}</p>
          <h3>{c.name}</h3>
          <p class="use">{c.use}</p>
          <p class="how">{c.how}</p>
        </div>
        <div class="ramp">
          {#each STEPS as s}
            <div class="swatch" class:dark={s >= 600} style="background: var(--{c.key}-{s})">
              <span class="step">{s}</span>
              <code>{hex[`${c.key}-${s}`] ?? ''}</code>
            </div>
          {/each}
        </div>
        <code class="token">--{c.key}-100 … --{c.key}-900</code>
      </article>
    {/each}
  </section>

  <section>
    <h2>Cycle colours</h2>
    <p class="lede">
      One colour for each phase of a lunation. Content takes the colour of the phase it belongs to,
      the way each focus area keeps one colour on foresight.org.
    </p>
    {#each PHASES as p, i}
      <article class="row phase">
        <div class="meta">
          <p class="role">{i + 1} · {p.phase} · {p.span}</p>
          <h3>{p.key[0].toUpperCase() + p.key.slice(1)}</h3>
          <p class="use">{p.use}</p>
          <p class="how">300 for circle fills, 500 for illustration and dividers, 700 for coloured text.</p>
        </div>
        <div class="ramp">
          {#each STEPS as s}
            <div class="swatch" class:dark={s >= 600} style="background: var(--{p.key}-{s})">
              <span class="step">{s}</span>
              <code>{hex[`${p.key}-${s}`] ?? ''}</code>
            </div>
          {/each}
        </div>
        <div class="extras">
          {#each [1, 2, 3] as g}
            <figure class="gradient" style="background: var(--gradient-{p.id}-{g})">
              <figcaption>gradient-{p.id}-{g}</figcaption>
            </figure>
          {/each}
          <figure class="orb-demo" style="background: color-mix(in srgb, var(--{p.key}-300) 75%, transparent)">
            <figcaption>circle · {p.key}-300</figcaption>
          </figure>
          <figure class="rule-demo">
            <hr style="border-color: var(--{p.key}-500)" />
            <figcaption>divider · {p.key}-500</figcaption>
          </figure>
        </div>
      </article>
    {/each}
  </section>

  <section>
    <h2>Readable pairs</h2>
    <p class="lede">Contrast is measured live from the variables. Body text needs AA (4.5:1); AAA (7:1) is better.</p>
    <div class="pairs">
      {#each pairs as p}
        <div class="pair" style="background: var(--{p.bg}); color: var(--{p.fg})">
          <span class="sample">Aa</span>
          <span class="label">{p.label}</span>
          <code>{p.fg} on {p.bg}</code>
          <span class="grade" class:bad={p.r < 4.5}>{p.r.toFixed(1)}:1 · {p.grade}</span>
        </div>
      {/each}
    </div>
  </section>

  <section class="rules">
    <h2>Rules of thumb</h2>
    <ul>
      <li><strong>One action colour.</strong> Rust is the only colour that means "press this". Don't make phase colours look clickable.</li>
      <li><strong>One phase per section.</strong> A section takes the colour of its phase; don't mix two phase colours in one block.</li>
      <li><strong>Phase 500 is never text.</strong> It's for circles, gradients and lines. Use the 700 step for coloured words.</li>
      <li><strong>Light pages.</strong> Oat 100 is the page. Dark bark is for text, not for full-width bands.</li>
      <li><strong>Not in this palette:</strong> gold, purple and mint.</li>
    </ul>
  </section>
</main>

<style>
  .palette {
    --ink: var(--bark-900);
    max-width: 1120px;
    margin: 0 auto;
    padding: 2rem 24px 8rem;
    font-family: 'Quicksand', system-ui, sans-serif;
    color: var(--bark-900);
  }

  :global(body) {
    background: var(--oat-100);
  }

  h1,
  h2,
  h3 {
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 300;
    letter-spacing: 0.01em;
    text-transform: none;
    color: var(--bark-900);
  }

  h1 {
    font-size: clamp(2.4rem, 5vw, 3.6rem);
    margin: 0.4rem 0 1rem;
  }

  h2 {
    font-size: 1.9rem;
    margin: 4.5rem 0 0.5rem;
  }

  h3 {
    font-size: 1.5rem;
    margin: 0.2rem 0 0.4rem;
  }

  .intro p:last-child,
  .lede {
    max-width: 62ch;
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--bark-700);
  }

  .lede {
    margin-bottom: 2rem;
  }

  .eyebrow,
  .role {
    font-size: 0.72rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--bark-600);
  }

  .row {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 1rem 2rem;
    padding: 1.75rem 0;
    border-top: 1px solid var(--bark-200);
  }

  .use {
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .how {
    margin-top: 0.5rem;
    font-size: 0.85rem;
    line-height: 1.6;
    color: var(--bark-600);
  }

  .ramp {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    border-radius: 12px;
    overflow: hidden;
    align-self: start;
  }

  .swatch {
    aspect-ratio: 3 / 4;
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: var(--bark-900);
    font-size: 0.72rem;
  }

  .swatch.dark {
    color: var(--oat-100);
  }

  .swatch code {
    font-size: 0.62rem;
    opacity: 0.85;
  }

  .token {
    grid-column: 2;
    font-size: 0.75rem;
    color: var(--bark-600);
  }

  .extras {
    grid-column: 2;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
  }

  figure {
    margin: 0;
  }

  .gradient {
    height: 90px;
    border-radius: 12px;
    display: flex;
    align-items: flex-end;
    padding: 8px;
  }

  .orb-demo {
    aspect-ratio: 1;
    max-height: 90px;
    border-radius: 50%;
    border: 1px solid color-mix(in srgb, var(--bark-900) 12%, transparent);
    display: grid;
    place-items: center;
    justify-self: center;
    text-align: center;
  }

  .rule-demo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
  }

  .rule-demo hr {
    border: 0;
    border-top: 2px solid;
  }

  figcaption {
    font-size: 0.68rem;
    color: var(--bark-800);
  }

  .pairs {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
  }

  .pair {
    border-radius: 12px;
    padding: 16px;
    display: grid;
    gap: 4px;
    border: 1px solid color-mix(in srgb, var(--bark-900) 8%, transparent);
  }

  .sample {
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 2rem;
    font-weight: 300;
  }

  .pair .label {
    font-size: 0.95rem;
  }

  .pair code {
    font-size: 0.7rem;
    opacity: 0.85;
  }

  .grade {
    justify-self: start;
    margin-top: 4px;
    padding: 2px 10px;
    border-radius: 999px;
    border: 1px solid currentColor;
    font-size: 0.72rem;
  }

  .grade.bad {
    border-style: dashed;
  }

  .rules ul {
    max-width: 70ch;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.8rem;
    line-height: 1.6;
  }

  .rules strong {
    font-weight: 600;
  }

  @media (max-width: 860px) {
    .row {
      grid-template-columns: 1fr;
    }

    .token,
    .extras {
      grid-column: 1;
    }

    .extras {
      grid-template-columns: repeat(3, 1fr);
    }

    .swatch code {
      display: none;
    }
  }
</style>

<script>
  const pillars = [
    {
      n: '01',
      title: 'Personal',
      text: 'Set your own goals for your stay. Outgrow your old self, find your ikigai, learn something new, write your book or your talk.',
    },
    {
      n: '02',
      title: 'Local',
      text: 'Do something for the people and the place around you: teach what you know, build, make art, regenerate the land.',
    },
    {
      n: '03',
      title: 'Global',
      text: 'Pick a cause that matters to you in the world, learn about it, and find ways to help.',
    },
  ];
</script>

<section id="about" class="section">
  <div class="wrap">
    <div class="intro">
      <div>
        <p class="eyebrow">About</p>
        <h2 class="display">A place of transition</h2>
      </div>
      <div>
        <p class="lead">
          <em>Liminal</em> means a threshold, a place that occupies both sides. Since 2019 we have been gathering
          temporary communities of value-aligned people to heal themselves and the collective, and to co-create
          the future they want to see, inspired by a Resource-Based Economy and
          <a href="https://www.gameb.wiki/index.php?title=Game_B" target="_blank" rel="noopener">Game B</a>.
        </p>
        <p class="muted">
          We use natural cycles to guide progress and experiment with “upgrading the operating system of
          society”: moving from scarcity-based markets towards access abundance.
        </p>
        <a class="more" href="/dna">Why we exist and how we live together: our DNA →</a>
      </div>
    </div>

    <h3 class="sub">Every visitor works on three levels</h3>
    <ol class="pillars">
      {#each pillars as p}
        <li>
          <span class="n">{p.n}</span>
          <h4 class="display">{p.title}</h4>
          <p>{p.text}</p>
        </li>
      {/each}
    </ol>

    <figure class="guides">
      <blockquote class="display">
        “Honor the wisdom of the past, question the assumptions of the present, and embody the
        possibilities of the future.”
      </blockquote>
      <figcaption>
        Our Council of Guides, from Ostrom, Fuller and Meadows to Watts, Macy and Kimmerer. No gurus: even
        our guides are there to be challenged. <a class="more" href="/dna#lineage">Meet the guides →</a>
      </figcaption>
    </figure>
  </div>
</section>

<style>
  .intro {
    display: grid;
    grid-template-columns: 5fr 7fr;
    gap: 48px;
    align-items: start;
  }
  .intro .lead a { color: var(--gold-dark); border-bottom: 1px solid currentColor; }
  .intro .muted { margin: 18px 0 26px; }

  .sub {
    margin: 88px 0 24px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--muted);
  }
  .pillars {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-top: 1px solid var(--line);
  }
  .pillars li { padding: 28px 32px 8px 0; }
  .pillars li + li { padding-left: 32px; border-left: 1px solid var(--line); }
  .n { font-size: 12px; font-weight: 600; letter-spacing: 2px; color: var(--gold-dark); }
  .pillars h4 { font-size: 32px; margin: 8px 0 10px; }
  .pillars p { font-size: 15px; color: var(--muted); }

  .guides {
    margin-top: 96px;
    padding: 48px 56px;
    border-radius: var(--radius);
    background: var(--gold-soft);
    text-align: center;
  }
  .guides blockquote { font-size: clamp(24px, 3vw, 32px); font-style: italic; line-height: 1.3; max-width: 820px; margin: 0 auto; }
  .guides figcaption { margin: 20px auto 0; max-width: 640px; font-size: 15px; color: var(--text); }
  .guides .more { margin-left: 4px; }

  @media (max-width: 860px) {
    .intro { grid-template-columns: 1fr; gap: 20px; }
    .pillars { grid-template-columns: 1fr; }
    .pillars li, .pillars li + li { padding: 22px 0; border-left: 0; }
    .pillars li + li { border-top: 1px solid var(--line); }
    .sub { margin-top: 64px; }
    .guides { margin-top: 64px; padding: 32px 22px; }
  }
</style>

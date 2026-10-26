<section id="about" class="about">
  <div class="container">
    <div class="section-heading">
      <h2>About</h2>
    </div>
    <div class="section-content">
      <p>
        Liminal Village is a co-living and co-creation eco-tech hub in the center of Italy.
        We have been experimenting with forming and weaving temporary communities aimed at
        creating value for the world, heal themselves and heal the collective, by emphasising
        the balance of personal, local and global regeneration. Inspired by the concept of a
        Resource-Based Economy, Liminal, meaning "a place of transition" or "a place that
        occupies both sides", is an embodied experimental ground where value-aligned people
        come together to co-create and experience the future they would like to see (eg:
        <a href="https://www.gameb.wiki/index.php?title=Game_B" target="_blank" rel="noopener">Game B</a>).
        Using natural cycles to guide progress, we focus on reinventing how we can live in
        harmony with each other and the planet, by "upgrading the operating system of society"
        and transitioning from scarcity based market economies to "access abundance".
      </p>
      <div class="dna">
        <p class="dna-text">Why we exist, what we value and how we live together is all in</p>
        <a class="dna-btn" href="/dna">our DNA →</a>
      </div>
      <p class="lead"><strong>Visitors of the Liminal Village are invited to focus on these three aspects:</strong></p>
    </div>
  </div>
</section>

<style>
  .about {
    width: 100%;
    padding: 6rem 0 3rem;
    background: var(--paper);
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .section-heading {
    text-align: center;
    margin-bottom: 3rem;
  }

  .section-heading h2 {
    font-size: 1.6rem;
    font-weight: 300;
    letter-spacing: 4px;
    color: var(--ink);
    text-transform: uppercase;
  }

  .section-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  p {
    font-size: 1rem;
    line-height: 1.75;
    color: var(--muted);
    max-width: 62ch;
    margin: 0 auto 1.5rem;
    text-align: left;
  }

  /* The DNA invitation: its own block, set on faint concentric rings */
  .dna {
    --size: min(440px, 90vw);
    width: var(--size);
    aspect-ratio: 1;
    margin: 3.5rem auto 0;
    padding: 0 calc(var(--size) * 0.16);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--orb-line);
    background:
      repeating-radial-gradient(circle at 50% 50%, transparent 0 22px, color-mix(in srgb, var(--ink) 6%, transparent) 22px 23px),
      var(--tint-1);
    text-align: center;
    animation: orb-drift 9s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .dna {
      animation: none;
    }
  }

  .dna-text {
    max-width: 26ch;
    margin: 0 auto 1.75rem;
    text-align: center;
    font-family: var(--font-heading);
    font-size: clamp(1.2rem, 2.2vw, 1.55rem);
    font-weight: var(--heading-weight, 300);
    line-height: 1.4;
    color: var(--ink);
  }

  .dna-btn {
    display: inline-block;
    padding: 12px 28px;
    border: 1px solid var(--ink);
    border-radius: 999px;
    background: var(--surface);
    color: var(--ink);
    font-size: 0.85rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: background 0.35s ease, color 0.35s ease;
  }

  .dna-btn:hover {
    background: var(--ink);
    color: var(--bar-solid); /* the page colour, solid, in every vibe */
  }

  /* Reads as the title of the Personal / Local / Global cards below */
  .lead {
    max-width: 24ch;
    margin: 4.5rem auto 0;
    text-align: center;
    font-family: var(--font-heading);
    font-size: clamp(1.45rem, 2.6vw, 2rem);
    font-weight: var(--heading-weight, 300);
    letter-spacing: var(--heading-tracking, 0);
    line-height: 1.3;
    color: var(--ink);
  }

  .lead strong {
    font-weight: inherit;
    color: inherit;
  }

  a {
    color: var(--accent);
    text-decoration: none;
    transition: color 0.3s;
  }

  a:hover {
    color: var(--accent-deep);
  }

  @media (max-width: 768px) {
    .about {
      padding: 4rem 0 2rem;
    }

    .section-heading h2 {
      font-size: 1.3rem;
    }
  }
</style>

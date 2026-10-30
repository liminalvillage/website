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
      <p class="lead"><strong>Visitors and members of the Liminal Village are invited to focus on our transition to Game B on 3 levels</strong></p>
    </div>
  </div>
</section>

<style>
  .about {
    width: 100%;
    padding: 6rem 0 3rem;
    background: transparent;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Editorial section head: a generated number, then a large left-aligned
     title above a hairline-separated section */
  .section-heading {
    display: grid;
    grid-template-columns: 3.5rem 1fr;
    align-items: baseline;
    text-align: left;
    margin-bottom: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid color-mix(in srgb, var(--ink) 12%, transparent);
  }

  .section-heading::before {
    counter-increment: section;
    content: counter(section, decimal-leading-zero);
    grid-row: 1 / span 2;
    font-size: 0.75rem;
    letter-spacing: 2px;
    color: var(--muted);
  }

  .section-heading > :global(*) {
    grid-column: 2;
  }

  .section-heading h2 {
    font-size: clamp(2.4rem, 4.6vw, 4rem);
    font-weight: var(--heading-weight, 300);
    letter-spacing: -0.01em;
    line-height: 1.05;
    color: var(--ink);
    text-transform: none;
  }

  .section-content {
    text-align: left;
  }

  p {
    font-size: 1rem;
    line-height: 1.75;
    color: var(--muted);
    max-width: 62ch;
    /* An offset column: text starts a third of the way in */
    margin: 0 0 1.5rem max(0px, min(33.333%, calc(100% - 62ch)));
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
    -webkit-mask-image: var(--orb-mask);
    mask-image: var(--orb-mask);
    /* The mycelium illustration glows softly inside, the doorway to /dna */
    background:
      repeating-radial-gradient(circle at 50% 50%, transparent 0 22px, color-mix(in srgb, var(--ink) 6%, transparent) 22px 23px),
      radial-gradient(circle closest-side, rgba(10, 8, 6, 0.62) 35%, rgba(10, 8, 6, 0.15)),
      url('/images/concepts/mycelium-networks.svg') center / cover,
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
      font-size: 2.2rem;
    }
  }
</style>

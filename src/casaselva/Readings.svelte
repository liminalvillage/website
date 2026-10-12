<script>
  // PDFs live in public/media/ and are shared with liminalvillage.com/media
  const readings = [
    {
      title: 'The Weight of Invisible Regulation: Trauma and Emotional Labour in Regenerative Culture',
      authors: 'Laura van Wijngaarden',
      source: 'Communities Magazine #212 · Trauma and Healing · Fall 2026',
      excerpt:
        'A candid account of a season at Liminal Village when the labour of regulating a trauma‑activated community fell on the most attuned people in the room — and the realisation that no outer system stays healthy when the inner lives shaping it go unaddressed. With a companion piece by Jillian Hovey on trauma literacy in intentional community.',
      href: '/media/the-weight-of-invisible-regulation-communities-212.pdf',
    },
    {
      title: 'Perspectives from a Tech‑Driven Community: Code, Care, and Regeneration',
      authors: 'Jillian Hovey, Roberto Valenti, Simon Quarmby & Laura van Wijngaarden',
      source: 'Communities Magazine #209 · CommunITy or DystopAIa? · Winter 2025',
      excerpt:
        'Four voices on building an eco‑tech hub as an intentional community: lunations as a shared rhythm, the inner work the Integral framework asks of us, and how technology can serve life rather than enslave it.',
      href: '/media/code-care-and-regeneration-communities-209.pdf',
    },
  ];
</script>

<section id="cs-readings" class="readings">
  <div class="container">
    <div class="section-heading">
      <p class="eyebrow">Readings</p>
      <h2>Words from the field</h2>
    </div>

    <div class="lead">
      <p>
        Reflections on inner work, care and community life, written by the people who steward Casa Selva and Liminal Village.
      </p>
    </div>

    <div class="cards">
      {#each readings as r}
        <article class="card">
          <p class="source">{r.source}</p>
          <h3>{r.title}</h3>
          <p class="authors">{r.authors}</p>
          <p class="excerpt">{r.excerpt}</p>
          <div class="actions">
            <a class="btn" href={r.href} target="_blank" rel="noopener">
              <i class="fas fa-book-open"></i> Read
            </a>
            <a class="btn ghost" href={r.href} download>
              <i class="fas fa-download"></i> PDF
            </a>
          </div>
        </article>
      {/each}
    </div>

    <p class="more">
      More articles, talks and videos on
      <a href="https://liminalvillage.com/media" target="_blank" rel="noopener">liminalvillage.com/media</a>
    </p>
  </div>
</section>

<style>
  .readings {
    padding: 7rem 0;
    background: var(--cs-cream);
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .section-heading {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .eyebrow {
    color: var(--cs-terracotta);
    font-size: 0.75rem;
    letter-spacing: 5px;
    text-transform: uppercase;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  .section-heading h2 {
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 400;
    font-style: italic;
    color: var(--cs-bark);
  }

  .lead {
    max-width: 720px;
    margin: 0 auto 3.5rem;
    text-align: center;
  }

  .lead p {
    font-size: 1.02rem;
    line-height: 1.9;
    color: var(--cs-text);
  }

  .cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .card {
    background: #fff;
    border: 1px solid var(--cs-line);
    border-radius: 4px;
    padding: 2.5rem 2.25rem;
    display: flex;
    flex-direction: column;
    transition: all 0.35s ease;
  }

  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(59, 66, 54, 0.08);
    border-color: var(--cs-forest);
  }

  .source {
    font-size: 0.72rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--cs-terracotta);
    margin-bottom: 1rem;
  }

  .card h3 {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.55rem;
    font-weight: 500;
    color: var(--cs-bark);
    line-height: 1.25;
    margin-bottom: 0.5rem;
  }

  .authors {
    font-size: 0.85rem;
    color: var(--cs-muted);
    margin-bottom: 1.25rem;
  }

  .excerpt {
    font-size: 0.95rem;
    line-height: 1.8;
    color: var(--cs-text);
    flex: 1;
    margin-bottom: 1.75rem;
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 1.4rem;
    border: 1px solid var(--cs-forest);
    border-radius: 2px;
    background: var(--cs-forest);
    color: #fff;
    font-size: 0.75rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .btn:hover {
    background: var(--cs-bark);
    border-color: var(--cs-bark);
  }

  .btn.ghost {
    background: transparent;
    color: var(--cs-forest);
  }

  .btn.ghost:hover {
    background: rgba(74, 107, 74, 0.08);
    color: var(--cs-forest);
  }

  .more {
    text-align: center;
    margin-top: 3rem;
    font-family: "Cormorant Garamond", serif;
    font-size: 1.15rem;
    font-style: italic;
    color: var(--cs-muted);
  }

  .more a {
    color: var(--cs-forest);
    text-decoration: none;
    border-bottom: 1px solid var(--cs-line);
  }

  .more a:hover {
    color: var(--cs-terracotta);
    border-color: var(--cs-terracotta);
  }

  @media (max-width: 860px) {
    .cards {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .readings { padding: 5rem 0; }
    .card { padding: 2rem 1.5rem; }
  }
</style>

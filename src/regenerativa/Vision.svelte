<section id="rg-vision" class="vision">
  <div class="container">
    <div class="section-heading">
      <p class="eyebrow">Vision</p>
      <h2>The world doesn't need more <em>extraction</em>.<br/>It needs <em>regeneration</em>.</h2>
    </div>

    <div class="lead">
      <p>
        Our economic systems deplete soil, fracture communities, and concentrate wealth. ReGenerativa offers a different path: open-source tools, living laboratories, and a coordination framework where every participant becomes a steward of ecological and social renewal.
      </p>
    </div>

    <div class="pillars">
      <div class="pillar">
        <div class="pillar-icon" aria-hidden="true">🌱</div>
        <h3>Ecological</h3>
        <p>Regenerating soil, water, and biodiversity through every project.</p>
      </div>
      <div class="pillar">
        <div class="pillar-icon" aria-hidden="true">🤝</div>
        <h3>Social</h3>
        <p>Building communities where cooperation replaces competition.</p>
      </div>
      <div class="pillar">
        <div class="pillar-icon" aria-hidden="true">⚙️</div>
        <h3>Systemic</h3>
        <p>Open frameworks that anyone can adopt and adapt locally.</p>
      </div>
    </div>
  </div>
</section>

<style>
  .vision {
    padding: 8rem 0 6rem;
    background: var(--rg-cream-soft);
    position: relative;
    overflow: hidden;
  }

  .container {
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 1;
  }

  .section-heading {
    text-align: center;
    margin-bottom: 3rem;
  }

  .eyebrow {
    color: var(--rg-gold);
    font-size: 0.75rem;
    letter-spacing: 5px;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .section-heading h2 {
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 400;
    color: var(--rg-bark);
    line-height: 1.25;
  }

  .section-heading h2 em {
    color: var(--rg-forest);
    font-style: italic;
    font-weight: 500;
  }

  .lead {
    max-width: 760px;
    margin: 0 auto 4.5rem;
    text-align: center;
  }

  .lead p {
    font-size: 1.05rem;
    line-height: 1.95;
    color: var(--rg-text);
  }

  .pillars {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 2rem;
  }

  .pillar {
    text-align: center;
    padding: 2.5rem 1.75rem;
    background: var(--rg-cream);
    border: 1px solid var(--rg-line);
    border-radius: 8px;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }

  .pillar:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(44, 53, 39, 0.08);
  }

  .pillar-icon {
    font-size: 2.4rem;
    margin-bottom: 0.75rem;
    line-height: 1;
  }

  .pillar h3 {
    font-size: 1.4rem;
    color: var(--rg-forest-dark);
    margin-bottom: 0.6rem;
    letter-spacing: 1.5px;
  }

  .pillar p {
    color: var(--rg-muted);
    font-size: 0.95rem;
    line-height: 1.7;
  }

  @media (max-width: 768px) {
    .vision { padding: 5rem 0 4rem; }
    .pillars { grid-template-columns: 1fr; gap: 1.25rem; }
  }
</style>

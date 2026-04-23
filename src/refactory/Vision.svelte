<section id="rf-vision" class="vision">
  <div class="container">
    <div class="section-heading">
      <p class="eyebrow">Vision</p>
      <h2>Where collaboration meets symbiosis</h2>
    </div>

    <div class="lead display">
      <p>
        A thriving ecosystem where collaboration meets symbiosis. This co-creation space
        brings together diverse minds and initiatives to forge new partnerships, innovative
        solutions, and regenerative practices.
      </p>
      <p>
        Here, third-sector entities and changemakers unite to create synergistic
        relationships that benefit both community and environment.
      </p>
    </div>

    <div class="three">
      <div class="card">
        <div class="card-icon"><i class="fas fa-hammer"></i></div>
        <h3>Co-Creation &amp; Making</h3>
        <p>
          Collaborative maker space with shared tools and resources — where ideas become
          prototypes and prototypes become enterprise.
        </p>
      </div>

      <div class="card">
        <div class="card-icon"><i class="fas fa-users"></i></div>
        <h3>Co-Living Community</h3>
        <p>
          Shared living spaces fostering deep collaboration, where daily rhythms create
          the ground for lasting partnerships.
        </p>
      </div>

      <div class="card">
        <div class="card-icon"><i class="fas fa-handshake"></i></div>
        <h3>Community-Owned Initiatives</h3>
        <p>
          Third-sector entities and community-driven projects supported by a shared
          infrastructure and a network of peers.
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  .vision {
    padding: 8rem 0 6rem;
    background: var(--rf-cream-soft);
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .section-heading {
    text-align: center;
    margin-bottom: 3.5rem;
  }

  .eyebrow {
    color: var(--rf-brick);
    font-size: 0.72rem;
    letter-spacing: 5px;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .section-heading h2 {
    font-size: clamp(1.6rem, 3.2vw, 2.3rem);
    font-weight: 700;
    color: var(--rf-dark);
    letter-spacing: 2px;
  }

  .lead {
    max-width: 760px;
    margin: 0 auto 4rem;
    text-align: center;
  }

  .lead p {
    font-size: 1.2rem;
    line-height: 1.75;
    color: var(--rf-text);
    margin-bottom: 1.25rem;
    font-style: italic;
  }

  .three {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .card {
    background: #fff;
    border: 1px solid var(--rf-line);
    padding: 2.5rem 2rem;
    text-align: left;
    transition: all 0.3s ease;
    border-top: 3px solid var(--rf-brick);
  }

  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(45, 41, 37, 0.08);
  }

  .card-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(180, 89, 59, 0.1);
    color: var(--rf-brick);
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
  }

  .card h3 {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--rf-dark);
    margin-bottom: 0.75rem;
    letter-spacing: 1.5px;
  }

  .card p {
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--rf-muted);
  }

  @media (max-width: 900px) {
    .three { grid-template-columns: 1fr; gap: 1.25rem; }
    .vision { padding: 5rem 0 4rem; }
  }
</style>

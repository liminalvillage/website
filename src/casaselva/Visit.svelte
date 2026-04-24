<section id="cs-visit" class="visit">
  <div class="inner">
    <div class="container">
      <p class="eyebrow">Visit</p>
      <h2>Slow down. Reconnect. Reorient.</h2>
      <p class="lead">
        In a time when many feel the old systems no longer serve life, Casa Selva offers space
        to pause, reflect, and find new ways of living — with ourselves, with each other, and
        with the land.
      </p>

      <div class="cards">
        <div class="card">
          <div class="card-icon"><i class="fas fa-mountain"></i></div>
          <h4>Where</h4>
          <p>
            Mountains near <strong>Ascoli Piceno</strong>, central Italy — around 500&nbsp;m
            altitude, surrounded by forest and water.
          </p>
        </div>

        <div class="card">
          <div class="card-icon"><i class="fas fa-envelope-open-text"></i></div>
          <h4>Stays, residencies & gatherings</h4>
          <p>
            Get in touch to learn about upcoming retreats, residency programmes, and ways to
            contribute to the life of the place.
          </p>
          <a href="mailto:info@liminalvillage.com" class="card-link">
            info@liminalvillage.com <i class="fas fa-arrow-right"></i>
          </a>
        </div>

        <div class="card">
          <div class="card-icon"><i class="fas fa-hands-helping"></i></div>
          <h4>Contribute</h4>
          <p>
            Participation means engaging fully — sharing daily tasks, financial support for
            infrastructure and land stewardship, and presence in the life of the community.
          </p>
        </div>
      </div>

      <div class="cta">
        <a href="mailto:info@liminalvillage.com?subject=Visit%20Casa%20Selva" class="btn">Reach out</a>
      </div>
    </div>
  </div>
</section>

<style>
  .visit {
    position: relative;
    padding: 0;
    background: var(--cs-bark);
    color: #fff;
    background-image:
      linear-gradient(135deg, rgba(59, 66, 54, 0.9), rgba(74, 107, 74, 0.85)),
      url('/images/casaselva/5.jpeg');
    background-size: cover;
    background-position: center;
  }

  .inner {
    padding: 7rem 0;
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem;
    text-align: center;
  }

  .eyebrow {
    color: var(--cs-terracotta-soft);
    font-size: 0.75rem;
    letter-spacing: 5px;
    text-transform: uppercase;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  .container h2 {
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 400;
    font-style: italic;
    color: #fff;
    margin-bottom: 1.25rem;
  }

  .lead {
    max-width: 700px;
    margin: 0 auto 3.5rem;
    font-size: 1.05rem;
    line-height: 1.9;
    color: rgba(246, 241, 231, 0.9);
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .card {
    background: rgba(251, 248, 241, 0.06);
    border: 1px solid rgba(246, 241, 231, 0.15);
    border-radius: 4px;
    padding: 2rem 1.75rem;
    text-align: left;
    backdrop-filter: blur(4px);
    transition: all 0.3s ease;
  }

  .card:hover {
    background: rgba(251, 248, 241, 0.1);
    border-color: var(--cs-terracotta-soft);
    transform: translateY(-3px);
  }

  .card-icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(214, 156, 122, 0.2);
    color: var(--cs-terracotta-soft);
    margin-bottom: 1rem;
  }

  .card h4 {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.35rem;
    font-weight: 500;
    color: #fff;
    margin-bottom: 0.75rem;
  }

  .card p {
    font-size: 0.92rem;
    line-height: 1.75;
    color: rgba(246, 241, 231, 0.85);
  }

  .card strong {
    color: #fff;
    font-weight: 500;
  }

  .card-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    color: var(--cs-terracotta-soft);
    font-size: 0.85rem;
    letter-spacing: 1px;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .card-link:hover {
    color: #fff;
  }

  .card-link i {
    font-size: 0.75rem;
    transition: transform 0.3s ease;
  }

  .card-link:hover i {
    transform: translateX(3px);
  }

  .cta {
    margin-top: 1rem;
  }

  .btn {
    display: inline-block;
    padding: 16px 44px;
    background: var(--cs-terracotta);
    color: #fff;
    font-size: 0.8rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 500;
    text-decoration: none;
    border: 1.5px solid var(--cs-terracotta);
    transition: all 0.4s ease;
  }

  .btn:hover {
    background: transparent;
    color: #fff;
    transform: translateY(-2px);
  }

  @media (max-width: 860px) {
    .cards {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .inner { padding: 5rem 0; }
  }
</style>

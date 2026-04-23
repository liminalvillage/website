<section id="rf-visit" class="visit">
  <div class="inner">
    <div class="container">
      <p class="eyebrow">Join</p>
      <h2>Join the collaborative revolution</h2>
      <p class="lead display">
        ReFactory is more than a place — it's a movement where diverse minds unite to
        forge symbiotic relationships and sustainable futures. Your unique contribution
        can spark new collaborations.
      </p>

      <div class="cards">
        <div class="card">
          <div class="card-icon"><i class="fas fa-map-pin"></i></div>
          <h4>Where</h4>
          <p>
            <strong>Marche region · Italy</strong> — 10 minutes from the historic centre
            of Ascoli Piceno, 3 hectares of land and 6&thinsp;000&thinsp;m³ of buildings.
          </p>
        </div>

        <div class="card">
          <div class="card-icon"><i class="fas fa-compass"></i></div>
          <h4>Quests &amp; projects</h4>
          <p>
            Browse the live quest portal for open collaborations, prototypes looking for
            hands, and funded initiatives needing partners.
          </p>
          <a href="/quests.html" class="card-link">
            Open quest portal <i class="fas fa-arrow-right"></i>
          </a>
        </div>

        <div class="card">
          <div class="card-icon"><i class="fas fa-envelope-open-text"></i></div>
          <h4>Get in touch</h4>
          <p>
            Bring a project, join a residency, host an event, or offer your skills. We
            build the calendar together.
          </p>
          <a href="mailto:hello@refactory.earth" class="card-link">
            hello@refactory.earth <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>

      <div class="cta">
        <a href="mailto:hello@refactory.earth?subject=Join%20ReFactory" class="btn">Join now</a>
      </div>
    </div>
  </div>
</section>

<style>
  .visit {
    position: relative;
    padding: 0;
    color: #fff;
    background-image:
      linear-gradient(135deg, rgba(45, 41, 37, 0.88), rgba(143, 65, 40, 0.75)),
      url('/images/refactory/14.jpeg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
  }

  .inner { padding: 7rem 0; }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem;
    text-align: center;
  }

  .eyebrow {
    color: var(--rf-brass-soft);
    font-size: 0.72rem;
    letter-spacing: 5px;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .container h2 {
    font-size: clamp(1.8rem, 3.5vw, 2.6rem);
    font-weight: 700;
    color: #fff;
    margin-bottom: 1.25rem;
    letter-spacing: 1.5px;
  }

  .lead {
    max-width: 700px;
    margin: 0 auto 3.5rem;
    font-size: 1.15rem;
    font-style: italic;
    line-height: 1.75;
    color: rgba(245, 239, 230, 0.9);
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .card {
    background: rgba(250, 245, 236, 0.06);
    border: 1px solid rgba(245, 239, 230, 0.15);
    padding: 2rem 1.75rem;
    text-align: left;
    backdrop-filter: blur(4px);
    transition: all 0.3s ease;
  }

  .card:hover {
    background: rgba(250, 245, 236, 0.1);
    border-color: var(--rf-brass-soft);
    transform: translateY(-3px);
  }

  .card-icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(212, 160, 85, 0.2);
    color: var(--rf-brass-soft);
    margin-bottom: 1rem;
  }

  .card h4 {
    font-size: 0.9rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.75rem;
    letter-spacing: 1.5px;
  }

  .card p {
    font-size: 0.92rem;
    line-height: 1.75;
    color: rgba(245, 239, 230, 0.85);
  }

  .card strong {
    color: #fff;
    font-weight: 600;
  }

  .card-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    color: var(--rf-brass-soft);
    font-size: 0.78rem;
    letter-spacing: 2px;
    font-weight: 600;
    text-decoration: none;
    text-transform: uppercase;
    transition: color 0.3s ease;
  }

  .card-link:hover { color: #fff; }
  .card-link i { font-size: 0.75rem; transition: transform 0.3s ease; }
  .card-link:hover i { transform: translateX(3px); }

  .btn {
    display: inline-block;
    padding: 16px 44px;
    background: var(--rf-brick);
    color: #fff;
    font-size: 0.78rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 700;
    text-decoration: none;
    border: 1.5px solid var(--rf-brick);
    transition: all 0.4s ease;
  }

  .btn:hover {
    background: transparent;
    color: #fff;
    transform: translateY(-2px);
  }

  @media (max-width: 900px) {
    .cards { grid-template-columns: 1fr; }
    .visit { background-attachment: scroll; }
  }

  @media (max-width: 768px) {
    .inner { padding: 5rem 0; }
  }
</style>

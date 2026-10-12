<section id="rg-participate" class="participate">
  <div class="container">
    <div class="bootstrap">
      <div class="bootstrap-text">
        <p class="eyebrow">Replicate the model</p>
        <h2>Bootstrap a Node</h2>
        <p class="lead">
          Everything we build is open-source. Start a regenerative node in your bioregion using our frameworks, technology stack, and coordination protocols.
        </p>
        <div class="actions">
          <a class="btn btn-primary" href="mailto:hello@regenerativa.earth?subject=Bootstrap%20a%20node">Start a Node</a>
          <a class="btn btn-ghost" href="/quests.html">Explore Quests</a>
        </div>
      </div>
      <div class="bootstrap-image" style="background-image: url('/images/regenerativa/aerial-green.jpg')" aria-hidden="true"></div>
    </div>

    <div class="events">
      <div class="section-heading">
        <p class="eyebrow">Upcoming events</p>
        <h2>Gatherings aligned with natural cycles</h2>
      </div>
      <div class="event-grid">
        <div class="event">
          <p class="event-when">Monthly</p>
          <h3>Next Lunation</h3>
          <p>Our monthly co-creation rhythm: planning, building, and celebrating regenerative projects together.</p>
        </div>
        <div class="event">
          <p class="event-when">Seasonal</p>
          <h3>Equinox &amp; Solstice</h3>
          <p>Seasonal gatherings to celebrate harvests, mark transitions, and renew shared intentions.</p>
        </div>
      </div>
    </div>

    <div class="cta">
      <h2>Ready to regenerate?</h2>
      <p>Whether you want to visit, contribute skills, or start a node in your bioregion — there's a place for you in this network.</p>
      <div class="actions">
        <a class="btn btn-primary" href="mailto:hello@regenerativa.earth?subject=Join%20the%20movement">Join the Movement</a>
        <a class="btn btn-ghost" href="#rg-sites">Plan a Visit</a>
      </div>
    </div>
  </div>
</section>

<style>
  .participate {
    padding: 7rem 0 6rem;
    background: var(--rg-cream-soft);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .bootstrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
    margin-bottom: 7rem;
  }

  .bootstrap-text .eyebrow,
  .events .eyebrow {
    color: var(--rg-gold);
    font-size: 0.75rem;
    letter-spacing: 5px;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .bootstrap-text h2,
  .events h2,
  .cta h2 {
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    color: var(--rg-bark);
    margin-bottom: 1.25rem;
    font-style: italic;
    font-weight: 400;
  }

  .bootstrap-text .lead {
    color: var(--rg-text);
    font-size: 1.05rem;
    line-height: 1.85;
    margin-bottom: 2rem;
    max-width: 540px;
  }

  .bootstrap-image {
    width: 100%;
    aspect-ratio: 4 / 3;
    background-size: cover;
    background-position: center;
    border-radius: 10px;
    box-shadow: 0 12px 40px rgba(44, 53, 39, 0.12);
  }

  .actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-block;
    padding: 13px 32px;
    font-size: 0.78rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
    border: 1.5px solid;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn-primary {
    background: var(--rg-forest);
    color: #fff;
    border-color: var(--rg-forest);
  }

  .btn-primary:hover {
    background: var(--rg-forest-dark);
    border-color: var(--rg-forest-dark);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(44, 74, 49, 0.25);
  }

  .btn-ghost {
    background: transparent;
    color: var(--rg-forest-dark);
    border-color: var(--rg-forest);
  }

  .btn-ghost:hover {
    background: rgba(63, 106, 69, 0.08);
    transform: translateY(-2px);
  }

  .events {
    margin-bottom: 6rem;
  }

  .section-heading {
    text-align: center;
    margin-bottom: 3rem;
  }

  .event-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .event {
    padding: 2.25rem 2rem;
    background: var(--rg-cream);
    border-left: 3px solid var(--rg-gold);
    border-radius: 4px;
  }

  .event-when {
    color: var(--rg-gold);
    font-size: 0.7rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .event h3 {
    font-size: 1.4rem;
    color: var(--rg-forest-dark);
    margin-bottom: 0.6rem;
    letter-spacing: 1px;
  }

  .event p {
    color: var(--rg-muted);
    font-size: 0.95rem;
    line-height: 1.7;
  }

  .cta {
    text-align: center;
    padding: 4rem 2rem;
    background: linear-gradient(135deg, var(--rg-forest) 0%, var(--rg-forest-dark) 100%);
    border-radius: 12px;
    color: #fff;
  }

  .cta h2 {
    color: #fff;
    margin-bottom: 1rem;
  }

  .cta p {
    color: rgba(255, 255, 255, 0.92);
    max-width: 620px;
    margin: 0 auto 2rem;
    font-size: 1.05rem;
  }

  .cta .actions {
    justify-content: center;
  }

  .cta .btn-primary {
    background: var(--rg-gold);
    border-color: var(--rg-gold);
    color: var(--rg-bark);
  }

  .cta .btn-primary:hover {
    background: var(--rg-gold-soft);
    border-color: var(--rg-gold-soft);
  }

  .cta .btn-ghost {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.6);
  }

  .cta .btn-ghost:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: #fff;
  }

  @media (max-width: 900px) {
    .bootstrap { grid-template-columns: 1fr; gap: 2rem; }
    .bootstrap-image { aspect-ratio: 16 / 9; }
    .event-grid { grid-template-columns: 1fr; gap: 1.25rem; }
    .participate { padding: 5rem 0 4rem; }
  }
</style>

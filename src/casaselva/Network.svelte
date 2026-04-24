<section id="cs-network" class="network">
  <div class="container">
    <div class="section-heading">
      <p class="eyebrow">Network</p>
      <h2>Part of a mycelial ecosystem</h2>
    </div>

    <div class="lead">
      <p>
        Casa Selva is closely connected to <a href="https://liminalvillage.com" target="_blank" rel="noopener">Liminal Village</a>
        and other local and international projects, forming part of a wider mycelial network of
        regenerative hubs. Together, they create a balanced network where inner and outer
        transformation support each other.
      </p>
    </div>

    <div class="polarity">
      <div class="pole pole-inner">
        <div class="pole-icon"><i class="fas fa-circle-notch"></i></div>
        <h3>Casa Selva</h3>
        <p class="pole-sub">Inner transformation</p>
        <ul>
          <li>Emotional intelligence & relational depth</li>
          <li>Stewardship of the land</li>
          <li>Rhythm, healing, rest</li>
        </ul>
      </div>

      <div class="bridge">
        <span>⟷</span>
        <p>Complementary polarity</p>
      </div>

      <div class="pole pole-outer">
        <div class="pole-icon"><i class="fas fa-cogs"></i></div>
        <h3>Liminal Village</h3>
        <p class="pole-sub">Outer innovation</p>
        <ul>
          <li>Open-source eco-tech</li>
          <li>Systems & tools for coordination</li>
          <li>Global collaboration</li>
        </ul>
      </div>
    </div>

    <div class="bioregion">
      <p>
        Casa Selva weaves with local initiatives, strengthening bioregional resilience, with the aim of becoming a living ecosystem that grows through uncertainty and supports human development.
      </p>
    </div>
  </div>
</section>

<style>
  .network {
    padding: 7rem 0;
    background: var(--cs-cream-soft);
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
    max-width: 760px;
    margin: 0 auto 4rem;
    text-align: center;
  }

  .lead p {
    font-size: 1.02rem;
    line-height: 1.9;
    color: var(--cs-text);
  }

  .polarity {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
    align-items: stretch;
    margin-bottom: 4rem;
  }

  .pole {
    background: #fff;
    border: 1px solid var(--cs-line);
    border-radius: 4px;
    padding: 2.5rem 2rem;
    text-align: center;
    transition: all 0.35s ease;
  }

  .pole:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(59, 66, 54, 0.08);
  }

  .pole-inner:hover { border-color: var(--cs-forest); }
  .pole-outer:hover { border-color: var(--cs-water); }

  .pole-icon {
    width: 56px;
    height: 56px;
    margin: 0 auto 1.25rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }

  .pole-inner .pole-icon {
    background: rgba(74, 107, 74, 0.12);
    color: var(--cs-forest);
  }

  .pole-outer .pole-icon {
    background: rgba(111, 148, 160, 0.12);
    color: var(--cs-water);
  }

  .pole h3 {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.6rem;
    font-weight: 500;
    color: var(--cs-bark);
    margin-bottom: 0.25rem;
  }

  .pole-sub {
    font-size: 0.78rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--cs-muted);
    margin-bottom: 1.5rem;
  }

  .pole ul {
    list-style: none;
    padding: 0;
    text-align: left;
    max-width: 280px;
    margin: 0 auto;
  }

  .pole ul li {
    padding: 0.5rem 0 0.5rem 1.5rem;
    font-size: 0.9rem;
    color: var(--cs-text);
    position: relative;
    line-height: 1.6;
  }

  .pole ul li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.9rem;
    width: 8px;
    height: 1px;
    background: var(--cs-terracotta);
  }

  .bridge {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: var(--cs-terracotta);
  }

  .bridge span {
    font-size: 2rem;
    font-weight: 300;
  }

  .bridge p {
    font-size: 0.72rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--cs-muted);
    text-align: center;
  }

  .bioregion {
    max-width: 760px;
    margin: 0 auto;
    padding: 3rem 2rem;
    text-align: center;
    border-top: 1px solid var(--cs-line);
  }

  .bioregion p {
    font-size: 1rem;
    line-height: 1.9;
    color: var(--cs-text);
    margin-bottom: 1.25rem;
  }

  .bioregion-footer {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.2rem !important;
    font-style: italic;
    color: var(--cs-forest);
    margin-top: 1.5rem;
  }

  @media (max-width: 860px) {
    .polarity {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .bridge {
      flex-direction: row;
      gap: 1rem;
    }

    .bridge span {
      transform: rotate(90deg);
    }
  }

  @media (max-width: 768px) {
    .network { padding: 5rem 0; }
  }
</style>

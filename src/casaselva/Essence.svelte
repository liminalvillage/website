<section id="cs-essence" class="essence">
  <div class="container">
    <div class="section-heading">
      <p class="eyebrow">Essence</p>
      <h2>A regenerative sanctuary for conscious evolution</h2>
    </div>

    <div class="intro">
      <p>
        Casa Selva places emotional intelligence, self-awareness, and relational depth as the foundation for outer impact. In practice, we bring awareness to our emotional response, work through conflict, and follow through on commitments.
      </p>
    </div>

    <div class="pillars">
      <div class="pillar">
        <div class="pillar-icon"><i class="fas fa-seedling"></i></div>
        <h3>Inner work as soil</h3>
        <p>
          If we don't work on ourselves, we cannot truly regenerate society or the environment.
          Emotional maturity and relational awareness are the ground from which everything else
          grows.
        </p>
      </div>

      <div class="pillar">
        <div class="pillar-icon"><i class="fas fa-infinity"></i></div>
        <h3>Frameworks lived, not studied</h3>
        <p>
          Internal Family Systems, anthroposophy, and Spiral Dynamics are part of everyday life —
          woven into conversations, reflections, and shared experiences rather than taught as
          abstract theories.
        </p>
      </div>

      <div class="pillar">
        <div class="pillar-icon"><i class="fas fa-moon"></i></div>
        <h3>Feminine in balance</h3>
        <p>
          Care, intuition, and relational depth take their place alongside action and structure,
          supporting the rebalancing of the feminine voice in humanity.
        </p>
      </div>

      <div class="pillar">
        <div class="pillar-icon"><i class="fas fa-heart"></i></div>
        <h3>Health as rhythm</h3>
        <p>
          Illness is not the opposite of health but part of a natural process. Human beings move
          rhythmically between imbalance and restoration — and healing emerges through that
          interplay.
        </p>
      </div>
    </div>

    <div class="practices">
      <h3 class="practices-title">Residencies, retreats & gatherings</h3>
      <p class="practices-text">
        People come to Casa Selva for retreats, residencies, and gatherings. These experiences
        follow natural rhythms rather than busy, extractive schedules. Shadow work, health as a
        dynamic process, and the understanding of human development are woven into everyday
        life, creating pathways toward authenticity, healing, and integration.
      </p>
    </div>
  </div>
</section>

<style>
  .essence {
    padding: 7rem 0;
    background: #fff;
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

  .intro {
    max-width: 720px;
    margin: 0 auto 4rem;
    text-align: center;
  }

  .intro p {
    font-size: 1.02rem;
    line-height: 1.9;
    color: var(--cs-text);
  }

  .pillars {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-bottom: 4rem;
  }

  .pillar {
    background: var(--cs-cream-soft);
    border: 1px solid var(--cs-line);
    border-radius: 4px;
    padding: 2.25rem 2rem;
    transition: all 0.35s ease;
  }

  .pillar:hover {
    transform: translateY(-3px);
    border-color: var(--cs-terracotta-soft);
    box-shadow: 0 12px 40px rgba(59, 66, 54, 0.08);
  }

  .pillar-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(183, 122, 82, 0.12);
    color: var(--cs-terracotta);
    margin-bottom: 1.25rem;
    font-size: 1.1rem;
  }

  .pillar h3 {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--cs-bark);
    margin-bottom: 0.75rem;
  }

  .pillar p {
    font-size: 0.95rem;
    line-height: 1.8;
    color: var(--cs-muted);
  }

  .practices {
    max-width: 780px;
    margin: 0 auto;
    padding: 3rem 2rem;
    text-align: center;
    border-top: 1px solid var(--cs-line);
  }

  .practices-title {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.7rem;
    font-style: italic;
    color: var(--cs-forest);
    margin-bottom: 1rem;
  }

  .practices-text {
    font-size: 1rem;
    line-height: 1.9;
    color: var(--cs-text);
  }

  @media (max-width: 768px) {
    .essence { padding: 5rem 0; }
    .pillars {
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }
  }
</style>

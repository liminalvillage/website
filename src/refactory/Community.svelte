<section id="rf-community" class="community">
  <div class="container">
    <div class="section-heading">
      <p class="eyebrow">Community &amp; Culture</p>
      <h2>A living stage for collaboration</h2>
    </div>

    <div class="lead display">
      <p>
        Exhibitions, conferences, and workshops where new symbiotic relationships are born.
        Nature provides the backdrop as diverse communities converge to forge innovative
        partnerships and regenerative solutions.
      </p>
    </div>

    <div class="blocks">
      <div class="block">
        <img src="/images/refactory/11.jpeg" alt="Shared gardens and km 0 kitchen" />
        <div class="block-body">
          <p class="block-eyebrow">Gastronomy</p>
          <h3>Km 0 kitchen &amp; shared gardens</h3>
          <p>
            A community restaurant with local, seasonal cuisine. Shared gardens that
            become education classrooms and sustainability laboratories. Every meal tells
            the story of the territory and the relationships that sustain it.
          </p>
        </div>
      </div>

      <div class="block reverse">
        <img src="/images/refactory/12.jpeg" alt="Wellness and relaxation spaces" />
        <div class="block-body">
          <p class="block-eyebrow">Wellness &amp; Nature</p>
          <h3>Slow time, natural rhythm</h3>
          <p>
            Wellness is integral here — relaxation spaces, authentic connection with
            oneself and with others. A place where time slows down, and work resumes its
            natural rhythm.
          </p>
        </div>
      </div>

      <div class="block">
        <img src="/images/refactory/13.jpeg" alt="Cultural events and gatherings" />
        <div class="block-body">
          <p class="block-eyebrow">Events</p>
          <h3>Exhibitions, conferences, workshops</h3>
          <p>
            The calendar is built by the community itself — showcases for social
            innovation, gatherings for emerging ideas, and opportunities for the community
            to take its place as active protagonist.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .community {
    padding: 7rem 0;
    background: var(--rf-cream-soft);
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
    letter-spacing: 1.5px;
  }

  .lead {
    max-width: 760px;
    margin: 0 auto 4rem;
    text-align: center;
  }

  .lead p {
    font-size: 1.15rem;
    line-height: 1.75;
    color: var(--rf-text);
    font-style: italic;
  }

  .blocks {
    display: flex;
    flex-direction: column;
    gap: 4rem;
  }

  .block {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
  }

  .block.reverse { direction: rtl; }
  .block.reverse > * { direction: ltr; }

  .block img {
    width: 100%;
    height: 360px;
    object-fit: cover;
    box-shadow: 0 12px 40px rgba(45, 41, 37, 0.15);
  }

  .block-eyebrow {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--rf-brass);
    margin-bottom: 0.75rem;
  }

  .block h3 {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--rf-dark);
    margin-bottom: 1rem;
    letter-spacing: 1px;
    line-height: 1.3;
  }

  .block-body p {
    font-size: 1rem;
    line-height: 1.85;
    color: var(--rf-text);
  }

  @media (max-width: 900px) {
    .block, .block.reverse {
      grid-template-columns: 1fr;
      direction: ltr;
      gap: 1.5rem;
    }
    .block img { height: 260px; }
    .community { padding: 5rem 0; }
  }
</style>

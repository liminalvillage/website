<section id="rf-place" class="place">
  <div class="parallax" style="background-image: url('/images/refactory/10.jpeg');">
    <div class="parallax-overlay"></div>
    <div class="parallax-content">
      <p class="quote display">
        “Nestled in the heart of the Marche region, the perfect blend of natural beauty
        and strategic accessibility.”
      </p>
    </div>
  </div>

  <div class="container">
    <div class="section-heading">
      <p class="eyebrow">Location &amp; Scale</p>
      <h2>Three hectares, 6&thinsp;000&thinsp;m³, one hub</h2>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="stat-value">3</div>
        <div class="stat-unit">hectares</div>
        <div class="stat-label">of land</div>
      </div>
      <div class="stat">
        <div class="stat-value">6000</div>
        <div class="stat-unit">m³</div>
        <div class="stat-label">building capacity</div>
      </div>
      <div class="stat">
        <div class="stat-value">10</div>
        <div class="stat-unit">min</div>
        <div class="stat-label">from Ascoli Piceno</div>
      </div>
    </div>

    <div class="access">
      <h3 class="access-title">Easy access</h3>
      <div class="access-grid">
        <div class="row"><span class="from">Ascoli Piceno</span><span class="time">10 minutes</span></div>
        <div class="row"><span class="from">Sibillini National Park</span><span class="time">15 minutes</span></div>
        <div class="row"><span class="from">Adriatic Coast</span><span class="time">30 minutes</span></div>
        <div class="row"><span class="from">Ski Areas</span><span class="time">30 minutes</span></div>
        <div class="row"><span class="from">Laga Mountains</span><span class="time">45 minutes</span></div>
        <div class="row"><span class="from">Airports</span><span class="time">90 minutes</span></div>
        <div class="row"><span class="from">Rome</span><span class="time">2.5 hours</span></div>
      </div>
    </div>
  </div>
</section>

<style>
  .place {
    background: #fff;
  }

  .parallax {
    position: relative;
    min-height: 55vh;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-align: center;
  }

  .parallax-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(45, 41, 37, 0.72),
      rgba(90, 98, 102, 0.6)
    );
  }

  .parallax-content {
    position: relative;
    z-index: 2;
    max-width: 820px;
    padding: 4rem 2rem;
  }

  .quote {
    font-size: clamp(1.6rem, 3.6vw, 2.6rem);
    font-style: italic;
    line-height: 1.35;
    color: #fff;
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 7rem 2rem;
  }

  .section-heading {
    text-align: center;
    margin-bottom: 4rem;
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

  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-bottom: 5rem;
    padding: 2.5rem 0;
    border-top: 1px solid var(--rf-line);
    border-bottom: 1px solid var(--rf-line);
  }

  .stat {
    text-align: center;
  }

  .stat-value {
    font-family: "Cormorant Garamond", serif;
    font-size: 3.8rem;
    font-weight: 400;
    color: var(--rf-brick);
    line-height: 1;
  }

  .stat-unit {
    font-size: 0.8rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--rf-brass);
    font-weight: 600;
    margin-top: 0.3rem;
  }

  .stat-label {
    font-size: 0.8rem;
    color: var(--rf-muted);
    margin-top: 0.5rem;
    letter-spacing: 1.5px;
  }

  .access {
    max-width: 720px;
    margin: 0 auto;
  }

  .access-title {
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--rf-dark);
    margin-bottom: 2rem;
    text-align: center;
  }

  .access-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
  }

  .row {
    display: flex;
    justify-content: space-between;
    padding: 1rem 0;
    border-bottom: 1px solid var(--rf-line);
    font-size: 0.95rem;
  }

  .row:last-child { border-bottom: none; }

  .from {
    color: var(--rf-dark);
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .time {
    color: var(--rf-brick);
    font-weight: 600;
    letter-spacing: 1px;
  }

  @media (max-width: 768px) {
    .parallax { background-attachment: scroll; }
    .container { padding: 5rem 2rem; }
    .stats { grid-template-columns: 1fr; gap: 2rem; padding: 2rem 0; }
  }
</style>

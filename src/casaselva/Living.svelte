<section id="cs-living" class="living">
  <div class="parallax" style="background-image: url('/images/casaselva/8.jpeg');">
    <div class="parallax-overlay"></div>
    <div class="parallax-content">
      <p class="quote">
        “Doing the work while doing the work.”
      </p>
      <p class="quote-sub">
        Every action — from gardening to cooking to caring for others — becomes part of the path.
      </p>
    </div>
  </div>

  <div class="container">
    <div class="section-heading">
      <p class="eyebrow">Daily Life</p>
      <h2>Contribution, rhythm, responsibility</h2>
    </div>

    <div class="three">
      <div class="item">
        <div class="num">01</div>
        <h3>Shared responsibility</h3>
        <p>
          Everyone contributes — through cooking, cleaning, gardening, and caring for the space
          and each other. Like any village, it requires both daily tasks and financial
          participation to sustain the space.
        </p>
      </div>

      <div class="item">
        <div class="num">02</div>
        <h3>Cyclical timing</h3>
        <p>
          Life at Casa Selva follows natural rhythms rather than busy, extractive schedules.
          Energy awareness and non-extractive rhythms are woven into how the day unfolds.
        </p>
      </div>

      <div class="item">
        <div class="num">03</div>
        <h3>Leadership at home</h3>
        <p>
          This is a place for growing into mature adulthood, where leadership begins at home —
          in presence, in how one speaks, in how one takes responsibility. Intergenerational
          learning is central.
        </p>
      </div>
    </div>

    <div class="inheritance">
      <div class="inheritance-text">
        <h3>A living inheritance</h3>
        <p>
          Casa Selva is designed to be resilient beyond any one individual. It is intended as a
          living inheritance for future generations — able to continue thriving even if a
          steward steps back, because it is rooted in <em>collective care</em> rather than
          individual dependency.
        </p>
        <p>
          It cultivates emotional maturity, interpersonal responsibility, and a culture of
          mutual support — where people grow not in isolation but in relationship.
        </p>
      </div>
      <div class="inheritance-image" style="background-image: url('/images/casaselva/6.jpeg');"></div>
    </div>
  </div>
</section>

<style>
  .living {
    background: #fff;
  }

  .parallax {
    position: relative;
    min-height: 60vh;
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
      rgba(59, 66, 54, 0.72),
      rgba(74, 107, 74, 0.55)
    );
  }

  .parallax-content {
    position: relative;
    z-index: 2;
    max-width: 760px;
    padding: 4rem 2rem;
  }

  .quote {
    font-family: "Cormorant Garamond", serif;
    font-size: clamp(1.8rem, 4vw, 3rem);
    font-weight: 400;
    font-style: italic;
    line-height: 1.3;
    margin-bottom: 1.5rem;
    color: #fff;
  }

  .quote-sub {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.2rem;
    font-style: italic;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.6;
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

  .three {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
    margin-bottom: 5rem;
  }

  .item {
    text-align: left;
  }

  .num {
    font-family: "Cormorant Garamond", serif;
    color: var(--cs-terracotta);
    font-size: 2.5rem;
    font-weight: 300;
    margin-bottom: 1rem;
    letter-spacing: 2px;
  }

  .item h3 {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--cs-bark);
    margin-bottom: 0.75rem;
  }

  .item p {
    font-size: 0.95rem;
    line-height: 1.8;
    color: var(--cs-muted);
  }

  .inheritance {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
    padding-top: 3rem;
    border-top: 1px solid var(--cs-line);
  }

  .inheritance-text h3 {
    font-family: "Cormorant Garamond", serif;
    font-size: 2rem;
    font-style: italic;
    color: var(--cs-forest);
    margin-bottom: 1.25rem;
  }

  .inheritance-text p {
    font-size: 1rem;
    line-height: 1.9;
    color: var(--cs-text);
    margin-bottom: 1rem;
  }

  .inheritance-text em {
    color: var(--cs-terracotta);
    font-style: italic;
  }

  .inheritance-image {
    height: 360px;
    background-size: cover;
    background-position: center;
    border-radius: 4px;
    box-shadow: 0 12px 40px rgba(59, 66, 54, 0.15);
  }

  @media (max-width: 768px) {
    .parallax { background-attachment: scroll; }
    .three { grid-template-columns: 1fr; gap: 2rem; }
    .inheritance { grid-template-columns: 1fr; gap: 2rem; }
    .container { padding: 5rem 2rem; }
  }
</style>

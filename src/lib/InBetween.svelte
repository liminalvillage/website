<section id="aplaceinbetween" class="in-between">
  <div class="container">
    <div class="section-heading">
      <h2>A place in between …</h2>
    </div>
    <div class="section-content">
      <p class="intro">
        The word <em>liminal</em> comes from the Latin word limen, meaning threshold – any point
        or place of entering or beginning. A liminal space is the time between the 'what was' and
        the 'next.' It is a place of transition, waiting, and not knowing.
      </p>

      <blockquote>
        "the space where we are betwixt and between the familiar and the completely unknown. There
        alone is our old world left behind, while we are not yet sure of the new existence. That's
        a good space where genuine newness can begin. Get there often and stay as long as you can
        by whatever means possible…This is the sacred space where the old world is able to fall
        apart, and a bigger world is revealed."
        <cite>— Richard Rohr</cite>
      </blockquote>

      <p class="subtitle">
        At the Liminal Village, we are investigating the ecotones at the intersections of:
      </p>

      <div class="intersections-grid">
        <div class="intersection">
          <i class="fas fa-seedling"></i>
          <h4>Nature and Technology</h4>
          <p>Nature is the most advanced technology, we draw inspiration from it to engineer balanced and resilient systems (biomimicry)</p>
        </div>

        <div class="intersection">
          <i class="fas fa-atom"></i>
          <h4>Science and Spirituality</h4>
          <p>Through entheogenics, we see different interpretations of similar mystical experiences across cultures, reintroducing spirituality in a scientific conversation.</p>
        </div>

        <div class="intersection">
          <i class="fas fa-globe"></i>
          <h4>Economy and Society</h4>
          <p>We are designing an alternative economic system which focuses on the wellbeing of the planet and of the people living on it.</p>
        </div>

        <div class="intersection">
          <i class="fas fa-universal-access"></i>
          <h4>Medicine and Holistic Healing</h4>
          <p>We explore the synergy between modern medicine and psychophysical guidance</p>
        </div>

        <div class="intersection">
          <i class="fa-solid fa-users-between-lines"></i>
          <h4>Self and Community</h4>
          <p>A community thrives when our integrated selves collectively echo inside out</p>
        </div>

        <div class="intersection">
          <i class="fa-solid fa-people-carry-box"></i>
          <h4>Competition and Collaboration</h4>
          <p>We facilitate collaborative hackathons, where participants highlight collaborative and ecosystem contributions, emphasizing the victory of the commons</p>
        </div>

        <div class="intersection">
          <i class="fa-solid fa-group-arrows-rotate"></i>
          <h4>Ownership and Commons</h4>
          <p>Commons needs stewards and everyone needs a private space to call home</p>
        </div>

        <div class="intersection">
          <i class="fa-solid fa-hand-holding-heart"></i>
          <h4>Intrinsics and Extrinsics</h4>
          <p>Intrinsic motivation is illuminated and stimulated by our environment</p>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .in-between {
    padding: 6rem 0;
    background: linear-gradient(to bottom, #fff 0%, #f8f9fa 100%);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .section-heading {
    text-align: center;
    margin-bottom: 3rem;
  }

  .section-heading h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
    letter-spacing: 2px;
    position: relative;
    display: inline-block;
  }

  .section-heading h2::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: #4a9d5f;
  }

  .section-content {
    max-width: 1000px;
    margin: 0 auto;
  }

  .intro, .subtitle {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #555;
    margin-bottom: 2rem;
    text-align: center;
  }

  .subtitle {
    font-weight: 600;
    font-size: 1.2rem;
    margin-top: 3rem;
  }

  em {
    font-style: italic;
    color: #4a9d5f;
    font-weight: 600;
  }

  blockquote {
    background: #f8f9fa;
    border-left: 4px solid #4a9d5f;
    padding: 2rem;
    margin: 2rem 0;
    font-style: italic;
    font-size: 1.1rem;
    line-height: 1.8;
    color: #555;
    border-radius: 4px;
  }

  cite {
    display: block;
    margin-top: 1rem;
    font-style: normal;
    font-weight: 600;
    color: #4a9d5f;
  }

  .intersections-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    margin-top: 3rem;
  }

  .intersection {
    text-align: center;
    padding: 2rem 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
  }

  .intersection:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
  }

  .intersection i {
    font-size: 2.5rem;
    color: #4a9d5f;
    margin-bottom: 1rem;
  }

  .intersection h4 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 0.75rem;
  }

  .intersection p {
    font-size: 0.9rem;
    line-height: 1.6;
    color: #666;
  }

  @media (max-width: 968px) {
    .intersections-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 576px) {
    .in-between {
      padding: 4rem 0;
    }

    .section-heading h2 {
      font-size: 2rem;
    }

    .intersections-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
</style>

<section id="cs-vision" class="vision">
  <div class="container">
    <div class="section-heading">
      <p class="eyebrow">Vision</p>
      <h2>Midwifing the passage to wholeness</h2>
    </div>

    <div class="lead">
      <p>
        Casa Selva exists as both a physical place and part of a living system where inner transformation meets everyday life through shared living, reflection, and practical collaboration. It is for those who want to grow, do their inner work, and evolve together — in lived experience, not just in theory.
      </p>
    </div>

    <div class="pulls">
      <div class="pull">
        <span class="pull-mark">❦</span>
        <p>
          “A place where people can rely on one another to follow through on their inner work, to
          evolve together, and to manifest that evolution in reality as an embodied, regenerative
          upward spiral.”
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  .vision {
    padding: 8rem 0 6rem;
    background: var(--cs-cream-soft);
    position: relative;
    overflow: hidden;
  }

  .vision::before {
    content: '';
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 720px;
    height: 576px;
    background-image: url('/images/casaselva/sacred-geometry.jpg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.06;
    pointer-events: none;
    z-index: 0;
  }

  .container {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 1;
  }

  .section-heading {
    text-align: center;
    margin-bottom: 3.5rem;
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
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 400;
    color: var(--cs-bark);
    font-style: italic;
  }

  .lead {
    max-width: 720px;
    margin: 0 auto;
    text-align: center;
  }

  .lead p {
    font-size: 1.05rem;
    line-height: 1.95;
    color: var(--cs-text);
    margin-bottom: 1.5rem;
  }

  .lead em {
    color: var(--cs-terracotta);
    font-style: italic;
  }

  .pulls {
    margin-top: 4rem;
    text-align: center;
  }

  .pull {
    max-width: 680px;
    margin: 0 auto;
    padding: 2.5rem 2rem;
    border-top: 1px solid var(--cs-line);
    border-bottom: 1px solid var(--cs-line);
  }

  .pull-mark {
    display: block;
    color: var(--cs-terracotta);
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }

  .pull p {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.35rem;
    font-style: italic;
    color: var(--cs-bark);
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .vision { padding: 5rem 0 4rem; }
  }
</style>

<section id="cs-place" class="place">
  <div class="container">
    <div class="grid">
      <div class="text">
        <p class="eyebrow">The Place</p>
        <h2>Held by forest, mountain & water</h2>
        <p>
          Rooted in the mountains near <strong>Ascoli Piceno</strong>, at around
          <strong>500 metres altitude</strong>, Casa Selva is held by the presence of forest,
          mountain, and water. These elements are not a backdrop but active co-healers —
          each contributing a natural frequency that supports grounding, restoration, and
          vitality.
        </p>
        <p>
          The place invites stillness: a chance to regulate the nervous system, reconnect with
          the body, and remember our place within the larger web of life. Nature here is an
          active partner — people are invited not only to <em>be</em> in nature, but to care
          for it and co-create with it.
        </p>
        <p>
          Stewardship of the land is both a practical responsibility and a reflection of one's
          inner state — grounding presence, responsibility, and integrity into daily life.
        </p>
      </div>

      <div class="images">
        <div class="img-tile tile-a" style="background-image: url('/images/casaselva/2.jpeg');"></div>
        <div class="img-tile tile-b" style="background-image: url('/images/casaselva/4.jpeg');"></div>
        <div class="img-tile tile-c" style="background-image: url('/images/casaselva/5.jpeg');"></div>
      </div>
    </div>

    <div class="gallery">
      <div class="gallery-tile" style="background-image: url('/images/casaselva/19.jpeg');"></div>
      <div class="gallery-tile" style="background-image: url('/images/casaselva/20.jpeg');"></div>
      <div class="gallery-tile" style="background-image: url('/images/casaselva/5.jpeg');"></div>
      <div class="gallery-tile" style="background-image: url('/images/casaselva/8.jpeg');"></div>
      <div class="gallery-tile" style="background-image: url('/images/casaselva/14.jpeg');"></div>
      <div class="gallery-tile" style="background-image: url('/images/casaselva/11.jpeg');"></div>
      <div class="gallery-tile" style="background-image: url('/images/casaselva/15.jpeg');"></div>
      <div class="gallery-tile" style="background-image: url('/images/casaselva/17.jpeg');"></div>
      <div class="gallery-tile" style="background-image: url('/images/casaselva/18.jpeg');"></div>
      <div class="gallery-tile" style="background-image: url('/images/casaselva/3.jpeg');"></div>
      <div class="gallery-tile" style="background-image: url('/images/casaselva/7.jpeg');"></div>
      <div class="gallery-tile" style="background-image: url('/images/casaselva/13.jpeg');"></div>
    </div>
  </div>
</section>

<style>
  .place {
    padding: 7rem 0;
    background: var(--cs-cream);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
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

  .text h2 {
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 400;
    font-style: italic;
    color: var(--cs-bark);
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }

  .text p {
    font-size: 1rem;
    line-height: 1.9;
    color: var(--cs-text);
    margin-bottom: 1.25rem;
  }

  .text strong {
    color: var(--cs-forest);
    font-weight: 500;
  }

  .images {
    position: relative;
    height: 520px;
  }

  .img-tile {
    position: absolute;
    background-size: cover;
    background-position: center;
    border-radius: 4px;
    box-shadow: 0 12px 40px rgba(59, 66, 54, 0.18);
    transition: transform 0.6s ease;
  }

  .img-tile:hover {
    transform: scale(1.02);
  }

  .tile-a {
    top: 0;
    left: 0;
    width: 70%;
    height: 65%;
  }

  .tile-b {
    top: 20%;
    right: 0;
    width: 55%;
    height: 55%;
    border: 6px solid var(--cs-cream);
  }

  .tile-c {
    bottom: 0;
    left: 15%;
    width: 55%;
    height: 40%;
    border: 6px solid var(--cs-cream);
  }

  .gallery {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-top: 3rem;
  }

  .gallery-tile {
    aspect-ratio: 1 / 1;
    background-size: cover;
    background-position: center;
    border-radius: 4px;
    transition: all 0.5s ease;
    filter: saturate(0.9);
  }

  .gallery-tile:hover {
    filter: saturate(1.1);
    transform: scale(1.02);
    box-shadow: 0 10px 30px rgba(59, 66, 54, 0.2);
  }

  @media (max-width: 960px) {
    .grid {
      grid-template-columns: 1fr;
      gap: 3rem;
    }

    .images {
      height: 400px;
    }

    .gallery {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .place { padding: 5rem 0; }
    .images { height: 340px; }
  }
</style>

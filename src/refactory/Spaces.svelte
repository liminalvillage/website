<section id="rf-spaces" class="spaces">
  <div class="container">
    <div class="grid">
      <div class="text">
        <p class="eyebrow">Maker Space &amp; Co-Creation Hub</p>
        <h2>Workshops, labs, and fertile ground</h2>
        <p>
          A thriving ecosystem of collaboration immersed in nature. Shared workshops,
          co-creation labs, and spaces where symbiotic partnerships emerge organically.
          Here co-living and co-creating intersect, fostering continuous cross-pollination
          between diverse initiatives.
        </p>

        <ul class="features">
          <li>
            <strong>Maker Workshops</strong>
            Shared fabrication labs and maker spaces with tools for prototyping and
            creation.
          </li>
          <li>
            <strong>Co-Creation Labs</strong>
            Collaborative spaces where community members co-create solutions and
            innovations together.
          </li>
          <li>
            <strong>Initiative Incubator</strong>
            Cultivating symbiotic partnerships between diverse entities and fostering
            collaborative social impact.
          </li>
        </ul>
      </div>

      <div class="images">
        <div class="tile tile-a" style="background-image: url('/images/refactory/2.jpeg');"></div>
        <div class="tile tile-b" style="background-image: url('/images/refactory/4.jpeg');"></div>
        <div class="tile tile-c" style="background-image: url('/images/refactory/5.jpeg');"></div>
      </div>
    </div>

    <div class="gallery">
      <div class="gallery-tile" style="background-image: url('/images/refactory/6.jpeg');"></div>
      <div class="gallery-tile" style="background-image: url('/images/refactory/7.jpeg');"></div>
      <div class="gallery-tile" style="background-image: url('/images/refactory/8.jpeg');"></div>
      <div class="gallery-tile" style="background-image: url('/images/refactory/9.jpeg');"></div>
    </div>
  </div>
</section>

<style>
  .spaces {
    padding: 7rem 0;
    background: var(--rf-cream);
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
    margin-bottom: 3rem;
  }

  .eyebrow {
    color: var(--rf-brick);
    font-size: 0.72rem;
    letter-spacing: 5px;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .text h2 {
    font-size: clamp(1.6rem, 3.2vw, 2.3rem);
    font-weight: 700;
    color: var(--rf-dark);
    margin-bottom: 1.5rem;
    letter-spacing: 1.5px;
  }

  .text p {
    font-size: 1rem;
    line-height: 1.85;
    color: var(--rf-text);
    margin-bottom: 1.5rem;
  }

  .features {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .features li {
    padding: 1rem 0 1rem 2rem;
    border-top: 1px solid var(--rf-line);
    position: relative;
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--rf-muted);
  }

  .features li:last-child {
    border-bottom: 1px solid var(--rf-line);
  }

  .features li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 1.6rem;
    width: 14px;
    height: 2px;
    background: var(--rf-brick);
  }

  .features li strong {
    display: block;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--rf-dark);
    letter-spacing: 2.5px;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
  }

  .images {
    position: relative;
    height: 520px;
  }

  .tile {
    position: absolute;
    background-size: cover;
    background-position: center;
    box-shadow: 0 12px 40px rgba(45, 41, 37, 0.2);
    transition: transform 0.6s ease;
  }

  .tile:hover { transform: scale(1.02); }

  .tile-a {
    top: 0;
    left: 0;
    width: 70%;
    height: 62%;
  }

  .tile-b {
    top: 25%;
    right: 0;
    width: 55%;
    height: 55%;
    border: 6px solid var(--rf-cream);
  }

  .tile-c {
    bottom: 0;
    left: 20%;
    width: 55%;
    height: 38%;
    border: 6px solid var(--rf-cream);
  }

  .gallery {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-top: 3rem;
  }

  .gallery-tile {
    aspect-ratio: 4 / 3;
    background-size: cover;
    background-position: center;
    filter: saturate(0.9);
    transition: all 0.5s ease;
  }

  .gallery-tile:hover {
    filter: saturate(1.15);
    transform: scale(1.02);
    box-shadow: 0 10px 30px rgba(45, 41, 37, 0.2);
  }

  @media (max-width: 960px) {
    .grid { grid-template-columns: 1fr; gap: 3rem; }
    .images { height: 400px; }
    .gallery { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    .spaces { padding: 5rem 0; }
    .images { height: 340px; }
  }
</style>

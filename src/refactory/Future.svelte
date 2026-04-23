<section id="rf-future" class="future">
  <div class="container">
    <div class="section-heading">
      <p class="eyebrow">Future &amp; Innovation</p>
      <h2>A living laboratory</h2>
    </div>

    <div class="lead display">
      <p>
        More than a workplace — it's where diverse entities unite to co-create
        sustainable futures through meaningful collaboration. A living laboratory for
        symbiotic innovation, new forms of collaborative economies, participatory
        governance, and regenerative partnerships.
      </p>
    </div>

    <div class="grid">
      <div class="item">
        <div class="num">01</div>
        <h3>Solidarity Economy</h3>
        <p>
          New economic models based on solidarity and sustainability, piloted at the
          scale of a real community.
        </p>
      </div>

      <div class="item">
        <div class="num">02</div>
        <h3>Participatory Governance</h3>
        <p>
          Collective decisions, shared stewardship, and active community participation
          in the life of the place.
        </p>
      </div>

      <div class="item">
        <div class="num">03</div>
        <h3>Environmental Sustainability</h3>
        <p>
          Ecological practices integrated into daily operations — not as a policy, but
          as a lived standard.
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  .future {
    padding: 7rem 0;
    background: var(--rf-dark);
    color: #fff;
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
    color: var(--rf-brass);
    font-size: 0.72rem;
    letter-spacing: 5px;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .section-heading h2 {
    font-size: clamp(1.6rem, 3.2vw, 2.3rem);
    font-weight: 700;
    color: #fff;
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
    color: rgba(245, 239, 230, 0.85);
    font-style: italic;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
  }

  .item {
    border-top: 2px solid var(--rf-brick);
    padding-top: 1.5rem;
  }

  .num {
    font-family: "Cormorant Garamond", serif;
    color: var(--rf-brass);
    font-size: 2.2rem;
    font-weight: 300;
    margin-bottom: 1rem;
    letter-spacing: 2px;
  }

  .item h3 {
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.75rem;
    letter-spacing: 1.5px;
  }

  .item p {
    font-size: 0.95rem;
    line-height: 1.8;
    color: rgba(245, 239, 230, 0.75);
  }

  @media (max-width: 900px) {
    .grid { grid-template-columns: 1fr; gap: 2rem; }
    .future { padding: 5rem 0; }
  }
</style>

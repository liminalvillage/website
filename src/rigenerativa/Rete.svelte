<script>
  const sites = [
    {
      name: 'Liminal Village',
      role: 'Hub di innovazione eco-tech',
      blurb: 'Il cuore della rete: un villaggio dove si sperimentano tecnologie aperte, vita comunitaria e progetti rigenerativi.',
      image: '/images/regenerativa/site-liminal.jpeg',
      href: 'https://liminalvillage.com',
    },
    {
      name: 'ReFactory',
      role: 'Spazio di co-creazione',
      blurb: "Un'ex fabbrica trasformata in laboratori, co-living e iniziative comunitarie, a dieci minuti da Ascoli Piceno.",
      image: '/images/regenerativa/site-refactory.jpeg',
      href: 'https://refactory.earth',
    },
    {
      name: 'Casa Selva',
      role: 'Scuola vivente nel bosco',
      blurb: 'Un rifugio in montagna dedicato al lavoro interiore, alle relazioni profonde e alla cura della terra.',
      image: '/images/regenerativa/site-casaselva.jpeg',
      href: 'https://casaselva.earth',
    },
  ];
</script>

<section id="ri-rete" class="rete">
  <div class="container">
    <div class="section-heading">
      <p class="eyebrow">La rete</p>
      <h2>I luoghi che rigeneriamo</h2>
      <p class="sub">
        Rigenerativa opera all'interno della rete <a href="https://regenerativa.earth" target="_blank" rel="noopener noreferrer">ReGenerativa</a>, che unisce comunità, tecnologie e modelli aperti per una civiltà ecologica.
      </p>
    </div>

    <div class="grid">
      {#each sites as s}
        <a class="card" href={s.href} target="_blank" rel="noopener noreferrer">
          <div class="card-image" style="background-image: url('{s.image}')"></div>
          <div class="card-body">
            <p class="role">{s.role}</p>
            <h3>{s.name}</h3>
            <p class="blurb">{s.blurb}</p>
            <span class="more">Scopri →</span>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>

<style>
  .rete {
    padding: 7rem 0 6rem;
    background: var(--rg-cream-soft);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .section-heading {
    text-align: center;
    margin-bottom: 3.5rem;
  }

  .eyebrow {
    color: var(--rg-gold);
    font-size: 0.75rem;
    letter-spacing: 5px;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .section-heading h2 {
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    color: var(--rg-bark);
    margin-bottom: 0.75rem;
    font-style: italic;
  }

  .sub {
    color: var(--rg-muted);
    font-size: 1rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .card {
    display: flex;
    flex-direction: column;
    background: var(--rg-cream);
    border: 1px solid var(--rg-line);
    border-radius: 10px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 40px rgba(44, 53, 39, 0.1);
    border-color: var(--rg-forest);
  }

  .card-image {
    width: 100%;
    height: 220px;
    background-size: cover;
    background-position: center;
  }

  .card-body {
    padding: 1.6rem 1.75rem 1.75rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .role {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: var(--rg-gold);
    font-weight: 600;
    margin-bottom: 0.55rem;
  }

  .card h3 {
    font-size: 1.5rem;
    color: var(--rg-forest-dark);
    margin-bottom: 0.7rem;
    letter-spacing: 1px;
  }

  .blurb {
    color: var(--rg-muted);
    font-size: 0.92rem;
    line-height: 1.7;
    flex: 1;
    margin-bottom: 1rem;
  }

  .more {
    color: var(--rg-forest);
    font-size: 0.78rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 600;
  }

  .card:hover .more {
    color: var(--rg-gold);
  }

  @media (max-width: 900px) {
    .grid { grid-template-columns: 1fr; gap: 1.5rem; }
    .rete { padding: 5rem 0 4rem; }
  }
</style>

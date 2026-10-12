<script>
  const sites = [
    {
      name: 'Liminal Village',
      role: 'Community hub',
      blurb: 'Our central community hub where innovation meets tradition, serving as the heart of our regenerative network.',
      image: '/images/regenerativa/site-liminal.jpeg',
      href: 'https://liminalvillage.com',
    },
    {
      name: 'ReFactory',
      role: 'Third sector factory',
      blurb: 'A factory focused on regenerative practices, circular economy, and sustainable production methodologies.',
      image: '/images/regenerativa/site-refactory.jpeg',
      href: 'https://refactory.earth',
    },
    {
      name: 'Casa Selva',
      role: 'Forest sanctuary',
      blurb: 'A forest sanctuary blending traditional architecture with modern regenerative living, in harmony with the land.',
      image: '/images/regenerativa/site-casaselva.jpeg',
      href: 'https://casaselva.earth',
    },
  ];
</script>

<section id="rg-sites" class="sites">
  <div class="container">
    <div class="section-heading">
      <p class="eyebrow">Our Sites</p>
      <h2>Visit our regenerative communities</h2>
      <p class="sub">See sustainable living in action across the network.</p>
    </div>

    <div class="grid">
      {#each sites as s}
        <a class="card" href={s.href} target="_blank" rel="noopener noreferrer">
          <div class="card-image" style="background-image: url('{s.image}')"></div>
          <div class="card-body">
            <p class="role">{s.role}</p>
            <h3>{s.name}</h3>
            <p class="blurb">{s.blurb}</p>
            <span class="more">Learn more →</span>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>

<style>
  .sites {
    padding: 7rem 0 6rem;
    background: var(--rg-cream);
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
    font-weight: 400;
  }

  .sub {
    color: var(--rg-muted);
    font-size: 1rem;
    max-width: 540px;
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
    background: var(--rg-cream-soft);
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
    .sites { padding: 5rem 0 4rem; }
  }
</style>

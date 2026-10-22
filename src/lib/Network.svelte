<script>
  const steps = [
    {
      icon: 'fa-book-open',
      title: 'Shared frameworks',
      text: 'Every site in the network builds on the same open-source frameworks, technology stack and coordination protocols, so what one community learns, all of them can use.',
    },
    {
      icon: 'fa-moon',
      title: 'One lunar rhythm',
      text: 'All sites keep the same calendar of lunations. The moon is our shared progress bar: each new moon starts a cycle of planning, building and celebrating together.',
    },
    {
      icon: 'fa-compass',
      title: 'Quests across sites',
      text: 'Work is offered as quests that anyone in the network can join. People, skills and resources move freely between communities wherever they are needed most.',
    },
    {
      icon: 'fa-seedling',
      title: 'New nodes',
      text: 'Each community is an independent node that runs itself. Anyone can start a new node in their own bioregion with the same open tools, and the network grows that way.',
    },
  ];

  const sites = [
    { name: 'Liminal Village', role: 'Community hub', href: '/', current: true },
    { name: 'ReFactory', role: 'Third sector factory', href: 'https://refactory.earth' },
    { name: 'Casa Selva', role: 'Forest sanctuary', href: 'https://casaselva.earth' },
  ];
</script>

<section id="network" class="network">
  <div class="container">
    <div class="section-heading">
      <p class="eyebrow">Part of the ReGenerativa network</p>
      <h2>A node in a regenerative network</h2>
    </div>

    <div class="section-content">
      <p>
        Liminal Village is the community hub of
        <a href="https://regenerativa.earth" target="_blank" rel="noopener">ReGenerativa</a>,
        a network of interdependent regenerative communities in central Italy and beyond. Instead of
        extracting from land and people, each site works to restore soil, water and biodiversity, to build
        communities where cooperation replaces competition, and to share open tools that others can adopt
        and adapt locally.
      </p>
    </div>

    <h3 class="how">How it works</h3>
    <div class="steps">
      {#each steps as step}
        <div class="step">
          <div class="step-icon"><i class="fas {step.icon}" aria-hidden="true"></i></div>
          <h4>{step.title}</h4>
          <p>{step.text}</p>
        </div>
      {/each}
    </div>

    <div class="sites" aria-label="Sites in the ReGenerativa network">
      {#each sites as s}
        {#if s.current}
          <span class="site current">
            <span class="site-role">{s.role}</span>
            <span class="site-name">{s.name}</span>
            <span class="site-here">You are here</span>
          </span>
        {:else}
          <a class="site" href={s.href} target="_blank" rel="noopener">
            <span class="site-role">{s.role}</span>
            <span class="site-name">{s.name}</span>
            <span class="site-here">Visit →</span>
          </a>
        {/if}
      {/each}
    </div>

    <p class="more">
      <a href="https://regenerativa.earth" target="_blank" rel="noopener">Discover the ReGenerativa network →</a>
    </p>
  </div>
</section>

<style>
  .network {
    padding: 6rem 0;
    background: #faf8f5;
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
    color: var(--primary-color);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .section-heading h2 {
    font-size: 1.6rem;
    font-weight: 300;
    letter-spacing: 4px;
    color: #222;
    text-transform: uppercase;
  }

  .section-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  p {
    font-size: 0.95rem;
    line-height: 1.9;
    letter-spacing: 0.5px;
    color: #8a8274;
    margin-bottom: 1.5rem;
  }

  a {
    color: #D6A15B;
    text-decoration: none;
    transition: color 0.3s;
  }

  a:hover {
    color: #b8873d;
  }

  .how {
    text-align: center;
    font-size: 1rem;
    font-weight: 400;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #222;
    margin: 3rem 0 2rem;
  }

  .steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }

  .step {
    background: #fff;
    border-radius: 12px;
    padding: 2rem 1.5rem;
    text-align: center;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
  }

  .step-icon {
    width: 56px;
    height: 56px;
    margin: 0 auto 1rem;
    border-radius: 50%;
    background: rgba(214, 161, 91, 0.1);
    color: #D6A15B;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
  }

  .step h4 {
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #222;
    margin-bottom: 0.75rem;
  }

  .step p {
    font-size: 0.88rem;
    line-height: 1.75;
    margin: 0;
  }

  .sites {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin: 3rem 0 1.5rem;
  }

  .site {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1.25rem 1.5rem;
    border: 1px solid rgba(214, 161, 91, 0.3);
    border-radius: 10px;
    text-align: center;
    background: #fff;
    transition: border-color 0.3s, transform 0.3s;
  }

  a.site:hover {
    border-color: #D6A15B;
    transform: translateY(-3px);
  }

  .site.current {
    background: rgba(214, 161, 91, 0.08);
    border-color: #D6A15B;
  }

  .site-role {
    font-size: 0.7rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #8a8274;
  }

  .site-name {
    font-size: 1.1rem;
    letter-spacing: 2px;
    color: #222;
  }

  .site-here {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #D6A15B;
  }

  .more {
    text-align: center;
    margin: 0;
  }

  .more a {
    font-weight: 600;
    border-bottom: 1px solid currentColor;
  }

  @media (max-width: 968px) {
    .steps {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .network {
      padding: 4rem 0;
    }

    .section-heading h2 {
      font-size: 1.3rem;
    }

    .steps,
    .sites {
      grid-template-columns: 1fr;
    }
  }
</style>

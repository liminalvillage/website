<script>
  const steps = [
    {
      title: 'Shared frameworks',
      text: 'Every site in the network builds on the same open-source frameworks, technology stack and coordination protocols, so what one community learns, all of them can use.',
    },
    {
      title: 'One lunar rhythm',
      text: 'All sites keep the same calendar of lunations. The moon is our shared progress bar: each new moon starts a cycle of planning, building and celebrating together.',
    },
    {
      title: 'Quests across sites',
      text: 'Work is offered as quests that anyone in the network can join. People, skills and resources move freely between communities wherever they are needed most.',
    },
    {
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
      <div class="video-container">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/XdhPXocPf9g"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <h3 class="how">How it works</h3>
    <div class="steps">
      {#each steps as step}
        <div class="step">
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
    background: var(--paper);
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
    color: var(--ink);
    text-transform: uppercase;
  }

  .section-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  p {
    font-size: 1rem;
    line-height: 1.75;
    color: var(--muted);
    max-width: 62ch;
    margin: 0 auto 1.5rem;
    text-align: left;
  }

  a {
    color: var(--accent);
    text-decoration: none;
    transition: color 0.3s;
  }

  a:hover {
    color: var(--accent-deep);
  }

  .video-container {
    text-align: center;
    margin: 2.5rem 0 0;
  }

  iframe {
    max-width: 100%;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }

  .how {
    text-align: center;
    font-size: 1rem;
    font-weight: 400;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--ink);
    margin: 3rem 0 2rem;
  }

  /* Overlapping circles that wrap: negative margins let neighbours overlap */
  .steps {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0.5rem 0;
  }

  .step {
    --size: min(270px, 86vw);
    position: relative;
    flex: none;
    width: var(--size);
    aspect-ratio: 1;
    border-radius: 50%;
    padding: 0 calc(var(--size) * 0.16);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 1px solid var(--orb-line);
    mix-blend-mode: var(--orb-blend);
    animation: orb-drift 9s ease-in-out infinite;
    margin: -8px -14px;
  }

  .step:nth-child(4n + 1) {
    background: var(--tint-1);
    animation-delay: -0s;
  }

  .step:nth-child(4n + 2) {
    background: var(--tint-2);
    animation-delay: -2.25s;
  }

  .step:nth-child(4n + 3) {
    background: var(--tint-3);
    animation-delay: -4.5s;
  }

  .step:nth-child(4n + 4) {
    background: var(--tint-4);
    animation-delay: -6.75s;
  }


  .step h4 {
    font-size: 1.1rem;
    color: var(--ink);
    margin-bottom: 0.5rem;
  }

  .step p {
    font-size: 0.82rem;
    line-height: 1.55;
    margin: 0;
    text-align: center;
    color: var(--ink-soft);
  }

  .sites {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 3.5rem 0 2rem;
  }

  .site {
    --size: 170px;
    position: relative;
    flex: none;
    width: var(--size);
    aspect-ratio: 1;
    border-radius: 50%;
    padding: 0 calc(var(--size) * 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 1px solid var(--orb-line);
    mix-blend-mode: var(--orb-blend);
    animation: orb-drift 9s ease-in-out infinite;
    gap: 0.2rem;
    margin: -6px -10px;
    transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .site:nth-child(3n + 1) {
    background: var(--tint-1);
    animation-delay: -0s;
  }

  .site:nth-child(3n + 2) {
    background: var(--tint-2);
    animation-delay: -2.25s;
  }

  .site:nth-child(3n + 3) {
    background: var(--tint-3);
    animation-delay: -4.5s;
  }

  a.site:hover {
    animation-play-state: paused;
    border-color: var(--ink);
  }

  .site.current {
    border-color: color-mix(in srgb, var(--ink) 45%, transparent);
  }

  .site-role {
    font-size: 0.6rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
  }

  .site-name {
    font-size: 1.05rem;
    letter-spacing: 0.5px;
    color: var(--ink);
  }

  .site-here {
    font-size: 0.65rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--ink);
  }

  .more {
    text-align: center;
    margin: 0;
  }

  .more a {
    font-weight: 600;
    border-bottom: 1px solid currentColor;
  }


  @media (max-width: 768px) {
    .network {
      padding: 4rem 0;
    }

    .section-heading h2 {
      font-size: 1.3rem;
    }

    .step + .step {
      margin-top: -24px;
    }

    iframe {
      height: 250px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .step,
    .site {
      animation: none;
    }
  }
</style>

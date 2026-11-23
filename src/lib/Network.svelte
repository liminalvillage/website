<script>
  const sites = [
    { name: 'Liminal Village', role: 'Community hub', href: '/', current: true, img: '/images/droneview.jpg' },
    { name: 'ReFactory', role: 'Third-sector factory', href: 'https://refactory.earth', img: '/images/refactory/12.jpeg' },
    { name: 'Casa Selva', role: 'Forest sanctuary', href: 'https://casaselva.earth', img: '/images/casaselva/1.jpeg' },
  ];
</script>

<section id="network" class="section alt">
  <div class="wrap">
    <div class="head">
      <div>
        <p class="eyebrow">The ReGenerativa network</p>
        <h2 class="display">One node in a regenerative network</h2>
      </div>
      <div>
        <p class="lead">
          Liminal Village is the community hub of
          <a href="https://regenerativa.earth" target="_blank" rel="noopener">ReGenerativa</a>, a network of
          interdependent communities in central Italy and beyond. Every site shares the same open frameworks,
          the same lunar calendar and a common pool of quests, so people, skills and resources can move to
          wherever they are needed. Anyone can start a new node in their own bioregion.
        </p>
      </div>
    </div>

    <div class="sites">
      {#each sites as s}
        <svelte:element
          this={s.current ? 'div' : 'a'}
          class="site"
          class:current={s.current}
          href={s.current ? undefined : s.href}
          target={s.current ? undefined : '_blank'}
          rel={s.current ? undefined : 'noopener'}
        >
          <img src={s.img} alt="" loading="lazy" />
          <span class="info">
            <span class="role">{s.role}</span>
            <span class="name display">{s.name}</span>
            <span class="go">{s.current ? 'You are here' : 'Visit →'}</span>
          </span>
        </svelte:element>
      {/each}
    </div>

    <div class="links">
      <a class="more" href="https://regenerativa.earth" target="_blank" rel="noopener">Discover the network →</a>
      <!-- Hidden for now (quests & services): restore by removing the comment
      <a class="more" href="/quests">Browse open quests →</a> -->
    </div>
  </div>
</section>

<style>
  .head { display: grid; grid-template-columns: 5fr 7fr; gap: 48px; align-items: end; }
  .lead a { color: var(--gold-dark); border-bottom: 1px solid currentColor; }

  .sites { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 48px; }
  .site {
    position: relative;
    display: block;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-radius: var(--radius);
    background: #3a3128;
    color: #fff;
  }
  .site img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--ease); }
  .site::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(20, 18, 15, 0) 35%, rgba(20, 18, 15, 0.75));
  }
  a.site:hover img { transform: scale(1.05); }
  .site.current { box-shadow: 0 0 0 2px var(--gold); }
  .info { position: absolute; left: 22px; right: 22px; bottom: 20px; z-index: 1; display: grid; gap: 2px; }
  .role { font-size: 11px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255, 255, 255, 0.75); }
  .name { font-size: 30px; color: #fff; }
  .go { font-size: 13px; font-weight: 600; color: #e8c490; }

  .links { display: flex; flex-wrap: wrap; gap: 28px; margin-top: 32px; }

  @media (max-width: 860px) {
    .head { grid-template-columns: 1fr; gap: 16px; }
    .sites { grid-template-columns: 1fr; }
    .site { aspect-ratio: 16 / 9; }
  }
</style>

<script>
  const explore = [
    { label: 'Lunations', href: '/lunations' },
    // Hidden for now (quests & services): restore by removing the comment
    // { label: 'Quests', href: '/quests' },
    // { label: 'Services', href: '/services' },
    { label: 'Our DNA', href: '/dna' },
    { label: 'Frameworks', href: '/frameworks' },
    { label: 'Readings & media', href: '/media' },
  ];
  const elsewhere = [
    { label: 'Documentation', href: 'https://docs.liminalvillage.com/' },
    { label: 'Projects', href: 'https://async.hackalong.io/' },
    { label: 'ReGenerativa', href: 'https://regenerativa.earth' },
    { label: 'Open Collective', href: 'https://opencollective.com/liminal' },
  ];
  const social = [
    { icon: 'fa-instagram', label: 'Instagram', href: 'https://www.instagram.com/liminalvillage/' },
    { icon: 'fa-linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/liminalvillage/' },
    { icon: 'fa-facebook', label: 'Facebook', href: 'http://www.facebook.com/emergentcivilization' },
    { icon: 'fa-twitter', label: 'Twitter', href: 'http://twitter.com/LiminalVillage' },
  ];
</script>

<footer id="contact" class="foot">
  <div class="wrap cols">
    <div class="about">
      <a href="/" class="brand display">Liminal Village</a>
      <p>
        In between Europe and Africa, northern and southern Italy, the mountains and the sea, the hilltop and
        the valley, nature and civilization.
      </p>
      <p class="where">
        <a href="https://www.google.com/maps?q=Spinetoli,+Ascoli+Piceno,+Italy" target="_blank" rel="noopener">
          Spinetoli, Ascoli Piceno · Marche, Italy ↗
        </a>
      </p>
      <p><a class="ask" href="/apply">Info, visits, stays & volunteering → apply</a></p>
    </div>

    <nav aria-label="Explore">
      <h4>Explore</h4>
      {#each explore as l}<a href={l.href}>{l.label}</a>{/each}
    </nav>

    <nav aria-label="Elsewhere">
      <h4>Elsewhere</h4>
      {#each elsewhere as l}<a href={l.href} target="_blank" rel="noopener">{l.label}</a>{/each}
    </nav>
  </div>

  <div class="wrap base">
    <span>© {new Date().getFullYear()} Liminal Village</span>
    <div class="social">
      {#each social as s}
        <a href={s.href} target="_blank" rel="noopener" aria-label={s.label}><i class="fab {s.icon}" aria-hidden="true"></i></a>
      {/each}
    </div>
  </div>
</footer>

<style>
  .foot { background: var(--paper); border-top: 1px solid var(--line); padding: 72px 0 28px; font-size: 14px; }
  .cols { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 48px; }
  .brand { font-size: 30px; }
  .about p { margin-top: 12px; max-width: 420px; color: var(--muted); }
  .where a, .ask { color: var(--gold-dark); font-weight: 600; }
  .where a:hover, .ask:hover { color: var(--ink); }
  nav { display: flex; flex-direction: column; gap: 8px; }
  h4 { font-size: 11px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: var(--ink); margin-bottom: 6px; }
  nav a { color: var(--muted); }
  nav a:hover { color: var(--gold-dark); }

  .base {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-top: 56px;
    padding-top: 24px;
    border-top: 1px solid var(--line);
    color: var(--muted);
    font-size: 13px;
  }
  .social { display: flex; gap: 8px; }
  .social a {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    border: 1px solid var(--line);
    color: var(--muted);
    transition: all 0.2s;
  }
  .social a:hover { border-color: var(--gold); color: var(--gold-dark); }

  @media (max-width: 860px) {
    .cols { grid-template-columns: 1fr 1fr; }
    .about { grid-column: 1 / -1; }
  }
</style>

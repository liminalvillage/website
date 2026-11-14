<script>
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import { pick } from './i18n.js';
  import { DOCS, EMAIL, docsPages } from './links.js';

  const t = pick({
    en: {
      mission: 'A continuous network for integral regeneration: connecting people, places, projects and resources through experiences that regenerate life.',
      explore: 'Explore',
      links: ['Vision', 'Events', 'Integral regeneration', 'Hubs', 'Economy', 'Digital mycelium', 'Agreements', 'Join'],
      calendar: 'Lunar calendar',
      quests: 'Quests',
      spaces: 'Hubs',
      agreements: 'Agreements',
      docs: [['overview', 'Constellation Overview'], ['terms', 'General Terms'], ['statute', 'Statute'], ['safeguarding', 'Safeguarding']],
      all: 'All documents',
      legal: 'ReGenerativa APS/ETS — Associazione di Promozione Sociale and Ente del Terzo Settore under Italian Legislative Decree 117/2017. Registered office in Castorano (AP), Italy. Connect. Contribute. Regenerate.',
      ops: 'Operating company',
    },
    it: {
      mission: 'Una rete continua per la rigenerazione integrale: connettiamo persone, luoghi, progetti e risorse attraverso esperienze che rigenerano la vita.',
      explore: 'Esplora',
      links: ['Visione', 'Eventi', 'Rigenerazione integrale', 'Hub', 'Economia', 'Micelio digitale', 'Accordi', 'Partecipa'],
      calendar: 'Calendario lunare',
      quests: 'Quest',
      spaces: 'Hub',
      agreements: 'Accordi',
      docs: [['overview', 'Constellation Overview'], ['terms', 'General Terms'], ['statuto', 'Statuto'], ['safeguarding', 'Safeguarding']],
      all: 'Tutti i documenti',
      legal: 'ReGenerativa APS/ETS — Associazione di Promozione Sociale ed Ente del Terzo Settore ai sensi del D.Lgs. 117/2017. Sede legale a Castorano (AP). Connetti. Contribuisci. Rigenera.',
      ops: 'Società operativa',
    },
  });

  const hashes = ['#rn-vision', '#rn-events', '#rn-integral', '#rn-hubs', '#rn-economy', '#rn-mycelium', '#rn-agreements', '#rn-join'];
  const year = new Date().getFullYear();
  const ext = { target: '_blank', rel: 'noopener noreferrer' };
</script>

<footer class="footer">
  <div class="rg-container">
    <div class="top">
      <div class="brand">
        <img src="/images/regenerativa/logo.png" alt="" class="logo" />
        <span class="name">ReGenerativa</span>
        <p>{t.mission}</p>
        <a href="mailto:{EMAIL}" class="email">{EMAIL}</a>
      </div>

      <div class="cols">
        <div>
          <h4>{t.explore}</h4>
          <ul>
            {#each hashes as h, i}<li><a href={h}>{t.links[i]}</a></li>{/each}
            <li><a href="/lunations.html">{t.calendar}</a></li>
            <li><a href="/quests.html">{t.quests}</a></li>
          </ul>
        </div>
        <div>
          <h4>{t.spaces}</h4>
          <ul>
            <li><a href="https://liminalvillage.com" {...ext}>Liminal Village <ArrowUpRight size={13} /></a></li>
            <li><a href="https://refactory.earth" {...ext}>ReFactory <ArrowUpRight size={13} /></a></li>
            <li><a href="https://casaselva.earth" {...ext}>Casa Selva <ArrowUpRight size={13} /></a></li>
          </ul>
          <h4 class="gap">{t.ops}</h4>
          <ul>
            <li><a href="https://rigenerativa.it" {...ext}>Rigenerativa S.r.l. <ArrowUpRight size={13} /></a></li>
          </ul>
        </div>
        <div>
          <h4>{t.agreements}</h4>
          <ul>
            {#each t.docs as [key, label]}<li><a href={docsPages[key]} {...ext}>{label} <ArrowUpRight size={13} /></a></li>{/each}
            <li><a class="all" href={DOCS} {...ext}>{t.all} <ArrowUpRight size={13} /></a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bottom">
      <p>{t.legal}</p>
      <p>&copy; 2025–{year} ReGenerativa APS</p>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: var(--rg-night);
    color: rgba(244, 239, 228, 0.75);
    padding: 5rem 0 2rem;
  }

  .top {
    display: grid;
    grid-template-columns: 1.2fr 2fr;
    gap: 3rem;
    margin-bottom: 3.5rem;
  }

  .brand {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .logo {
    width: 44px;
    height: 44px;
    object-fit: contain;
    filter: brightness(0) invert(1);
    opacity: 0.85;
    margin-bottom: 0.6rem;
  }

  .name {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.5rem;
    letter-spacing: 2px;
    color: #fff;
    margin-bottom: 0.9rem;
  }

  .brand p {
    color: rgba(244, 239, 228, 0.7);
    font-size: 0.93rem;
    max-width: 340px;
    margin-bottom: 1rem;
  }

  .email { color: var(--rg-gold-soft); font-size: 0.93rem; }

  .cols {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  h4 {
    color: var(--rg-gold);
    font-family: "Open Sans", sans-serif;
    font-size: 0.68rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 1.1rem;
  }

  h4.gap { margin-top: 1.75rem; }

  ul { list-style: none; }
  li { margin-bottom: 0.5rem; }

  .cols a {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: rgba(244, 239, 228, 0.78);
    font-size: 0.9rem;
  }

  .cols a:hover { color: var(--rg-gold-soft); }
  .cols a.all { color: var(--rg-gold-soft); }

  .bottom {
    border-top: 1px solid rgba(244, 239, 228, 0.12);
    padding-top: 1.5rem;
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    font-size: 0.8rem;
  }

  .bottom p { color: rgba(244, 239, 228, 0.5); line-height: 1.6; }
  .bottom p:first-child { max-width: 640px; }

  @media (max-width: 860px) {
    .top { grid-template-columns: 1fr; }
    .cols { grid-template-columns: 1fr 1fr; }
    .bottom { flex-direction: column; gap: 0.75rem; }
  }
</style>

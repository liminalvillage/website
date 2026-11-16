<script>
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import Plus from '@lucide/svelte/icons/plus';
  import { pick } from './i18n.js';
  import Photo from './Photo.svelte';
  import { agreementUrl } from './links.js';

  const t = pick({
    en: {
      eyebrow: 'A network of hubs',
      title: 'Autonomous places, <em>interdependent</em>',
      sub: 'Farms, ecovillages, workshops and homes: each one autonomous, each stronger for being connected. We begin with three places in the Marche, Italy.',
      panorama: 'A community meeting in the Marche',
      visit: 'Visit',
      sites: [
        ['Eco-tech and community hub', 'A living laboratory for collaborative living, permaculture, regenerative technologies and alternative economic arrangements.'],
        ['Co-creation space', 'A former factory near Ascoli Piceno becoming workshops, co-living and community-owned initiatives.'],
        ['Regenerative hospitality', 'Retreats, nature-based experiences and the restoration and activation of existing buildings.'],
      ],
      yoursTitle: 'Your place could be next',
      yours: 'A farm, a house, a workshop, a piece of land. Open it to regenerative use and keep owning it — the Ownership agreement sets out how.',
      yoursCta: 'Ownership agreement',
    },
    it: {
      eyebrow: 'Una rete di hub',
      title: 'Luoghi autonomi, <em>interdipendenti</em>',
      sub: 'Aziende agricole, ecovillaggi, laboratori e case: ognuno autonomo, ognuno più forte perché connesso. Partiamo da tre luoghi nelle Marche.',
      panorama: 'Un incontro di comunità nelle Marche',
      visit: 'Visita',
      sites: [
        ['Hub eco-tech e di comunità', 'Un laboratorio vivente di vita collaborativa, permacultura, tecnologie rigenerative ed economie alternative.'],
        ['Spazio di co-creazione', "Un'ex fabbrica vicino ad Ascoli Piceno che diventa laboratori, co-living e iniziative di comunità."],
        ['Ospitalità rigenerativa', 'Ritiri, esperienze nella natura e il recupero e la riattivazione di edifici esistenti.'],
      ],
      yoursTitle: 'Il tuo luogo potrebbe essere il prossimo',
      yours: "Una fattoria, una casa, un laboratorio, un terreno. Aprilo a un uso rigenerativo e restane proprietario: l'accordo di Proprietà spiega come.",
      yoursCta: 'Accordo di Proprietà',
    },
  });

  const sites = [
    { name: 'Liminal Village', image: '/images/regenerativa/site-liminal.jpeg', href: 'https://liminalvillage.com' },
    { name: 'ReFactory', image: '/images/regenerativa/site-refactory.jpeg', href: 'https://refactory.earth' },
    { name: 'Casa Selva', image: '/images/regenerativa/site-casaselva.jpeg', href: 'https://casaselva.earth' },
  ].map((s, i) => ({ ...s, role: t.sites[i][0], blurb: t.sites[i][1] }));

</script>

<section id="rn-hubs" class="rg-section hubs">
  <div class="rg-container">
    <div class="heading" data-reveal>
      <p class="rg-eyebrow">{t.eyebrow}</p>
      <h2 class="rg-h2">{@html t.title}</h2>
      <p class="rg-sub">{t.sub}</p>
    </div>

    <div class="panorama" data-reveal>
      <Photo src="/images/regenerativa/community-meeting.jpg" caption={t.panorama} ratio="1800 / 665" />
    </div>

    <div class="grid" data-reveal="stagger">
      {#each sites as s}
        <a class="card" href={s.href} target="_blank" rel="noopener noreferrer">
          <div class="img" style="background-image: url('{s.image}')"></div>
          <div class="body">
            <p class="role">{s.role}</p>
            <h4>{s.name}</h4>
            <p class="blurb">{s.blurb}</p>
            <span class="more">{t.visit} <ArrowUpRight size={15} /></span>
          </div>
        </a>
      {/each}

      <a class="card yours" href={agreementUrl(1, 'Ownership')} target="_blank" rel="noopener noreferrer">
        <span class="plus"><Plus size={28} strokeWidth={1.25} /></span>
        <h4>{t.yoursTitle}</h4>
        <p class="blurb">{t.yours}</p>
        <span class="more">{t.yoursCta} <ArrowUpRight size={15} /></span>
      </a>
    </div>

  </div>
</section>

<style>
  .heading { max-width: 760px; margin-bottom: 3rem; }


  .panorama { margin-bottom: 1.25rem; }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
  }

  .card {
    display: flex;
    flex-direction: column;
    background: var(--rg-cream-soft);
    border: 1px solid var(--rg-line);
    border-radius: 18px;
    overflow: hidden;
    color: inherit;
    transition: transform 0.45s var(--rg-ease), box-shadow 0.45s var(--rg-ease), border-color 0.3s ease;
  }

  .card:hover {
    color: inherit;
    transform: translateY(-6px);
    box-shadow: 0 24px 50px rgba(44, 53, 39, 0.12);
    border-color: var(--rg-forest);
  }

  .img {
    aspect-ratio: 4 / 3;
    background-size: cover;
    background-position: center;
    transition: transform 0.8s var(--rg-ease);
  }

  .card:hover .img { transform: scale(1.04); }

  .body {
    padding: 1.5rem 1.5rem 1.6rem;
    display: flex;
    flex-direction: column;
    flex: 1;
    background: var(--rg-cream-soft);
    position: relative;
  }

  .role {
    font-size: 0.66rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 600;
    color: var(--rg-soil);
    margin-bottom: 0.4rem;
  }

  .card h4 { font-size: 1.6rem; margin-bottom: 0.6rem; }

  .blurb {
    color: var(--rg-muted);
    font-size: 0.9rem;
    line-height: 1.7;
    flex: 1;
    margin-bottom: 1.25rem;
  }

  .more {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.72rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    font-weight: 600;
    color: var(--rg-forest);
  }

  .yours {
    padding: 1.75rem 1.5rem 1.6rem;
    background: transparent;
    border-style: dashed;
    border-width: 1.5px;
  }

  .yours:hover { background: var(--rg-cream); }

  .plus {
    display: inline-flex;
    width: 56px;
    height: 56px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1.5px dashed var(--rg-forest);
    color: var(--rg-forest);
    margin-bottom: auto;
  }

  .yours h4 { margin-top: 2.5rem; }


  @media (max-width: 1100px) {
    .grid { grid-template-columns: repeat(2, 1fr); }
  }


  @media (max-width: 600px) {
    .grid { grid-template-columns: 1fr; }
  }
</style>

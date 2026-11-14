<script>
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import Plus from '@lucide/svelte/icons/plus';
  import { pick } from './i18n.js';
  import { agreementUrl } from './links.js';

  const t = pick({
    en: {
      eyebrow: 'A network of hubs',
      title: 'Autonomous places, <em>interdependent</em>',
      sub: 'No single central venue: a distributed network of ecovillages, farms, cultural centres, educational associations, retreat venues, restored buildings, community gardens and private properties opened to regenerative use.',
      strengths: 'Not every hub needs to host events or offer beds. One place attracts visitors with workshops and retreats while its neighbours bring food, products, transport, facilitation or expertise. Each focuses on its strengths and gains from the whole.',
      holonTitle: 'Holons: whole in themselves, part of something larger',
      holon: [
        'An event is a holon, with its own organisers, participants, aims, resources and agreements. A venue hosts many event holons; several venues collaborate as a bioregional network; regional networks connect through shared tools and interoperable agreements.',
        'Each holon keeps real autonomy over its culture, governance, contribution arrangements and priorities, and agrees only to the minimum shared principles needed to cooperate.',
      ],
      rings: ['Event', 'Hub', 'Bioregion', 'Network'],
      startTitle: 'Where we begin: the Marche bioregion',
      startSub: 'An existing foundation of relationships, spaces and experimentation in central Italy, our living environment for developing and testing the model.',
      visit: 'Visit',
      sites: [
        ['Eco-tech and community hub', 'A living laboratory for collaborative living, permaculture, regenerative technologies and alternative economic arrangements.'],
        ['Co-creation space', 'A former factory near Ascoli Piceno becoming workshops, co-living and community-owned initiatives.'],
        ['Regenerative hospitality', 'Retreats, nature-based experiences and the restoration and activation of existing buildings.'],
      ],
      yoursTitle: 'Your place could be next',
      yours: 'A farm, a house, a workshop, a piece of land. Open it to regenerative use and keep owning it — the Ownership agreement sets out how.',
      yoursCta: 'Ownership agreement',
      around: 'Around these spaces are independent associations, farmers, educators, practitioners, artisans, entrepreneurs and community initiatives taking part in different ways. Collaborations with educational associations such as Fiori del Fiobbo show how shared spaces and resources can support independent organisations.',
    },
    it: {
      eyebrow: 'Una rete di hub',
      title: 'Luoghi autonomi, <em>interdipendenti</em>',
      sub: 'Nessuna sede centrale: una rete distribuita di ecovillaggi, aziende agricole, centri culturali, associazioni educative, luoghi per ritiri, edifici recuperati, orti di comunità e proprietà private aperte a un uso rigenerativo.',
      strengths: 'Non ogni hub deve organizzare eventi o offrire ospitalità. Un luogo attira visitatori con corsi e ritiri, mentre i vicini forniscono cibo, prodotti, trasporti, facilitazione o competenze. Ognuno si concentra sui propri punti di forza e beneficia del tutto.',
      holonTitle: 'Oloni: interi in sé, parte di qualcosa di più grande',
      holon: [
        'Un evento è un olone, con i propri organizzatori, partecipanti, obiettivi, risorse e accordi. Un luogo ospita molti eventi; più luoghi collaborano come rete bioregionale; le reti regionali si connettono tramite strumenti condivisi e accordi interoperabili.',
        'Ogni olone mantiene una vera autonomia su cultura, governance, modalità di contributo e priorità, e condivide solo i principi minimi necessari per cooperare.',
      ],
      rings: ['Evento', 'Hub', 'Bioregione', 'Rete'],
      startTitle: 'Da dove partiamo: la bioregione delle Marche',
      startSub: "Una base già viva di relazioni, spazi e sperimentazione nell'Italia centrale: l'ambiente in cui sviluppiamo e mettiamo alla prova il modello.",
      visit: 'Visita',
      sites: [
        ['Hub eco-tech e di comunità', 'Un laboratorio vivente di vita collaborativa, permacultura, tecnologie rigenerative ed economie alternative.'],
        ['Spazio di co-creazione', "Un'ex fabbrica vicino ad Ascoli Piceno che diventa laboratori, co-living e iniziative di comunità."],
        ['Ospitalità rigenerativa', 'Ritiri, esperienze nella natura e il recupero e la riattivazione di edifici esistenti.'],
      ],
      yoursTitle: 'Il tuo luogo potrebbe essere il prossimo',
      yours: "Una fattoria, una casa, un laboratorio, un terreno. Aprilo a un uso rigenerativo e restane proprietario: l'accordo di Proprietà spiega come.",
      yoursCta: 'Accordo di Proprietà',
      around: 'Intorno a questi spazi ci sono associazioni indipendenti, agricoltori, educatori, professionisti, artigiani, imprenditori e iniziative di comunità che partecipano in modi diversi. Le collaborazioni con associazioni educative come Fiori del Fiobbo mostrano come spazi e risorse condivise possano sostenere organizzazioni indipendenti.',
    },
  });

  const sites = [
    { name: 'Liminal Village', image: '/images/regenerativa/site-liminal.jpeg', href: 'https://liminalvillage.com' },
    { name: 'ReFactory', image: '/images/regenerativa/site-refactory.jpeg', href: 'https://refactory.earth' },
    { name: 'Casa Selva', image: '/images/regenerativa/site-casaselva.jpeg', href: 'https://casaselva.earth' },
  ].map((s, i) => ({ ...s, role: t.sites[i][0], blurb: t.sites[i][1] }));

  // Nested rings, innermost first: radius and where its label sits.
  const rings = [44, 86, 128, 170];
</script>

<section id="rn-hubs" class="rg-section hubs">
  <div class="rg-container">
    <div class="heading" data-reveal>
      <p class="rg-eyebrow">{t.eyebrow}</p>
      <h2 class="rg-h2">{@html t.title}</h2>
      <p class="rg-sub">{t.sub}</p>
      <p class="rg-sub">{t.strengths}</p>
    </div>

    <div class="holons">
      <div class="h-text" data-reveal>
        <h3>{t.holonTitle}</h3>
        {#each t.holon as p}<p>{p}</p>{/each}
      </div>
      <div class="rings" data-reveal>
        <svg viewBox="-180 -180 360 360" role="img" aria-label={t.rings.join(' ⊂ ')}>
          {#each [...rings].reverse() as r, i}
            <circle r={r} cy={170 - r} class="ring r{3 - i}" />
          {/each}
          {#each rings as r, i}
            <text y={170 - 2 * r + (i === 0 ? 50 : 22)} class="ring-label" class:core={i === 0}>{t.rings[i]}</text>
          {/each}
        </svg>
      </div>
    </div>

    <div class="start" data-reveal>
      <h3>{t.startTitle}</h3>
      <p>{t.startSub}</p>
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

    <p class="around" data-reveal>{t.around}</p>
  </div>
</section>

<style>
  .heading { max-width: 760px; margin-bottom: 5rem; }
  .heading .rg-sub + .rg-sub { margin-top: 0.75rem; font-size: 0.98rem; }

  .holons {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 4rem;
    align-items: center;
    margin-bottom: 7rem;
  }

  .h-text h3 { font-size: clamp(1.7rem, 3vw, 2.3rem); font-weight: 300; margin-bottom: 1.25rem; }
  .h-text p + p { margin-top: 1rem; color: var(--rg-muted); }

  .rings svg { width: 100%; max-width: 380px; display: block; margin: 0 auto; }

  .ring { stroke-width: 1.25; }
  .r0 { fill: var(--rg-forest); stroke: var(--rg-forest); }
  .r1 { fill: rgba(63, 106, 69, 0.22); stroke: var(--rg-forest); }
  .r2 { fill: rgba(111, 140, 90, 0.14); stroke: var(--rg-moss); }
  .r3 { fill: rgba(201, 163, 91, 0.1); stroke: var(--rg-gold); stroke-dasharray: 3 5; }

  .ring-label {
    text-anchor: middle;
    font-family: "Cormorant Garamond", serif;
    font-style: italic;
    font-size: 18px;
    fill: var(--rg-bark);
  }

  .ring-label.core { fill: var(--rg-cream); }

  .start { max-width: 720px; margin-bottom: 2.5rem; }
  .start h3 { font-size: clamp(1.7rem, 3vw, 2.3rem); font-weight: 300; margin-bottom: 0.75rem; }
  .start p { color: var(--rg-muted); }

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

  .around {
    margin-top: 2.5rem;
    max-width: 860px;
    color: var(--rg-muted);
    font-size: 0.95rem;
  }

  @media (max-width: 1100px) {
    .grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 860px) {
    .holons { grid-template-columns: 1fr; gap: 2.5rem; margin-bottom: 5rem; }
  }

  @media (max-width: 600px) {
    .grid { grid-template-columns: 1fr; }
  }
</style>

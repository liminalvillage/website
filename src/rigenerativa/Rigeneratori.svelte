<script>
  import HardHat from '@lucide/svelte/icons/hard-hat';
  import GraduationCap from '@lucide/svelte/icons/graduation-cap';
  import Mail from '@lucide/svelte/icons/mail';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import { mailto } from './contact.js';
  import { settori, bySlug, settoreUrl, settoreHost } from './settori.js';

  // On a sector page the emails name the sector, and the form suggests it as the interest.
  export let topic = '';

  const sectorList = settori.map((s) => s.name.toLowerCase()).join(', ');
  const interest = topic ? topic.toLowerCase() : `(${sectorList})`;
  const tag = topic ? ` · ${topic}` : '';

  const paths = [
    {
      key: 'lavoro',
      icon: HardHat,
      eyebrow: 'Lavora con noi',
      title: 'Metti le tue <em>competenze</em> al servizio dei luoghi',
      text: "Ogni progetto della rete ha bisogno di mani, teste e cuori diversi. Raccontaci cosa sai fare: quando un cantiere, un campo o una comunità ha bisogno di te, ti contattiamo per una collaborazione, un incarico o un'assunzione.",
      listTitle: 'Profili che cerchiamo',
      list: [
        'Artigiani della bioedilizia e del restauro',
        'Architetti e progettisti bioclimatici',
        'Agricoltori, permacultori e apicoltori',
        "Gestori di spazi e dell'ospitalità",
        'Facilitatori e community manager',
        'Sviluppatori, GIS e data scientist',
        'Esperti di fondi europei',
        'Comunicatori, fotografi e videomaker',
      ],
      cta: 'Candidati',
      href: mailto(
        `Candidatura rigeneratore${tag}`,
        `Buongiorno,\n\nvorrei collaborare con Rigenerativa.\n\nNome e cognome:\nDove vivo:\nLe mie competenze:\nSettori di interesse ${interest}:\nDisponibilità (collaborazione, progetto, assunzione; da quando):\nCV, portfolio o LinkedIn:\n\n`
      ),
    },
    {
      key: 'formazione',
      icon: GraduationCap,
      eyebrow: 'Impara la rigenerazione',
      title: 'Forma le competenze per <em>rigenerare</em>',
      text: 'Si impara nei cantieri, nei campi e nei cerchi decisionali dei luoghi della rete: corsi in presenza e online, esperienze sul campo e percorsi per chi vuole gestire un nodo nel proprio territorio.',
      listTitle: 'Competenze che trasmettiamo',
      list: [
        'Bioedilizia e recupero adattivo',
        'Permacultura e agroecologia',
        "Gestione dell'acqua come bene comune",
        'Facilitazione, sociocrazia e consenso',
        'Strumenti digitali aperti e GIS',
        'Progettazione europea e fundraising',
        'Gestione di spazi e comunità',
      ],
      cta: 'Voglio formarmi',
      href: mailto(
        `Formazione rigeneratore${tag}`,
        `Buongiorno,\n\nvorrei formarmi nella rigenerazione.\n\nNome e cognome:\nDove vivo:\nCosa vorrei imparare ${interest}:\nDa dove parto (esperienze, studi):\nPreferisco (corso online, in presenza, esperienza sul campo):\n\n`
      ),
    },
  ];
</script>

<section id="ri-rigeneratori" class="rigeneratori rg-section">
  <div class="rg-container">
    <div class="heading" data-reveal>
      <p class="rg-eyebrow">Sei un rigeneratore?</p>
      <h2 class="rg-h2">Unisciti a chi <em>rigenera</em></h2>
      <p class="rg-sub">
        Che tu voglia lavorare nei progetti della rete o imparare a rigenerare, c'è un posto per te.
        {#if topic}Partiamo da {topic.toLowerCase()}, ma la rete è più grande.{/if}
      </p>
    </div>

    <div class="paths" data-reveal="stagger">
      {#each paths as p}
        <article class="path {p.key}">
          <span class="path-icon" aria-hidden="true"><svelte:component this={p.icon} size={24} strokeWidth={1.5} /></span>
          <p class="path-eyebrow">{p.eyebrow}</p>
          <h3>{@html p.title}</h3>
          <p class="path-text">{p.text}</p>
          <p class="list-title">{p.listTitle}</p>
          <ul class="list">
            {#each p.list as item}<li>{item}</li>{/each}
          </ul>
          <div class="path-actions">
            <a class="rg-btn {p.key === 'lavoro' ? 'rg-btn-dark' : 'rg-btn-gold'}" href={p.href}>
              <Mail size={18} strokeWidth={1.75} />{p.cta} <ArrowRight class="arrow" size={18} strokeWidth={1.75} />
            </a>
            {#if p.key === 'formazione' && topic !== bySlug.formazione.name}
              <a class="more" href={settoreUrl('formazione')}>{settoreHost('formazione')} <ArrowUpRight size={16} strokeWidth={1.75} /></a>
            {/if}
          </div>
        </article>
      {/each}
    </div>

    <p class="live" data-reveal>
      Vuoi vivere la rigenerazione da dentro, per qualche settimana o una lunazione?
      <a href="https://liminalvillage.com/apply" target="_blank" rel="noopener noreferrer">Candidati a Liminal Village <ArrowUpRight size={15} strokeWidth={1.75} /></a>
    </p>
  </div>
</section>

<style>
  .heading {
    margin-bottom: 3.5rem;
  }

  .paths {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  .path {
    display: flex;
    flex-direction: column;
    padding: 2.75rem 2.5rem 2.5rem;
    border-radius: 24px;
    border: 1px solid var(--rg-line);
    background: var(--rg-cream);
  }

  .path.formazione {
    background: var(--rg-forest-dark);
    background-image: var(--rg-grain), radial-gradient(ellipse at 100% 0%, rgba(201, 163, 91, 0.22), transparent 55%);
    border-color: var(--rg-forest-dark);
    color: var(--rg-cream);
  }

  .path-icon {
    display: inline-grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 14px;
    background: var(--rg-forest-dark);
    color: var(--rg-gold-soft);
    margin-bottom: 1.5rem;
  }

  .formazione .path-icon {
    background: rgba(244, 239, 228, 0.1);
  }

  .path-eyebrow {
    font-size: 0.7rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 600;
    color: var(--rg-forest);
    margin-bottom: 0.75rem;
  }

  .formazione .path-eyebrow {
    color: var(--rg-gold-soft);
  }

  h3 {
    font-size: clamp(1.7rem, 2.6vw, 2.2rem);
    font-weight: 300;
    line-height: 1.15;
    margin-bottom: 1rem;
  }

  h3 :global(em) {
    font-style: italic;
    color: var(--rg-forest);
  }

  .formazione h3 {
    color: #fff;
  }

  .formazione h3 :global(em) {
    color: var(--rg-gold-soft);
  }

  .path-text {
    color: var(--rg-muted);
    margin-bottom: 1.75rem;
  }

  .formazione .path-text {
    color: rgba(244, 239, 228, 0.78);
  }

  .list-title {
    font-size: 0.7rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 600;
    color: var(--rg-muted);
    margin-bottom: 0.9rem;
  }

  .formazione .list-title {
    color: rgba(244, 239, 228, 0.6);
  }

  .list {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 2.25rem;
  }

  .list li {
    font-size: 0.85rem;
    line-height: 1.45;
    padding: 0.5rem 0.95rem;
    border-radius: 999px;
    background: var(--rg-cream-soft);
    border: 1px solid var(--rg-line);
  }

  .formazione .list li {
    background: rgba(244, 239, 228, 0.08);
    border-color: rgba(244, 239, 228, 0.16);
    color: var(--rg-cream);
  }

  .path-actions {
    margin-top: auto;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.25rem;
  }

  .more {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    color: var(--rg-gold-soft);
    border-bottom: 1px solid rgba(221, 185, 121, 0.4);
    padding-bottom: 0.15rem;
  }

  .more:hover {
    color: #fff;
    border-color: #fff;
  }

  .live {
    margin-top: 2.5rem;
    text-align: center;
    color: var(--rg-muted);
  }

  .live a {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-weight: 600;
    border-bottom: 1px solid var(--rg-line);
  }

  @media (max-width: 900px) {
    .paths {
      grid-template-columns: 1fr;
    }

    .path {
      padding: 2.25rem 1.5rem 2rem;
    }
  }

  @media (max-width: 520px) {
    .path-actions .rg-btn {
      width: 100%;
      justify-content: center;
      letter-spacing: 2px;
    }
  }
</style>

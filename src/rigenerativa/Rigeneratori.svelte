<script>
  import HardHat from '@lucide/svelte/icons/hard-hat';
  import GraduationCap from '@lucide/svelte/icons/graduation-cap';
  import Mail from '@lucide/svelte/icons/mail';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import { mailto } from './contact.js';
  import { settori, bySlug, settoreUrl, settoreHost } from './settori.js';
  import { pick } from './i18n.js';

  // On a sector page the emails name the sector, and the form suggests it as the interest.
  export let topic = '';

  const sectorList = settori.map((s) => s.name.toLowerCase()).join(', ');
  const interest = topic ? topic.toLowerCase() : `(${sectorList})`;
  const tag = topic ? ` · ${topic}` : '';

  const t = pick({
    it: {
      eyebrow: 'Sei un rigeneratore?',
      title: 'Unisciti a chi <em>rigenera</em>',
      sub: "Che tu voglia lavorare nei progetti della rete o imparare a rigenerare, c'è un posto per te.",
      topic: (x) => `Partiamo da ${x}, ma la rete è più grande.`,
      live: 'Vuoi vivere la rigenerazione da dentro, per qualche settimana o una lunazione?',
      apply: 'Candidati a Liminal Village',
      lavoro: {
        eyebrow: 'Lavora con noi',
        title: 'Metti le tue <em>competenze</em> al servizio dei luoghi',
        text: "Artigiani, progettisti, agricoltori, facilitatori, sviluppatori: raccontaci cosa sai fare e ti contattiamo quando un cantiere, un campo o una comunità ha bisogno di te.",
        cta: 'Candidati',
        subject: 'Candidatura rigeneratore',
        body: `Buongiorno,\n\nvorrei collaborare con Rigenerativa.\n\nNome e cognome:\nDove vivo:\nLe mie competenze:\nSettori di interesse ${interest}:\nDisponibilità (collaborazione, progetto, assunzione; da quando):\nCV, portfolio o LinkedIn:\n\n`,
      },
      formazione: {
        eyebrow: 'Impara la rigenerazione',
        title: 'Forma le competenze per <em>rigenerare</em>',
        text: 'Bioedilizia, permacultura, facilitazione, strumenti digitali: si impara nei cantieri, nei campi e nei cerchi decisionali della rete.',
        cta: 'Voglio formarmi',
        subject: 'Formazione rigeneratore',
        body: `Buongiorno,\n\nvorrei formarmi nella rigenerazione.\n\nNome e cognome:\nDove vivo:\nCosa vorrei imparare ${interest}:\nDa dove parto (esperienze, studi):\nPreferisco (corso online, in presenza, esperienza sul campo):\n\n`,
      },
    },
    en: {
      eyebrow: 'Are you a regenerator?',
      title: 'Join the people who <em>regenerate</em>',
      sub: "Whether you want to work on the network's projects or learn how to regenerate, there's a place for you.",
      topic: (x) => `We're starting from ${x}, but the network is bigger.`,
      live: 'Want to experience regeneration from the inside, for a few weeks or a lunar cycle?',
      apply: 'Apply to Liminal Village',
      lavoro: {
        eyebrow: 'Work with us',
        title: 'Put your <em>skills</em> to work for places',
        text: "Craftspeople, designers, farmers, facilitators, developers: tell us what you can do and we'll get in touch when a building site, a field or a community needs you.",
        cta: 'Apply',
        subject: 'Regenerator application',
        body: `Hello,\n\nI'd like to work with Rigenerativa.\n\nFull name:\nWhere I live:\nMy skills:\nSectors of interest ${interest}:\nAvailability (collaboration, project, employment; from when):\nCV, portfolio or LinkedIn:\nLanguages I speak:\n\n`,
      },
      formazione: {
        eyebrow: 'Learn regeneration',
        title: 'Build the skills to <em>regenerate</em>',
        text: 'Green building, permaculture, facilitation, digital tools: you learn on the building sites, in the fields and in the decision-making circles of the network.',
        cta: 'I want to train',
        subject: 'Regenerator training',
        body: `Hello,\n\nI'd like to train in regeneration.\n\nFull name:\nWhere I live:\nWhat I'd like to learn ${interest}:\nWhere I'm starting from (experience, studies):\nI prefer (online course, in person, hands-on experience):\n\n`,
      },
    },
  });

  const paths = [
    { key: 'lavoro', icon: HardHat },
    { key: 'formazione', icon: GraduationCap },
  ].map((p) => {
    const c = t[p.key];
    return { ...p, ...c, href: mailto(`${c.subject}${tag}`, c.body) };
  });
</script>

<section id="ri-rigeneratori" class="rigeneratori rg-section">
  <div class="rg-container">
    <div class="heading" data-reveal>
      <p class="rg-eyebrow">{t.eyebrow}</p>
      <h2 class="rg-h2">{@html t.title}</h2>
      <p class="rg-sub">
        {t.sub}
        {#if topic}{t.topic(topic.toLowerCase())}{/if}
      </p>
    </div>

    <div class="paths" data-reveal="stagger">
      {#each paths as p}
        <article class="path {p.key}">
          <span class="path-icon" aria-hidden="true"><svelte:component this={p.icon} size={24} strokeWidth={1.5} /></span>
          <p class="path-eyebrow">{p.eyebrow}</p>
          <h3>{@html p.title}</h3>
          <p class="path-text">{p.text}</p>
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
      {t.live}
      <a href="https://liminalvillage.com/apply" target="_blank" rel="noopener noreferrer">{t.apply} <ArrowUpRight size={15} strokeWidth={1.75} /></a>
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
    margin-bottom: 2.25rem;
  }

  .formazione .path-text {
    color: rgba(244, 239, 228, 0.78);
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

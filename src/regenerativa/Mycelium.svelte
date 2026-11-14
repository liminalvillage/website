<script>
  import Compass from '@lucide/svelte/icons/compass';
  import CalendarDays from '@lucide/svelte/icons/calendar-days';
  import Users from '@lucide/svelte/icons/users';
  import Sparkles from '@lucide/svelte/icons/sparkles';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import { pick } from './i18n.js';

  const t = pick({
    en: {
      eyebrow: 'The digital mycelium',
      title: 'Technology that <em>serves relationships</em>',
      sub: 'A distributed network needs more than a website or an events calendar. We are growing an open, interoperable infrastructure that acts like a mycelium between the physical hubs.',
      who: [
        ['Participants', 'Discover experiences, find projects that need support, offer skills or resources, talk to organisers and follow the outcomes of what they took part in.'],
        ['Organisers', 'Manage events, find venues and collaborators, understand resource needs, coordinate tasks, document contributions and evaluate outcomes.'],
        ['Communities', 'Keep their own agreements, governance practices and records, and share across the network only what they choose.'],
        ['AI assistance', 'Matches needs with yields, surfaces overlooked resources, reduces admin and helps people navigate the network’s shared knowledge.'],
      ],
      serve: 'Technology should serve relationships, not replace them. We build and test these tools through real community activity: every event, partnership and project improves both the social agreements and the systems that support them.',
      quests: 'See open quests',
      modelEyebrow: 'A replicable model',
      modelTitle: 'From one bioregion to <em>many</em>',
      model: 'Our ambition goes beyond the Marche: a network of regenerative bioregions, each with its own constellation of hubs, projects and experiences, sharing knowledge and resources with the others.',
      points: [
        ['No central ownership', 'Growth does not require ReGenerativa to own properties or manage every activity. Existing initiatives join by adopting shared agreements, collaborating with other nodes and using common tools.'],
        ['Fractal by design', 'The same principles that organise one event can support a local community, a network of venues, or collaboration between entire bioregions.'],
        ['Reusable building blocks', 'A successful event format, governance agreement, resource practice or digital tool can be shared and adapted elsewhere, with experienced hubs supporting newcomers.'],
      ],
      cosmo: 'Place-based regeneration, with the reach of a <em>cosmo-local</em> network.',
    },
    it: {
      eyebrow: 'Il micelio digitale',
      title: 'Tecnologia <em>al servizio delle relazioni</em>',
      sub: 'Una rete distribuita ha bisogno di più di un sito o di un calendario di eventi. Stiamo facendo crescere un\'infrastruttura aperta e interoperabile che funziona come un micelio tra gli hub fisici.',
      who: [
        ['Partecipanti', 'Scoprono esperienze, trovano progetti che cercano sostegno, offrono competenze o risorse, parlano con gli organizzatori e seguono i risultati di ciò a cui hanno partecipato.'],
        ['Organizzatori', 'Gestiscono eventi, trovano luoghi e collaboratori, capiscono le risorse necessarie, coordinano i compiti, documentano i contributi e valutano i risultati.'],
        ['Comunità', 'Mantengono i propri accordi, pratiche di governance e archivi, e condividono con la rete solo ciò che scelgono.'],
        ['Assistenza IA', 'Abbina bisogni e rese, fa emergere risorse trascurate, riduce il lavoro amministrativo e aiuta a orientarsi nel sapere condiviso della rete.'],
      ],
      serve: 'La tecnologia deve servire le relazioni, non sostituirle. Costruiamo e mettiamo alla prova questi strumenti attraverso attività reali di comunità: ogni evento, partenariato e progetto migliora sia gli accordi sociali sia i sistemi che li sostengono.',
      quests: 'Vedi le quest aperte',
      modelEyebrow: 'Un modello replicabile',
      modelTitle: 'Da una bioregione <em>a molte</em>',
      model: 'La nostra ambizione va oltre le Marche: una rete di bioregioni rigenerative, ognuna con la propria costellazione di hub, progetti ed esperienze, che condivide saperi e risorse con le altre.',
      points: [
        ['Nessuna proprietà centrale', 'Crescere non richiede a ReGenerativa di possedere immobili o gestire ogni attività. Le iniziative esistenti entrano adottando accordi condivisi, collaborando con altri nodi e usando strumenti comuni.'],
        ['Frattale per natura', 'Gli stessi principi che organizzano un evento possono sostenere una comunità locale, una rete di luoghi o la collaborazione tra intere bioregioni.'],
        ['Mattoni riutilizzabili', 'Un format di evento riuscito, un accordo di governance, una pratica di gestione delle risorse o uno strumento digitale possono essere condivisi e adattati altrove, con gli hub esperti a sostegno dei nuovi.'],
      ],
      cosmo: 'Rigenerazione radicata nei luoghi, con la portata di una rete <em>cosmo-locale</em>.',
    },
  });

  const icons = [Compass, CalendarDays, Users, Sparkles];
</script>

<section id="rn-mycelium" class="rg-section mycelium">
  <div class="rg-container">
    <div class="heading" data-reveal>
      <p class="rg-eyebrow">{t.eyebrow}</p>
      <h2 class="rg-h2">{@html t.title}</h2>
      <p class="rg-sub">{t.sub}</p>
    </div>

    <ul class="who" data-reveal="stagger">
      {#each t.who as [name, body], i}
        <li>
          <span class="icon"><svelte:component this={icons[i]} size={20} strokeWidth={1.5} /></span>
          <h3>{name}</h3>
          <p>{body}</p>
        </li>
      {/each}
    </ul>

    <div class="serve" data-reveal>
      <p>{t.serve}</p>
      <a class="rg-btn rg-btn-line" href="/quests.html">{t.quests} <ArrowRight class="arrow" size={16} /></a>
    </div>

    <div class="model">
      <div class="m-head" data-reveal>
        <p class="rg-eyebrow">{t.modelEyebrow}</p>
        <h2 class="rg-h2">{@html t.modelTitle}</h2>
        <p class="rg-sub">{t.model}</p>
      </div>
      <ol class="points" data-reveal="stagger">
        {#each t.points as [name, body]}
          <li>
            <h3>{name}</h3>
            <p>{body}</p>
          </li>
        {/each}
      </ol>
      <p class="cosmo" data-reveal>{@html t.cosmo}</p>
    </div>
  </div>
</section>

<style>
  .heading { max-width: 760px; margin-bottom: 4rem; }

  .who {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  .who li {
    padding: 1.75rem 1.5rem;
    border-radius: 16px;
    border: 1px solid var(--rg-line);
    background: var(--rg-cream-soft);
  }

  .who h3 { font-size: 1.45rem; margin-bottom: 0.5rem; }
  .who p { color: var(--rg-muted); font-size: 0.9rem; line-height: 1.7; }

  .icon {
    display: inline-flex;
    width: 42px;
    height: 42px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--rg-cream);
    color: var(--rg-forest);
    margin-bottom: 1rem;
  }

  .serve {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2.5rem;
    align-items: center;
    margin-top: 2.5rem;
    padding: 2rem 2.25rem;
    border-radius: 16px;
    background: var(--rg-cream);
  }

  .serve p { font-size: 1rem; }

  .model {
    margin-top: 8rem;
    padding-top: 6rem;
    border-top: 1px solid var(--rg-line);
  }

  .m-head { max-width: 760px; margin-bottom: 3rem; }

  .points {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    counter-reset: pt;
  }

  .points li {
    counter-increment: pt;
    padding: 0 2rem 0 0;
  }

  .points li + li { padding-left: 2rem; border-left: 1px solid var(--rg-line); }

  .points h3::before {
    content: "0" counter(pt);
    display: block;
    font-family: "Open Sans", sans-serif;
    font-size: 0.7rem;
    letter-spacing: 3px;
    font-weight: 600;
    color: var(--rg-gold);
    margin-bottom: 0.5rem;
  }

  .points h3 { font-size: 1.55rem; margin-bottom: 0.5rem; }
  .points p { color: var(--rg-muted); font-size: 0.93rem; }

  .cosmo {
    margin-top: 4rem;
    font-family: "Cormorant Garamond", serif;
    font-size: clamp(1.5rem, 2.8vw, 2.1rem);
    font-weight: 300;
    line-height: 1.3;
    color: var(--rg-bark);
    text-align: center;
  }

  .cosmo :global(em) { color: var(--rg-forest); }

  @media (max-width: 1000px) {
    .who { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 860px) {
    .serve { grid-template-columns: 1fr; gap: 1.5rem; padding: 1.75rem 1.25rem; }
    .model { margin-top: 5rem; padding-top: 4rem; }
    .points { grid-template-columns: 1fr; }
    .points li, .points li + li { padding: 1.75rem 0; border-left: none; }
    .points li + li { border-top: 1px solid var(--rg-line); }
  }

  @media (max-width: 560px) {
    .who { grid-template-columns: 1fr; }
  }
</style>

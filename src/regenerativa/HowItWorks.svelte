<script>
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import { pick } from './i18n.js';
  import { docsPages } from './links.js';
  import Photo from './Photo.svelte';

  // What used to be four sections (integral regeneration, economy, flywheel,
  // digital mycelium), said in four points; the depth lives on the docs site.
  const t = pick({
    en: {
      eyebrow: 'How it works',
      title: 'Each place gives what it has, <em>and gets what it needs</em>',
      points: [
        ['Needs meet yields', 'A farm needs hands and customers; a retreat needs food and beds. We connect what one place offers with what another lacks.'],
        ['Events feed the local economy', 'One retreat supports a host venue, local producers, facilitators and transport, and part of what it earns goes back into shared projects.'],
        ['Not only money counts', 'Cooking, building, facilitating and caring create value too. Each hub decides openly how contributions are recognised.'],
        ['Shared tools, local freedom', 'Open digital tools help hubs coordinate while each keeps its own culture. The model is made to be copied by other bioregions.'],
      ],
      lunch: 'A shared lunch: food, time and care that no invoice counts',
      structure: 'ReGenerativa APS is the non-profit that holds the network. Rigenerativa S.r.l. and other partners run the commercial services.',
      links: [['fund', 'How the money moves'], ['impact', 'How we measure impact']],
      quests: 'Open quests',
    },
    it: {
      eyebrow: 'Come funziona',
      title: 'Ogni luogo dà ciò che ha, <em>e riceve ciò che gli serve</em>',
      points: [
        ['Bisogni e rese si incontrano', 'Un\'azienda agricola ha bisogno di braccia e clienti; un ritiro di cibo e posti letto. Colleghiamo ciò che un luogo offre a ciò che manca a un altro.'],
        ['Gli eventi nutrono l\'economia locale', 'Un ritiro sostiene un luogo ospitante, produttori locali, facilitatori e trasporti, e parte di ciò che genera torna in progetti condivisi.'],
        ['Non conta solo il denaro', 'Cucinare, costruire, facilitare e prendersi cura creano valore. Ogni hub decide in modo trasparente come riconoscere i contributi.'],
        ['Strumenti condivisi, libertà locale', 'Strumenti digitali aperti aiutano gli hub a coordinarsi, mentre ognuno mantiene la propria cultura. Il modello è pensato per essere replicato in altre bioregioni.'],
      ],
      lunch: 'Un pranzo condiviso: cibo, tempo e cura che nessuna fattura conta',
      structure: 'ReGenerativa APS è l\'ente non profit che custodisce la rete. Rigenerativa S.r.l. e altri partner gestiscono i servizi commerciali.',
      links: [['fund', 'Come si muove il denaro'], ['impact', "Come misuriamo l'impatto"]],
      quests: 'Quest aperte',
    },
  });
</script>

<section id="rn-how" class="rg-section rg-dark how">
  <div class="rg-container">
    <div class="heading" data-reveal>
      <p class="rg-eyebrow">{t.eyebrow}</p>
      <h2 class="rg-h2">{@html t.title}</h2>
    </div>

    <div class="body">
      <ol class="points" data-reveal="stagger">
        {#each t.points as [name, text], i}
          <li>
            <span class="num">{i + 1}</span>
            <div>
              <h3>{name}</h3>
              <p>{text}</p>
            </div>
          </li>
        {/each}
      </ol>

      <div class="side" data-reveal>
        <Photo src="/images/regenerativa/shared-lunch.jpg" caption={t.lunch} ratio="4 / 3" />
        <p class="structure">
          {t.structure}
          <a href="https://rigenerativa.it" target="_blank" rel="noopener noreferrer">rigenerativa.it <ArrowUpRight size={13} /></a>
        </p>
        <div class="links">
          {#each t.links as [key, label]}
            <a href={docsPages[key]} target="_blank" rel="noopener noreferrer">{label} <ArrowUpRight size={14} /></a>
          {/each}
          <a href="/quests.html">{t.quests} <ArrowRight size={14} /></a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .how {
    background:
      radial-gradient(ellipse 55% 45% at 10% 90%, rgba(63, 106, 69, 0.22), transparent 70%),
      var(--rg-night);
  }

  .heading { max-width: 760px; margin-bottom: 3.5rem; }

  .body {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: 4rem;
    align-items: start;
  }

  .points { list-style: none; display: grid; gap: 2rem; }

  .points li { display: grid; grid-template-columns: 2.5rem 1fr; gap: 1rem; }

  .num {
    display: inline-flex;
    width: 36px;
    height: 36px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid var(--rg-gold);
    color: var(--rg-gold-soft);
    font-family: "Cormorant Garamond", serif;
    font-size: 1.1rem;
  }

  .points h3 { font-size: 1.55rem; margin-bottom: 0.35rem; }
  .points p { font-size: 0.95rem; line-height: 1.7; }

  .structure { margin-top: 1.5rem; font-size: 0.88rem; line-height: 1.65; }

  .structure a, .links a {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: var(--rg-gold-soft);
  }

  .structure a:hover, .links a:hover { color: var(--rg-cream); }

  .links {
    margin-top: 1.25rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
    font-size: 0.9rem;
    font-weight: 600;
  }

  @media (max-width: 900px) {
    .body { grid-template-columns: 1fr; gap: 3rem; }
  }
</style>

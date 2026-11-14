<script>
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import { pick } from './i18n.js';

  const t = pick({
    en: {
      eyebrow: 'Regenerative economics',
      title: 'Every element has <em>needs and yields</em>',
      sub: 'A simple principle drawn from permaculture. When we understand what each participant needs and what it offers, the yield of one can meet the need of another. Events concentrate these connections; the network sustains them afterwards.',
      needs: 'Needs',
      yields: 'Yields',
      elements: [
        ['A venue', 'maintenance, energy, people', 'space, infrastructure, hospitality'],
        ['A farmer', 'customers, labour, resources', 'food, ecological stewardship, knowledge'],
        ['An educator', 'participants, suitable facilities', 'learning, transformation'],
      ],
      engineTitle: 'Events as an economic engine',
      engine: 'A multi-day retreat might involve an organiser, a host venue, local food producers, facilitators, artists and transport. Instead of one business capturing the value, the experience supports an interconnected local economy, and part of what it generates can be reinvested in shared infrastructure, community initiatives and ecological restoration.',
      retreat: 'A retreat',
      roles: ['Organiser', 'Host venue', 'Food producers', 'Facilitators', 'Artists', 'Transport'],
      valueTitle: 'Money matters, and it is not the only value',
      value: [
        'Organisers, producers, land stewards and service providers need viable livelihoods. Buildings need maintenance and coordination takes time. A regenerative economy cannot run forever on invisible labour or the goodwill of a few.',
        'But preparing a meal, maintaining a trail, facilitating a hard conversation, writing software, caring for children or restoring an ecosystem also create value that transactions miss. We are developing ways to make these contributions visible and easier to coordinate, without reducing relationships to accounting.',
      ],
      costTitle: 'Counting real resource costs',
      cost: 'One more guest means more food, but also more preparation, cleaning, beds, energy and coordination. Seeing these inputs lets us share responsibilities fairly and avoid overburdening the people who keep the commons.',
      holonRule: 'Each holon decides how contributions are recognised and scarce resources allocated, through transparent and consensual agreements.',
      notPoints: 'Not a universal points system that decides anyone’s worth: an economy where <em>contributions, needs, ecological limits and available resources</em> are considered together.',
      structureTitle: 'Two kinds of organisation, clear roles',
      aps: 'The non-profit associative framework: shared purposes, collective initiatives, education, experimentation and network coordination.',
      srl: 'Commercial operators, including Rigenerativa S.r.l. and other independent partners, provide professional services and economic activity through transparent agreements.',
      srlLink: 'rigenerativa.it',
    },
    it: {
      eyebrow: 'Economia rigenerativa',
      title: 'Ogni elemento ha <em>bisogni e rese</em>',
      sub: "Un principio semplice, tratto dalla permacultura. Quando capiamo di cosa ha bisogno ogni partecipante e cosa offre, la resa dell'uno può rispondere al bisogno dell'altro. Gli eventi concentrano queste connessioni; la rete le sostiene nel tempo.",
      needs: 'Bisogni',
      yields: 'Rese',
      elements: [
        ['Un luogo', 'manutenzione, energia, persone', 'spazio, infrastrutture, ospitalità'],
        ['Un agricoltore', 'clienti, lavoro, risorse', 'cibo, cura ecologica, saperi'],
        ['Un educatore', 'partecipanti, spazi adatti', 'apprendimento, trasformazione'],
      ],
      engineTitle: 'Gli eventi come motore economico',
      engine: "Un ritiro di più giorni può coinvolgere un organizzatore, un luogo ospitante, produttori locali, facilitatori, artisti e trasporti. Invece di un'unica impresa che cattura il valore, l'esperienza sostiene un'economia locale interconnessa, e parte di ciò che genera può essere reinvestita in infrastrutture condivise, iniziative di comunità e ripristino ecologico.",
      retreat: 'Un ritiro',
      roles: ['Organizzatore', 'Luogo ospitante', 'Produttori', 'Facilitatori', 'Artisti', 'Trasporti'],
      valueTitle: "Il denaro conta, ma non è l'unico valore",
      value: [
        "Organizzatori, produttori, custodi della terra e fornitori di servizi hanno bisogno di mezzi di sussistenza dignitosi. Gli edifici richiedono manutenzione e il coordinamento richiede tempo. Un'economia rigenerativa non può reggersi all'infinito sul lavoro invisibile o sulla buona volontà di pochi.",
        "Ma anche preparare un pasto, curare un sentiero, facilitare una conversazione difficile, scrivere software, prendersi cura dei bambini o ripristinare un ecosistema creano valore che le transazioni non vedono. Stiamo sviluppando modi per rendere visibili e più facili da coordinare questi contributi, senza ridurre le relazioni a contabilità.",
      ],
      costTitle: 'Contare i costi reali',
      cost: "Un ospite in più significa più cibo, ma anche più preparazione, pulizie, posti letto, energia e coordinamento. Vedere questi input permette di distribuire le responsabilità in modo equo ed evitare di sovraccaricare chi si prende cura dei beni comuni.",
      holonRule: 'Ogni olone decide come riconoscere i contributi e allocare le risorse scarse, con accordi trasparenti e consensuali.',
      notPoints: "Non un sistema di punti universale che stabilisce il valore delle persone: un'economia in cui <em>contributi, bisogni, limiti ecologici e risorse disponibili</em> vengono considerati insieme.",
      structureTitle: 'Due tipi di organizzazione, ruoli chiari',
      aps: 'La cornice associativa non profit: finalità condivise, iniziative collettive, formazione, sperimentazione e coordinamento della rete.',
      srl: 'Operatori commerciali, tra cui Rigenerativa S.r.l. e altri partner indipendenti, offrono servizi professionali e attività economiche tramite accordi trasparenti.',
      srlLink: 'rigenerativa.it',
    },
  });

  // Six roles around the retreat, evenly spaced.
  const R = 130;
  const pos = (i) => {
    const a = (i / 6) * 2 * Math.PI - Math.PI / 2;
    return { x: Math.cos(a) * R, y: Math.sin(a) * R };
  };
</script>

<section id="rn-economy" class="rg-section economy">
  <div class="rg-container">
    <div class="heading" data-reveal>
      <p class="rg-eyebrow">{t.eyebrow}</p>
      <h2 class="rg-h2">{@html t.title}</h2>
      <p class="rg-sub">{t.sub}</p>
    </div>

    <div class="ny" data-reveal="stagger">
      {#each t.elements as [who, needs, yields]}
        <div class="ny-row">
          <h3>{who}</h3>
          <p class="need"><span>{t.needs}</span>{needs}</p>
          <ArrowRight size={18} strokeWidth={1.5} />
          <p class="yield"><span>{t.yields}</span>{yields}</p>
        </div>
      {/each}
    </div>

    <div class="engine">
      <div class="e-text" data-reveal>
        <h3>{t.engineTitle}</h3>
        <p>{t.engine}</p>
      </div>
      <div class="web" data-reveal>
        <svg viewBox="-200 -170 400 340" role="img" aria-label="{t.retreat}: {t.roles.join(', ')}">
          {#each t.roles as _, i}
            <line x1="0" y1="0" x2={pos(i).x} y2={pos(i).y} />
            <line class="ring" x1={pos(i).x} y1={pos(i).y} x2={pos((i + 1) % 6).x} y2={pos((i + 1) % 6).y} />
          {/each}
          <circle r="46" class="core" />
          <text y="6" class="core-label">{t.retreat}</text>
          {#each t.roles as role, i}
            <circle cx={pos(i).x} cy={pos(i).y} r="7" class="node" />
            <text x={pos(i).x} y={pos(i).y + (pos(i).y < -1 ? -16 : 26)} class="role">{role}</text>
          {/each}
        </svg>
      </div>
    </div>

    <div class="value">
      <div data-reveal>
        <h3>{t.valueTitle}</h3>
        {#each t.value as p}<p>{p}</p>{/each}
      </div>
      <aside data-reveal>
        <h4>{t.costTitle}</h4>
        <p>{t.cost}</p>
        <p class="rule">{t.holonRule}</p>
      </aside>
    </div>

    <blockquote class="not-points" data-reveal>{@html t.notPoints}</blockquote>

    <div class="structure" data-reveal>
      <h3>{t.structureTitle}</h3>
      <div class="orgs">
        <div class="org">
          <p class="org-name">ReGenerativa APS</p>
          <p>{t.aps}</p>
        </div>
        <div class="org">
          <p class="org-name">Rigenerativa S.r.l. + partners</p>
          <p>{t.srl}</p>
          <a href="https://rigenerativa.it" target="_blank" rel="noopener noreferrer">{t.srlLink} <ArrowUpRight size={14} /></a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .heading { max-width: 780px; margin-bottom: 4rem; }

  .ny { display: grid; gap: 0.75rem; margin-bottom: 7rem; }

  .ny-row {
    display: grid;
    grid-template-columns: 11rem 1fr auto 1fr;
    gap: 1.5rem;
    align-items: center;
    padding: 1.25rem 1.75rem;
    border: 1px solid var(--rg-line);
    border-radius: 14px;
    background: var(--rg-cream-soft);
  }

  .ny-row h3 { font-size: 1.5rem; }
  .ny-row > :global(svg) { color: var(--rg-gold); }

  .need, .yield { font-size: 0.93rem; line-height: 1.5; }
  .need { color: var(--rg-muted); }
  .yield { color: var(--rg-forest-dark); }

  .need span, .yield span {
    display: block;
    font-size: 0.62rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--rg-soil);
    margin-bottom: 0.15rem;
  }

  .yield span { color: var(--rg-forest); }

  .engine {
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    gap: 4rem;
    align-items: center;
    margin-bottom: 7rem;
  }

  .e-text h3, .value h3, .structure h3 {
    font-size: clamp(1.7rem, 3vw, 2.3rem);
    font-weight: 300;
    margin-bottom: 1rem;
  }

  .e-text p { color: var(--rg-muted); }

  .web svg { width: 100%; max-width: 460px; display: block; margin: 0 auto; overflow: visible; }

  .web line { stroke: var(--rg-gold); stroke-width: 1; opacity: 0.6; }
  .web line.ring { stroke: var(--rg-line); opacity: 1; stroke-dasharray: 2 4; }

  .core { fill: var(--rg-forest); }

  .core-label {
    text-anchor: middle;
    fill: var(--rg-cream);
    font-family: "Cormorant Garamond", serif;
    font-style: italic;
    font-size: 19px;
  }

  .node { fill: var(--rg-cream-soft); stroke: var(--rg-forest); stroke-width: 2; }

  .role {
    text-anchor: middle;
    fill: var(--rg-bark);
    font-size: 12px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-weight: 600;
  }

  .value {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 3.5rem;
    align-items: start;
  }

  .value p + p { margin-top: 1rem; color: var(--rg-muted); }

  aside {
    padding: 2rem;
    border-radius: 18px;
    background: var(--rg-cream);
    border-left: 3px solid var(--rg-gold);
  }

  aside h4 { font-size: 1.45rem; margin-bottom: 0.6rem; }
  aside p { font-size: 0.92rem; color: var(--rg-muted); }
  aside .rule { margin-top: 1rem; color: var(--rg-bark); font-weight: 600; }

  .not-points {
    font-family: "Cormorant Garamond", serif;
    font-size: clamp(1.5rem, 2.8vw, 2.1rem);
    font-weight: 300;
    line-height: 1.3;
    color: var(--rg-bark);
    max-width: 880px;
    margin: 5rem auto;
    text-align: center;
  }

  .not-points :global(em) { color: var(--rg-forest); }

  .orgs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .org {
    padding: 1.75rem;
    border-radius: 16px;
    border: 1px solid var(--rg-line);
    background: var(--rg-cream-soft);
  }

  .org-name {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.45rem;
    color: var(--rg-bark);
    margin-bottom: 0.4rem;
  }

  .org p:not(.org-name) { color: var(--rg-muted); font-size: 0.93rem; }

  .org a {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    margin-top: 0.75rem;
    font-size: 0.85rem;
    font-weight: 600;
  }

  @media (max-width: 900px) {
    .engine, .value, .orgs { grid-template-columns: 1fr; gap: 2rem; }
    .engine { margin-bottom: 5rem; }
    .ny { margin-bottom: 5rem; }
  }

  @media (max-width: 700px) {
    .ny-row { grid-template-columns: 1fr; gap: 0.5rem; padding: 1.25rem; }
    .ny-row > :global(svg) { transform: rotate(90deg); }
  }
</style>

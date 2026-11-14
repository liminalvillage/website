<script>
  import Hammer from '@lucide/svelte/icons/hammer';
  import GraduationCap from '@lucide/svelte/icons/graduation-cap';
  import Tent from '@lucide/svelte/icons/tent';
  import Flame from '@lucide/svelte/icons/flame';
  import Palette from '@lucide/svelte/icons/palette';
  import Compass from '@lucide/svelte/icons/compass';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import Moon from './Moon.svelte';
  import { now, upcoming, seasons } from './cycle.js';
  import { lang, pick } from './i18n.js';

  const t = pick({
    en: {
      eyebrow: 'A continuous events network',
      title: 'The event ends, <em>its effects continue</em>',
      sub: 'Events are moments when knowledge, resources, relationships, culture and economic activity converge. We coordinate them across places and through the year, so that each one leads somewhere.',
      ripplesTitle: 'More than an experience consumed',
      ripples: [
        ['A permaculture workshop', 'introduces participants to a local farmer', 'whose produce joins a community food network.'],
        ['A wellness retreat', 'creates demand for beds, meals and services', 'supplied by several neighbouring initiatives.'],
        ['A community festival', 'earns income for local producers', 'and brings new volunteers and organisers to restoration projects.'],
      ],
      formatsTitle: 'What happens in the network',
      formats: [
        ['Gatherings', 'Community dinners, cultural celebrations, local markets and full-moon evenings.'],
        ['Courses', 'Permaculture, natural building, facilitation, open technology — taught by practitioners of the network.'],
        ['Retreats', 'Wellness, inner work, deep listening and time with the land.'],
        ['Restoration days', 'Hands-on work camps restoring soil, water, buildings and landscapes.'],
        ['Residencies and labs', 'Artistic residencies, technological experiments and collaborative work sessions.'],
        ['Regenerative journeys', 'Multi-day experiences that weave several hubs, producers and guides together.'],
      ],
      pathTitle: 'A living pathway',
      pathSub: 'Join one event, discover the next, then find your own way in.',
      path: [
        ['Participate', 'Attend a gathering, a course or a retreat.'],
        ['Contribute', 'Lend skills, time or resources to an ongoing project.'],
        ['Collaborate', 'Co-create experiences and projects with other hubs.'],
        ['Steward', 'Start your own activity and help hold the network.'],
      ],
      rhythmTitle: 'Following the rhythms of nature',
      rhythmSub: 'Seasonal programmes follow the territory; smaller gatherings every lunation keep the network continuous.',
      seasonText: {
        spring: 'Growing, restoration and learning.',
        summer: 'Culture, immersive experiences and regenerative tourism.',
        autumn: 'Harvest, processing, community gatherings and reflection.',
        winter: 'Learning, inner work, planning, technology and deeper collaboration.',
      },
      season: { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter' },
      threshold: { spring: 'Equinox', summer: 'Solstice', autumn: 'Equinox', winter: 'Solstice' },
      youAreHere: 'We are here',
      lunation: 'Lunation',
      nextTitle: 'Next lunations',
      newMoon: 'New moon',
      fullMoon: 'Full moon',
      current: 'now',
      calendar: 'Full calendar',
      quests: 'Open quests',
    },
    it: {
      eyebrow: 'Una rete di eventi continui',
      title: "L'evento finisce, <em>i suoi effetti continuano</em>",
      sub: "Gli eventi sono momenti in cui saperi, risorse, relazioni, cultura e attività economica convergono. Li coordiniamo tra i luoghi e lungo l'anno, perché ognuno porti da qualche parte.",
      ripplesTitle: "Più di un'esperienza da consumare",
      ripples: [
        ['Un corso di permacultura', 'fa conoscere ai partecipanti un agricoltore locale', 'i cui prodotti entrano in una rete alimentare di comunità.'],
        ['Un ritiro di benessere', 'crea domanda di posti letto, pasti e servizi', 'forniti da più iniziative vicine.'],
        ['Una festa di comunità', 'genera reddito per i produttori locali', 'e porta nuovi volontari e organizzatori ai progetti di ripristino.'],
      ],
      formatsTitle: 'Cosa succede nella rete',
      formats: [
        ['Incontri', 'Cene di comunità, feste culturali, mercati locali e serate di luna piena.'],
        ['Corsi', 'Permacultura, bioedilizia, facilitazione, tecnologia aperta — tenuti da chi pratica nella rete.'],
        ['Ritiri', 'Benessere, lavoro interiore, ascolto profondo e tempo con la terra.'],
        ['Giornate di ripristino', 'Cantieri pratici per rigenerare suolo, acqua, edifici e paesaggi.'],
        ['Residenze e laboratori', 'Residenze artistiche, sperimentazioni tecnologiche e sessioni di lavoro collaborativo.'],
        ['Viaggi rigenerativi', 'Esperienze di più giorni che intrecciano hub, produttori e guide diverse.'],
      ],
      pathTitle: 'Un percorso vivo',
      pathSub: 'Partecipa a un evento, scopri il successivo, poi trova la tua strada.',
      path: [
        ['Partecipa', 'Vieni a un incontro, un corso o un ritiro.'],
        ['Contribuisci', 'Offri competenze, tempo o risorse a un progetto in corso.'],
        ['Collabora', 'Co-crea esperienze e progetti con altri hub.'],
        ['Custodisci', 'Avvia una tua attività e aiuta a tenere viva la rete.'],
      ],
      rhythmTitle: 'Seguendo i ritmi della natura',
      rhythmSub: 'I programmi stagionali seguono il territorio; incontri più piccoli a ogni lunazione rendono la rete continua.',
      seasonText: {
        spring: 'Coltivare, ripristinare, imparare.',
        summer: 'Cultura, esperienze immersive e turismo rigenerativo.',
        autumn: 'Raccolto, trasformazione, incontri di comunità e riflessione.',
        winter: 'Formazione, lavoro interiore, progettazione, tecnologia e collaborazione profonda.',
      },
      season: { spring: 'Primavera', summer: 'Estate', autumn: 'Autunno', winter: 'Inverno' },
      threshold: { spring: 'Equinozio', summer: 'Solstizio', autumn: 'Equinozio', winter: 'Solstizio' },
      youAreHere: 'Siamo qui',
      lunation: 'Lunazione',
      nextTitle: 'Prossime lunazioni',
      newMoon: 'Luna nuova',
      fullMoon: 'Luna piena',
      current: 'ora',
      calendar: 'Calendario completo',
      quests: 'Quest aperte',
    },
  });

  const formatIcons = [Flame, GraduationCap, Tent, Hammer, Palette, Compass];

  const cycle = now();
  const lunations = upcoming(3);
  const thresholds = seasons(4);

  const locale = lang === 'it' ? 'it-IT' : 'en-GB';
  const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtShort = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' });

  // The lunar wheel: the moon travelling around one cycle.
  const R = 120;
  const angle = cycle.phase * 2 * Math.PI - Math.PI / 2;
  const marker = { x: Math.cos(angle) * R, y: Math.sin(angle) * R };
  const moonAt = (i) => {
    const a = (i / 4) * 2 * Math.PI - Math.PI / 2;
    return { x: Math.cos(a) * (R + 30), y: Math.sin(a) * (R + 30) };
  };
</script>

<section id="rn-events" class="rg-section rg-dark events">
  <div class="rg-container">
    <div class="heading" data-reveal>
      <p class="rg-eyebrow">{t.eyebrow}</p>
      <h2 class="rg-h2">{@html t.title}</h2>
      <p class="rg-sub">{t.sub}</p>
    </div>

    <h3 class="block-title" data-reveal>{t.ripplesTitle}</h3>
    <ol class="ripples" data-reveal="stagger">
      {#each t.ripples as [event, then, after]}
        <li>
          <span class="r-event">{event}</span>
          <span class="r-step"><ArrowRight size={14} /> {then}</span>
          <span class="r-step"><ArrowRight size={14} /> {after}</span>
        </li>
      {/each}
    </ol>

    <h3 class="block-title" data-reveal>{t.formatsTitle}</h3>
    <ul class="formats" data-reveal="stagger">
      {#each t.formats as [name, body], i}
        <li>
          <svelte:component this={formatIcons[i]} size={22} strokeWidth={1.5} />
          <h4>{name}</h4>
          <p>{body}</p>
        </li>
      {/each}
    </ul>

    <div class="path" data-reveal>
      <div>
        <h3 class="block-title">{t.pathTitle}</h3>
        <p class="path-sub">{t.pathSub}</p>
      </div>
      <ol>
        {#each t.path as [step, body], i}
          <li>
            <span class="p-num">{i + 1}</span>
            <h4>{step}</h4>
            <p>{body}</p>
          </li>
        {/each}
      </ol>
    </div>

    <div class="rhythm">
      <div class="r-head" data-reveal>
        <h3 class="block-title">{t.rhythmTitle}</h3>
        <p class="path-sub">{t.rhythmSub}</p>
      </div>

      <ul class="seasons" data-reveal="stagger">
        {#each thresholds as s, i}
          <li class:next={i === 0}>
            <span class="s-when">{t.threshold[s.key]} ≈ {fmt.format(s.date)}</span>
            <h4>{t.season[s.key]}</h4>
            <p>{t.seasonText[s.key]}</p>
          </li>
        {/each}
      </ul>

      <div class="lunar" data-reveal>
        <div class="wheel">
          <svg viewBox="-170 -170 340 340" role="img" aria-label="{t.lunation} {cycle.index}, {t.youAreHere} {cycle.day}/{cycle.days}">
            <circle r={R} class="track" />
            {#each [0, 0.25, 0.5, 0.75] as ph, i}
              <g transform="translate({moonAt(i).x - 9},{moonAt(i).y - 9})">
                <Moon phase={ph} size={18} />
              </g>
            {/each}
            <circle cx={marker.x} cy={marker.y} r="7" class="marker" />
            <circle cx={marker.x} cy={marker.y} r="14" class="marker-halo" />
            <text y="-6" class="center-big">{t.lunation} {cycle.index}</text>
            <text y="20" class="center-small">{t.youAreHere} · {cycle.day}/{cycle.days}</text>
          </svg>
        </div>
        <div class="list">
          <h4>{t.nextTitle}</h4>
          <ul>
            {#each lunations as l}
              <li class:current={l.current}>
                <span class="num">{l.index}</span>
                <span class="dates">
                  <span><Moon phase={0} size={14} /> {t.newMoon} {fmtShort.format(l.newMoon)}</span>
                  <span><Moon phase={0.5} size={14} /> {t.fullMoon} ≈ {fmtShort.format(l.fullMoon)}</span>
                </span>
                {#if l.current}<span class="tag">{t.current}</span>{/if}
              </li>
            {/each}
          </ul>
          <div class="actions">
            <a class="rg-btn rg-btn-gold" href="/lunations.html">{t.calendar} <ArrowRight class="arrow" size={16} /></a>
            <a class="rg-btn rg-btn-ghost" href="/quests.html">{t.quests}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .events {
    background:
      radial-gradient(ellipse 60% 50% at 85% 10%, rgba(63, 106, 69, 0.25), transparent 70%),
      var(--rg-night);
  }

  .heading { max-width: 760px; margin-bottom: 5rem; }

  .block-title {
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: 300;
    margin-bottom: 1.75rem;
  }

  .ripples {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 6rem;
  }

  .ripples li {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 1.75rem 1.6rem;
    border-radius: 16px;
    border: 1px solid rgba(201, 163, 91, 0.3);
    background: linear-gradient(160deg, rgba(201, 163, 91, 0.08), transparent 60%);
  }

  .r-event {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.5rem;
    color: var(--rg-gold-soft);
  }

  .r-step {
    display: flex;
    gap: 0.6rem;
    align-items: baseline;
    font-size: 0.92rem;
    color: rgba(244, 239, 228, 0.8);
  }

  .r-step :global(svg) { color: var(--rg-gold); position: relative; top: 2px; }
  .r-step + .r-step { padding-left: 1.2rem; }

  .formats {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 6rem;
  }

  .formats li {
    padding: 1.75rem 1.5rem;
    background: var(--rg-night-2);
    border-radius: 16px;
    border: 1px solid rgba(244, 239, 228, 0.06);
    transition: transform 0.4s var(--rg-ease), border-color 0.4s ease;
  }

  .formats li:hover {
    transform: translateY(-4px);
    border-color: rgba(201, 163, 91, 0.4);
  }

  .formats :global(svg) { color: var(--rg-gold); }

  .formats h4, .path h4, .seasons h4 {
    font-size: 1.35rem;
    color: var(--rg-cream);
    margin: 0.9rem 0 0.4rem;
  }

  .formats p, .path p, .seasons p { font-size: 0.88rem; line-height: 1.65; }

  .path {
    display: grid;
    grid-template-columns: 1fr 2.4fr;
    gap: 3rem;
    padding: 3rem;
    border-radius: 20px;
    border: 1px solid rgba(244, 239, 228, 0.1);
    margin-bottom: 7rem;
  }

  .path-sub { font-size: 0.95rem; }

  .path ol {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
    position: relative;
  }

  .path ol::before {
    content: "";
    position: absolute;
    top: 18px;
    left: 18px;
    right: 18px;
    height: 1px;
    background: linear-gradient(90deg, var(--rg-gold), rgba(201, 163, 91, 0.15));
  }

  .path li { position: relative; }
  .path h4 { margin-top: 1rem; }

  .p-num {
    position: relative;
    display: inline-flex;
    width: 36px;
    height: 36px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--rg-night);
    border: 1px solid var(--rg-gold);
    color: var(--rg-gold-soft);
    font-family: "Cormorant Garamond", serif;
    font-size: 1.1rem;
  }

  .r-head { max-width: 640px; margin-bottom: 2rem; }
  .r-head .block-title { margin-bottom: 0.75rem; }

  .seasons {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .seasons li {
    padding: 1.5rem;
    border-radius: 16px;
    border: 1px solid rgba(244, 239, 228, 0.1);
  }

  .seasons li.next {
    border-color: rgba(201, 163, 91, 0.6);
    background: rgba(201, 163, 91, 0.08);
  }

  .seasons h4 { margin-top: 0.3rem; }

  .s-when {
    font-size: 0.64rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    font-weight: 600;
    color: var(--rg-gold);
  }

  .lunar {
    display: grid;
    grid-template-columns: 1fr 1.3fr;
    gap: 3rem;
    align-items: center;
    padding: 2.5rem 3rem;
    border-radius: 20px;
    background: var(--rg-night-2);
  }

  .wheel svg { width: 100%; max-width: 320px; display: block; margin: 0 auto; overflow: visible; }

  .track { fill: none; stroke: rgba(244, 239, 228, 0.12); stroke-width: 2; }
  .marker { fill: #f3dcaa; }

  .marker-halo {
    fill: none;
    stroke: var(--rg-gold);
    stroke-width: 1;
    opacity: 0.6;
    transform-box: fill-box;
    transform-origin: center;
    animation: halo 2.6s ease-out infinite;
  }

  @keyframes halo {
    from { transform: scale(0.6); opacity: 0.8; }
    to { transform: scale(1.8); opacity: 0; }
  }

  .center-big {
    text-anchor: middle;
    fill: var(--rg-cream);
    font-family: "Cormorant Garamond", serif;
    font-size: 26px;
    font-style: italic;
  }

  .center-small {
    text-anchor: middle;
    fill: var(--rg-gold);
    font-size: 10px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    font-weight: 600;
  }

  .list h4 { font-size: 1.5rem; color: var(--rg-cream); margin-bottom: 0.5rem; }
  .list ul { list-style: none; margin-bottom: 1.75rem; }

  .list li {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid rgba(244, 239, 228, 0.08);
    font-size: 0.9rem;
    color: rgba(244, 239, 228, 0.8);
  }

  .num {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.5rem;
    font-style: italic;
    color: var(--rg-cream);
    min-width: 3.2rem;
  }

  .current .num { color: var(--rg-gold-soft); }

  .dates { display: flex; flex-direction: column; gap: 0.2rem; flex: 1; }
  .dates span { display: inline-flex; align-items: center; gap: 0.5rem; }

  .tag {
    font-size: 0.62rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--rg-night);
    background: var(--rg-gold);
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
  }

  .actions { display: flex; flex-wrap: wrap; gap: 1rem; }

  @media (max-width: 1000px) {
    .ripples { grid-template-columns: 1fr; }
    .formats, .seasons { grid-template-columns: 1fr 1fr; }
    .path { grid-template-columns: 1fr; gap: 2rem; }
  }

  @media (max-width: 760px) {
    .path { padding: 2rem 1.25rem; }
    .path ol { grid-template-columns: 1fr 1fr; gap: 1.75rem 1.25rem; }
    .path ol::before { display: none; }
    .lunar { grid-template-columns: 1fr; padding: 2rem 1.25rem; }
  }

  @media (max-width: 520px) {
    .formats, .seasons { grid-template-columns: 1fr; }
  }
</style>

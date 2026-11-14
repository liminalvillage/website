<script>
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import { pick } from './i18n.js';
  import { docsPages } from './links.js';

  const t = pick({
    en: {
      eyebrow: 'The regenerative flywheel',
      title: 'Participation that <em>feeds itself</em>',
      sub: 'The strength of the network lies in how its activities reinforce one another. Regeneration becomes a continuous process rather than a sequence of disconnected interventions.',
      steps: [
        ['Participation', 'An attractive experience brings people into the network.'],
        ['Contributions', 'Income, time, relationships and knowledge flow to the people and places that made it possible.'],
        ['Capacity', 'Hubs become more capable and economically resilient, and new projects can start.'],
        ['Opportunities', 'More experiences and services attract more participants, organisers and partners.'],
      ],
      tools: 'Shared digital tools and governance practices reduce the effort of coordinating a growing network, while accumulated knowledge makes it easier for new nodes to join.',
      measureTitle: 'Measuring what really matters',
      measure: 'Attendance, revenue and the number of events are useful, but not enough. We want to understand whether our activities:',
      indicators: [
        'create lasting relationships',
        'strengthen community capabilities',
        'improve livelihoods',
        'restore ecosystems',
        'reduce waste',
        'widen access to resources',
        'help new initiatives emerge',
      ],
      measureSub: 'We document needs, contributions, resources and outcomes in practical ways, avoiding unnecessary bureaucracy and respecting privacy, to learn from real evidence and find patterns worth replicating.',
      success: 'An event succeeds not only when people enjoy it, but when it leaves the people, the place and the wider ecosystem <em>better positioned to thrive</em>.',
      framework: 'Regenerative Impact Framework',
    },
    it: {
      eyebrow: 'Il volano rigenerativo',
      title: 'Una partecipazione che <em>si autoalimenta</em>',
      sub: 'La forza della rete sta nel modo in cui le sue attività si rafforzano a vicenda. La rigenerazione diventa un processo continuo, non una serie di interventi scollegati.',
      steps: [
        ['Partecipazione', "Un'esperienza attraente porta persone nella rete."],
        ['Contributi', 'Reddito, tempo, relazioni e saperi arrivano alle persone e ai luoghi che l\'hanno resa possibile.'],
        ['Capacità', 'Gli hub diventano più capaci ed economicamente resilienti, e nascono nuovi progetti.'],
        ['Opportunità', 'Più esperienze e servizi attirano più partecipanti, organizzatori e partner.'],
      ],
      tools: 'Strumenti digitali e pratiche di governance condivise riducono la fatica di coordinare una rete che cresce, mentre il sapere accumulato rende più facile l\'ingresso di nuovi nodi.',
      measureTitle: 'Misurare ciò che conta davvero',
      measure: 'Presenze, ricavi e numero di eventi sono utili, ma non bastano. Vogliamo capire se le nostre attività:',
      indicators: [
        'creano relazioni durature',
        'rafforzano le capacità della comunità',
        'migliorano i mezzi di sussistenza',
        'ripristinano gli ecosistemi',
        'riducono gli sprechi',
        "ampliano l'accesso alle risorse",
        'fanno nascere nuove iniziative',
      ],
      measureSub: 'Documentiamo bisogni, contributi, risorse e risultati in modo pratico, evitando burocrazia inutile e rispettando la privacy, per imparare da evidenze reali e trovare schemi da replicare.',
      success: "Un evento riesce non solo quando piace a chi partecipa, ma quando lascia le persone, il luogo e l'ecosistema più ampio <em>in condizioni migliori per prosperare</em>.",
      framework: 'Regenerative Impact Framework',
    },
  });

  // Four stations clockwise from the top.
  const R = 130;
  const at = (i) => {
    const a = (i / 4) * 2 * Math.PI - Math.PI / 2;
    return { x: Math.cos(a) * R, y: Math.sin(a) * R };
  };
  // Arrowheads a little before each station, pointing along the circle.
  const head = (i) => {
    const a = ((i + 0.78) / 4) * 2 * Math.PI - Math.PI / 2;
    return { x: Math.cos(a) * R, y: Math.sin(a) * R, deg: (a * 180) / Math.PI + 90 };
  };
</script>

<section id="rn-flywheel" class="rg-section rg-dark flywheel">
  <div class="rg-container">
    <div class="heading" data-reveal>
      <p class="rg-eyebrow">{t.eyebrow}</p>
      <h2 class="rg-h2">{@html t.title}</h2>
      <p class="rg-sub">{t.sub}</p>
    </div>

    <div class="wheel-wrap">
      <div class="wheel" data-reveal>
        <svg viewBox="-170 -170 340 340" aria-hidden="true">
          <circle r={R} class="track" />
          <circle r={R} class="flow" />
          {#each t.steps as _, i}
            <path d="M-6,4 L0,-6 L6,4 Z" class="head" transform="translate({head(i).x},{head(i).y}) rotate({head(i).deg})" />
            <circle cx={at(i).x} cy={at(i).y} r="22" class="station" />
            <text x={at(i).x} y={at(i).y + 6} class="station-num">{i + 1}</text>
          {/each}
        </svg>
      </div>

      <ol class="steps" data-reveal="stagger">
        {#each t.steps as [name, body], i}
          <li>
            <span class="s-num">{i + 1}</span>
            <div>
              <h3>{name}</h3>
              <p>{body}</p>
            </div>
          </li>
        {/each}
      </ol>
    </div>

    <p class="tools" data-reveal>{t.tools}</p>

    <div class="measure">
      <div data-reveal>
        <h3>{t.measureTitle}</h3>
        <p>{t.measure}</p>
        <ul class="chips">
          {#each t.indicators as ind}<li>{ind}</li>{/each}
        </ul>
        <p class="m-sub">{t.measureSub}</p>
        <a class="rg-btn rg-btn-ghost" href={docsPages.impact} target="_blank" rel="noopener noreferrer">
          {t.framework} <ArrowUpRight class="arrow" size={16} />
        </a>
      </div>
      <blockquote data-reveal>{@html t.success}</blockquote>
    </div>
  </div>
</section>

<style>
  .flywheel {
    background:
      radial-gradient(ellipse 60% 50% at 15% 20%, rgba(63, 106, 69, 0.28), transparent 70%),
      var(--rg-night);
  }

  .heading { max-width: 760px; margin-bottom: 4rem; }

  .wheel-wrap {
    display: grid;
    grid-template-columns: 1fr 1.15fr;
    gap: 4rem;
    align-items: center;
  }

  .wheel svg { width: 100%; max-width: 380px; display: block; margin: 0 auto; }

  .track { fill: none; stroke: rgba(244, 239, 228, 0.1); stroke-width: 14; }

  .flow {
    fill: none;
    stroke: var(--rg-gold);
    stroke-width: 1.5;
    stroke-dasharray: 4 10;
    animation: flow 6s linear infinite;
  }

  @keyframes flow { to { stroke-dashoffset: -140; } }

  .head { fill: var(--rg-gold-soft); }
  .station { fill: var(--rg-night-2); stroke: var(--rg-gold); stroke-width: 1.5; }

  .station-num {
    text-anchor: middle;
    fill: var(--rg-cream);
    font-family: "Cormorant Garamond", serif;
    font-size: 20px;
  }

  .steps { list-style: none; display: grid; gap: 1rem; }

  .steps li {
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
    padding: 1.25rem 1.5rem;
    border-radius: 14px;
    border: 1px solid rgba(244, 239, 228, 0.1);
  }

  .s-num {
    flex-shrink: 0;
    display: inline-flex;
    width: 34px;
    height: 34px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid var(--rg-gold);
    color: var(--rg-gold-soft);
    font-family: "Cormorant Garamond", serif;
    font-size: 1.05rem;
  }

  .steps h3 { font-size: 1.45rem; margin-bottom: 0.2rem; }
  .steps p { font-size: 0.9rem; line-height: 1.65; }

  .tools {
    max-width: 780px;
    margin: 3.5rem auto 7rem;
    text-align: center;
    font-size: 1rem;
  }

  .measure {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 4rem;
    align-items: center;
    padding: 3rem;
    border-radius: 20px;
    background: var(--rg-night-2);
  }

  .measure h3 { font-size: clamp(1.7rem, 3vw, 2.3rem); font-weight: 300; margin-bottom: 0.75rem; }

  .chips {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1.25rem 0 1.5rem;
  }

  .chips li {
    padding: 0.35rem 0.9rem;
    border-radius: 999px;
    border: 1px solid rgba(201, 163, 91, 0.45);
    color: var(--rg-gold-soft);
    font-size: 0.82rem;
  }

  .m-sub { font-size: 0.9rem; margin-bottom: 1.75rem; }

  blockquote {
    font-family: "Cormorant Garamond", serif;
    font-size: clamp(1.5rem, 2.6vw, 2rem);
    font-weight: 300;
    line-height: 1.3;
    color: var(--rg-cream);
    padding-left: 1.75rem;
    border-left: 2px solid var(--rg-gold);
  }

  blockquote :global(em) { color: var(--rg-gold-soft); }

  @media (max-width: 900px) {
    .wheel-wrap, .measure { grid-template-columns: 1fr; gap: 2.5rem; }
    .wheel svg { max-width: 260px; }
    .measure { padding: 2rem 1.25rem; }
    .tools { text-align: left; margin: 2.5rem 0 5rem; }
  }
</style>

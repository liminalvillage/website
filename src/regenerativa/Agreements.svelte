<script>
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import ScrollText from '@lucide/svelte/icons/scroll-text';
  import { lang, pick } from './i18n.js';
  import { DOCS, docsPages, agreementUrl } from './links.js';

  const t = pick({
    en: {
      eyebrow: 'Shared agreements',
      title: 'The minimum <em>we hold in common</em>',
      sub: 'Every holon keeps its own culture and governance, and agrees only to the minimum shared principles needed to cooperate. These are ours: a small constellation of clear, public agreements for everyone who hosts, stewards, teaches, builds or gives within the network.',
      quote: 'An agreement here is not a transaction. It is a plain way of naming what you and the network each offer and protect.',
      hint: 'Choose a star',
      door: 'The door',
      read: 'Read the agreement',
      agreements: {
        Ownership: 'You have a place and want to lend it to the network for good use, without selling it or losing control of it.',
        Membership: 'You want to belong to the network and take part in its democratic life. The first step, and the doorway to every other role.',
        Stewardship: 'You look after one space day to day, holding the place and its people well — a trusted guardian, not a tenant or employee.',
        Mentorship: 'You have real expertise and teach it through programmes, offered first to those who have given the most.',
        Sponsorship: 'You give money, tools, land or time to the network as a gift, without buying influence over how it is used.',
        Partnership: 'You team up with others on a project, sharing what it earns by what each person actually contributed.',
        Intrapreneurship: 'You see a real, unmet need in the network and build something to meet it, grown inside the commons and serving it first.',
        Eldership: 'You have given over a long time and step into guidance and witness, helping hold the whole rather than running a part.',
      },
      stackable: 'No role is higher than another. Hold only the agreements that match what you do, several at once, and step back when life changes.',
      companionTitle: 'Start here',
      companion: [
        ['overview', 'Constellation Overview', 'The plain-language tour — a 3-minute read'],
        ['intro', 'Introduction', 'The deeper why behind the agreements'],
        ['terms', 'General Terms and Conditions', 'The shared rulebook, including the Regenerative Covenant'],
        ['statute', 'Statute of ReGenerativa APS', 'Our purpose as a non-profit, above every agreement'],
        ['safeguarding', 'Safeguarding and Code of Conduct', 'How we keep each other safe at every event'],
        ['fund', 'The Fund in Plain Language', 'How the network’s money moves, and where it goes'],
      ],
      open: 'Open docs.regenerativa.earth',
    },
    it: {
      eyebrow: 'Accordi condivisi',
      title: 'Il minimo <em>che teniamo in comune</em>',
      sub: 'Ogni olone mantiene la propria cultura e governance, e condivide solo i principi minimi necessari per cooperare. Questi sono i nostri: una piccola costellazione di accordi chiari e pubblici per chi ospita, custodisce, insegna, costruisce o dona nella rete.',
      quote: 'Qui un accordo non è una transazione. È un modo semplice per dire cosa tu e la rete vi offrite e cosa proteggete.',
      hint: 'Scegli una stella',
      door: 'La porta',
      read: "Leggi l'accordo",
      agreements: {
        Ownership: 'Hai un luogo e vuoi affidarlo alla rete per un buon uso, senza venderlo né perderne il controllo.',
        Membership: 'Vuoi far parte della rete e della sua vita democratica. Il primo passo, e la porta verso ogni altro ruolo.',
        Stewardship: 'Ti prendi cura di uno spazio ogni giorno, del luogo e delle sue persone — un custode di fiducia, non un inquilino né un dipendente.',
        Mentorship: 'Hai una competenza vera e la insegni con dei programmi, offerti prima a chi ha dato di più.',
        Sponsorship: 'Doni denaro, strumenti, terra o tempo alla rete, senza comprare influenza su come vengono usati.',
        Partnership: 'Collabori con altri a un progetto, dividendo ciò che genera in base a quanto ciascuno ha davvero contribuito.',
        Intrapreneurship: 'Vedi un bisogno reale e scoperto nella rete e costruisci qualcosa per rispondere, cresciuto nei beni comuni e al loro servizio.',
        Eldership: 'Hai dato a lungo e ti metti al servizio come guida e testimone, aiutando a tenere insieme il tutto.',
      },
      names: {
        Ownership: 'Proprietà', Membership: 'Adesione', Stewardship: 'Custodia', Mentorship: 'Mentorato',
        Sponsorship: 'Sostegno', Partnership: 'Partenariato', Intrapreneurship: 'Imprenditorialità interna', Eldership: 'Ruolo degli anziani',
      },
      stackable: 'Nessun ruolo è più in alto di un altro. Sottoscrivi solo gli accordi che corrispondono a ciò che fai, anche più di uno, e fai un passo indietro quando la vita cambia.',
      companionTitle: 'Da dove iniziare',
      companion: [
        ['overview', 'Constellation Overview', 'Il giro in parole semplici — 3 minuti di lettura'],
        ['intro', 'Introduction', 'Il perché profondo degli accordi'],
        ['terms', 'General Terms and Conditions', 'Il regolamento comune, con il Patto Rigenerativo'],
        ['statuto', 'Statuto di ReGenerativa APS', 'Il nostro scopo come ente non profit, sopra ogni accordo'],
        ['safeguarding', 'Safeguarding and Code of Conduct', 'Come ci proteggiamo a vicenda in ogni evento'],
        ['fund', 'The Fund in Plain Language', 'Come si muove il denaro della rete, e dove va'],
      ],
      note: 'I documenti sono in inglese; lo Statuto è disponibile anche in italiano.',
      open: 'Apri docs.regenerativa.earth',
    },
  });

  // The constellation: positions in a 600×380 sky, and the lines that join them.
  const stars = [
    { n: 1, key: 'Ownership', x: 70, y: 250 },
    { n: 2, key: 'Membership', x: 190, y: 165, door: true },
    { n: 3, key: 'Stewardship', x: 285, y: 265 },
    { n: 4, key: 'Mentorship', x: 315, y: 95 },
    { n: 5, key: 'Sponsorship', x: 445, y: 55 },
    { n: 6, key: 'Partnership', x: 420, y: 200 },
    { n: 7, key: 'Intrapreneurship', x: 520, y: 305 },
    { n: 8, key: 'Eldership', x: 545, y: 150 },
  ];
  const lines = [[1, 2], [2, 3], [2, 4], [4, 5], [3, 6], [4, 6], [6, 7], [6, 8], [5, 8]];
  const at = (n) => stars[n - 1];
  // Agreement titles stay in English, as on docs.regenerativa.earth; Italian gets a gloss.
  const gloss = (key) => t.names?.[key];

  let selected = 2;
  $: s = at(selected);

  function keydown(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') selected = (selected % 8) + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') selected = ((selected + 6) % 8) + 1;
    else return;
    e.preventDefault();
    document.getElementById(`rn-star-${selected}`)?.focus();
  }
</script>

<section id="rn-agreements" class="rg-section agreements">
  <div class="rg-container">
    <div class="heading" data-reveal>
      <p class="rg-eyebrow">{t.eyebrow}</p>
      <h2 class="rg-h2">{@html t.title}</h2>
      <p class="rg-sub">{t.sub}</p>
    </div>

    <div class="board" data-reveal>
      <div class="sky">
        <svg viewBox="0 0 600 380" aria-hidden="true">
          {#each lines as [a, b]}
            <line
              x1={at(a).x} y1={at(a).y} x2={at(b).x} y2={at(b).y}
              class:lit={a === selected || b === selected}
            />
          {/each}
        </svg>
        <div class="stars" role="radiogroup" aria-label={t.hint}>
          {#each stars as st}
            <button
              id="rn-star-{st.n}"
              class="star"
              class:on={st.n === selected}
              class:door={st.door}
              style="left: {(st.x / 600) * 100}%; top: {(st.y / 380) * 100}%"
              role="radio"
              aria-checked={st.n === selected}
              tabindex={st.n === selected ? 0 : -1}
              on:click={() => (selected = st.n)}
              on:keydown={keydown}
            >
              <span class="dot"></span>
              <span class="label">{st.key}</span>
            </button>
          {/each}
        </div>
        <p class="hint">{t.hint}</p>
      </div>

      <div class="detail" aria-live="polite">
        <p class="num">{String(s.n).padStart(2, '0')} / 08 {#if s.door}<span class="door-tag">{t.door}</span>{/if}</p>
        <h3>{s.key}</h3>
        {#if gloss(s.key)}<p class="gloss">{gloss(s.key)}</p>{/if}
        <p class="desc">{t.agreements[s.key]}</p>
        <a class="rg-btn rg-btn-gold" href={agreementUrl(s.n, s.key)} target="_blank" rel="noopener noreferrer">
          {t.read} <ArrowUpRight class="arrow" size={16} />
        </a>
        <p class="stack">{t.stackable}</p>
      </div>
    </div>

    <blockquote class="quote" data-reveal>“{t.quote}”</blockquote>

    <div class="companion">
      <h3 data-reveal>{t.companionTitle}</h3>
      <ul data-reveal="stagger">
        {#each t.companion as [key, title, body]}
          <li>
            <a href={docsPages[key]} target="_blank" rel="noopener noreferrer" hreflang={key === 'statuto' ? 'it' : 'en'}>
              <span class="c-title">{title} <ArrowUpRight size={15} /></span>
              <span class="c-body">{body}</span>
            </a>
          </li>
        {/each}
      </ul>
      {#if t.note}<p class="note">{t.note}</p>{/if}
      <a class="rg-btn rg-btn-dark open" href={DOCS} target="_blank" rel="noopener noreferrer">
        <ScrollText size={16} /> {t.open}
      </a>
    </div>
  </div>
</section>

<style>
  .agreements {
    background: var(--rg-cream);
  }

  .heading {
    max-width: 720px;
    margin-bottom: 3.5rem;
  }

  .board {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    border-radius: 24px;
    overflow: hidden;
    background: var(--rg-night);
    color: var(--rg-cream);
  }

  .sky {
    position: relative;
    padding: 2.5rem;
    background:
      radial-gradient(ellipse 70% 70% at 40% 50%, rgba(63, 106, 69, 0.3), transparent 70%),
      var(--rg-night);
  }

  .sky svg {
    display: block;
    width: 100%;
    height: auto;
  }

  line {
    stroke: rgba(244, 239, 228, 0.16);
    stroke-width: 1;
    transition: stroke 0.4s ease;
  }

  line.lit {
    stroke: rgba(221, 185, 121, 0.7);
  }

  .stars {
    position: absolute;
    inset: 2.5rem;
  }

  .star {
    position: absolute;
    transform: translate(-50%, -50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.6rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.45rem;
    color: rgba(244, 239, 228, 0.65);
    font: inherit;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--rg-cream);
    box-shadow: 0 0 0 4px rgba(244, 239, 228, 0.08), 0 0 14px rgba(244, 239, 228, 0.4);
    transition: transform 0.4s var(--rg-ease), background 0.3s ease, box-shadow 0.4s ease;
  }

  .door .dot {
    width: 16px;
    height: 16px;
  }

  .label {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.05rem;
    font-style: italic;
    letter-spacing: 0.5px;
    white-space: nowrap;
    transition: color 0.3s ease;
  }

  .star:hover,
  .star.on {
    color: var(--rg-gold-soft);
  }

  .star:hover .dot {
    transform: scale(1.25);
  }

  .star.on .dot {
    background: #f3dcaa;
    transform: scale(1.4);
    box-shadow: 0 0 0 6px rgba(201, 163, 91, 0.2), 0 0 26px rgba(221, 185, 121, 0.9);
  }

  .hint {
    position: absolute;
    left: 2.5rem;
    bottom: 1.25rem;
    font-size: 0.66rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(244, 239, 228, 0.4);
  }

  .detail {
    padding: 3rem 2.75rem;
    background: var(--rg-night-2);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .num {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.72rem;
    letter-spacing: 3px;
    color: var(--rg-gold);
    font-weight: 600;
  }

  .door-tag {
    font-size: 0.6rem;
    padding: 0.15rem 0.6rem;
    border-radius: 999px;
    border: 1px solid var(--rg-gold);
    text-transform: uppercase;
  }

  .detail h3 {
    color: var(--rg-cream);
    font-size: clamp(2rem, 3.5vw, 2.8rem);
    font-weight: 300;
    margin: 0.5rem 0 1rem;
  }

  .gloss {
    margin: -0.6rem 0 1rem;
    color: var(--rg-gold-soft);
    font-family: "Cormorant Garamond", serif;
    font-style: italic;
    font-size: 1.15rem;
  }

  .desc {
    color: rgba(244, 239, 228, 0.82);
    font-size: 1rem;
    margin-bottom: 2rem;
    min-height: 5.6em;
  }

  .stack {
    margin-top: auto;
    padding-top: 2rem;
    font-size: 0.85rem;
    color: rgba(244, 239, 228, 0.55);
  }

  .quote {
    font-family: "Cormorant Garamond", serif;
    font-style: italic;
    font-size: clamp(1.5rem, 2.8vw, 2.1rem);
    font-weight: 300;
    line-height: 1.3;
    color: var(--rg-bark);
    max-width: 820px;
    margin: 5rem auto;
    text-align: center;
  }

  .companion h3 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  .companion ul {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .companion li a {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    height: 100%;
    padding: 1.4rem 1.5rem;
    border: 1px solid var(--rg-line);
    border-radius: 14px;
    background: var(--rg-cream-soft);
    color: inherit;
    transition: border-color 0.3s ease, transform 0.4s var(--rg-ease);
  }

  .companion li a:hover {
    border-color: var(--rg-forest);
    transform: translateY(-3px);
  }

  .c-title {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: "Cormorant Garamond", serif;
    font-size: 1.3rem;
    color: var(--rg-bark);
  }

  .c-title :global(svg) { color: var(--rg-forest); }

  .c-body {
    color: var(--rg-muted);
    font-size: 0.88rem;
  }

  .note {
    margin-top: 1.25rem;
    font-size: 0.88rem;
    color: var(--rg-muted);
  }

  .open {
    margin-top: 2rem;
  }

  @media (max-width: 1000px) {
    .board { grid-template-columns: 1fr; }
    .companion ul { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 640px) {
    .sky { padding: 1.5rem 1rem 2.5rem; }
    .stars { inset: 1.5rem 1rem 2.5rem; }
    .label { font-size: 0.85rem; }
    .star { padding: 0.35rem; }
    .hint { left: 1rem; bottom: 0.9rem; }
    .detail { padding: 2.25rem 1.5rem; }
    .companion ul { grid-template-columns: 1fr; }
  }
</style>

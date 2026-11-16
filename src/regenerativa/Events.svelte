<script>
  import Hammer from '@lucide/svelte/icons/hammer';
  import GraduationCap from '@lucide/svelte/icons/graduation-cap';
  import Tent from '@lucide/svelte/icons/tent';
  import Flame from '@lucide/svelte/icons/flame';
  import Palette from '@lucide/svelte/icons/palette';
  import Compass from '@lucide/svelte/icons/compass';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import Moon from './Moon.svelte';
  import { now, upcoming } from './cycle.js';
  import { lang, pick } from './i18n.js';

  const t = pick({
    en: {
      eyebrow: 'Events',
      title: 'The event ends, <em>its effects continue</em>',
      sub: 'We coordinate gatherings across places and through the year, so that each one leads somewhere.',
      momentsTitle: 'Already happening',
      moments: ['A circle on the hill, Summer Solstice 2026', 'Solstice night, dancing under the canopy', 'Morning circle in the pagoda', 'Around the fire at dusk', 'Olive harvest', 'Evening gathering, as the lights come on', 'Raising a yurt together', 'Live music in the pagoda'],
      formatsTitle: 'What happens in the network',
      formats: [
        ['Gatherings', 'Dinners, celebrations, full-moon evenings.'],
        ['Courses', 'Permaculture, natural building, facilitation.'],
        ['Retreats', 'Inner work and time with the land.'],
        ['Restoration days', 'Hands-on work on soil, water and buildings.'],
        ['Residencies and labs', 'Art, technology, collaborative work.'],
        ['Regenerative journeys', 'Multi-day trips across several hubs.'],
      ],
      rhythmTitle: 'Following the moon',
      rhythmSub: 'A small gathering every lunation, a larger one each season.',
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
      eyebrow: 'Eventi',
      title: "L'evento finisce, <em>i suoi effetti continuano</em>",
      sub: "Coordiniamo gli incontri tra i luoghi e lungo l'anno, perché ognuno porti da qualche parte.",
      momentsTitle: 'Sta già succedendo',
      moments: ['Un cerchio sulla collina, Solstizio d\'estate 2026', 'La notte del Solstizio, danze sotto il telo', 'Cerchio del mattino nella pagoda', 'Attorno al fuoco al tramonto', 'Raccolta delle olive', 'Incontro serale, mentre si accendono le luci', 'Montare una yurta insieme', 'Musica dal vivo nella pagoda'],
      formatsTitle: 'Cosa succede nella rete',
      formats: [
        ['Incontri', 'Cene, feste, serate di luna piena.'],
        ['Corsi', 'Permacultura, bioedilizia, facilitazione.'],
        ['Ritiri', 'Lavoro interiore e tempo con la terra.'],
        ['Giornate di ripristino', 'Lavoro pratico su suolo, acqua ed edifici.'],
        ['Residenze e laboratori', 'Arte, tecnologia, lavoro collaborativo.'],
        ['Viaggi rigenerativi', 'Esperienze di più giorni tra più hub.'],
      ],
      rhythmTitle: 'Seguendo la luna',
      rhythmSub: 'Un piccolo incontro a ogni lunazione, uno più grande a ogni stagione.',
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

  // Real moments from the network, the first one shown largest.
  const photos = ['solstice-circle', 'solstice-night', 'circle-sunlight', 'fire', 'olive-harvest', 'circle-dusk', 'yurt', 'music']
    .map((name, i) => ({ src: `/images/regenerativa/${name}.jpg`, caption: t.moments[i] }));

  const cycle = now();
  const lunations = upcoming(3);

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

    <div class="moments-head" data-reveal>
      <h3 class="block-title">{t.momentsTitle}</h3>
    </div>
    <ul class="moments" data-reveal="stagger">
      {#each photos as ph}
        <li>
          <figure>
            <img src={ph.src} alt={ph.caption} loading="lazy" decoding="async" />
            <figcaption>{ph.caption}</figcaption>
          </figure>
        </li>
      {/each}
    </ul>

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

    <div class="rhythm">
      <div class="r-head" data-reveal>
        <h3 class="block-title">{t.rhythmTitle}</h3>
        <p class="path-sub">{t.rhythmSub}</p>
      </div>


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

  .moments-head { max-width: 640px; margin-bottom: 2rem; }
  .moments-head .block-title { margin-bottom: 0.75rem; }

  .moments {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: 240px;
    gap: 0.75rem;
    margin-bottom: 6rem;
  }

  .moments li:nth-child(1) { grid-column: span 4; grid-row: span 2; }
  .moments li:nth-child(2) { grid-column: span 2; grid-row: span 2; }
  .moments li:nth-child(n + 3) { grid-column: span 2; }

  .moments figure {
    position: relative;
    height: 100%;
    overflow: hidden;
    border-radius: 16px;
    background: var(--rg-night-2);
  }

  .moments img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 1.2s var(--rg-ease);
  }

  .moments figure:hover img { transform: scale(1.04); }

  .moments figcaption {
    position: absolute;
    inset: auto 0 0 0;
    padding: 2.5rem 1.1rem 0.9rem;
    font-size: 0.82rem;
    line-height: 1.4;
    color: var(--rg-cream);
    background: linear-gradient(transparent, rgba(20, 26, 22, 0.85));
  }

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

  .formats h4 {
    font-size: 1.35rem;
    color: var(--rg-cream);
    margin: 0.9rem 0 0.4rem;
  }

  .formats p { font-size: 0.88rem; line-height: 1.65; }

  .path-sub { font-size: 0.95rem; }

  .r-head { max-width: 640px; margin-bottom: 2rem; }
  .r-head .block-title { margin-bottom: 0.75rem; }






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
    .formats { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 760px) {
    .moments { grid-template-columns: 1fr 1fr; grid-auto-rows: 180px; }
    .moments li:nth-child(1) { grid-column: span 2; grid-row: span 2; }
    .moments li:nth-child(n + 2) { grid-column: span 1; grid-row: span 1; }
    .moments li:last-child { grid-column: span 2; }
    .lunar { grid-template-columns: 1fr; padding: 2rem 1.25rem; }
  }

  @media (max-width: 520px) {
    .formats { grid-template-columns: 1fr; }
  }
</style>

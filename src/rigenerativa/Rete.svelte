<script>
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import MapPin from '@lucide/svelte/icons/map-pin';
  import { pick } from './i18n.js';

  const t = pick({
    it: {
      eyebrow: 'La rete',
      title: 'I luoghi che <em>rigeneriamo</em>',
      sub: ["Rigenerativa opera all'interno della rete", ', che unisce comunità, tecnologie e modelli aperti per una civiltà ecologica.'],
      visit: 'Visita il sito',
      sites: [
        ['Hub di innovazione eco-tech', 'Il cuore della rete: un villaggio dove si sperimentano tecnologie aperte, vita comunitaria e progetti rigenerativi.'],
        ['Spazio di co-creazione', "Un'ex fabbrica trasformata in laboratori, co-living e iniziative comunitarie, a dieci minuti da Ascoli Piceno."],
        ['Scuola vivente nel bosco', 'Un rifugio in montagna dedicato al lavoro interiore, alle relazioni profonde e alla cura della terra.'],
      ],
    },
    en: {
      eyebrow: 'The network',
      title: 'The places we <em>regenerate</em>',
      sub: ['Rigenerativa works within the', ' network, which brings together communities, technologies and open models for an ecological civilisation.'],
      visit: 'Visit the website',
      sites: [
        ['Eco-tech innovation hub', 'The heart of the network: a village for experimenting with open technology, community living and regenerative projects.'],
        ['Co-creation space', 'A former factory turned into workshops, co-living and community initiatives, ten minutes from Ascoli Piceno.'],
        ['Living school in the woods', 'A mountain retreat devoted to inner work, deep relationships and care for the land.'],
      ],
    },
  });

  const sites = [
    { name: 'Liminal Village', image: '/images/regenerativa/site-liminal.jpeg', href: 'https://liminalvillage.com' },
    { name: 'ReFactory', image: '/images/regenerativa/site-refactory.jpeg', href: 'https://refactory.earth' },
    { name: 'Casa Selva', image: '/images/regenerativa/site-casaselva.jpeg', href: 'https://casaselva.earth' },
  ].map((s, i) => ({ ...s, role: t.sites[i][0], blurb: t.sites[i][1] }));

  const canHover = typeof matchMedia !== 'undefined'
    && matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches;

  // Cards lean toward the pointer; --mx/--my also place the light sheen.
  function tilt(e) {
    if (!canHover) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - y) * 7}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * 9}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
  }

  function untilt(e) {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }
</script>

<section id="ri-rete" class="rete rg-section">
  <div class="rg-container">
    <div class="heading" data-reveal>
      <p class="rg-eyebrow">{t.eyebrow}</p>
      <h2 class="rg-h2">{@html t.title}</h2>
      <p class="rg-sub">
        {t.sub[0]} <a href="https://regenerativa.earth" target="_blank" rel="noopener noreferrer">ReGenerativa</a>{t.sub[1]}
      </p>
    </div>

    <div class="grid" data-reveal="stagger">
      {#each sites as s, i}
        <a
          class="card"
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          on:pointermove={tilt}
          on:pointerleave={untilt}
        >
          <div class="card-image">
            <img src={s.image} alt="" loading="lazy" />
            <span class="badge"><MapPin size={14} strokeWidth={1.75} />0{i + 1}</span>
          </div>
          <div class="card-body">
            <p class="role">{s.role}</p>
            <h3>{s.name}</h3>
            <p class="blurb">{s.blurb}</p>
            <span class="more">{t.visit} <ArrowUpRight class="arrow" size={16} strokeWidth={1.75} /></span>
          </div>
          <span class="sheen" aria-hidden="true"></span>
        </a>
      {/each}
    </div>
  </div>
</section>

<style>
  .rete {
    background: var(--rg-cream);
    background-image: var(--rg-grain);
  }

  .heading {
    margin-bottom: 4rem;
  }

  .heading a {
    color: var(--rg-forest);
    border-bottom: 1px solid currentColor;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.75rem;
    perspective: 1200px;
  }

  .card {
    --rx: 0deg;
    --ry: 0deg;
    --mx: 50%;
    --my: 0%;
    position: relative;
    display: flex;
    flex-direction: column;
    background: var(--rg-cream-soft);
    border: 1px solid var(--rg-line);
    border-radius: 20px;
    overflow: hidden;
    color: inherit;
    transform: rotateX(var(--rx)) rotateY(var(--ry));
    transform-style: preserve-3d;
    transition: transform 0.6s var(--rg-ease), box-shadow 0.6s var(--rg-ease);
  }

  .card:hover {
    color: inherit;
    box-shadow: 0 30px 60px -20px rgba(44, 53, 39, 0.3);
    transition: transform 0.15s linear, box-shadow 0.6s var(--rg-ease);
  }

  .card-image {
    position: relative;
    height: 240px;
    overflow: hidden;
  }

  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transform: scale(1.02);
    transition: transform 1.2s var(--rg-ease), filter 0.8s ease;
    filter: saturate(0.85);
  }

  .card:hover .card-image img {
    transform: scale(1.1);
    filter: saturate(1.05);
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    position: absolute;
    top: 1rem;
    left: 1rem;
    font-size: 0.7rem;
    letter-spacing: 2px;
    padding: 0.3rem 0.7rem;
    border-radius: 999px;
    background: rgba(27, 34, 26, 0.55);
    backdrop-filter: blur(6px);
    color: var(--rg-cream);
  }

  .card-body {
    padding: 1.75rem 1.85rem 1.85rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .role {
    font-size: 0.7rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    font-weight: 600;
    color: var(--rg-soil);
    margin-bottom: 0.5rem;
  }

  .card h3 {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }

  .blurb {
    color: var(--rg-muted);
    font-size: 0.93rem;
    flex: 1;
    margin-bottom: 1.5rem;
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

  .more :global(.arrow) {
    transition: transform 0.4s var(--rg-ease);
  }

  .card:hover .more :global(.arrow) {
    transform: translate(3px, -3px);
  }

  .sheen {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(circle at var(--mx) var(--my), rgba(255, 255, 255, 0.35), transparent 45%);
    opacity: 0;
    transition: opacity 0.5s ease;
    mix-blend-mode: soft-light;
  }

  .card:hover .sheen {
    opacity: 1;
  }

  @media (max-width: 960px) {
    .grid {
      grid-template-columns: 1fr;
      max-width: 520px;
    }
  }
</style>

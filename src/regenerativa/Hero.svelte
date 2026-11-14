<script>
  import { onMount } from 'svelte';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import Sprout from '@lucide/svelte/icons/sprout';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import { reduced } from '../rigenerativa/motion.js';
  import { sky } from './sky.js';
  import { now } from './cycle.js';
  import { pick } from './i18n.js';
  import Moon from './Moon.svelte';

  const t = pick({
    en: {
      eyebrow: 'ReGenerativa APS · Connect. Contribute. Regenerate.',
      h1: ['A continuous network', 'for <em>integral regeneration</em>'],
      tagline: 'Connecting people, places, projects and resources through experiences that regenerate life. We begin in the Marche, Italy, with a model made to grow into other bioregions.',
      events: 'Find an experience',
      docs: 'Join the network',
      now: 'Now',
      lunation: 'Lunation',
      day: (d, n) => `day ${d} of ${n}`,
      scroll: 'Scroll down',
      spaces: 'Spaces in the network',
    },
    it: {
      eyebrow: 'ReGenerativa APS · Connetti. Contribuisci. Rigenera.',
      h1: ['Una rete continua', 'per la <em>rigenerazione integrale</em>'],
      tagline: 'Connettiamo persone, luoghi, progetti e risorse attraverso esperienze che rigenerano la vita. Partiamo dalle Marche, con un modello pensato per crescere in altre bioregioni.',
      events: "Trova un'esperienza",
      docs: 'Entra nella rete',
      now: 'Ora',
      lunation: 'Lunazione',
      day: (d, n) => `giorno ${d} di ${n}`,
      scroll: 'Scorri in basso',
      spaces: 'Spazi della rete',
    },
  });

  // Where the three spaces sit in the sky (unit coordinates of the canvas).
  const spaces = [
    { name: 'Liminal Village', x: 0.7, y: 0.32 },
    { name: 'ReFactory', x: 0.86, y: 0.55 },
    { name: 'Casa Selva', x: 0.64, y: 0.72 },
  ];

  const cycle = now();
  let canvas;

  onMount(() => sky(canvas, { spaces, reduced }));
</script>

<section id="rn-top" class="hero">
  <canvas bind:this={canvas} class="sky" aria-hidden="true"></canvas>
  <ul class="labels" aria-label={t.spaces}>
    {#each spaces as s}
      <li style="left: {s.x * 100}%; top: {s.y * 100}%">{s.name}</li>
    {/each}
  </ul>

  <div class="rg-container inner">
    <p class="eyebrow">{t.eyebrow}</p>
    <h1>
      <span>{t.h1[0]}</span>
      <span>{@html t.h1[1]}</span>
    </h1>
    <p class="tagline">{t.tagline}</p>
    <div class="actions">
      <a href="#rn-events" class="rg-btn rg-btn-gold">{t.events} <ArrowRight class="arrow" size={16} /></a>
      <a href="#rn-join" class="rg-btn rg-btn-ghost"><Sprout size={16} /> {t.docs}</a>
    </div>

    <a class="now" href="/lunations.html">
      <Moon phase={cycle.phase} size={22} />
      <span class="now-label">{t.now}</span>
      <span>{t.lunation} {cycle.index} · {t.day(cycle.day, cycle.days)}</span>
    </a>
  </div>

  <a href="#rn-vision" class="scroll" aria-label={t.scroll}><ChevronDown size={22} strokeWidth={1.5} /></a>
</section>

<style>
  .hero {
    position: relative;
    min-height: 100vh;
    min-height: 100svh;
    display: flex;
    align-items: center;
    background:
      radial-gradient(ellipse 70% 60% at 75% 50%, rgba(63, 106, 69, 0.28), transparent 70%),
      radial-gradient(ellipse 50% 40% at 10% 100%, rgba(201, 163, 91, 0.12), transparent 70%),
      var(--rg-night);
    color: var(--rg-cream);
    overflow: hidden;
  }

  .sky {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .labels {
    list-style: none;
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .labels li {
    position: absolute;
    transform: translate(18px, -50%);
    font-family: "Cormorant Garamond", serif;
    font-style: italic;
    font-size: 1.1rem;
    letter-spacing: 1px;
    color: var(--rg-gold-soft);
    white-space: nowrap;
    opacity: 0;
    animation: label-in 1.2s var(--rg-ease) forwards;
  }

  .labels li:nth-child(2) { animation-delay: 0.25s; }
  .labels li:nth-child(3) { animation-delay: 0.5s; }

  @keyframes label-in {
    from { opacity: 0; transform: translate(10px, -50%); }
    to { opacity: 0.9; transform: translate(18px, -50%); }
  }

  .inner {
    position: relative;
    z-index: 2;
    width: 100%;
    padding-top: 7rem;
    padding-bottom: 6rem;
  }

  .eyebrow {
    color: var(--rg-gold);
    font-size: 0.72rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 1.75rem;
  }

  h1 {
    color: var(--rg-cream);
    font-size: clamp(2.6rem, 6.2vw, 5.2rem);
    font-weight: 300;
    line-height: 1.02;
    max-width: 15ch;
    margin-bottom: 2rem;
  }

  h1 span { display: block; }

  h1 :global(em) {
    font-style: italic;
    color: var(--rg-gold-soft);
  }

  .tagline {
    color: rgba(244, 239, 228, 0.8);
    font-size: 1.08rem;
    max-width: 540px;
    margin-bottom: 2.5rem;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .now {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    margin-top: 3.5rem;
    padding: 0.55rem 1.1rem 0.55rem 0.7rem;
    border: 1px solid rgba(244, 239, 228, 0.18);
    border-radius: 999px;
    background: rgba(20, 26, 22, 0.55);
    backdrop-filter: blur(6px);
    color: rgba(244, 239, 228, 0.85);
    font-size: 0.82rem;
    letter-spacing: 0.5px;
  }

  .now:hover {
    color: var(--rg-cream);
    border-color: var(--rg-gold);
  }

  .now-label {
    color: var(--rg-gold);
    font-size: 0.66rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 700;
  }

  .scroll {
    position: absolute;
    left: 50%;
    bottom: 1.75rem;
    transform: translateX(-50%);
    color: rgba(244, 239, 228, 0.6);
    z-index: 2;
    animation: bob 2.4s ease-in-out infinite;
  }

  @keyframes bob {
    0%, 100% { transform: translate(-50%, 0); }
    50% { transform: translate(-50%, 6px); }
  }

  @media (max-width: 900px) {
    .labels { display: none; }
    .sky { opacity: 0.55; }
    .now { font-size: 0.76rem; }
  }
</style>

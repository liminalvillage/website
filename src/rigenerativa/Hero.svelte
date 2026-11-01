<script>
  import { onMount } from 'svelte';
  import { gsap, reduced } from './motion.js';
  import { hexmesh, HOME_CELL, LEVELS } from './hexmesh.js';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import MapPin from '@lucide/svelte/icons/map-pin';
  import Hexagon from '@lucide/svelte/icons/hexagon';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';

  let hero;
  let canvas;
  let photo;
  let touch = false;
  let cell = null;
  let stats = LEVELS.map((l) => ({ ...l, online: 0, total: 0 }));

  onMount(() => {
    touch = matchMedia('(hover: none)').matches;
    const stop = hexmesh(canvas, { area: hero, reduced, onCell: (id) => (cell = id), onStats: (s) => (stats = s) });
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.to(photo, {
        yPercent: 18,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, hero);
    return () => {
      stop();
      ctx.revert();
    };
  });
</script>

<section id="ri-top" class="hero" bind:this={hero}>
  <div class="photo" bind:this={photo} aria-hidden="true"></div>
  <div class="shade" aria-hidden="true"></div>
  <canvas bind:this={canvas} class="web" aria-hidden="true"></canvas>

  <div class="hero-content rg-container">
    <p class="eyebrow">
      <span>Rigenerativa S.r.l.</span>
      <span class="place"><MapPin size="1.3em" strokeWidth={1.75} />Castorano, Marche</span>
    </p>
    <h1>
      <span class="line"><span>Rigeneriamo luoghi,</span></span>
      <span class="line"><span><em>comunità</em> e territori</span></span>
    </h1>
    <p class="tagline">
      Trasformiamo spazi dismessi e sottoutilizzati in luoghi vivi e polifunzionali, unendo bioedilizia, agroecologia, tecnologia aperta e governance dei beni comuni.
    </p>
    <div class="hero-actions">
      <a href="#ri-contatti" class="rg-btn rg-btn-gold">Collabora con noi <ArrowRight class="arrow" size="1.4em" strokeWidth={1.75} /></a>
      <a href="#ri-attivita" class="rg-btn rg-btn-ghost">Cosa facciamo</a>
    </div>
  </div>

  <div class="hero-foot rg-container">
    <div class="story">
    <ol class="layers" aria-label="Livelli della rete sulla griglia H3">
      {#each stats as l, i}
        {#if i}<li class="sep" aria-hidden="true"><ChevronRight size={14} strokeWidth={1.5} /></li>{/if}
        <li class="layer" class:on={l.online > 0}>
          <Hexagon size={10 + i * 4} strokeWidth={1.5} />
          <span class="layer-name">{l.label}</span>
          <span class="layer-count">{l.online}<span class="of">/{l.total}</span></span>
          <span class="layer-res">r{l.res}</span>
        </li>
      {/each}
    </ol>
    <p class="hint">
      <span class="hex" class:home={!cell || cell === HOME_CELL}><Hexagon size="1.5em" strokeWidth={1.75} /></span>
      {#if cell}
        <span>Cella H3 <code>{cell}</code>{cell === HOME_CELL ? ' · Castorano' : ''}</span>
      {:else}
        <span>{touch ? 'Tocca' : 'Clicca'} un esagono: un nuovo progetto entra in rete</span>
      {/if}
    </p>
    </div>
    <a href="#ri-chi-siamo" class="scroll-hint" aria-label="Scorri in basso">
      <span>Scopri</span>
      <ChevronDown class="bob" size="1.6em" strokeWidth={1.5} />
    </a>
  </div>
</section>

<style>
  .hero {
    position: relative;
    width: 100%;
    min-height: 100vh;
    min-height: 100svh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: var(--rg-night);
    color: var(--rg-cream);
    isolation: isolate;
  }

  .photo {
    position: absolute;
    inset: -6% 0 -12%;
    background-image: url('/images/regenerativa/green-field.jpg');
    background-position: center;
    background-size: cover;
    opacity: 0.42;
    z-index: -3;
    will-change: transform;
  }

  .shade {
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      radial-gradient(ellipse at 20% 30%, rgba(63, 106, 69, 0.35), transparent 60%),
      linear-gradient(180deg, rgba(27, 34, 26, 0.55) 0%, rgba(27, 34, 26, 0.25) 45%, rgba(27, 34, 26, 0.92) 100%);
  }

  .web {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .hero-content {
    width: 100%;
    padding-top: 7rem;
    padding-bottom: 6rem;
  }

  .eyebrow {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    color: rgba(244, 239, 228, 0.78);
    font-size: 0.72rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 2rem;
    animation: rise 1.2s var(--rg-ease) 0.1s both;
  }

  .place {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: var(--rg-gold-soft);
  }

  h1 {
    font-family: "Cormorant Garamond", serif;
    color: #fff;
    font-size: clamp(2.9rem, 8.4vw, 7.4rem);
    font-weight: 300;
    letter-spacing: -0.5px;
    line-height: 0.98;
    margin: 0 0 2.25rem;
  }

  .line {
    display: block;
    overflow: hidden;
    padding-bottom: 0.08em;
  }

  .line > span {
    display: inline-block;
    animation: lift 1.4s var(--rg-ease) both;
  }

  .line:nth-child(2) > span {
    animation-delay: 0.14s;
  }

  h1 em {
    color: var(--rg-gold-soft);
    font-style: italic;
    font-weight: 400;
  }

  .tagline {
    color: rgba(244, 239, 228, 0.86);
    font-size: clamp(1rem, 1.5vw, 1.15rem);
    font-weight: 300;
    max-width: 560px;
    margin: 0 0 2.75rem;
    line-height: 1.75;
    animation: rise 1.2s var(--rg-ease) 0.45s both;
  }

  .hero-actions {
    display: flex;
    gap: 0.9rem;
    flex-wrap: wrap;
    animation: rise 1.2s var(--rg-ease) 0.6s both;
  }

  .hero-foot {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    pointer-events: none;
    animation: rise 1.2s var(--rg-ease) 1s both;
  }

  .story {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  .layers {
    list-style: none;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.35rem 0.6rem;
  }

  .layer {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    border: 1px solid rgba(244, 239, 228, 0.14);
    background: rgba(27, 34, 26, 0.45);
    backdrop-filter: blur(6px);
    color: rgba(244, 239, 228, 0.45);
    font-size: 0.7rem;
    letter-spacing: 1px;
    transition: color 0.6s ease, border-color 0.6s ease;
  }

  .layer.on {
    color: var(--rg-cream);
    border-color: rgba(221, 185, 121, 0.45);
  }

  .layer.on :global(svg) {
    color: var(--rg-gold);
  }

  .layer-count {
    font-variant-numeric: tabular-nums;
    color: var(--rg-gold-soft);
  }

  .layer:not(.on) .layer-count {
    color: inherit;
  }

  .layer-count .of,
  .layer-res {
    opacity: 0.55;
  }

  .sep {
    display: inline-flex;
    color: rgba(244, 239, 228, 0.35);
  }

  .hint {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    color: rgba(244, 239, 228, 0.6);
    font-size: 0.72rem;
    letter-spacing: 1.5px;
  }

  .hint code {
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 0.95em;
    letter-spacing: 0.5px;
    color: var(--rg-gold-soft);
  }

  .hex {
    position: relative;
    display: inline-flex;
    color: rgba(244, 239, 228, 0.7);
  }

  .hex.home {
    color: var(--rg-gold);
  }

  .hex.home::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px solid var(--rg-gold);
    animation: ping 2.2s ease-out infinite;
  }

  .scroll-hint {
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    color: rgba(244, 239, 228, 0.7);
    font-size: 0.65rem;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .scroll-hint:hover {
    color: var(--rg-gold-soft);
  }

  .scroll-hint :global(.bob) {
    color: var(--rg-gold);
    animation: bob 2.2s var(--rg-ease) infinite;
  }

  @keyframes lift {
    from { transform: translateY(105%); }
    to { transform: translateY(0); }
  }

  @keyframes rise {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes ping {
    from { transform: scale(0.6); opacity: 0.9; }
    to { transform: scale(1.8); opacity: 0; }
  }

  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(6px); }
  }

  @media (max-width: 640px) {
    .eyebrow {
      flex-wrap: wrap;
      gap: 0.6rem;
      letter-spacing: 3px;
    }

    .hero-foot {
      justify-content: flex-start;
      bottom: 1.25rem;
    }

    .hero-content {
      padding-bottom: 10rem;
    }

    .sep,
    .layer-res {
      display: none;
    }

    .scroll-hint {
      display: none;
    }
  }
</style>

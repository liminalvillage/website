<script>
  import { onMount } from 'svelte';
  import { gsap, reduced } from './motion.js';
  import { mycelium } from './mycelium.js';

  let hero;
  let canvas;
  let photo;
  let touch = false;

  onMount(() => {
    touch = matchMedia('(hover: none)').matches;
    const stop = mycelium(canvas, { area: hero, reduced });
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
    <p class="eyebrow"><span>Rigenerativa S.r.l.</span><span class="dot"></span><span>Castorano, Marche</span></p>
    <h1>
      <span class="line"><span>Rigeneriamo luoghi,</span></span>
      <span class="line"><span><em>comunità</em> e territori</span></span>
    </h1>
    <p class="tagline">
      Trasformiamo spazi dismessi e sottoutilizzati in luoghi vivi e polifunzionali, unendo bioedilizia, agroecologia, tecnologia aperta e governance dei beni comuni.
    </p>
    <div class="hero-actions">
      <a href="#ri-contatti" class="rg-btn rg-btn-gold">Collabora con noi <span class="arrow">→</span></a>
      <a href="#ri-attivita" class="rg-btn rg-btn-ghost">Cosa facciamo</a>
    </div>
  </div>

  <div class="hero-foot rg-container">
    <p class="hint">
      <span class="pulse" aria-hidden="true"></span>
      {touch ? 'Tocca lo schermo: la rete cresce' : 'Muovi il cursore, clicca: la rete cresce'}
    </p>
    <a href="#ri-chi-siamo" class="scroll-hint" aria-label="Scorri in basso">
      <span>Scopri</span>
      <span class="stem" aria-hidden="true"></span>
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

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--rg-gold);
    box-shadow: 0 0 10px var(--rg-gold);
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

  .hint {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    color: rgba(244, 239, 228, 0.6);
    font-size: 0.72rem;
    letter-spacing: 1.5px;
  }

  .pulse {
    position: relative;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--rg-gold);
  }

  .pulse::after {
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

  .stem {
    width: 1px;
    height: 46px;
    background: linear-gradient(var(--rg-gold), transparent);
    transform-origin: top;
    animation: grow 2.4s var(--rg-ease) infinite;
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
    from { transform: scale(1); opacity: 0.9; }
    to { transform: scale(3.2); opacity: 0; }
  }

  @keyframes grow {
    0% { transform: scaleY(0); opacity: 1; }
    60% { transform: scaleY(1); opacity: 1; }
    100% { transform: scaleY(1); opacity: 0; }
  }

  @media (max-width: 640px) {
    .eyebrow {
      flex-wrap: wrap;
      gap: 0.6rem;
      letter-spacing: 3px;
    }

    .hero-foot {
      justify-content: center;
    }

    .scroll-hint {
      display: none;
    }
  }
</style>

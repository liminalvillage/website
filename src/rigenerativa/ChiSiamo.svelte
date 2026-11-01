<script>
  import { onMount } from 'svelte';
  import { gsap, reduced } from './motion.js';

  const lead =
    "Rigenerativa S.r.l. è il braccio operativo della rete ReGenerativa nelle Marche. Prendiamo in gestione edifici civili e industriali, aree rurali e strutture dismesse, e li accompagniamo dal cantiere alla vita quotidiana: progettazione bioclimatica, costruzione, programmazione culturale, agricoltura rigenerativa e gestione condivisa con le comunità locali.";
  const words = lead.split(' ');

  // Line icons drawn as the pillars scroll in (paths use pathLength="1").
  const pillars = [
    {
      title: 'Costruire',
      text: "Bioedilizia, restauro e recupero adattivo con materiali naturali e riciclati, energia off-grid e gestione dell'acqua.",
      icon: ['M6 42h36', 'M10 42V22l14-12 14 12v20', 'M19 42V30h10v12', 'M30 17V8h5v13'],
    },
    {
      title: 'Abitare',
      text: 'Ospitalità diffusa, turismo lento, eventi, filiera corta e agricoltura supportata dalla comunità negli spazi rigenerati.',
      icon: ['M24 44V16', 'M24 26c-7 0-11-5-11-11 7 0 11 5 11 11z', 'M24 20c6 0 10-4 10-10-6 0-10 4-10 10z', 'M8 44h32'],
    },
    {
      title: 'Custodire',
      text: 'Beni comuni, governance distribuita e strumenti digitali aperti per coordinare una rete di nodi locali replicabile.',
      icon: ['M24 8v32', 'M10 16l28 16', 'M38 16L10 32', 'M24 24m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0', 'M24 8m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0', 'M24 40m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0'],
    },
  ];

  let section;

  onMount(() => {
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.fromTo('.lead .w', { opacity: 0.16 }, {
        opacity: 1,
        stagger: 0.04,
        ease: 'none',
        scrollTrigger: { trigger: '.lead', start: 'top 78%', end: 'bottom 45%', scrub: true },
      });
      gsap.utils.toArray('.pillar').forEach((p) => {
        gsap.fromTo(p.querySelectorAll('path'), { strokeDashoffset: 1 }, {
          strokeDashoffset: 0,
          duration: 1.6,
          stagger: 0.15,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: p, start: 'top 85%', once: true },
        });
      });
    }, section);
    return () => ctx.revert();
  });
</script>

<section id="ri-chi-siamo" class="chi-siamo rg-section" bind:this={section}>
  <div class="rg-container">
    <div class="heading" data-reveal>
      <p class="rg-eyebrow">Chi siamo</p>
      <h2 class="rg-h2">Un'impresa che si prende la <em>piena responsabilità</em> della trasformazione dei luoghi</h2>
    </div>

    <p class="lead">
      {#each words as w}<span class="w">{w}</span>{' '}{/each}
    </p>

    <div class="pillars" data-reveal="stagger">
      {#each pillars as p, i}
        <article class="pillar">
          <span class="num">0{i + 1}</span>
          <svg class="icon" viewBox="0 0 48 48" aria-hidden="true">
            {#each p.icon as d}<path {d} pathLength="1" />{/each}
          </svg>
          <h3>{p.title}</h3>
          <p>{p.text}</p>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .chi-siamo {
    background: transparent;
  }

  .heading {
    max-width: 860px;
    margin-bottom: 4rem;
  }

  .lead {
    font-family: "Cormorant Garamond", serif;
    font-size: clamp(1.45rem, 2.6vw, 2.25rem);
    font-weight: 400;
    line-height: 1.45;
    color: var(--rg-bark);
    max-width: 1040px;
    margin: 0 0 6rem auto;
  }

  .pillars {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-top: 1px solid var(--rg-line);
  }

  .pillar {
    position: relative;
    padding: 2.75rem 2.25rem 2.5rem;
    border-right: 1px solid var(--rg-line);
    transition: background 0.5s var(--rg-ease);
  }

  .pillar:last-child {
    border-right: none;
  }

  .pillar::before {
    content: "";
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--rg-gold);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.6s var(--rg-ease);
  }

  .pillar:hover {
    background: var(--rg-cream);
  }

  .pillar:hover::before {
    transform: scaleX(1);
  }

  .num {
    position: absolute;
    top: 2.75rem;
    right: 2.25rem;
    font-size: 0.72rem;
    letter-spacing: 2px;
    color: var(--rg-muted);
  }

  .icon {
    width: 52px;
    height: 52px;
    margin-bottom: 1.5rem;
    fill: none;
    stroke: var(--rg-forest);
    stroke-width: 1.4;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform 0.6s var(--rg-ease), stroke 0.4s ease;
  }

  .icon :global(path) {
    stroke-dasharray: 1;
    stroke-dashoffset: 0;
  }

  .pillar:hover .icon {
    transform: translateY(-4px) rotate(-3deg);
    stroke: var(--rg-soil);
  }

  .pillar h3 {
    font-size: 2rem;
    font-weight: 400;
    margin-bottom: 0.75rem;
  }

  .pillar p {
    color: var(--rg-muted);
    font-size: 0.95rem;
  }

  @media (max-width: 860px) {
    .lead {
      margin-bottom: 4rem;
    }

    .pillars {
      grid-template-columns: 1fr;
    }

    .pillar {
      border-right: none;
      border-bottom: 1px solid var(--rg-line);
      padding: 2.25rem 0.5rem;
    }

    .num {
      right: 0.5rem;
      top: 2.25rem;
    }
  }
</style>

<script>
  import { onMount } from 'svelte';
  import { gsap, reduced } from './motion.js';
  import Hammer from '@lucide/svelte/icons/hammer';
  import Sprout from '@lucide/svelte/icons/sprout';
  import Network from '@lucide/svelte/icons/network';

  const lead =
    "Rigenerativa S.r.l. è il braccio operativo della rete ReGenerativa nelle Marche. Prendiamo in gestione edifici civili e industriali, aree rurali e strutture dismesse, e li accompagniamo dal cantiere alla vita quotidiana: progettazione bioclimatica, costruzione, programmazione culturale, agricoltura rigenerativa e gestione condivisa con le comunità locali.";
  const words = lead.split(' ');

  // Each pillar's icon draws itself in as it scrolls into view.
  const pillars = [
    {
      title: 'Costruire',
      text: "Bioedilizia, restauro e recupero adattivo con materiali naturali e riciclati, energia off-grid e gestione dell'acqua.",
      icon: Hammer,
    },
    {
      title: 'Abitare',
      text: 'Ospitalità diffusa, turismo lento, eventi, filiera corta e agricoltura supportata dalla comunità negli spazi rigenerati.',
      icon: Sprout,
    },
    {
      title: 'Custodire',
      text: 'Beni comuni, governance distribuita e strumenti digitali aperti per coordinare una rete di nodi locali replicabile.',
      icon: Network,
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
        const paths = [...p.querySelectorAll('.icon path, .icon rect, .icon circle')];
        paths.forEach((el) => {
          const len = el.getTotalLength();
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.to(paths, {
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
          <span class="icon"><svelte:component this={p.icon} size={44} strokeWidth={1.25} /></span>
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
    display: inline-grid;
    place-items: center;
    width: 72px;
    height: 72px;
    margin-bottom: 1.5rem;
    border-radius: 50%;
    background: var(--rg-cream);
    color: var(--rg-forest);
    transition: transform 0.6s var(--rg-ease), color 0.4s ease, background 0.4s ease;
  }

  .pillar:hover .icon {
    transform: translateY(-4px);
    color: var(--rg-soil);
    background: var(--rg-cream-soft);
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

<script>
  import { onMount } from 'svelte';
  import { gsap, reduced } from './motion.js';
  import KeyRound from '@lucide/svelte/icons/key-round';
  import PencilRuler from '@lucide/svelte/icons/pencil-ruler';
  import Hammer from '@lucide/svelte/icons/hammer';
  import Sprout from '@lucide/svelte/icons/sprout';
  import Users from '@lucide/svelte/icons/users';

  // The path named in the Chi siamo lead: from taking a place on to sharing it.
  const steps = [
    {
      title: 'Presa in gestione',
      icon: KeyRound,
      text: 'Edifici civili e industriali, aree rurali e strutture dismesse: ne assumiamo la piena responsabilità, con forme di gestione, concessione o custodia fiduciaria.',
      tags: ['Edifici', 'Terre', 'Strutture dismesse'],
    },
    {
      title: 'Progettazione bioclimatica',
      icon: PencilRuler,
      text: "Ascoltiamo il luogo e progettiamo con il clima, l'acqua e i materiali che offre: architettura bioclimatica, BIM e digital twin, energia off-grid.",
      tags: ['Bioclimatica', 'BIM', 'Off-grid'],
    },
    {
      title: 'Costruzione',
      icon: Hammer,
      text: 'Bioedilizia, restauro e recupero adattivo come General Contractor, con materiali naturali e riciclati, fitodepurazione e biolaghi.',
      tags: ['Bioedilizia', 'Restauro', 'Materiali riciclati'],
    },
    {
      title: 'Vita culturale e agricola',
      icon: Sprout,
      text: 'Il luogo si riempie: programmazione culturale, ospitalità, eventi e residenze; agroecologia, food forest e agricoltura supportata dalla comunità.',
      tags: ['Cultura', 'Ospitalità', 'Agroecologia'],
    },
    {
      title: 'Gestione condivisa',
      icon: Users,
      text: 'Accompagniamo le comunità locali verso la cura condivisa dei beni comuni, con governance distribuita e strumenti digitali aperti.',
      tags: ['Beni comuni', 'Governance', 'Comunità'],
    },
  ];

  let section;
  let track;
  let current = 0;

  onMount(() => {
    const mm = gsap.matchMedia();
    if (!reduced) {
      mm.add('(min-width: 900px)', () => {
        const distance = () => track.scrollWidth - section.clientWidth;
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => '+=' + distance(),
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              section.style.setProperty('--p', self.progress.toFixed(4));
              current = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
            },
          },
        });
      });
    }
    return () => mm.revert();
  });
</script>

<section id="ri-percorso" class="percorso" bind:this={section}>
  <div class="frame">
    <div class="intro rg-container">
      <div>
        <p class="rg-eyebrow">Il percorso</p>
        <h2 class="rg-h2">Dal cantiere alla <em>vita quotidiana</em></h2>
      </div>
      <p class="counter" aria-hidden="true">
        <span class="now">0{current + 1}</span><span class="of">/ 0{steps.length}</span>
      </p>
    </div>

    <div class="viewport">
      <ol class="track" bind:this={track}>
        {#each steps as s, i}
          <li class="step" class:lit={i <= current}>
            <span class="node" aria-hidden="true"><svelte:component this={s.icon} size={20} strokeWidth={1.5} /></span>
            <span class="index">0{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <ul class="tags">
              {#each s.tags as t}<li>{t}</li>{/each}
            </ul>
          </li>
        {/each}
      </ol>
      <div class="root" aria-hidden="true"><span></span></div>
    </div>
  </div>
</section>

<style>
  .percorso {
    --p: 0;
    position: relative;
    background: var(--rg-bark);
    background-image: var(--rg-grain), radial-gradient(ellipse at 80% 0%, rgba(111, 140, 90, 0.25), transparent 55%);
    color: var(--rg-cream);
    overflow: hidden;
  }

  .frame {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 7rem 0 5rem;
  }

  .intro {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 2rem;
    margin-bottom: 4rem;
  }

  .intro .rg-eyebrow {
    color: var(--rg-gold-soft);
  }

  .intro .rg-h2 {
    color: #fff;
  }

  .intro .rg-h2 em {
    color: var(--rg-gold-soft);
  }

  .counter {
    font-family: "Cormorant Garamond", serif;
    color: var(--rg-cream);
    line-height: 1;
    white-space: nowrap;
  }

  .now {
    font-size: 4.5rem;
    font-weight: 300;
  }

  .of {
    font-size: 1.25rem;
    margin-left: 0.4rem;
    opacity: 0.5;
  }

  .viewport {
    position: relative;
  }

  .track {
    list-style: none;
    display: flex;
    gap: 0;
    padding: 0 max(2rem, calc((100vw - 1200px) / 2 + 2rem));
    width: max-content;
    will-change: transform;
  }

  .step {
    position: relative;
    width: min(420px, 34vw);
    padding: 4.75rem 3rem 0 0;
    opacity: 0.38;
    transition: opacity 0.7s var(--rg-ease);
  }

  .step.lit {
    opacity: 1;
  }

  .index {
    position: absolute;
    top: 22px;
    left: 64px;
    transform: translateY(-50%);
    padding: 0 0.6rem;
    background: var(--rg-bark);
    font-size: 0.7rem;
    letter-spacing: 3px;
    line-height: 1;
    color: var(--rg-gold-soft);
    z-index: 1;
  }

  .node {
    position: absolute;
    top: 0;
    left: 0;
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    border: 1px solid rgba(201, 163, 91, 0.6);
    background: var(--rg-bark);
    color: var(--rg-gold-soft);
    transition: background 0.5s ease, color 0.5s ease, box-shadow 0.5s ease;
    z-index: 1;
  }

  .step.lit .node {
    background: var(--rg-gold);
    color: var(--rg-night);
    box-shadow: 0 0 0 6px rgba(201, 163, 91, 0.15), 0 0 22px rgba(221, 185, 121, 0.5);
  }

  .step h3 {
    color: #fff;
    font-size: clamp(1.7rem, 2.4vw, 2.3rem);
    font-weight: 400;
    margin: 0.75rem 0 1rem;
  }

  .step p {
    color: rgba(244, 239, 228, 0.75);
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }

  .tags {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .tags li {
    font-size: 0.7rem;
    letter-spacing: 1px;
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    border: 1px solid rgba(244, 239, 228, 0.22);
    color: rgba(244, 239, 228, 0.82);
  }

  /* The root line the nodes sit on; it grows with the pinned scroll. */
  .root {
    position: absolute;
    top: 22px;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(244, 239, 228, 0.15);
  }

  .root span {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, var(--rg-moss), var(--rg-gold));
    transform-origin: left;
    transform: scaleX(var(--p));
  }

  /* Without the pinned scroll the steps stack as a vertical timeline. */
  @media (max-width: 899px), (prefers-reduced-motion: reduce) {
    .frame {
      min-height: 0;
      padding: 5.5rem 0;
    }

    .counter,
    .root {
      display: none;
    }

    .track {
      flex-direction: column;
      width: auto;
      padding: 0 1.25rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .step {
      width: auto;
      opacity: 1;
      padding: 0 0 2.75rem 2.75rem;
      border-left: 1px solid rgba(244, 239, 228, 0.18);
      margin-left: 22px;
    }

    .step:last-child {
      padding-bottom: 0;
    }

    .index {
      left: 2.75rem;
      padding: 0;
      background: none;
    }

    .node {
      left: -22px;
      background: var(--rg-gold);
      color: var(--rg-night);
    }

    .step h3 {
      margin-top: 0;
      padding-top: 3.25rem;
    }
  }

  @media (min-width: 900px) and (prefers-reduced-motion: reduce) {
    .track {
      padding: 0 2rem;
    }
  }
</style>

<script>
  import { onMount } from 'svelte';
  import { gsap, reduced } from './motion.js';
  import Flame from '@lucide/svelte/icons/flame';
  import HeartHandshake from '@lucide/svelte/icons/heart-handshake';
  import Recycle from '@lucide/svelte/icons/recycle';
  import Mail from '@lucide/svelte/icons/mail';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import { mailto } from './contact.js';
  import { pick } from './i18n.js';

  // The share of every sale that stays with the collective.
  const SHARE = 30;

  const t = pick({
    it: {
      eyebrow: "L'ecosistema",
      title: "Un'economia che <em>resta</em> nel collettivo",
      sub: `Chi ha una passione entra con la propria attività e cresce insieme agli altri. Il ${SHARE}% di ogni vendita resta al collettivo, non a una piattaforma terza, e il collettivo decide insieme dove investirlo.`,
      split: {
        you: 'a chi fa il lavoro',
        collective: 'al collettivo',
        caption: `Su ogni vendita, il ${100 - SHARE}% va a chi ha creato il prodotto o il servizio e il ${SHARE}% al fondo comune.`,
      },
      steps: [
        ['Entri con la tua passione', 'Un mestiere, un prodotto, un servizio: non serve un\'azienda già avviata.'],
        ['Ci aiutiamo a riuscire', 'Clienti, spazi, strumenti e competenze si condividono tra i membri.'],
        ['Il rendimento torna a chi contribuisce', 'Chiunque può unirsi a un progetto del collettivo e riceverne una parte del rendimento.'],
      ],
      pilots: 'Primi esperimenti: la seed bank box e i prodotti e servizi dei membri, in vendita dal sito del collettivo.',
      cta: 'Proponi la tua attività',
      subject: "Proposta per l'ecosistema",
      body: `Buongiorno,\n\nvorrei entrare nell'ecosistema con la mia attività.\n\nNome e cognome:\nDove vivo:\nCosa propongo (prodotto o servizio):\nA che punto sono (idea, prototipo, già in vendita):\nSito, portfolio o social:\n\n`,
    },
    en: {
      eyebrow: 'The ecosystem',
      title: 'An economy that <em>stays</em> in the collective',
      sub: `People with a passion join with their own business and grow alongside the others. ${SHARE}% of every sale stays with the collective, not a third-party platform, and the collective decides together where to invest it.`,
      split: {
        you: 'to the person doing the work',
        collective: 'to the collective',
        caption: `On every sale, ${100 - SHARE}% goes to whoever created the product or service and ${SHARE}% to the common fund.`,
      },
      steps: [
        ['Join with your passion', "A craft, a product, a service: you don't need an established company."],
        ['We help each other succeed', 'Customers, spaces, tools and skills are shared among members.'],
        ['The yield returns to contributors', "Anyone can join one of the collective's projects and receive a share of its yield."],
      ],
      pilots: "First experiments: the seed bank box and members' products and services, sold from the collective's website.",
      cta: 'Propose your business',
      subject: 'Ecosystem proposal',
      body: `Hello,\n\nI'd like to join the ecosystem with my business.\n\nFull name:\nWhere I live:\nWhat I offer (product or service):\nWhere I am (idea, prototype, already selling):\nWebsite, portfolio or social media:\n\n`,
    },
  });

  const steps = [Flame, HeartHandshake, Recycle].map((icon, i) => ({ icon, title: t.steps[i][0], text: t.steps[i][1] }));
  const proposeHref = mailto(t.subject, t.body);

  let section;
  let shown = false;

  // The split bar grows from zero and the numbers count up when it scrolls into view.
  onMount(() => {
    const ctx = gsap.context(() => {
      const you = { v: 0 };
      const col = { v: 0 };
      const render = () => {
        section.querySelector('.you .pct').textContent = Math.round(you.v);
        section.querySelector('.col .pct').textContent = Math.round(col.v);
      };
      if (reduced) {
        shown = true;
        you.v = 100 - SHARE;
        col.v = SHARE;
        render();
        return;
      }
      gsap.timeline({ scrollTrigger: { trigger: '.split', start: 'top 78%', once: true }, onStart: () => (shown = true) })
        .to(you, { v: 100 - SHARE, duration: 1.6, ease: 'power3.out', onUpdate: render }, 0)
        .to(col, { v: SHARE, duration: 1.6, ease: 'power3.out', onUpdate: render }, 0);
    }, section);
    return () => ctx.revert();
  });
</script>

<section id="ri-ecosistema" class="ecosistema rg-section" bind:this={section}>
  <div class="rg-container">
    <div class="heading" data-reveal>
      <p class="rg-eyebrow">{t.eyebrow}</p>
      <h2 class="rg-h2">{@html t.title}</h2>
      <p class="rg-sub">{t.sub}</p>
    </div>

    <div class="split" class:shown style="--share: {SHARE}" data-reveal>
      <div class="bar" role="img" aria-label={t.split.caption}>
        <div class="seg you"><span class="pct">0</span><span class="sign">%</span><span class="who">{t.split.you}</span></div>
        <div class="seg col"><span class="pct">0</span><span class="sign">%</span><span class="who">{t.split.collective}</span></div>
      </div>
      <p class="caption">{t.split.caption}</p>
    </div>

    <ol class="steps" data-reveal="stagger">
      {#each steps as s}
        <li class="step">
          <span class="step-icon" aria-hidden="true"><svelte:component this={s.icon} size={22} strokeWidth={1.5} /></span>
          <div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>
        </li>
      {/each}
    </ol>

    <div class="pilots" data-reveal>
      <p>{t.pilots}</p>
      <a class="rg-btn rg-btn-gold" href={proposeHref}>
        <Mail size={18} strokeWidth={1.75} />{t.cta} <ArrowRight class="arrow" size={18} strokeWidth={1.75} />
      </a>
    </div>
  </div>
</section>

<style>
  .ecosistema {
    background: var(--rg-night);
    background-image: var(--rg-grain), radial-gradient(ellipse at 15% 0%, rgba(63, 106, 69, 0.35), transparent 55%),
      radial-gradient(ellipse at 100% 100%, rgba(201, 163, 91, 0.14), transparent 50%);
    color: var(--rg-cream);
  }

  .ecosistema :global(h2),
  .ecosistema :global(h3) {
    color: #fff;
  }

  .ecosistema .rg-eyebrow,
  .ecosistema .rg-h2 :global(em) {
    color: var(--rg-gold-soft);
  }

  .ecosistema .rg-sub,
  .ecosistema p {
    color: rgba(244, 239, 228, 0.78);
  }

  .heading {
    margin-bottom: 3.5rem;
  }

  /* ----- 70 / 30 split ----- */
  .split {
    margin-bottom: 4rem;
  }

  .bar {
    display: flex;
    gap: 6px;
    height: 150px;
  }

  .seg {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1.25rem 1.5rem;
    border-radius: 18px;
    overflow: hidden;
    flex: 0 0 0%;
    transition: flex-basis 1.6s var(--rg-ease);
  }

  .shown .you {
    flex-basis: calc((100 - var(--share)) * 1%);
  }

  .shown .col {
    flex-basis: calc(var(--share) * 1%);
  }

  .you {
    background: var(--rg-forest-dark);
    background-image: var(--rg-grain);
    color: var(--rg-cream);
  }

  .col {
    background: var(--rg-gold);
    background-image: var(--rg-grain);
    color: var(--rg-night);
  }

  .pct {
    font-family: "Cormorant Garamond", serif;
    font-size: clamp(2.6rem, 5.5vw, 4.4rem);
    font-weight: 300;
    line-height: 1;
    letter-spacing: -1px;
  }

  .sign {
    font-family: "Cormorant Garamond", serif;
    font-size: clamp(1.3rem, 2.5vw, 2rem);
    font-weight: 300;
    margin-left: 2px;
  }

  .who {
    display: block;
    font-size: 0.7rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    font-weight: 600;
    margin-top: 0.5rem;
    white-space: nowrap;
    opacity: 0.85;
  }

  .col .who {
    color: var(--rg-night);
  }

  .caption {
    margin-top: 1.25rem;
    font-size: 0.93rem;
    max-width: 620px;
    color: rgba(244, 239, 228, 0.6);
  }

  /* ----- steps ----- */
  .steps {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
    margin-bottom: 3.5rem;
  }

  .step {
    display: flex;
    gap: 1.1rem;
    align-items: flex-start;
    padding: 1.6rem 1.6rem;
    border-radius: 20px;
    border: 1px solid rgba(244, 239, 228, 0.12);
    background: rgba(244, 239, 228, 0.045);
  }

  .step-icon {
    display: inline-grid;
    place-items: center;
    flex-shrink: 0;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 14px;
    background: rgba(244, 239, 228, 0.08);
    color: var(--rg-gold-soft);
  }

  .step h3 {
    font-size: 1.35rem;
    font-weight: 400;
    margin-bottom: 0.3rem;
  }

  .step p {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  /* ----- pilots + CTA ----- */
  .pilots {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding-top: 2.5rem;
    border-top: 1px dashed rgba(221, 185, 121, 0.35);
  }

  .pilots p {
    max-width: 560px;
    color: var(--rg-cream);
  }

  .pilots .rg-btn {
    flex-shrink: 0;
  }

  @media (max-width: 960px) {
    .steps {
      grid-template-columns: 1fr;
    }

    .pilots {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (max-width: 640px) {
    .bar {
      flex-direction: column;
      height: auto;
    }

    .seg {
      flex: 1 1 auto !important;
      flex-direction: row;
      align-items: baseline;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
    }

    .who {
      margin-top: 0;
      margin-left: auto;
      white-space: normal;
      text-align: right;
    }

    .pilots .rg-btn {
      width: 100%;
      justify-content: center;
      letter-spacing: 2px;
    }
  }
</style>

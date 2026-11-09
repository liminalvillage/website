<script>
  import { onMount } from 'svelte';
  import { initMotion, gsap, reduced } from './motion.js';
  import { settori, bySlug, settoreUrl, homeUrl, settoreHost } from './settori.js';
  import Navbar from './Navbar.svelte';
  import Rete from './Rete.svelte';
  import Rigeneratori from './Rigeneratori.svelte';
  import Contatti from './Contatti.svelte';
  import Footer from './Footer.svelte';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import Globe from '@lucide/svelte/icons/globe';
  import { pick } from './i18n.js';

  const t = pick({
    it: {
      menu: ['Approccio', 'Servizi', 'Metodo', 'Settori', 'Rigeneratori', 'Contatti'],
      crumbs: 'Percorso di navigazione',
      activities: 'Attività',
      sector: 'Settore',
      talk: 'Parliamone',
      services: 'I servizi',
      approach: 'Approccio',
      servicesEyebrow: 'Servizi',
      servicesTitle: (name) => `Cosa offriamo in <em>${name.toLowerCase()}</em>`,
      servicesSub: (n) => `${n} servizi, combinabili tra loro e con quelli degli altri settori della rete.`,
      method: 'Metodo',
      methodTitle: 'Come <em>lavoriamo</em>',
      others: 'Gli altri settori',
      othersTitle: "Un'offerta <em>integrata</em>",
      othersSub: 'Ogni progetto attraversa più settori: dal cantiere al campo, dalla comunità agli strumenti digitali.',
    },
    en: {
      menu: ['Approach', 'Services', 'Method', 'Sectors', 'Regenerators', 'Contact'],
      crumbs: 'Breadcrumb',
      activities: 'Activities',
      sector: 'Sector',
      talk: "Let's talk",
      services: 'Our services',
      approach: 'Approach',
      servicesEyebrow: 'Services',
      servicesTitle: (name) => `What we offer in <em>${name.toLowerCase()}</em>`,
      servicesSub: (n) => `${n} services that combine with one another and with those of the network's other sectors.`,
      method: 'Method',
      methodTitle: 'How we <em>work</em>',
      others: 'Other sectors',
      othersTitle: 'An <em>integrated</em> offer',
      othersSub: 'Every project spans several sectors: from building site to field, from community to digital tools.',
    },
  });

  export let slug;

  const s = bySlug[slug];
  const index = settori.indexOf(s);
  const others = settori.filter((o) => o !== s);

  const menu = ['#ri-approccio', '#ri-servizi', '#ri-metodo', '#ri-settori', '#ri-rigeneratori', '#ri-contatti']
    .map((href, i) => ({ label: t.menu[i], href }));

  let root;
  let hero;
  let photo;

  onMount(() => {
    const stop = initMotion(root);
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.to(photo, {
        yPercent: 16,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, hero);
    return () => {
      ctx.revert();
      stop();
    };
  });
</script>

<main bind:this={root}>
  <Navbar items={menu} brandHref={homeUrl()} />

  <section id="ri-top" class="hero" bind:this={hero}>
    <div class="photo" bind:this={photo} style="background-image: url('{s.image}')" aria-hidden="true"></div>
    <div class="shade" aria-hidden="true"></div>

    <div class="hero-content rg-container">
      <nav class="crumbs" aria-label={t.crumbs}>
        <a href={homeUrl()}>Rigenerativa</a>
        <ChevronRight size={14} strokeWidth={1.5} />
        <a href={homeUrl('#ri-attivita')}>{t.activities}</a>
        <ChevronRight size={14} strokeWidth={1.5} />
        <span aria-current="page">{s.name}</span>
      </nav>
      <p class="eyebrow">
        <span class="badge"><svelte:component this={s.icon} size={18} strokeWidth={1.5} /></span>
        <span>{t.sector} {String(index + 1).padStart(2, '0')} / {String(settori.length).padStart(2, '0')}</span>
        <span class="host"><Globe size="1.2em" strokeWidth={1.75} />{settoreHost(s.slug)}</span>
      </p>
      <h1>
        {#each s.title as line, i}
          <span class="line"><span style="animation-delay: {i * 0.14}s">{@html line}</span></span>
        {/each}
      </h1>
      <p class="tagline">{s.tagline}</p>
      <div class="hero-actions">
        <a href="#ri-contatti" class="rg-btn rg-btn-gold">{t.talk} <ArrowRight class="arrow" size="1.4em" strokeWidth={1.75} /></a>
        <a href="#ri-servizi" class="rg-btn rg-btn-ghost">{t.services}</a>
      </div>
    </div>
  </section>

  <section id="ri-approccio" class="rg-section">
    <div class="rg-container">
      <div class="intro" data-reveal>
        <p class="rg-eyebrow">{t.approach}</p>
        <p class="lead">{s.lead}</p>
      </div>
      <div class="principles" data-reveal="stagger">
        {#each s.principles as p, i}
          <article class="principle">
            <span class="num">0{i + 1}</span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <section id="ri-servizi" class="servizi rg-section">
    <div class="rg-container">
      <div class="heading" data-reveal>
        <p class="rg-eyebrow">{t.servicesEyebrow}</p>
        <h2 class="rg-h2">{@html t.servicesTitle(s.name)}</h2>
        <p class="rg-sub">{t.servicesSub(s.services.length)}</p>
      </div>
      <ol class="services" data-reveal="stagger">
        {#each s.services as sv, i}
          <li class="service">
            <span class="service-num">{String(i + 1).padStart(2, '0')}</span>
            <h3>{sv.title}</h3>
            <p>{sv.text}</p>
          </li>
        {/each}
      </ol>
    </div>
  </section>

  <section class="focus rg-section">
    <div class="rg-container">
      <div class="focus-grid">
        <div class="focus-head" data-reveal>
          <p class="rg-eyebrow">{s.focus.eyebrow}</p>
          <h2 class="rg-h2">{@html s.focus.title}</h2>
          <span class="mark" aria-hidden="true"><svelte:component this={s.icon} size={180} strokeWidth={0.6} /></span>
        </div>
        <dl class="focus-list" data-reveal="stagger">
          {#each s.focus.items as f}
            <div>
              <dt>{f.name}</dt>
              <dd>{f.text}</dd>
            </div>
          {/each}
        </dl>
      </div>
    </div>
  </section>

  <section id="ri-metodo" class="rg-section">
    <div class="rg-container">
      <div class="heading" data-reveal>
        <p class="rg-eyebrow">{t.method}</p>
        <h2 class="rg-h2">{@html t.methodTitle}</h2>
      </div>
      <ol class="steps" data-reveal="stagger">
        {#each s.steps as st, i}
          <li class="step">
            <span class="dot" aria-hidden="true">{i + 1}</span>
            <h3>{st.title}</h3>
            <p>{st.text}</p>
          </li>
        {/each}
      </ol>
    </div>
  </section>

  <Rete />

  <section id="ri-settori" class="settori rg-section">
    <div class="rg-container">
      <div class="heading" data-reveal>
        <p class="rg-eyebrow">{t.others}</p>
        <h2 class="rg-h2">{@html t.othersTitle}</h2>
        <p class="rg-sub">{t.othersSub}</p>
      </div>
      <div class="sector-grid" data-reveal="stagger">
        {#each others as o}
          <a class="sector" href={settoreUrl(o.slug)}>
            <span class="sector-icon"><svelte:component this={o.icon} size={22} strokeWidth={1.5} /></span>
            <span class="sector-name">{o.name}</span>
            <span class="sector-host">{settoreHost(o.slug)}</span>
            <span class="sector-go" aria-hidden="true"><ArrowUpRight size={18} strokeWidth={1.5} /></span>
          </a>
        {/each}
      </div>
    </div>
  </section>

  <Rigeneratori topic={s.name} />
  <Contatti topic={s.name} />
  <Footer />
</main>

<style>
  main {
    width: 100%;
  }

  /* ---------- hero ---------- */

  .hero {
    position: relative;
    min-height: 86vh;
    min-height: 86svh;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
    background: var(--rg-night);
    color: var(--rg-cream);
    isolation: isolate;
  }

  .photo {
    position: absolute;
    inset: -6% 0 -12%;
    background-position: center;
    background-size: cover;
    opacity: 0.5;
    z-index: -2;
    will-change: transform;
  }

  .shade {
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      radial-gradient(ellipse at 15% 20%, rgba(63, 106, 69, 0.4), transparent 60%),
      linear-gradient(180deg, rgba(27, 34, 26, 0.6) 0%, rgba(27, 34, 26, 0.3) 40%, rgba(27, 34, 26, 0.94) 100%);
  }

  .hero-content {
    width: 100%;
    padding-top: 8rem;
    padding-bottom: 5.5rem;
  }

  .crumbs {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.4rem;
    font-size: 0.78rem;
    color: rgba(244, 239, 228, 0.6);
    margin-bottom: 2rem;
    animation: rise 1.2s var(--rg-ease) both;
  }

  .crumbs a {
    color: rgba(244, 239, 228, 0.78);
  }

  .crumbs a:hover {
    color: var(--rg-gold-soft);
  }

  .crumbs [aria-current] {
    color: var(--rg-gold-soft);
  }

  .eyebrow {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.6rem 1rem;
    color: rgba(244, 239, 228, 0.78);
    font-size: 0.72rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 1.75rem;
    animation: rise 1.2s var(--rg-ease) 0.1s both;
  }

  .badge {
    display: inline-grid;
    place-items: center;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 10px;
    background: rgba(244, 239, 228, 0.1);
    color: var(--rg-gold-soft);
  }

  .host {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: var(--rg-gold-soft);
    letter-spacing: 1.5px;
    text-transform: none;
  }

  h1 {
    color: #fff;
    font-size: clamp(2.6rem, 7.4vw, 6.4rem);
    font-weight: 300;
    letter-spacing: -0.5px;
    line-height: 0.98;
    margin-bottom: 2rem;
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

  h1 :global(em) {
    color: var(--rg-gold-soft);
    font-style: italic;
    font-weight: 400;
  }

  .tagline {
    color: rgba(244, 239, 228, 0.86);
    font-size: clamp(1rem, 1.5vw, 1.15rem);
    font-weight: 300;
    max-width: 600px;
    margin-bottom: 2.5rem;
    animation: rise 1.2s var(--rg-ease) 0.45s both;
  }

  .hero-actions {
    display: flex;
    gap: 0.9rem;
    flex-wrap: wrap;
    animation: rise 1.2s var(--rg-ease) 0.6s both;
  }

  /* ---------- shared headings ---------- */

  .heading {
    margin-bottom: 3.5rem;
  }

  .rg-h2 :global(em) {
    font-style: italic;
    color: var(--rg-forest);
  }

  /* ---------- approccio ---------- */

  .intro {
    max-width: 900px;
    margin-bottom: 4.5rem;
  }

  .lead {
    font-family: "Cormorant Garamond", serif;
    font-size: clamp(1.5rem, 2.8vw, 2.3rem);
    line-height: 1.35;
    color: var(--rg-bark);
    font-weight: 300;
  }

  .principles {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
    border-top: 1px solid var(--rg-line);
    padding-top: 2.5rem;
  }

  .num {
    display: block;
    font-size: 0.72rem;
    letter-spacing: 2px;
    color: var(--rg-gold);
    margin-bottom: 0.9rem;
  }

  .principle h3 {
    font-size: 1.6rem;
    margin-bottom: 0.6rem;
  }

  .principle p {
    color: var(--rg-muted);
  }

  /* ---------- servizi ---------- */

  .servizi {
    background: var(--rg-cream);
  }

  .services {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem;
  }

  .service {
    padding: 1.9rem 1.7rem;
    border-radius: 18px;
    background: var(--rg-cream-soft);
    border: 1px solid var(--rg-line);
    transition: transform 0.45s var(--rg-ease), border-color 0.45s var(--rg-ease), box-shadow 0.45s var(--rg-ease);
  }

  .service:hover {
    transform: translateY(-4px);
    border-color: var(--rg-moss);
    box-shadow: 0 14px 40px rgba(44, 53, 39, 0.08);
  }

  .service-num {
    display: block;
    font-size: 0.7rem;
    letter-spacing: 2px;
    color: var(--rg-gold);
    margin-bottom: 1.1rem;
  }

  .service h3 {
    font-size: 1.45rem;
    margin-bottom: 0.55rem;
  }

  .service p {
    font-size: 0.92rem;
    line-height: 1.7;
    color: var(--rg-muted);
  }

  /* ---------- focus ---------- */

  .focus {
    background: var(--rg-forest-dark);
    background-image: var(--rg-grain), radial-gradient(ellipse at 100% 0%, rgba(201, 163, 91, 0.2), transparent 55%);
    color: var(--rg-cream);
    overflow: hidden;
  }

  .focus-grid {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 4rem;
    align-items: start;
  }

  .focus-head {
    position: relative;
    position: sticky;
    top: 7rem;
  }

  .focus .rg-eyebrow {
    color: var(--rg-gold-soft);
  }

  .focus .rg-h2 {
    color: #fff;
  }

  .focus .rg-h2 :global(em) {
    color: var(--rg-gold-soft);
  }

  .mark {
    display: block;
    margin-top: 2.5rem;
    color: rgba(221, 185, 121, 0.22);
  }

  .focus-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0 2.5rem;
  }

  .focus-list div {
    padding: 1.5rem 0;
    border-top: 1px solid rgba(244, 239, 228, 0.16);
  }

  .focus-list dt {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.45rem;
    color: #fff;
    margin-bottom: 0.35rem;
  }

  .focus-list dd {
    color: rgba(244, 239, 228, 0.72);
    font-size: 0.92rem;
    line-height: 1.65;
  }

  /* ---------- metodo ---------- */

  .steps {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    position: relative;
  }

  .steps::before {
    content: "";
    position: absolute;
    top: 1.35rem;
    left: 1.35rem;
    right: 1.35rem;
    height: 1px;
    background: linear-gradient(90deg, var(--rg-moss), var(--rg-gold));
    opacity: 0.6;
  }

  .step {
    position: relative;
  }

  .dot {
    display: grid;
    place-items: center;
    width: 2.7rem;
    height: 2.7rem;
    border-radius: 50%;
    background: var(--rg-forest-dark);
    color: var(--rg-gold-soft);
    font-family: "Cormorant Garamond", serif;
    font-size: 1.2rem;
    margin-bottom: 1.4rem;
    position: relative;
    box-shadow: 0 0 0 6px var(--rg-cream-soft);
  }

  .step h3 {
    font-size: 1.45rem;
    margin-bottom: 0.5rem;
  }

  .step p {
    color: var(--rg-muted);
    font-size: 0.92rem;
    line-height: 1.7;
  }

  /* ---------- altri settori ---------- */

  .settori {
    padding-bottom: 2rem;
  }

  .sector-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 0.9rem;
  }

  .sector {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    column-gap: 1rem;
    align-items: center;
    padding: 1.3rem 3rem 1.3rem 1.3rem;
    border-radius: 16px;
    border: 1px solid var(--rg-line);
    background: rgba(255, 255, 255, 0.45);
    color: var(--rg-bark);
    transition: background 0.4s var(--rg-ease), border-color 0.4s var(--rg-ease), transform 0.4s var(--rg-ease), color 0.4s var(--rg-ease);
  }

  .sector:hover {
    background: var(--rg-forest-dark);
    border-color: var(--rg-forest-dark);
    color: var(--rg-cream);
    transform: translateY(-3px);
  }

  .sector-icon {
    grid-row: 1 / 3;
    display: grid;
    place-items: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 12px;
    background: var(--rg-cream);
    color: var(--rg-forest);
    transition: background 0.4s ease, color 0.4s ease;
  }

  .sector:hover .sector-icon {
    background: rgba(244, 239, 228, 0.12);
    color: var(--rg-gold-soft);
  }

  .sector-name {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.4rem;
    line-height: 1.15;
  }

  .sector-host {
    font-size: 0.75rem;
    color: var(--rg-muted);
    transition: color 0.4s ease;
    overflow-wrap: anywhere;
  }

  .sector:hover .sector-host {
    color: rgba(244, 239, 228, 0.65);
  }

  .sector-go {
    position: absolute;
    top: 1.1rem;
    right: 1.1rem;
    display: flex;
    color: var(--rg-gold);
    transition: transform 0.4s var(--rg-ease);
  }

  .sector:hover .sector-go {
    transform: translate(2px, -2px);
  }

  @keyframes lift {
    from { transform: translateY(105%); }
    to { transform: translateY(0); }
  }

  @keyframes rise {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 960px) {
    .principles {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .focus-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .focus-head {
      position: relative;
      top: 0;
    }

    .mark {
      display: none;
    }

    .steps {
      grid-template-columns: repeat(2, 1fr);
      row-gap: 2.75rem;
    }

    .steps::before {
      display: none;
    }
  }

  @media (max-width: 560px) {
    .focus-list,
    .steps {
      grid-template-columns: 1fr;
    }

    .hero-content {
      padding-bottom: 3.5rem;
    }

    .eyebrow {
      letter-spacing: 3px;
    }
  }
</style>

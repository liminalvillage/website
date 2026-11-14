<script>
  import Sprout from '@lucide/svelte/icons/sprout';
  import Presentation from '@lucide/svelte/icons/presentation';
  import Users from '@lucide/svelte/icons/users';
  import KeyRound from '@lucide/svelte/icons/key-round';
  import Play from '@lucide/svelte/icons/play';
  import { pick } from './i18n.js';

  const t = pick({
    en: {
      eyebrow: 'The vision',
      title: 'What if regeneration <em>never stopped?</em>',
      lead: [
        'Not something we talk about now and then at conferences, retreats or festivals, but something we take part in continuously, wherever we live.',
        'ReGenerativa is building a decentralised network of people, places, organisations and initiatives that work together to regenerate ecological, social, cultural and economic systems. At its heart is a continuous ecosystem of events, experiences, learning and shared projects that create tangible change.',
      ],
      mission: 'Our mission is to make regeneration <em>accessible, participatory and economically viable</em>, turning occasional inspiration into sustained collective action.',
      video: 'Watch: the Regenerative Hubs Network, 2030 vision and now',
      play: 'Play video',
      challengeEyebrow: 'The challenge',
      challengeTitle: 'Connecting what already exists',
      challenge: 'People everywhere are restoring soils, reinventing learning, living more collaboratively and building technology that respects planetary limits. Much of it stays fragmented:',
      cases: [
        ['A farm', 'has land and knowledge, but not the people or resources to run educational experiences.'],
        ['A facilitator', 'has extraordinary skills, but struggles to find venues and participants.'],
        ['A family', 'wants to be part of a regenerative community, but does not know where to begin.'],
        ['A property owner', 'has an under-used building, while a nearby initiative badly needs space.'],
      ],
      missing: 'The missing ingredient is often not another project, but <em>the relationships and coordination</em> that let existing projects support one another.',
      missingSub: 'Instead of asking every initiative to become self-sufficient, ReGenerativa creates the conditions for them to become mutually supportive.',
    },
    it: {
      eyebrow: 'La visione',
      title: 'E se la rigenerazione <em>non si fermasse mai?</em>',
      lead: [
        'Non qualcosa di cui parlare ogni tanto a conferenze, ritiri o festival, ma qualcosa a cui partecipare con continuità, ovunque viviamo.',
        'ReGenerativa sta costruendo una rete decentralizzata di persone, luoghi, organizzazioni e iniziative che collaborano per rigenerare sistemi ecologici, sociali, culturali ed economici. Al centro c\'è un ecosistema continuo di eventi, esperienze, apprendimento e progetti condivisi che producono un cambiamento concreto.',
      ],
      mission: 'La nostra missione è rendere la rigenerazione <em>accessibile, partecipata ed economicamente sostenibile</em>, trasformando l\'ispirazione occasionale in azione collettiva duratura.',
      video: 'Guarda: la rete degli hub rigenerativi, visione 2030 e presente',
      play: 'Riproduci il video',
      challengeEyebrow: 'La sfida',
      challengeTitle: 'Connettere ciò che già esiste',
      challenge: 'Ovunque c\'è chi rigenera i suoli, reinventa l\'educazione, vive in modo più collaborativo e crea tecnologie che rispettano i limiti del pianeta. Ma gran parte di questo resta frammentato:',
      cases: [
        ['Una fattoria', 'ha terra e saperi, ma non le persone o le risorse per creare esperienze formative.'],
        ['Un facilitatore', 'ha competenze straordinarie, ma fatica a trovare spazi e partecipanti.'],
        ['Una famiglia', 'vorrebbe far parte di una comunità rigenerativa, ma non sa da dove cominciare.'],
        ['Un proprietario', 'ha un edificio sottoutilizzato, mentre un\'iniziativa vicina cerca disperatamente spazio.'],
      ],
      missing: 'Spesso l\'ingrediente mancante non è un altro progetto, ma <em>le relazioni e il coordinamento</em> che permettono ai progetti esistenti di sostenersi a vicenda.',
      missingSub: 'Invece di chiedere a ogni iniziativa di essere autosufficiente, ReGenerativa crea le condizioni perché diventino reciprocamente solidali.',
    },
  });

  const icons = [Sprout, Presentation, Users, KeyRound];

  // The network's video: a thumbnail until clicked, so YouTube loads only on request.
  const VIDEO_ID = 'XdhPXocPf9g';
  let playing = false;
</script>

<section id="rn-vision" class="rg-section vision">
  <div class="rg-container">
    <div class="intro">
      <div data-reveal>
        <p class="rg-eyebrow">{t.eyebrow}</p>
        <h2 class="rg-h2">{@html t.title}</h2>
      </div>
      <div class="lead" data-reveal>
        {#each t.lead as p}<p>{p}</p>{/each}
      </div>
    </div>

    <blockquote class="mission" data-reveal>{@html t.mission}</blockquote>

    <figure class="video" data-reveal>
      <div class="frame">
        {#if playing}
          <iframe
            src="https://www.youtube-nocookie.com/embed/{VIDEO_ID}?autoplay=1&rel=0&modestbranding=1"
            title={t.video}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowfullscreen
          ></iframe>
        {:else}
          <button class="poster" on:click={() => (playing = true)} aria-label="{t.play}: {t.video}">
            <img src="https://i.ytimg.com/vi/{VIDEO_ID}/maxresdefault.jpg" alt="" loading="lazy" />
            <span class="play"><Play size={30} strokeWidth={1.5} /></span>
          </button>
        {/if}
      </div>
      <figcaption>{t.video}</figcaption>
    </figure>

    <div class="challenge">
      <div class="c-head" data-reveal>
        <p class="rg-eyebrow">{t.challengeEyebrow}</p>
        <h3>{t.challengeTitle}</h3>
        <p>{t.challenge}</p>
      </div>
      <ul class="cases" data-reveal="stagger">
        {#each t.cases as [who, what], i}
          <li>
            <span class="icon"><svelte:component this={icons[i]} size={20} strokeWidth={1.5} /></span>
            <p><strong>{who}</strong> {what}</p>
          </li>
        {/each}
      </ul>
      <div class="missing" data-reveal>
        <p class="m-big">{@html t.missing}</p>
        <p class="m-sub">{t.missingSub}</p>
      </div>
    </div>
  </div>
</section>

<style>
  .intro {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: end;
    margin-bottom: 4.5rem;
  }

  .lead p { font-size: 1.05rem; }
  .lead p + p { margin-top: 1rem; color: var(--rg-muted); }

  .mission {
    font-family: "Cormorant Garamond", serif;
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    font-weight: 300;
    line-height: 1.25;
    color: var(--rg-bark);
    max-width: 900px;
    padding-left: 2rem;
    border-left: 2px solid var(--rg-gold);
    margin-bottom: 6rem;
  }

  .mission :global(em) { color: var(--rg-forest); }

  .video { margin-bottom: 6rem; }

  .frame {
    position: relative;
    aspect-ratio: 16 / 9;
    border-radius: 20px;
    overflow: hidden;
    background: var(--rg-night);
    box-shadow: 0 30px 60px rgba(44, 53, 39, 0.18);
  }

  .frame iframe, .poster {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }

  .poster { padding: 0; cursor: pointer; background: var(--rg-night); }

  .poster img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.8;
    transition: opacity 0.4s ease, transform 0.8s var(--rg-ease);
  }

  .poster:hover img { opacity: 0.95; transform: scale(1.02); }

  .play {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 84px;
    height: 84px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 4px;
    border-radius: 50%;
    background: var(--rg-gold);
    color: var(--rg-night);
    box-shadow: 0 0 0 10px rgba(201, 163, 91, 0.25);
    transition: transform 0.4s var(--rg-ease);
  }

  .poster:hover .play { transform: translate(-50%, -50%) scale(1.08); }

  figcaption {
    margin-top: 1rem;
    font-family: "Cormorant Garamond", serif;
    font-style: italic;
    font-size: 1.1rem;
    color: var(--rg-muted);
    text-align: center;
  }

  .challenge {
    padding: 4rem;
    border-radius: 22px;
    background: var(--rg-cream);
  }

  .c-head { max-width: 680px; margin-bottom: 2.5rem; }
  .c-head h3 { font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 300; margin-bottom: 0.75rem; }
  .c-head p { color: var(--rg-muted); }

  .cases {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  .cases li {
    padding: 1.5rem 1.4rem;
    background: var(--rg-cream-soft);
    border: 1px solid var(--rg-line);
    border-radius: 14px;
  }

  .cases p { font-size: 0.92rem; line-height: 1.7; color: var(--rg-muted); }
  .cases strong { color: var(--rg-bark); font-weight: 600; }

  .icon {
    display: inline-flex;
    width: 42px;
    height: 42px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--rg-cream);
    color: var(--rg-forest);
    margin-bottom: 1rem;
  }

  .missing {
    margin-top: 3rem;
    padding-top: 2.5rem;
    border-top: 1px dashed var(--rg-soil);
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 3rem;
    align-items: center;
  }

  .m-big {
    font-family: "Cormorant Garamond", serif;
    font-size: clamp(1.4rem, 2.4vw, 1.9rem);
    line-height: 1.3;
    color: var(--rg-bark);
  }

  .m-big :global(em) { color: var(--rg-forest); }
  .m-sub { color: var(--rg-muted); }

  @media (max-width: 1000px) {
    .cases { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 900px) {
    .intro, .missing { grid-template-columns: 1fr; gap: 1.5rem; }
    .challenge { padding: 2.25rem 1.25rem; }
    .mission { padding-left: 1.25rem; margin-bottom: 3rem; }
    .video { margin-bottom: 4rem; }
    .frame { border-radius: 14px; }
    .play { width: 64px; height: 64px; }
  }

  @media (max-width: 560px) {
    .cases { grid-template-columns: 1fr; }
  }
</style>

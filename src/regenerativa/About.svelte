<script>
  import Sprout from '@lucide/svelte/icons/sprout';
  import Presentation from '@lucide/svelte/icons/presentation';
  import Users from '@lucide/svelte/icons/users';
  import KeyRound from '@lucide/svelte/icons/key-round';
  import Play from '@lucide/svelte/icons/play';
  import { pick } from './i18n.js';
  import Photo from './Photo.svelte';

  const t = pick({
    en: {
      eyebrow: 'The vision',
      title: 'What if regeneration <em>never stopped?</em>',
      lead: [
        'ReGenerativa connects the people, places and projects already regenerating land and community in the Marche, so that each gathering leads to the next and the whole network grows stronger.',
      ],
      video: 'Watch: the Regenerative Hubs Network, 2030 vision and now',
      play: 'Play video',
      challengeEyebrow: 'The challenge',
      challengeTitle: 'Connecting what already exists',
      cases: [
        ['A farm', 'has land and knowledge, but not the people or resources to run educational experiences.'],
        ['A facilitator', 'has extraordinary skills, but struggles to find venues and participants.'],
        ['A family', 'wants to be part of a regenerative community, but does not know where to begin.'],
        ['A property owner', 'has an under-used building, while a nearby initiative badly needs space.'],
      ],
      mapCaption: 'Mapping who is already doing what across the Marche',
      meetingCaption: 'A network gathering: people, projects and needs around one table',
      missing: 'The missing ingredient is often not another project, but <em>the relationships and coordination</em> that let existing projects support one another.',
    },
    it: {
      eyebrow: 'La visione',
      title: 'E se la rigenerazione <em>non si fermasse mai?</em>',
      lead: [
        'ReGenerativa connette le persone, i luoghi e i progetti che già rigenerano terra e comunità nelle Marche, perché ogni incontro porti al successivo e tutta la rete diventi più forte.',
      ],
      video: 'Guarda: la rete degli hub rigenerativi, visione 2030 e presente',
      play: 'Riproduci il video',
      challengeEyebrow: 'La sfida',
      challengeTitle: 'Connettere ciò che già esiste',
      cases: [
        ['Una fattoria', 'ha terra e saperi, ma non le persone o le risorse per creare esperienze formative.'],
        ['Un facilitatore', 'ha competenze straordinarie, ma fatica a trovare spazi e partecipanti.'],
        ['Una famiglia', 'vorrebbe far parte di una comunità rigenerativa, ma non sa da dove cominciare.'],
        ['Un proprietario', 'ha un edificio sottoutilizzato, mentre un\'iniziativa vicina cerca disperatamente spazio.'],
      ],
      mapCaption: 'Mappare chi sta già facendo cosa nelle Marche',
      meetingCaption: 'Un incontro della rete: persone, progetti e bisogni attorno a un tavolo',
      missing: 'Spesso l\'ingrediente mancante non è un altro progetto, ma <em>le relazioni e il coordinamento</em> che permettono ai progetti esistenti di sostenersi a vicenda.',
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
      </div>
      <ul class="cases" data-reveal="stagger">
        {#each t.cases as [who, what], i}
          <li>
            <span class="icon"><svelte:component this={icons[i]} size={20} strokeWidth={1.5} /></span>
            <p><strong>{who}</strong> {what}</p>
          </li>
        {/each}
      </ul>
      <div class="photos" data-reveal="stagger">
        <Photo src="/images/regenerativa/map.jpg" caption={t.mapCaption} ratio="3 / 4" />
        <Photo src="/images/regenerativa/network-meeting.jpg" caption={t.meetingCaption} ratio="4 / 3" />
      </div>
      <div class="missing" data-reveal>
        <p class="m-big">{@html t.missing}</p>
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

  .photos {
    display: grid;
    grid-template-columns: 9fr 16fr;
    gap: 1rem;
    margin-top: 1.5rem;
    align-items: start;
  }

  .missing {
    margin-top: 3rem;
    padding-top: 2.5rem;
    border-top: 1px dashed var(--rg-soil);
    max-width: 820px;
  }

  .m-big {
    font-family: "Cormorant Garamond", serif;
    font-size: clamp(1.4rem, 2.4vw, 1.9rem);
    line-height: 1.3;
    color: var(--rg-bark);
  }

  .m-big :global(em) { color: var(--rg-forest); }

  @media (max-width: 1000px) {
    .cases { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 900px) {
    .intro { grid-template-columns: 1fr; gap: 1.5rem; }
    .challenge { padding: 2.25rem 1.25rem; }
    .video { margin-bottom: 4rem; }
    .frame { border-radius: 14px; }
    .play { width: 64px; height: 64px; }
  }

  @media (max-width: 560px) {
    .cases { grid-template-columns: 1fr; }
    .photos { grid-template-columns: 1fr; }
  }
</style>

<script>
  // The home page as a zoomable canvas, in the spirit of Prezi. Ideas are
  // circles inside circles; scrolling (or swiping, the arrow keys, clicking a
  // circle, or the bottom dock) flies the camera into the next idea, where its
  // content fades in, and back out on the way to the one after. The village
  // video plays behind (VideoBackdrop). All copy is the home page's own.
  import Ring from './Ring.svelte';
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import LunationTimer from '../lib/LunationTimer.svelte';

  // --- the world: positions and radii in world units -----------------------
  const HUB = { x: 0, y: 0, r: 520 };
  const ABOUT = { x: -950, y: -760, r: 430 };
  const DNA = { x: ABOUT.x - 150, y: ABOUT.y + 215, r: 100 };
  const ASPECTS = { x: ABOUT.x + 118, y: ABOUT.y + 200, r: 158 };
  // Side by side with a small gap, so no two rings cross
  const PILLARS = [-1, 0, 1].map((k) => ({ x: ASPECTS.x + k * 96, y: ASPECTS.y + 22, r: 44 }));
  const VILLAGE = { x: 950, y: -760, r: 430 };
  const LUNATIONS = { x: 1250, y: 420, r: 430 };
  const NETWORK = { x: 0, y: 1180, r: 430 };
  const CONTACT = { x: -1250, y: 420, r: 430 };
  const PHASES = ['Seed', 'Build', 'Celebrate', 'Harvest'];

  // A frame for the camera: centre and the width/height that must fit
  const frame = (c, pad = 1) => ({ x: c.x, y: c.y, w: c.r * 2 * pad, h: c.r * 2 * pad });

  let vw = 1280;
  let vh = 800;
  $: narrow = vw < 700;

  // The stops along the journey. On a phone each of the three aspects gets
  // its own stop, since three side by side would be too small to read. The
  // camera eases into the aspects more slowly ("slow"), so they can be taken
  // in as they open.
  const OVERVIEW = { x: 0, y: 160, w: 3500, h: 3300 };
  $: STOPS = [
    { label: 'Liminal Village', frame: frame(HUB, 1.06), href: '#main-top' },
    { label: 'Overview', frame: OVERVIEW, href: '#main-top' },
    { label: 'About', frame: frame(ABOUT, 1.04), href: '#about' },
    { label: 'Our DNA', frame: frame(DNA, 1.1), href: '#about' },
    ...(narrow
      ? PILLARS.map((p, i) => ({ label: ['Personal', 'Local', 'Global'][i], frame: frame(p, 1.08), href: '#about', slow: 1.6 }))
      : [{ label: 'Personal · Local · Global', frame: { x: ASPECTS.x, y: ASPECTS.y - 6, w: 300, h: 190 }, href: '#about', slow: 1.8 }]),
    { label: 'The Village', frame: frame(VILLAGE, 1.04), href: '#thevillage' },
    { label: 'Lunations', frame: frame(LUNATIONS, 1.04), href: '#lunations' },
    { label: 'Network', frame: frame(NETWORK, 1.04), href: '#network' },
    { label: 'Join', frame: frame(CONTACT, 1.04), href: '#contact' },
    { label: 'Overview', frame: OVERVIEW, href: '#main-top' },
  ];

  // --- the camera ------------------------------------------------------------
  let cam = { x: 0, y: 0, s: 0.2 };
  let stop = 0;
  let busy = false;
  let world;

  const scaleFor = (f) => Math.min((vw * 0.9) / f.w, (vh * 0.84) / f.h);

  function apply() {
    if (!world) return;
    world.style.transform = `translate(${vw / 2}px, ${vh / 2}px) scale(${cam.s}) translate(${-cam.x}px, ${-cam.y}px)`;
    // Lines stay at least a pixel wide at any zoom
    world.style.setProperty('--px', `${Math.max(1, 1 / cam.s)}px`);
    world.style.setProperty('--inv', 1 / cam.s);
    // A circle's ring fades once you've zoomed well inside it, so only the
    // rings of what you're looking at are drawn. The hub's own ring is the
    // exception: framed full screen as the front page it has none, and it
    // fades in only as you zoom out to the others
    for (const el of world.querySelectorAll('.orb')) {
      const r = el.offsetWidth / 2;
      const at = Math.min(vw * 0.9, vh * 0.84) / (r * 2.08);
      const a = el.classList.contains('hub') ? (at * 0.9 - cam.s) / (at * 0.3) : (at * 1.9 - cam.s) / (at * 0.6);
      el.style.setProperty('--ring-a', Math.min(1, Math.max(0, a)));
      // Zoomed out, a big circle's title glides from the top of the circle
      // to its middle, so each one reads as a centred label
      if (el.classList.contains('world-orb')) {
        const title = el.querySelector('.title');
        const far = Math.min(1, Math.max(0, (at * 0.6 - cam.s) / (at * 0.3)));
        const shift = (r - (title.offsetTop + title.offsetHeight / 2)) * far;
        for (const t of el.querySelectorAll('.title, .eyebrow')) t.style.transform = `translateY(${shift}px)`;
      }
    }
    // Content belonging to a circle fades in as you zoom close enough to read it
    for (const el of world.querySelectorAll('[data-r]')) {
      // Shown once the camera nears the scale that frames its circle, and
      // gone again once you zoom well past it into something smaller.
      // Labels (titles) are there from far away and only fade going deeper.
      const at = Math.min(vw * 0.9, vh * 0.84) / (+el.dataset.r * 2.08);
      const fadeIn = Math.min(1, Math.max(0, (cam.s - at * 0.5) / (at * 0.35)));
      const fadeOut = Math.min(1, Math.max(0, (at * 2.6 - cam.s) / (at * 0.8)));
      // Content also needs the camera to be over its own circle, so a
      // circle's words never show while you are looking at another one
      let near = 1;
      if ((el.dataset.mode !== 'label' || el.dataset.near) && el.dataset.c) {
        const [cx, cy, r] = el.dataset.c.split(',').map(Number);
        near = Math.min(1, Math.max(0, 1.6 - Math.hypot(cam.x - cx, cam.y - cy) / r));
      }
      const k = el.dataset.mode === 'label' ? Math.min(fadeOut, near) : Math.min(fadeIn, fadeOut, near);
      el.style.opacity = k;
      el.style.visibility = k < 0.01 ? 'hidden' : 'visible';
    }
  }

  function go(i, instant = false) {
    i = Math.max(0, Math.min(STOPS.length - 1, i));
    const to = STOPS[i].frame;
    const from = { ...cam };
    const target = { x: to.x, y: to.y, s: scaleFor(to) };
    stop = i;
    dispatchEvent(new CustomEvent('journey-stop', { detail: { index: i, href: STOPS[i].href } }));
    if (instant) {
      cam = target;
      apply();
      return;
    }
    // Pull back between far-apart ideas, the way Prezi does
    const dist = Math.hypot(target.x - from.x, target.y - from.y);
    const bump = Math.min(0.7, dist / 2800);
    const p = { t: 0 };
    busy = true;
    gsap.to(p, {
      t: 1,
      duration: (1.7 + bump * 0.8) * (STOPS[i].slow ?? 1),
      ease: 'power3.inOut',
      onUpdate: () => {
        const t = p.t;
        const s = Math.exp(Math.log(from.s) + (Math.log(target.s) - Math.log(from.s)) * t);
        cam = {
          x: from.x + (target.x - from.x) * t,
          y: from.y + (target.y - from.y) * t,
          s: s * (1 - bump * Math.sin(Math.PI * t)),
        };
        apply();
      },
      onComplete: () => (busy = false),
    });
  }

  const next = () => !busy && go(stop + 1);
  const prev = () => !busy && go(stop - 1);

  // --- input -----------------------------------------------------------------
  let acc = 0;
  let accTimer;
  function onWheel(e) {
    e.preventDefault();
    if (busy) return;
    acc += e.deltaY;
    clearTimeout(accTimer);
    accTimer = setTimeout(() => (acc = 0), 220);
    if (acc > 60) {
      acc = 0;
      next();
    } else if (acc < -60) {
      acc = 0;
      prev();
    }
  }

  let touchY = null;
  const onTouchStart = (e) => (touchY = e.touches[0].clientY);
  function onTouchEnd(e) {
    if (touchY == null) return;
    const dy = touchY - e.changedTouches[0].clientY;
    touchY = null;
    if (dy > 50) next();
    else if (dy < -50) prev();
  }

  function onKey(e) {
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
      next();
    } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      prev();
    } else if (e.key === 'Escape') {
      go(0);
    }
  }

  // Clicking a circle flies to the first stop with that label
  const toLabel = (label) => {
    const i = STOPS.findIndex((s) => s.label === label);
    if (i >= 0 && !busy) go(i);
  };

  function resize() {
    vw = innerWidth;
    vh = innerHeight;
    setTimeout(() => go(stop, true));
  }

  function onLink(e) {
    const a = e.target.closest('a[href*="#"]');
    if (!a) return;
    const hash = new URL(a.href).hash;
    const i = STOPS.findIndex((s) => s.href === hash && s.label !== 'Overview');
    if (i < 0 || new URL(a.href).pathname !== location.pathname) return;
    e.preventDefault();
    if (!busy) go(i);
  }

  onMount(() => {
    resize();
    go(0, true);
    world.parentElement.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('click', onLink);
    return () => {
      world?.parentElement?.removeEventListener('wheel', onWheel);
      document.removeEventListener('click', onLink);
    };
  });

  // Circle placement in world units
  const place = (c) => `left:${c.x - c.r}px;top:${c.y - c.r}px;width:${c.r * 2}px;height:${c.r * 2}px`;
</script>

<svelte:window on:resize={resize} on:keydown={onKey} />

<main class="journey" on:touchstart={onTouchStart} on:touchend={onTouchEnd}>
  <div
    class="world"
    class:about-focus={STOPS[stop]?.label === 'About'}
    class:about-inside={STOPS[stop]?.href === '#about' && STOPS[stop]?.label !== 'About'}
    bind:this={world}
  >
    <!-- Liminal Village -->
    <section class="orb hub" style={place(HUB)}>
      <Ring seed={1} />
      <h1 data-r={HUB.r} data-mode="label" data-near="1" data-c={`${HUB.x},${HUB.y},${HUB.r * 1.4}`}>Liminal Village</h1>
      <p class="sub" data-r={HUB.r} data-mode="label" data-near="1" data-c={`${HUB.x},${HUB.y},${HUB.r * 1.4}`}>Open Source Innovation Eco-Tech Hub</p>
      <p class="line" data-r={HUB.r} data-mode="label" data-near="1" data-c={`${HUB.x},${HUB.y},${HUB.r * 1.4}`}>A node of the <a href="https://regenerativa.earth" target="_blank" rel="noopener">ReGenerativa</a> network</p>
      <div class="moon-wrap" data-r={HUB.r} data-mode="label" data-near="1" data-c={`${HUB.x},${HUB.y},${HUB.r * 1.4}`}><LunationTimer /></div>
    </section>

    <!-- About, with the DNA and the three aspects inside it -->
    <section class="orb world-orb" style={place(ABOUT)} on:click={() => toLabel('About')}>
      <Ring seed={2} />
      <h2 class="title" data-r={ABOUT.r} data-mode="label">About</h2>
      <!-- Set like notes: the same words, some larger, some in hand -->
      <div class="body notes" data-r={ABOUT.r} data-c={`${ABOUT.x},${ABOUT.y},${ABOUT.r}`}>
        <p class="note-lead">Liminal Village is a co-living and co-creation eco-tech hub in the center of Italy.</p>
        <p>
          We have been experimenting with forming and weaving temporary communities aimed at
          creating value for the world, heal themselves and heal the collective, by emphasising
          the balance of <strong>personal, local and global regeneration</strong>.
        </p>
        <p>
          Inspired by the concept of a <em>Resource-Based Economy</em>, Liminal, meaning
          <span class="hand">"a place of transition"</span> or
          <span class="hand">"a place that occupies both sides"</span>, is an embodied experimental ground
          where value-aligned people come together to co-create and experience the future they
          would like to see (eg:
          <a href="https://www.gameb.wiki/index.php?title=Game_B" target="_blank" rel="noopener">Game B</a>).
        </p>
        <p>
          Using natural cycles to guide progress, we focus on reinventing how we can live in
          harmony with each other and the planet, by
          <span class="hand">"upgrading the operating system of society"</span>
          and transitioning from scarcity based market economies to
          <span class="hand big">"access abundance"</span>.
        </p>
      </div>
    </section>
    <section class="orb inner dna" style={place(DNA)} on:click|stopPropagation={() => toLabel('Our DNA')}>
      <Ring seed={3} />
      <span class="peek" data-r={ABOUT.r} data-c={`${ABOUT.x},${ABOUT.y},${ABOUT.r}`}>our DNA</span>
      <div class="deep" data-r={DNA.r} data-c={`${DNA.x},${DNA.y},${DNA.r * 2}`}>
        <p class="dna-text">Why we exist, what we value and how we live together is all in</p>
        <a class="pill" href="/dna">our DNA →</a>
      </div>
    </section>
    <section class="orb inner aspects" style={place(ASPECTS)} on:click|stopPropagation={() => toLabel(narrow ? 'Personal' : 'Personal · Local · Global')}>
      <Ring seed={4} />
      <span class="peek" data-r={ABOUT.r} data-c={`${ABOUT.x},${ABOUT.y},${ABOUT.r}`}>Personal · Local · Global</span>
      <p class="lead" data-r={ASPECTS.r * 0.85} data-c={`${ASPECTS.x},${ASPECTS.y},${ASPECTS.r * 2}`}>Visitors and members of the Liminal Village are invited to focus on our transition to Game B on 3 levels</p>
    </section>
    {#each PILLARS as p, i}
      <section class="orb pillar t{i + 1}" style={place(p)}>
        <Ring seed={50 + i} />
        <div data-r={ASPECTS.r * 0.85} data-c={`${ASPECTS.x},${ASPECTS.y},${ASPECTS.r * 2}`}>
          <h3>{['Personal', 'Local', 'Global'][i]}</h3>
          <p>
            {[
              'Contribute something to yourself. During your stay at the village, you can set your personal goals and directions. Outgrow your old self, find your Ikigai, learn something new, write your book or your own TED talk!',
              'Do something for the people around you and for your surrounding: Teach something you know, build something, create art, regenerate the place around you.',
              'Do something for the planet and the people living on it: Find a cause that you deem important in the world, find out more about it, then find ways to help and improve!',
            ][i]}
          </p>
        </div>
      </section>
    {/each}

    <!-- The Village -->
    <section class="orb world-orb" style={place(VILLAGE)} on:click={() => toLabel('The Village')}>
      <Ring seed={6} />
      <h2 class="title" data-r={VILLAGE.r} data-mode="label">The Village</h2>
      <p class="body" data-r={VILLAGE.r} data-c={`${VILLAGE.x},${VILLAGE.y},${VILLAGE.r}`}>
        The co-creation village is situated on the smooth hills of the Tronto Valley in the
        "Marche" region, with panoramic views over the hills and the mountains. We can
        accommodate visitors in private or shared rooms, in caravans and in tents. High-speed
        internet is available throughout the village. We have a biolake, open source water
        purification system and food machines, a permaculture garden, co-creation spaces, and
        outdoor presentation facilities.
      </p>
      <img class="photo" src="/images/P1120415-500x99999.jpeg" alt="Village" data-r={VILLAGE.r} data-c={`${VILLAGE.x},${VILLAGE.y},${VILLAGE.r}`} />
    </section>

    <!-- Lunations -->
    <section class="orb world-orb" style={place(LUNATIONS)} on:click={() => toLabel('Lunations')}>
      <Ring seed={7} />
      <h2 class="title" data-r={LUNATIONS.r} data-mode="label">Lunations</h2>
      <p class="body" data-r={LUNATIONS.r} data-c={`${LUNATIONS.x},${LUNATIONS.y},${LUNATIONS.r}`}>
        We align our activity to the lunar cycles to synchronize group working patterns around
        the phases of a lunar month. You can imagine the moon as a planet-wide 'progress-bar'
        whereby simply craning our heads to the night sky, we can check-in with the vibes of
        other participants anywhere on planet Earth. This is a way for globally distributed teams
        and projects to synchronize and harmonize their activities.
      </p>
      <div class="phases" data-r={LUNATIONS.r} data-c={`${LUNATIONS.x},${LUNATIONS.y},${LUNATIONS.r}`}>
        {#each PHASES as ph, i}<span class="phase t{i + 1}">{ph}</span>{/each}
      </div>
    </section>

    <!-- Network -->
    <section class="orb world-orb" style={place(NETWORK)} on:click={() => toLabel('Network')}>
      <Ring seed={8} />
      <p class="eyebrow" data-r={NETWORK.r} data-mode="label">Part of the ReGenerativa network</p>
      <h2 class="title" data-r={NETWORK.r} data-mode="label">A node in a regenerative network</h2>
      <p class="body" data-r={NETWORK.r} data-c={`${NETWORK.x},${NETWORK.y},${NETWORK.r}`}>
        Liminal Village is the community hub of
        <a href="https://regenerativa.earth" target="_blank" rel="noopener">ReGenerativa</a>,
        a network of interdependent regenerative communities in central Italy and beyond. Instead of
        extracting from land and people, each site works to restore soil, water and biodiversity, to build
        communities where cooperation replaces competition, and to share open tools that others can adopt
        and adapt locally.
      </p>
    </section>

    <!-- Join: the invitation to start -->
    <section class="orb world-orb" style={place(CONTACT)} on:click={() => toLabel('Join')}>
      <Ring seed={9} />
      <h2 class="title" data-r={CONTACT.r} data-mode="label">Start your transition to Game B</h2>
      <div class="body join" data-r={CONTACT.r} data-c={`${CONTACT.x},${CONTACT.y},${CONTACT.r}`}>
        <p class="join-lead">Apply to visit, or become a member of the Liminal Village.</p>
        <div class="join-ways">
          <a class="pill" href="/apply">Apply to visit</a>
          <a class="pill" href="/apply">Become a member</a>
        </div>
        <p class="hand where">
          in between Europe and Africa, northern and southern Italy, the mountains and the sea,
          the hilltop and the valley, nature and civilization
        </p>
      </div>
    </section>
  </div>



</main>

<style>
  /* The journey replaces page scrolling on the home page */
  :global(html),
  :global(body) {
    margin: 0;
    overflow: hidden;
    overscroll-behavior: none;
    scroll-snap-type: none;
    background: #0d0b09;
  }

  .journey {
    position: fixed;
    inset: 0;
    overflow: hidden;
    font-family: 'Quicksand', system-ui, sans-serif;
    z-index: 1;
    color: #fbf6ee;
    touch-action: none;
  }

  /* Headings take the journey's light ink, not the site's dark heading colour */
  .journey :global(:is(h1, h2, h3, h4)) {
    color: inherit;
  }

  .world {
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: 0 0;
  }

  /* Circles in the concept-art style: a soft glow, a fine white ring and stipple */
  .orb {
    position: absolute;
    box-sizing: border-box;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: radial-gradient(circle closest-side, rgba(255, 176, 120, 0.16), rgba(255, 176, 120, 0.04) 85%, transparent);
    cursor: pointer;
    text-shadow: 0 1px 12px rgba(0, 0, 0, 0.4);
  }

  .orb a {
    color: #f6c4ae;
  }

  .hub {
    cursor: default;
    padding: 0 60px;
    background: radial-gradient(circle closest-side, rgba(255, 240, 220, 0.12), transparent);
  }

  .hub h1 {
    margin: 0;
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 200;
    font-size: 96px;
    letter-spacing: 0.02em;
  }

  .hub .sub {
    margin: 18px 0 0;
    font-size: 20px;
    letter-spacing: 7px;
    text-transform: uppercase;
    opacity: 0.85;
  }

  /* Today's moon, larger so its details read when the hub is framed, but
     small enough that the hub's title stays inside its ring */
  .moon-wrap {
    zoom: 1.2;
    margin-top: 0;
  }

  .hub .line {
    margin: 14px 0 0;
    font-size: 16px;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  /* Titles start low enough that even three lines stay inside the ring */
  .world-orb {
    padding: 90px 110px;
  }

  /* Titles never shrink below ~18px on screen, so the overview reads */
  .title {
    margin: 0 0 22px;
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 200;
    font-size: max(54px, calc(18px * var(--inv, 1)));
    line-height: 1.05;
  }

  .eyebrow {
    margin: 0 0 10px;
    font-size: 13px;
    letter-spacing: 3px;
    text-transform: uppercase;
    opacity: 0.75;
  }

  .body {
    margin: 0;
    max-width: 540px;
    font-size: 16px;
    line-height: 1.6;
    text-align: center;
  }

  /* About, set like notes: centred, the opening line larger, the key
     phrases weighted, and the quotes written by hand */
  /* Sized so the whole block, title included, stays well inside the ring */
  .notes {
    max-width: 560px;
    font-size: 16.5px;
  }

  .body.notes p {
    margin: 0 0 1em;
  }

  .body.notes p:last-child {
    margin: 0;
  }

  .notes .note-lead {
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 300;
    font-size: 1.45em;
    line-height: 1.3;
  }

  .notes strong,
  .notes em {
    color: inherit;
  }

  .notes strong {
    font-weight: 600;
  }

  .notes em {
    font-style: italic;
  }

  .notes .hand {
    font-family: 'Caveat', cursive;
    font-size: 1.35em;
    line-height: 1;
    white-space: nowrap;
  }

  .notes .hand.big {
    font-size: 1.7em;
  }

  /* While About is read, the circles inside it (the DNA and the three
     aspects) step back, so their lines never cross the words; they return
     as the camera travels in to them */
  .world.about-focus .inner,
  .world.about-focus .pillar {
    opacity: 0;
    pointer-events: none;
  }

  /* ...and the other way round: inside About, its words step back so they
     never run across the circles coming in. Each fades out before the other
     fades in. */
  /* (a filter, as the camera sets each block's opacity inline) */
  .world.about-inside .notes {
    filter: opacity(0);
  }

  .notes {
    transition: filter 0.4s ease 0.5s;
  }

  .world.about-inside .notes {
    transition-delay: 0s;
  }

  .inner,
  .pillar {
    transition: opacity 0.8s ease 0.4s;
  }

  .world.about-focus .inner,
  .world.about-focus .pillar {
    transition-delay: 0s;
  }

  /* The invitation to join */
  .join-lead {
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 300;
    font-size: 1.4em;
    line-height: 1.35;
  }

  .join-ways {
    display: flex;
    justify-content: center;
    gap: 14px;
    margin: 26px 0 30px;
  }

  .join .pill {
    padding: 12px 26px;
    border-width: 1px;
    font-size: 14px;
    letter-spacing: 2.5px;
    background: rgba(251, 246, 238, 0.08);
    transition: background 0.3s ease;
  }

  .join .pill:hover {
    background: rgba(251, 246, 238, 0.2);
  }

  .join .where {
    max-width: 440px;
    margin: 0 auto;
    font-family: 'Caveat', cursive;
    font-size: 1.35em;
    line-height: 1.25;
    opacity: 0.85;
  }

  .body h4 {
    margin: 18px 0 4px;
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 300;
    font-size: 20px;
  }

  .body p {
    margin: 0;
  }

  .photo {
    margin-top: 22px;
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.35);
  }

  .phases {
    display: flex;
    margin-top: 26px;
  }

  .phase {
    width: 92px;
    height: 92px;
    margin: 0 -8px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 300;
    font-size: 15px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);
  }

  .t1 { background: radial-gradient(circle closest-side, rgba(255, 176, 120, 0.3), transparent); }
  .t2 { background: radial-gradient(circle closest-side, rgba(255, 150, 130, 0.28), transparent); }
  .t3 { background: radial-gradient(circle closest-side, rgba(255, 240, 220, 0.22), transparent); }
  .t4 { background: radial-gradient(circle closest-side, rgba(225, 170, 130, 0.28), transparent); }

  /* Inner circles: a word to find them by, then their content up close */
  .inner {
    padding: 0 16px;
  }

  /* Above the three small circles and inside the big one's ring, so the
     words cross no line */
  .peek {
    position: absolute;
    top: 21%;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .dna .deep {
    padding: 0 6px;
  }

  .dna-text {
    margin: 0 0 8px;
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 300;
    font-size: 11px;
    line-height: 1.35;
  }

  .pill {
    display: inline-block;
    padding: 3px 9px;
    border: 0.5px solid #fbf6ee;
    border-radius: 999px;
    font-size: 5.5px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #fbf6ee !important;
    text-decoration: none;
  }

  /* The invitation sits just above the three circles */
  .aspects {
    justify-content: flex-start;
    padding-top: 78px;
  }

  .aspects .lead {
    margin: 0;
    max-width: 150px;
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 300;
    font-size: 7px;
    line-height: 1.3;
  }

  .pillar {
    cursor: default;
    padding: 0 9px;
    mix-blend-mode: screen;
  }

  .pillar,
  .inner {
    background: radial-gradient(circle closest-side, rgba(255, 176, 120, 0.2), transparent);
  }

  .pillar h3 {
    margin: 0 0 2px;
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 300;
    font-size: 6.5px;
  }

  .pillar p {
    margin: 0;
    font-size: 3.4px;
    line-height: 1.4;
  }



</style>

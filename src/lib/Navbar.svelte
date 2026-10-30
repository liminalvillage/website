<script>
  import { onMount } from 'svelte';

  // The title floats at the top over the hero video. "fade": a dark gradient
  // behind light text that settles into a frosted bar past the hero.
  // "invert": the title inverts against whatever is behind it. Try
  // ?nav=invert to compare. The menu itself is a dock at the bottom.
  // On pages without the hero video the bar starts settled (light).
  export let overHero = true;

  const variant = new URLSearchParams(location.search).get('nav') === 'invert' ? 'invert' : 'fade';
  let pastHero = !overHero;
  // How far down the page you are, 0–1: the dock fills with it
  let progress = 0;
  // On the home page the header's words wait until the hero's large title
  // has scrolled away, so the name never shows twice at once
  let wordmark = true;
  const onScroll = () => {
    if (home) {
      const title = document.querySelector('.hero h1');
      wordmark = !title || title.getBoundingClientRect().bottom < 80;
    }
    // On the home page the whole site scrolls over the video, so the bar keeps
    // its over-video look; other pages get the light bar
    pastHero = !overHero;
    const run = document.documentElement.scrollHeight - window.innerHeight;
    progress = run > 0 ? Math.min(1, window.scrollY / run) : 0;
  };

  const home = location.pathname === '/' || location.pathname === '/index.html';
  const links = [
    { label: 'About', href: '#about' },
    { label: 'The Village', href: '#thevillage' },
    { label: 'Game B', href: '/game-b' },
    { label: 'Lunations', href: '/lunations' },
    { label: 'DNA', href: '/dna' },
    { label: 'Community', href: '/services' },
    { label: 'Quests', href: '/quests.html' },
    { label: 'Media', href: '/media' },
    { label: 'Join', href: '#contact' },
  ];
  // Section links point back to the home page from other pages
  const menuItems = links.map((item) =>
    item.href.startsWith('#') && !home ? { ...item, href: `/${item.href}` } : item
  );
  // The dock's ground line, drawn by hand like the forest drawing's: a
  // gentle wobble across, the same every time
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const groundPts = Array.from({ length: 13 }, (_, i) => [i * (1000 / 12), 9 + (rand() - 0.5) * 5]);
  const ground = groundPts.reduce((d, [x, y], i, pts) => {
    if (i === 0) return `M${x} ${y}`;
    if (i === pts.length - 1) return `${d}L${x} ${y}`;
    const [nx, ny] = pts[i + 1];
    return `${d}Q${x} ${y} ${(x + nx) / 2} ${(y + ny) / 2}`;
  }, '');
  const here = location.pathname.replace(/\.html$/, '').replace(/\/+$/, '');

  // Highlight the in-page section that is on screen
  let active = menuItems.find((item) => !item.href.includes('#') && item.href.replace(/\.html$/, '') === here)?.href ?? '';
  // On the journey home page, the camera says where we are
  const onJourney = (e) => {
    active = e.detail.href === '#main-top' ? '' : e.detail.href;
    wordmark = e.detail.index > 0;
  };

  // --- moving along the menu ------------------------------------------------
  // The pages in the menu's order, the home page (with its circles) first.
  // Scrolling past the end of one carries on to the next, and the drawn
  // loop travels along the dock to it; the loop can also be dragged.
  const clean = (href) => href.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
  const pages = ['/', ...menuItems.filter((item) => !item.href.includes('#')).map((item) => clean(item.href))];
  const at = home ? 0 : pages.indexOf(clean(here));

  let list;
  let loop = { x: 0, w: 0, shown: false };
  let dragging = false;
  let pull = 0;
  let leaving = false;

  // Fit the loop round the link it marks
  function place(href) {
    const a = list?.querySelector(`a[href="${CSS.escape(href)}"]`);
    if (!a) return (loop = { ...loop, shown: false });
    loop = { x: a.offsetLeft, w: a.offsetWidth, shown: true };
  }
  $: if (list && !dragging && !leaving) place(active);

  function travel(href) {
    leaving = true;
    // From the home page's circles, the loop starts from where it is, or
    // from the first word when nothing is marked yet
    if (!loop.shown) place(menuItems[0].href);
    requestAnimationFrame(() => place(href));
    setTimeout(() => (location.href = href), 650);
  }

  function step(d) {
    if (at < 0 || leaving) return;
    const to = at + d;
    if (to < 0) return;
    const page = pages[to % pages.length];
    travel(page === '/' ? '/' : menuItems.find((item) => clean(item.href) === page).href);
  }
  const onStep = (e) => step(e.detail);

  // On ordinary pages, a deliberate scroll past the bottom (or the top)
  // tugs the loop towards the next (or previous) page, then goes there
  let sum = 0;
  let sumTimer;
  function onWheel(e) {
    if (home || 'ownScroll' in document.body.dataset || leaving) return;
    const root = document.documentElement;
    const atEnd = e.deltaY > 0 && window.scrollY + window.innerHeight >= root.scrollHeight - 2;
    const atStart = e.deltaY < 0 && window.scrollY <= 0;
    if (!atEnd && !atStart) return (sum = pull = 0);
    sum += e.deltaY;
    clearTimeout(sumTimer);
    sumTimer = setTimeout(() => (sum = pull = 0), 600);
    pull = Math.max(-1, Math.min(1, sum / 700));
    if (Math.abs(pull) >= 1) {
      pull = 0;
      step(sum > 0 ? 1 : -1);
    }
  }

  // Dragging the loop along the words, then letting go on one, goes there
  let start = null;
  function grab(e) {
    if (leaving) return;
    e.preventDefault();
    start = { px: e.clientX, x: loop.x, last: e.clientX };
    dragging = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function drag(e) {
    if (!start) return;
    start.last = e.clientX;
    const max = list.scrollWidth - loop.w;
    loop = { ...loop, x: Math.max(0, Math.min(max, start.x + e.clientX - start.px)) };
  }
  function drop() {
    if (!start) return;
    // The word nearest where the loop was let go (from the last move, as a
    // cancelled pointer reports no position)
    const mid = start.last - list.getBoundingClientRect().left;
    start = null;
    dragging = false;
    const a = [...list.querySelectorAll('a')].reduce((best, el) =>
      Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid) < Math.abs(best.offsetLeft + best.offsetWidth / 2 - mid) ? el : best
    );
    const href = a.getAttribute('href');
    if (href === active) return place(active);
    place(href);
    // The home page's own circles move by the journey; other words load their page
    if (href.startsWith('#')) a.click();
    else travel(href);
  }

  onMount(() => {
    addEventListener('journey-stop', onJourney);
    addEventListener('page-step', onStep);
    addEventListener('wheel', onWheel, { passive: true });
    addEventListener('resize', () => place(active));
    document.fonts?.ready.then(() => place(active));
    // Pages opened at an anchor start below the hero
    onScroll();
    if (!home) return;
    const sections = menuItems
      .filter((item) => item.href.startsWith('#'))
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) active = `#${e.target.id}`;
          else if (active === `#${e.target.id}`) active = '';
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  });
</script>

<svelte:window on:scroll={onScroll} />

<header class="navbar {variant}" class:past-hero={pastHero}>
  <a href={home ? '#main-top' : '/'} class="navbar-title">
    <img class="logo" src="/images/liminal-village-logo-rings.png" alt="" width="409" height="281" />
    <span class="wordmark" class:shown={wordmark}>Liminal Village</span>
  </a>
</header>

<nav class="dock" class:light={pastHero} aria-label="Main" style="--progress: {progress}">
  <ul bind:this={list}>
    <!-- The drawn loop round the current place; drag it to another word -->
    <span
      class="loop"
      class:shown={loop.shown}
      class:dragging
      style="left: {loop.x}px; width: {loop.w}px; --pull: {pull}"
      on:pointerdown={grab}
      on:pointermove={drag}
      on:pointerup={drop}
      on:pointercancel={drop}
      aria-hidden="true"
    ></span>
    <!-- The links stand on a drawn ground line; the bright part of it grows
         with your progress through the page -->
    <svg class="ground" viewBox="0 0 1000 18" preserveAspectRatio="none" aria-hidden="true">
      <path d={ground} class="base" />
      <path d={ground} class="walked" pathLength="1" style="stroke-dashoffset: {1 - progress}" />
    </svg>
    {#each menuItems as item}
      <li>
        <a
          href={item.href}
          class:active={active === item.href}
          aria-current={active === item.href ? 'location' : undefined}
          target={item.external ? '_blank' : '_self'}
          rel={item.external ? 'noopener noreferrer' : undefined}
        >
          {item.label}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    font-family: var(--font-body);
    height: 100px;
    padding: 0 3%;
    --nav-ink: var(--on-dark);
    transition: background 0.6s ease, backdrop-filter 0.6s ease, opacity 1.2s ease 0.3s;
  }

  /* Fade: a soft shade from the top keeps light text readable on the video */
  .navbar.fade {
    background: linear-gradient(to bottom, rgba(18, 14, 11, 0.85), rgba(18, 14, 11, 0));
  }

  /* Content passing under the bar softens away instead of colliding with
     the title: a blur that dissolves downward */
  .navbar.fade::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    -webkit-mask-image: linear-gradient(#000 55%, transparent);
    mask-image: linear-gradient(#000 55%, transparent);
  }

  /* On the light pages, no bar at all: only the soft blur that dissolves
     downward, so the paper runs right up to the top */
  .navbar.fade.past-hero {
    --nav-ink: var(--dark-color);
    background: none;
  }

  /* Invert: a white title blended with difference reads light on the video
     and dark on the cream sections, with no bar at all */
  .navbar.invert {
    background: transparent;
    mix-blend-mode: difference;
  }

  .navbar-title {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    transition: color 0.5s cubic-bezier(0, 0, 0.7, 1);
    font-size: 12px;
    font-weight: 300;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--nav-ink);
    text-decoration: none;
    white-space: nowrap;
  }

  .wordmark {
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  .wordmark.shown {
    opacity: 1;
    transform: none;
  }

  /* The logo's rings, cropped without the words from the Pixelmator file
     (Liminal Logo New.pxd); on the light bar a filter darkens them to the
     ink colour, so the file itself stays untouched */
  .logo {
    height: 22px;
    width: auto;
    flex: none;
    transition: filter 0.5s ease, opacity 0.5s ease;
  }

  /* A soft white light behind the logo, the same colour as the black ring's
     outline, so that rough edge melts into it; it slowly breathes */
  .navbar-title::before {
    content: '';
    position: absolute;
    left: -84px;
    top: 50%;
    width: 200px;
    height: 160px;
    margin-top: -80px;
    background: radial-gradient(ellipse closest-side, rgba(255, 250, 240, 0.13), rgba(255, 246, 232, 0.05) 50%, transparent);
    filter: blur(8px);
    pointer-events: none;
    z-index: -1;
    animation: logo-glow 7s ease-in-out infinite alternate;
  }

  @keyframes logo-glow {
    from {
      opacity: 0.85;
    }
    to {
      opacity: 1;
    }
  }

  .navbar.fade.past-hero .logo {
    filter: brightness(0);
    opacity: 0.85;
  }

  /* The dock: a row of words on a hand-drawn ground line, like the forest
     drawing, rather than an app's pill bar */
  .dock {
    position: fixed;
    left: 50%;
    bottom: 16px;
    z-index: 1000;
    transform: translateX(-50%);
    max-width: calc(100vw - 32px);
    padding: 4px 8px 10px;
    overflow-x: auto;
    scrollbar-width: none;
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.6);
    animation: dock-in 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both 0.6s;
    transition: left 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 1.2s ease 0.3s;
  }

  /* With the terminal open at the left, the dock moves aside for it */
  @media (min-width: 900px) {
    :global(html.terminal-open) .dock {
      left: calc(50% + 200px);
      max-width: calc(100vw - 440px);
    }
  }

  .dock::-webkit-scrollbar {
    display: none;
  }

  .dock ul {
    position: relative;
  }

  .ground {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -6px;
    width: 100%;
    height: 18px;
    overflow: visible;
    pointer-events: none;
    filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.5));
  }

  .ground path {
    fill: none;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }

  .ground .base {
    stroke: rgba(251, 246, 238, 0.45);
    stroke-width: 1;
  }

  .ground .walked {
    stroke: #fbf6ee;
    stroke-width: 1.6;
    stroke-dasharray: 1;
    transition: stroke-dashoffset 0.6s ease;
  }

  @keyframes dock-in {
    from {
      opacity: 0;
      transform: translate(-50%, 24px);
    }
  }

  .dock ul {
    display: flex;
    gap: 0;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .dock a {
    display: block;
    position: relative;
    padding: 9px 14px;
    color: rgba(255, 255, 255, 0.8);
    font-family: var(--font-body);
    font-size: 13px;
    letter-spacing: 0.2px;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.35s ease, color 0.35s ease;
  }

  .dock a:hover {
    color: #fff;
  }

  /* On the light pages the words and their ground line are drawn in ink,
     with a soft paper-coloured halo so they still read over dark pictures */
  .dock.light {
    text-shadow: 0 0 6px #fbf6ee, 0 0 12px #fbf6ee;
  }

  .dock.light a,
  .dock.light a:hover,
  .dock.light a.active {
    color: var(--dark-color);
  }

  .dock.light .ground {
    filter: drop-shadow(0 0 3px #fbf6ee);
  }

  .dock.light .ground .base {
    stroke: color-mix(in srgb, var(--dark-color) 35%, transparent);
  }

  .dock.light .ground .walked {
    stroke: var(--dark-color);
  }

  .dock.light .loop {
    filter: brightness(0);
  }

  .dock.light .loop.shown {
    opacity: 0.8;
  }

  /* The current place gets a loose hand-drawn loop around it, like a
     circle drawn round a word in a notebook. It travels along the words to
     the next place, leans towards it as you scroll past the end of a page,
     and can be picked up and dragged. */
  .dock a.active {
    color: #fff;
  }

  .loop {
    position: absolute;
    top: 2px;
    bottom: 2px;
    z-index: 1;
    background: url('/images/dock-loop.svg') center / 100% 100% no-repeat;
    opacity: 0;
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-drag: none;
    transform: translateX(calc(var(--pull, 0) * 18px)) rotate(calc(var(--pull, 0) * 6deg));
    transition: left 0.6s cubic-bezier(0.5, 0, 0.2, 1), width 0.6s cubic-bezier(0.5, 0, 0.2, 1), opacity 0.4s ease,
      transform 0.3s ease;
  }

  .loop.shown {
    opacity: 1;
  }

  .loop.dragging {
    cursor: grabbing;
    transition: opacity 0.4s ease, transform 0.3s ease;
    transform: scale(1.08) rotate(-3deg);
  }

  /* Room for the dock below the last content */
  :global(footer) {
    padding-bottom: 96px !important;
  }

  /* Pages without the hero keep their content clear of the fixed bar */
  :global(html.has-site-nav body) {
    padding-top: 100px;
  }

  @media (max-width: 768px) {
    :global(html.has-site-nav body) {
      padding-top: 70px;
    }
  }

  @media (max-width: 768px) {
    .navbar {
      height: 70px;
    }

    .navbar-title {
      font-size: 10px;
      letter-spacing: 1.5px;
      gap: 10px;
    }

    .logo {
      height: 18px;
    }

    /* The same light, scaled with the smaller logo */
    .navbar-title::before {
      left: -87px;
      transform: scale(0.79);
    }

    .dock {
      bottom: 14px;
    }

    .dock a {
      padding: 8px 12px;
      font-size: 12px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dock,
    .navbar-title::before {
      animation: none;
    }
  }
</style>

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
    { label: 'Lunations', href: '/lunations' },
    { label: 'DNA', href: '/dna' },
    { label: 'Community', href: '/services' },
    { label: 'Quests', href: '/quests.html' },
    { label: 'Media', href: '/media' },
    { label: 'Contact', href: '#contact' },
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

  onMount(() => {
    addEventListener('journey-stop', onJourney);
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
  <ul>
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

  .navbar.fade.past-hero {
    --nav-ink: var(--dark-color);
    background: var(--bar-bg);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
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
    font-size: 15px;
    font-weight: 300;
    letter-spacing: 3px;
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
    height: 28px;
    width: auto;
    flex: none;
    transition: filter 0.5s ease, opacity 0.5s ease;
  }

  /* A soft white light behind the logo, the same colour as the black ring's
     outline, so that rough edge melts into it; it slowly breathes */
  .navbar-title::before {
    content: '';
    position: absolute;
    left: -80px;
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

  .dock.light a.active::before {
    filter: brightness(0);
    opacity: 0.8;
  }

  /* The current place gets a loose hand-drawn loop around it, like a
     circle drawn round a word in a notebook */
  .dock a.active {
    color: #fff;
  }

  .dock a.active::before {
    content: '';
    position: absolute;
    inset: 2px 0;
    background: url('/images/dock-loop.svg') center / 100% 100% no-repeat;
    pointer-events: none;
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
      font-size: 12px;
      letter-spacing: 2px;
      gap: 10px;
    }

    .logo {
      height: 22px;
    }

    /* The same light, scaled with the smaller logo */
    .navbar-title::before {
      left: -84px;
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

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
  const onScroll = () => {
    pastHero = !overHero || window.scrollY > window.innerHeight - 100;
  };

  const home = location.pathname === '/' || location.pathname === '/index.html';
  const links = [
    { label: 'ABOUT', href: '#about' },
    { label: 'THE VILLAGE', href: '#thevillage' },
    { label: 'LUNATIONS', href: '/lunations' },
    { label: 'DNA', href: '/dna' },
    { label: 'SERVICES', href: '/services' },
    { label: 'QUESTS', href: '/quests.html' },
    { label: 'MEDIA', href: '/media' },
    { label: 'CONTACT', href: '#contact' },
  ];
  // Section links point back to the home page from other pages
  const menuItems = links.map((item) =>
    item.href.startsWith('#') && !home ? { ...item, href: `/${item.href}` } : item
  );
  const here = location.pathname.replace(/\.html$/, '').replace(/\/+$/, '');

  // Highlight the in-page section that is on screen
  let active = menuItems.find((item) => !item.href.includes('#') && item.href.replace(/\.html$/, '') === here)?.href ?? '';
  onMount(() => {
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
  <a href={home ? '#main-top' : '/'} class="navbar-title">Liminal Village</a>
</header>

<nav class="dock" aria-label="Main">
  <ul>
    {#each menuItems as item}
      <li>
        <a
          href={item.href}
          class:active={active === item.href}
          class:acronym={item.label.length <= 3}
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
    --nav-hover: var(--primary-color);
    transition: background 0.6s ease, backdrop-filter 0.6s ease;
  }

  /* Fade: a soft shade from the top keeps light text readable on the video */
  .navbar.fade {
    background: linear-gradient(to bottom, rgba(20, 18, 15, 0.55), rgba(20, 18, 15, 0));
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
    --nav-hover: var(--on-dark);
  }

  .navbar-title {
    transition: color 0.5s cubic-bezier(0, 0, 0.7, 1);
    font-size: 22px;
    font-weight: 300;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--nav-ink);
    text-decoration: none;
    white-space: nowrap;
  }

  .navbar-title:hover {
    color: var(--nav-hover);
  }

  /* The dock: a floating pill of links at the bottom of the screen */
  .dock {
    position: fixed;
    left: 50%;
    bottom: 20px;
    z-index: 1000;
    transform: translateX(-50%);
    max-width: calc(100vw - 32px);
    padding: 5px;
    border-radius: 999px;
    background: rgba(20, 20, 20, 0.72);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    box-shadow: 0 10px 34px rgba(0, 0, 0, 0.22);
    overflow-x: auto;
    scrollbar-width: none;
    animation: dock-in 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both 0.6s;
  }

  .dock::-webkit-scrollbar {
    display: none;
  }

  @keyframes dock-in {
    from {
      opacity: 0;
      transform: translate(-50%, 24px);
    }
  }

  .dock ul {
    display: flex;
    gap: 2px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* Labels are written in capitals; set them in sentence case */
  .dock a {
    display: block;
    padding: 9px 15px;
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.75);
    font-family: var(--font-body);
    font-size: 13px;
    letter-spacing: 0.2px;
    text-transform: lowercase;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.35s ease, color 0.35s ease;
  }

  .dock a::first-letter {
    text-transform: uppercase;
  }

  .dock a.acronym {
    text-transform: none;
  }

  .dock a:hover {
    color: #fff;
  }

  .dock a.active {
    background: #fff;
    color: #111;
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
      font-size: 17px;
      letter-spacing: 2px;
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
    .dock {
      animation: none;
    }
  }
</style>

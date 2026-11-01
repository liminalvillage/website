<script>
  import { onMount } from 'svelte';
  import Menu from '@lucide/svelte/icons/menu';
  import X from '@lucide/svelte/icons/x';

  let mobileMenuOpen = false;
  let scrolled = false;
  let progress = 0;
  let active = '';

  const toggleMenu = () => {
    mobileMenuOpen = !mobileMenuOpen;
  };

  const onScroll = () => {
    scrolled = window.scrollY > 40;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
  };

  const menuItems = [
    { label: 'Chi siamo', href: '#ri-chi-siamo' },
    { label: 'Percorso', href: '#ri-percorso' },
    { label: 'Attività', href: '#ri-attivita' },
    { label: 'La rete', href: '#ri-rete' },
    { label: 'Contatti', href: '#ri-contatti' },
  ];

  // Highlight the section that crosses the middle of the viewport.
  onMount(() => {
    onScroll();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) active = '#' + e.target.id;
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );
    menuItems.forEach((m) => {
      const el = document.querySelector(m.href);
      if (el) io.observe(el);
    });
    const top = document.querySelector('#ri-top');
    if (top) io.observe(top);
    return () => io.disconnect();
  });
</script>

<svelte:window on:scroll={onScroll} />

<nav class="nav" class:scrolled class:open={mobileMenuOpen}>
  <div class="nav-inner">
    <a href="#ri-top" class="brand" on:click={() => (mobileMenuOpen = false)}>
      <img src="/images/regenerativa/logo.png" alt="" class="brand-logo" />
      <span class="brand-text">Rigenerativa</span>
    </a>

    <button
      class="toggler"
      on:click={toggleMenu}
      aria-label={mobileMenuOpen ? 'Chiudi il menu' : 'Apri il menu'}
      aria-expanded={mobileMenuOpen}
    >
      {#if mobileMenuOpen}<X size={26} strokeWidth={1.5} />{:else}<Menu size={26} strokeWidth={1.5} />{/if}
    </button>

    <ul class="menu" class:open={mobileMenuOpen}>
      {#each menuItems as item}
        <li>
          <a
            href={item.href}
            class:active={active === item.href}
            aria-current={active === item.href ? 'true' : null}
            on:click={() => (mobileMenuOpen = false)}
          >
            {item.label}
          </a>
        </li>
      {/each}
    </ul>
  </div>
  <div class="progress" style="transform: scaleX({progress})" aria-hidden="true"></div>
</nav>

<style>
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: transparent;
    transition: background 0.5s ease, box-shadow 0.5s ease, backdrop-filter 0.5s ease;
    --nav-ink: var(--rg-cream);
  }

  .nav.scrolled,
  .nav.open {
    background: rgba(250, 246, 236, 0.86);
    backdrop-filter: blur(14px) saturate(1.2);
    -webkit-backdrop-filter: blur(14px) saturate(1.2);
    box-shadow: 0 1px 0 var(--rg-line), 0 8px 30px rgba(44, 53, 39, 0.06);
    --nav-ink: var(--rg-bark);
  }

  .nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: padding 0.5s ease;
  }

  .nav.scrolled .nav-inner {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: var(--nav-ink);
    text-decoration: none;
    font-family: "Cormorant Garamond", serif;
    transition: color 0.5s ease;
  }

  .brand:hover {
    color: var(--nav-ink);
  }

  .brand-logo {
    width: 34px;
    height: 34px;
    object-fit: contain;
    filter: brightness(0) invert(0.95);
    transition: filter 0.5s ease;
  }

  .nav.scrolled .brand-logo,
  .nav.open .brand-logo {
    filter: none;
  }

  .brand-text {
    font-size: 1.35rem;
    letter-spacing: 2px;
    font-weight: 500;
  }

  .menu {
    list-style: none;
    display: flex;
    gap: 2.1rem;
    margin: 0;
    padding: 0;
  }

  .menu li a {
    color: var(--nav-ink);
    font-size: 0.74rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    font-weight: 600;
    padding: 0.25rem 0;
    position: relative;
    opacity: 0.82;
    transition: color 0.5s ease, opacity 0.3s ease;
  }

  .menu li a::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -5px;
    height: 1.5px;
    background: var(--rg-gold);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.45s var(--rg-ease);
  }

  .menu li a:hover,
  .menu li a.active {
    opacity: 1;
  }

  .menu li a:hover::after,
  .menu li a.active::after {
    transform: scaleX(1);
  }

  .progress {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--rg-moss), var(--rg-gold));
    transform-origin: left;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .nav.scrolled .progress {
    opacity: 1;
  }

  .toggler {
    display: none;
    background: none;
    border: none;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    margin-right: -10px;
    cursor: pointer;
    color: var(--nav-ink);
    transition: color 0.5s ease;
  }

  @media (max-width: 900px) {
    .nav-inner {
      padding: 0.9rem 1.25rem;
    }

    .toggler {
      display: flex;
    }

    .menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      flex-direction: column;
      gap: 0;
      background: rgba(250, 246, 236, 0.98);
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.45s var(--rg-ease);
    }

    .menu.open {
      max-height: 420px;
      border-bottom: 1px solid var(--rg-line);
    }

    .menu li {
      border-bottom: 1px solid var(--rg-line);
    }

    .menu li:last-child {
      border-bottom: none;
    }

    .menu li a {
      display: block;
      padding: 1.05rem 1.25rem;
      color: var(--rg-bark);
    }

    .menu li a::after {
      display: none;
    }

    .menu li a.active {
      color: var(--rg-forest);
    }
  }
</style>

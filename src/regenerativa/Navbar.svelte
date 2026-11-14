<script>
  import { onMount } from 'svelte';
  import Menu from '@lucide/svelte/icons/menu';
  import X from '@lucide/svelte/icons/x';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import { LANGS, lang, setLang, pick } from './i18n.js';
  import { DOCS } from './links.js';

  const t = pick({
    en: {
      items: ['Vision', 'Events', 'Hubs', 'Economy', 'Agreements', 'Join'],
      docs: 'Docs',
      open: 'Open menu',
      close: 'Close menu',
      language: 'Language',
      names: { en: 'English', it: 'Italiano' },
    },
    it: {
      items: ['Visione', 'Eventi', 'Hub', 'Economia', 'Accordi', 'Partecipa'],
      docs: 'Documenti',
      open: 'Apri menu',
      close: 'Chiudi menu',
      language: 'Lingua',
      names: { en: 'English', it: 'Italiano' },
    },
  });

  const items = ['#rn-vision', '#rn-events', '#rn-hubs', '#rn-economy', '#rn-agreements', '#rn-join']
    .map((href, i) => ({ label: t.items[i], href }));

  const DARK = ['#rn-events', '#rn-flywheel'];

  let open = false;
  let scrolled = false;
  let active = '';

  const onScroll = () => { scrolled = window.scrollY > 40; };

  onMount(() => {
    onScroll();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) active = '#' + e.target.id;
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );
    ['#rn-top', ...items.map((m) => m.href), ...DARK, '#rn-integral', '#rn-mycelium'].forEach((h) => {
      const el = document.querySelector(h);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  });

  // Over the dark hero and the dark sections the bar stays light-on-dark.
  $: dark = !open && (!scrolled || active === '#rn-top' || DARK.includes(active));
</script>

<svelte:window on:scroll={onScroll} />

<nav class="nav" class:scrolled class:dark class:open>
  <div class="inner">
    <a href="#rn-top" class="brand" on:click={() => (open = false)}>
      <img src="/images/regenerativa/logo.png" alt="" class="logo" />
      <span>ReGenerativa</span>
    </a>

    <button class="toggler" on:click={() => (open = !open)} aria-label={open ? t.close : t.open} aria-expanded={open}>
      {#if open}<X size={26} strokeWidth={1.5} />{:else}<Menu size={26} strokeWidth={1.5} />{/if}
    </button>

    <ul class="menu" class:open>
      {#each items as item}
        <li>
          <a href={item.href} class:active={active === item.href} on:click={() => (open = false)}>{item.label}</a>
        </li>
      {/each}
      <li>
        <a class="docs" href={DOCS} target="_blank" rel="noopener noreferrer">{t.docs} <ArrowUpRight size={13} /></a>
      </li>
      <li class="langs" role="group" aria-label={t.language}>
        {#each LANGS as l}
          <button class="lang" class:active={l === lang} lang={l} aria-pressed={l === lang} title={t.names[l]} on:click={() => setLang(l)}>{l}</button>
        {/each}
      </li>
    </ul>
  </div>
</nav>

<style>
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    --ink: var(--rg-bark);
    background: rgba(250, 246, 236, 0.86);
    backdrop-filter: blur(14px) saturate(1.2);
    -webkit-backdrop-filter: blur(14px) saturate(1.2);
    box-shadow: 0 1px 0 var(--rg-line);
    transition: background 0.5s ease, box-shadow 0.5s ease;
  }

  .nav.dark {
    --ink: var(--rg-cream);
    background: rgba(20, 26, 22, 0.35);
    box-shadow: 0 1px 0 rgba(244, 239, 228, 0.08);
  }

  .nav.dark:not(.scrolled) {
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.85rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: var(--ink);
    font-family: "Cormorant Garamond", serif;
    font-size: 1.35rem;
    letter-spacing: 2px;
    font-weight: 500;
  }

  .brand:hover { color: var(--ink); }

  .logo {
    width: 34px;
    height: 34px;
    object-fit: contain;
    transition: filter 0.5s ease;
  }

  .dark .logo { filter: brightness(0) invert(0.95); }

  .menu {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .menu a {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--ink);
    font-size: 0.72rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    font-weight: 600;
    opacity: 0.82;
  }

  .menu a::after {
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

  .menu a:hover,
  .menu a.active { opacity: 1; }

  .menu a:hover::after,
  .menu a.active::after { transform: scaleX(1); }

  .menu a.docs { color: var(--rg-gold); opacity: 1; }
  .nav:not(.dark) .menu a.docs { color: var(--rg-soil); }

  .langs {
    display: flex;
    gap: 0.15rem;
    padding-left: 1rem;
    border-left: 1px solid color-mix(in srgb, var(--ink) 28%, transparent);
  }

  .lang {
    background: none;
    border: none;
    padding: 0.25rem 0.35rem;
    font: inherit;
    font-size: 0.7rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 600;
    color: var(--ink);
    opacity: 0.5;
    cursor: pointer;
  }

  .lang:hover,
  .lang.active { opacity: 1; }
  .lang.active { color: var(--rg-gold); cursor: default; }

  .toggler {
    display: none;
    background: none;
    border: none;
    width: 44px;
    height: 44px;
    margin-right: -10px;
    align-items: center;
    justify-content: center;
    color: var(--ink);
    cursor: pointer;
  }

  @media (max-width: 960px) {
    .inner { padding: 0.8rem 1.25rem; }
    .toggler { display: flex; }

    .menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      flex-direction: column;
      align-items: stretch;
      gap: 0;
      background: rgba(250, 246, 236, 0.98);
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.45s var(--rg-ease);
    }

    .menu.open {
      max-height: 520px;
      border-bottom: 1px solid var(--rg-line);
    }

    .menu li { border-top: 1px solid var(--rg-line); }

    .menu a {
      display: flex;
      padding: 1rem 1.25rem;
      color: var(--rg-bark);
    }

    .menu a::after { display: none; }
    .menu a.docs { color: var(--rg-soil); }

    .langs {
      padding: 0.6rem 1rem;
      border-left: none;
    }

    .lang { color: var(--rg-bark); padding: 0.5rem 0.6rem; }
  }
</style>

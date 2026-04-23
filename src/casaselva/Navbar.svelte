<script>
  let mobileMenuOpen = false;
  let scrolled = false;

  const toggleMenu = () => {
    mobileMenuOpen = !mobileMenuOpen;
  };

  const onScroll = () => {
    scrolled = window.scrollY > 40;
  };

  const menuItems = [
    { label: 'Home', href: '#cs-top' },
    { label: 'Vision', href: '#cs-vision' },
    { label: 'Essence', href: '#cs-essence' },
    { label: 'The Place', href: '#cs-place' },
    { label: 'Daily Life', href: '#cs-living' },
    { label: 'Network', href: '#cs-network' },
    { label: 'Quests', href: '/quests.html', external: true },
    { label: 'Visit', href: '#cs-visit' },
  ];
</script>

<svelte:window on:scroll={onScroll} />

<nav class="nav" class:scrolled>
  <div class="nav-inner">
    <a href="#cs-top" class="brand" on:click={() => (mobileMenuOpen = false)}>
      <span class="brand-mark">❦</span>
      <span class="brand-text">Casa Selva</span>
    </a>

    <button class="toggler" on:click={toggleMenu} aria-label="Toggle navigation">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>

    <ul class="menu" class:open={mobileMenuOpen}>
      {#each menuItems as item}
        <li>
          <a
            href={item.href}
            target={item.external ? '_self' : null}
            on:click={() => (mobileMenuOpen = false)}
          >
            {item.label}
          </a>
        </li>
      {/each}
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
    background: rgba(251, 248, 241, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: all 0.4s ease;
    border-bottom: 1px solid transparent;
  }

  .nav.scrolled {
    background: rgba(251, 248, 241, 0.95);
    border-bottom: 1px solid var(--cs-line);
    box-shadow: 0 2px 20px rgba(59, 66, 54, 0.05);
  }

  .nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: var(--cs-bark);
    text-decoration: none;
    font-family: "Cormorant Garamond", serif;
  }

  .brand-mark {
    font-size: 1.4rem;
    color: var(--cs-terracotta);
  }

  .brand-text {
    font-size: 1.35rem;
    letter-spacing: 2px;
    font-weight: 500;
  }

  .menu {
    list-style: none;
    display: flex;
    gap: 2rem;
    margin: 0;
    padding: 0;
  }

  .menu li a {
    color: var(--cs-bark);
    font-size: 0.82rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    font-weight: 500;
    padding: 0.25rem 0;
    position: relative;
  }

  .menu li a::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -4px;
    height: 1px;
    background: var(--cs-terracotta);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.3s ease;
  }

  .menu li a:hover {
    color: var(--cs-terracotta);
  }

  .menu li a:hover::after {
    transform: scaleX(1);
  }

  .toggler {
    display: none;
    background: none;
    border: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    padding: 0.5rem;
  }

  .bar {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--cs-bark);
    transition: all 0.3s;
  }

  @media (max-width: 860px) {
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
      background: rgba(251, 248, 241, 0.98);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--cs-line);
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.35s ease;
    }

    .menu.open {
      max-height: 500px;
    }

    .menu li {
      border-bottom: 1px solid var(--cs-line);
    }

    .menu li:last-child {
      border-bottom: none;
    }

    .menu li a {
      display: block;
      padding: 1rem 2rem;
      font-size: 0.78rem;
    }
  }
</style>

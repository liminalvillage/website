<script>
  let mobileMenuOpen = false;
  let scrolled = false;

  const toggleMenu = () => { mobileMenuOpen = !mobileMenuOpen; };
  const onScroll = () => { scrolled = window.scrollY > 40; };

  const menuItems = [
    { label: 'Home', href: '#rf-top' },
    { label: 'Vision', href: '#rf-vision' },
    { label: 'Spaces', href: '#rf-spaces' },
    { label: 'The Place', href: '#rf-place' },
    { label: 'Community', href: '#rf-community' },
    { label: 'Future', href: '#rf-future' },
    { label: 'Quests', href: '/quests.html', external: true },
    { label: 'Join', href: '#rf-visit' },
  ];
</script>

<svelte:window on:scroll={onScroll} />

<nav class="nav" class:scrolled>
  <div class="nav-inner">
    <a href="#rf-top" class="brand" on:click={() => (mobileMenuOpen = false)}>
      <span class="brand-mark">◼</span>
      <span class="brand-text">ReFactory</span>
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
    background: rgba(250, 245, 236, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: all 0.4s ease;
    border-bottom: 1px solid transparent;
  }

  .nav.scrolled {
    background: rgba(250, 245, 236, 0.96);
    border-bottom: 1px solid var(--rf-line);
    box-shadow: 0 2px 20px rgba(45, 41, 37, 0.06);
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
    color: var(--rf-dark);
    text-decoration: none;
  }

  .brand-mark {
    font-size: 0.85rem;
    color: var(--rf-brick);
  }

  .brand-text {
    font-family: "Open Sans", sans-serif;
    font-size: 1.05rem;
    letter-spacing: 4px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .menu {
    list-style: none;
    display: flex;
    gap: 2rem;
    margin: 0;
    padding: 0;
  }

  .menu li a {
    color: var(--rf-dark);
    font-size: 0.76rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 600;
    padding: 0.25rem 0;
    position: relative;
  }

  .menu li a::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -4px;
    height: 2px;
    background: var(--rf-brick);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.3s ease;
  }

  .menu li a:hover { color: var(--rf-brick); }
  .menu li a:hover::after { transform: scaleX(1); }

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
    background: var(--rf-dark);
    transition: all 0.3s;
  }

  @media (max-width: 900px) {
    .toggler { display: flex; }

    .menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      flex-direction: column;
      gap: 0;
      background: rgba(250, 245, 236, 0.98);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--rf-line);
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.35s ease;
    }

    .menu.open { max-height: 500px; }

    .menu li { border-bottom: 1px solid var(--rf-line); }
    .menu li:last-child { border-bottom: none; }

    .menu li a {
      display: block;
      padding: 1rem 2rem;
      font-size: 0.75rem;
    }
  }
</style>

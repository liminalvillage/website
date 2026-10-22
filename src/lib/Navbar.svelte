<script>
  let mobileMenuOpen = false;

  const toggleMenu = () => {
    mobileMenuOpen = !mobileMenuOpen;
  };

  const closeMenu = () => {
    mobileMenuOpen = false;
  };

  const menuItems = [
    { label: 'ABOUT', href: '#about' },
    { label: 'THE VILLAGE', href: '#thevillage' },
    { label: 'LUNATIONS', href: '/lunations' },
    { label: 'DNA', href: '/dna' },
    { label: 'SERVICES', href: '/services' },
    { label: 'QUESTS', href: '/quests.html' },
    { label: 'MEDIA', href: '/media' },
    { label: 'CONTACT', href: '#contact' },
  ];
</script>

<svelte:window on:keydown={(e) => e.key === 'Escape' && closeMenu()} />

<nav class="navbar" class:mobile-open={mobileMenuOpen}>
  <div class="navbar-container">
    <a href="#main-top" class="navbar-title" on:click={closeMenu}>Liminal Village</a>
    <button
      class="navbar-toggler"
      class:open={mobileMenuOpen}
      on:click={toggleMenu}
      aria-label="Toggle Navigation"
      aria-expanded={mobileMenuOpen}
      aria-controls="main-menu"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="navbar-content" class:show={mobileMenuOpen}>
      <ul class="menu" id="main-menu">
        {#each menuItems as item}
          <li>
            <a
              href={item.href}
              target={item.external ? '_blank' : '_self'}
              rel={item.external ? 'noopener noreferrer' : undefined}
              on:click={closeMenu}
            >
              {item.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</nav>

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    font-family: "Open Sans", sans-serif;
    height: 100px;
    padding: 0 3%;
  }

  .navbar-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }

  .navbar-title {
    transition: color 0.5s cubic-bezier(0, 0, 0.7, 1);
    font-size: 22px;
    font-weight: 300;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--dark-color);
    text-decoration: none;
    white-space: nowrap;
  }

  .navbar-title:hover {
    color: var(--primary-color);
  }

  .navbar-toggler {
    display: none;
    background: none;
    border: none;
    width: 44px;
    height: 44px;
    padding: 0;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .navbar-toggler-icon {
    display: block;
    width: 25px;
    height: 3px;
    background: var(--dark-color);
    position: relative;
    transition: background 0.3s;
  }

  .navbar-toggler-icon::before,
  .navbar-toggler-icon::after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 3px;
    background: var(--dark-color);
    transition: transform 0.3s, top 0.3s;
  }

  .navbar-toggler-icon::before {
    top: -8px;
  }

  .navbar-toggler-icon::after {
    top: 8px;
  }

  .navbar-toggler.open .navbar-toggler-icon {
    background: transparent;
  }

  .navbar-toggler.open .navbar-toggler-icon::before {
    top: 0;
    transform: rotate(45deg);
  }

  .navbar-toggler.open .navbar-toggler-icon::after {
    top: 0;
    transform: rotate(-45deg);
  }

  .menu {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .menu li {
    padding: 0 8px;
  }

  .menu li a {
    color: var(--dark-color);
    text-decoration: none;
    font-weight: 400;
    font-size: 12px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    white-space: nowrap;
    transition: color 0.5s ease-in-out 0.1s;
  }

  .menu li a:hover {
    color: var(--primary-color);
  }

  /* 14 items don't fit inline below this width: collapse to the hamburger */
  @media (max-width: 1500px) {
    .navbar {
      height: 80px;
    }

    .navbar-title {
      font-size: 20px;
      letter-spacing: 3px;
    }

    .navbar-toggler {
      display: flex;
    }

    .navbar-content {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.98);
      max-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      transition: max-height 0.3s ease;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .navbar-content.show {
      max-height: calc(100vh - 80px);
      max-height: calc(100dvh - 80px);
    }

    .menu {
      display: block;
    }

    .menu li {
      padding: 0;
      border-bottom: 1px solid #eee;
    }

    .menu li:last-child {
      border-bottom: none;
    }

    .menu li a {
      display: block;
      padding: 0.9rem 2rem;
      font-size: 13px;
      letter-spacing: 2px;
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

    .navbar-content.show {
      max-height: calc(100vh - 70px);
      max-height: calc(100dvh - 70px);
    }

    .menu li a {
      padding: 0.85rem 1.5rem;
    }
  }
</style>

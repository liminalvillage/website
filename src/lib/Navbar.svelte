<script>
  let mobileMenuOpen = false;

  const toggleMenu = () => {
    mobileMenuOpen = !mobileMenuOpen;
  };

  const menuItems = [
    { label: 'HOME', href: '#main-top' },
    { label: 'ABOUT', href: '#about' },
    { label: 'IN BETWEEN …', href: '#aplaceinbetween' },
    { label: 'THE VILLAGE', href: '#thevillage' },
    { label: 'LUNATIONS', href: '#lunations' },
    { label: 'PROJECTS', href: 'https://async.hackalong.io/', external: true },
    { label: 'ALL INFO', href: 'https://docs.liminalvillage.com/', external: true },
    { label: 'CONTACT', href: '#contact' },
  ];
</script>

<nav class="navbar" class:mobile-open={mobileMenuOpen}>
  <div class="navbar-container">
    <a href="#main-top" class="navbar-title">Liminal Village</a>
    <button class="navbar-toggler" on:click={toggleMenu} aria-label="Toggle Navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="navbar-content" class:show={mobileMenuOpen}>
      <ul class="menu">
        {#each menuItems as item}
          <li>
            <a
              href={item.href}
              target={item.external ? '_blank' : '_self'}
              rel={item.external ? 'noopener noreferrer' : ''}
              on:click={() => !item.external && (mobileMenuOpen = false)}
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
    padding: 1rem 0;
  }

  .navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .navbar-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
    text-decoration: none;
    transition: color 0.3s;
  }

  .navbar-title:hover {
    color: #4a9d5f;
  }

  .navbar-toggler {
    display: none;
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
  }

  .navbar-toggler-icon {
    display: block;
    width: 25px;
    height: 3px;
    background: #333;
    position: relative;
    transition: all 0.3s;
  }

  .navbar-toggler-icon::before,
  .navbar-toggler-icon::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 3px;
    background: #333;
    transition: all 0.3s;
  }

  .navbar-toggler-icon::before {
    top: -8px;
  }

  .navbar-toggler-icon::after {
    top: 8px;
  }

  .menu {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 2rem;
  }

  .menu li a {
    color: #333;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
    transition: color 0.3s;
  }

  .menu li a:hover {
    color: #4a9d5f;
  }

  @media (max-width: 768px) {
    .navbar-toggler {
      display: block;
    }

    .navbar-content {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.98);
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .navbar-content.show {
      max-height: 500px;
    }

    .menu {
      flex-direction: column;
      padding: 1rem 2rem;
      gap: 0;
    }

    .menu li {
      padding: 0.75rem 0;
      border-bottom: 1px solid #eee;
    }

    .menu li:last-child {
      border-bottom: none;
    }
  }
</style>

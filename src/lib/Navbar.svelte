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
    { label: 'QUESTS', href: '/quests.html', external: true },
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
    transition: height 0.5s cubic-bezier(0, 0, 0.7, 1);
    font-family: "Open Sans", sans-serif;
    height: 100px;
    padding: 0 3%;
  }

  .navbar-container {
    width: 100%;
    display: table;
    height: 100%;
  }

  .navbar-title {
    transition: all 0.5s cubic-bezier(0, 0, 0.7, 1);
    height: 100px;
    font-size: 25px;
    font-weight: 300;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: var(--dark-color);
    display: table-cell;
    vertical-align: middle;
    text-decoration: none;
  }

  .navbar-title:hover {
    color: var(--primary-color);
  }

  .navbar-content {
    float: right;
    display: table;
    height: 100%;
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
    background: var(--dark-color);
    position: relative;
    transition: all 0.3s;
  }

  .navbar-toggler-icon::before,
  .navbar-toggler-icon::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 3px;
    background: var(--dark-color);
    transition: all 0.3s;
  }

  .navbar-toggler-icon::before {
    top: -8px;
  }

  .navbar-toggler-icon::after {
    top: 8px;
  }

  .menu {
    display: table-cell;
    vertical-align: middle;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .menu li {
    display: inline-block;
    padding: 0 15px;
  }

  .menu li a {
    color: var(--dark-color);
    text-decoration: none;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 3px;
    text-transform: uppercase;
    transition: all 0.5s ease-in-out 0.1s;
  }

  .menu li a:hover {
    color: var(--primary-color);
  }

  @media (max-width: 968px) {
    .navbar {
      height: 80px;
    }

    .navbar-title {
      font-size: 20px;
      height: 80px;
      letter-spacing: 3px;
    }

    .menu li a {
      font-size: 12px;
      letter-spacing: 2px;
    }

    .menu li {
      padding: 0 10px;
    }
  }

  @media (max-width: 768px) {
    .navbar {
      height: 70px;
    }

    .navbar-title {
      height: 70px;
      font-size: 18px;
    }

    .navbar-toggler {
      display: block;
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
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
      float: none;
      display: block;
    }

    .navbar-content.show {
      max-height: 500px;
    }

    .menu {
      display: block;
    }

    .menu li {
      display: block;
      padding: 0.75rem 2rem;
      border-bottom: 1px solid #eee;
    }

    .menu li:last-child {
      border-bottom: none;
    }
  }
</style>

<script>
  import LunationTimer from './LunationTimer.svelte';
</script>

<section id="main-top" class="hero">
  <div class="hero-content">
    <div class="hero-text">
      <h1>Liminal Village</h1>
      <p class="subtitle">Open Source Innovation Eco-Tech Hub</p>
      <p class="network-line">
        A node of the <a href="https://regenerativa.earth" target="_blank" rel="noopener">ReGenerativa</a> network
      </p>
    </div>
    <LunationTimer />
    <a href="#about" class="scroll-down" aria-label="Scroll down to About section">
      <span class="arrow"></span>
    </a>
  </div>
</section>

<style>
  .hero {
    position: relative;
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    background-image: url('/images/droneview.jpg');
    background-position: center center;
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
  }

  .hero-content {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(34,34,34,0.55), rgba(214,161,91,0.2));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .hero-text {
    text-align: center;
    animation: fadeInDown 1.5s ease;
  }

  .hero-text h1 {
    color: #fff;
    font-size: 3.5rem;
    font-weight: 300;
    letter-spacing: 8px;
    margin: 0;
    text-transform: uppercase;
  }

  .subtitle {
    color: rgba(232, 196, 144, 0.9);
    font-size: 1rem;
    font-weight: 300;
    letter-spacing: 5px;
    text-transform: uppercase;
    margin-top: 1rem;
  }

  .network-line {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.85rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-top: 0.75rem;
  }

  .network-line a {
    color: #fff;
    border-bottom: 1px solid rgba(232, 196, 144, 0.9);
    text-decoration: none;
  }

  .scroll-down {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: inline-block;
    text-decoration: none;
  }

  .arrow {
    display: block;
    width: 24px;
    height: 24px;
    border-left: 2px solid var(--primary-color);
    border-bottom: 2px solid var(--primary-color);
    transform: rotate(-45deg);
    animation: bounce 2s infinite;
    opacity: 0.7;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0) rotate(-45deg);
    }
    40% {
      transform: translateY(-10px) rotate(-45deg);
    }
    60% {
      transform: translateY(-5px) rotate(-45deg);
    }
  }

  @media (max-width: 768px) {
    .hero {
      background-attachment: scroll;
    }

    .hero-text h1 {
      font-size: 2.2rem;
      letter-spacing: 5px;
    }

    .subtitle {
      font-size: 0.8rem;
      letter-spacing: 3px;
    }

    .network-line {
      font-size: 0.75rem;
      letter-spacing: 2px;
      padding: 0 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .hero-text h1 {
      font-size: 1.6rem;
      letter-spacing: 3px;
    }

    .subtitle {
      font-size: 0.7rem;
      letter-spacing: 2px;
    }

    .network-line {
      font-size: 0.68rem;
      letter-spacing: 1.5px;
    }
  }
</style>

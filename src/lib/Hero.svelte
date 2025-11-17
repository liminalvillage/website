<section id="main-top" class="hero">
  <div class="hero-content">
    <h1>Liminal Village</h1>
    <a href="#about" class="scroll-down" aria-label="Scroll down to About section">
      <span class="arrow"></span>
    </a>
  </div>
</section>

<style>
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url('/images/droneview.jpg');
    background-position: center center;
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
    position: relative;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
  }

  .hero-content {
    position: relative;
    z-index: 1;
    text-align: center;
    color: white;
  }

  h1 {
    font-size: 4rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    animation: fadeInDown 1s ease;
  }

  .scroll-down {
    display: inline-block;
    margin-top: 3rem;
    text-decoration: none;
  }

  .arrow {
    display: block;
    width: 30px;
    height: 30px;
    border-left: 3px solid white;
    border-bottom: 3px solid white;
    transform: rotate(-45deg);
    animation: bounce 2s infinite;
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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
    h1 {
      font-size: 2.5rem;
    }

    .hero {
      background-attachment: scroll;
    }
  }
</style>

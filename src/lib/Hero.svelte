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
    background-color: rgba(0, 0, 0, 0.0);
    display: table;
  }

  .hero-content h1 {
    color: #FFF;
    font-size: 50px;
    font-weight: 300;
    letter-spacing: 5px;
    width: 700px;
    max-width: 90%;
    margin: 0 auto;
    border: 3px solid var(--primary-color);
    padding: 20px 15px;
    animation: fadeInDown 2s;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }

  .scroll-down {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: inline-block;
    text-decoration: none;
  }

  .arrow {
    display: block;
    width: 30px;
    height: 30px;
    border-left: 3px solid var(--primary-color);
    border-bottom: 3px solid var(--primary-color);
    transform: rotate(-45deg);
    animation: bounce 2s infinite;
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

    .hero-content h1 {
      font-size: 30px;
      width: 90%;
      padding: 15px 10px;
      letter-spacing: 3px;
    }
  }

  @media (max-width: 480px) {
    .hero-content h1 {
      font-size: 20px;
      width: 300px;
      padding: 10px 3px;
      letter-spacing: 2px;
    }
  }
</style>

<section id="rf-top" class="hero">
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <p class="eyebrow">Marche · 10 min from Ascoli Piceno</p>
    <h1>ReFactory</h1>
    <p class="tagline display">A co-creation space for symbiotic innovation.</p>
    <div class="hero-actions">
      <a href="#rf-vision" class="btn btn-primary">Discover</a>
      <a href="#rf-visit" class="btn btn-ghost">Join us</a>
    </div>
    <a href="#rf-vision" class="scroll-hint" aria-label="Scroll down">
      <span class="arrow"></span>
    </a>
  </div>
</section>

<style>
  .hero {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background-image: url('/images/refactory/1.jpeg');
    background-position: center center;
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(45, 41, 37, 0.65) 0%,
      rgba(90, 98, 102, 0.45) 50%,
      rgba(180, 89, 59, 0.35) 100%
    );
  }

  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 0 2rem;
    max-width: 900px;
    animation: rf-fade-in-slow 1.5s ease;
  }

  .eyebrow {
    color: rgba(245, 239, 230, 0.85);
    font-size: 0.78rem;
    letter-spacing: 5px;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    font-weight: 500;
  }

  h1 {
    font-family: "Open Sans", sans-serif;
    color: #fff;
    font-size: clamp(2.5rem, 7vw, 5rem);
    font-weight: 800;
    letter-spacing: 10px;
    margin: 0 0 1.5rem 0;
    line-height: 1;
    text-transform: uppercase;
  }

  .tagline {
    color: rgba(245, 239, 230, 0.95);
    font-size: clamp(1.1rem, 2.2vw, 1.6rem);
    font-style: italic;
    letter-spacing: 1.5px;
    margin-bottom: 3rem;
    line-height: 1.5;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-block;
    padding: 14px 36px;
    font-size: 0.78rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.4s ease;
    border: 1.5px solid;
    cursor: pointer;
  }

  .btn-primary {
    background: var(--rf-brick);
    color: #fff;
    border-color: var(--rf-brick);
  }

  .btn-primary:hover {
    background: transparent;
    color: #fff;
    transform: translateY(-2px);
  }

  .btn-ghost {
    background: transparent;
    color: #fff;
    border-color: rgba(255, 255, 255, 0.55);
  }

  .btn-ghost:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: #fff;
    color: #fff;
    transform: translateY(-2px);
  }

  .scroll-hint {
    position: absolute;
    bottom: -10vh;
    left: 50%;
    transform: translateX(-50%);
    text-decoration: none;
  }

  .arrow {
    display: block;
    width: 22px;
    height: 22px;
    border-left: 2px solid rgba(255, 255, 255, 0.7);
    border-bottom: 2px solid rgba(255, 255, 255, 0.7);
    transform: rotate(-45deg);
    animation: bounce 2.2s infinite;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0) rotate(-45deg); }
    40% { transform: translateY(-10px) rotate(-45deg); }
    60% { transform: translateY(-5px) rotate(-45deg); }
  }

  @media (max-width: 768px) {
    .hero { background-attachment: scroll; }
    h1 { letter-spacing: 6px; }
  }
</style>

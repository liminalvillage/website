<section id="ri-top" class="hero">
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <p class="eyebrow">Rigenerativa S.r.l. · Castorano, Marche</p>
    <h1>Rigeneriamo luoghi,<br /><em>comunità</em> e territori</h1>
    <p class="tagline">Trasformiamo spazi dismessi e sottoutilizzati in luoghi vivi e polifunzionali, unendo bioedilizia, agroecologia, tecnologia aperta e governance dei beni comuni.</p>
    <div class="hero-actions">
      <a href="#ri-contatti" class="btn btn-primary">Collabora con noi</a>
      <a href="#ri-attivita" class="btn btn-ghost">Cosa facciamo</a>
    </div>
    <a href="#ri-chi-siamo" class="scroll-hint" aria-label="Scorri in basso">
      <span class="arrow"></span>
    </a>
  </div>
</section>

<style>
  .hero {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background-image: url('/images/regenerativa/green-field.jpg');
    background-position: center;
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
      rgba(44, 53, 39, 0.7) 0%,
      rgba(44, 74, 49, 0.5) 55%,
      rgba(138, 106, 74, 0.35) 100%
    );
  }

  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 0 2rem;
    max-width: 920px;
    animation: rg-fade-in-slow 1.5s ease;
  }

  .eyebrow {
    color: rgba(244, 239, 228, 0.85);
    font-size: 0.8rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    font-weight: 300;
  }

  h1 {
    font-family: "Cormorant Garamond", serif;
    color: #fff;
    font-size: clamp(2.4rem, 6.5vw, 5rem);
    font-weight: 300;
    letter-spacing: 3px;
    margin: 0 0 1.5rem 0;
    line-height: 1.08;
  }

  h1 em {
    color: var(--rg-gold-soft);
    font-style: italic;
    font-weight: 400;
  }

  .tagline {
    color: rgba(244, 239, 228, 0.95);
    font-family: "Cormorant Garamond", serif;
    font-size: clamp(1.1rem, 2.2vw, 1.5rem);
    font-weight: 300;
    font-style: italic;
    letter-spacing: 0.5px;
    margin: 0 auto 3rem;
    line-height: 1.55;
    max-width: 720px;
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
    font-size: 0.8rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.4s ease;
    border: 1.5px solid;
    cursor: pointer;
  }

  .btn-primary {
    background: var(--rg-gold);
    color: var(--rg-bark);
    border-color: var(--rg-gold);
  }

  .btn-primary:hover {
    background: var(--rg-gold-soft);
    border-color: var(--rg-gold-soft);
    color: var(--rg-bark);
    transform: translateY(-2px);
  }

  .btn-ghost {
    background: transparent;
    color: #fff;
    border-color: rgba(255, 255, 255, 0.6);
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
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0) rotate(-45deg);
    }
    40% { transform: translateY(-10px) rotate(-45deg); }
    60% { transform: translateY(-5px) rotate(-45deg); }
  }

  @media (max-width: 768px) {
    .hero {
      background-attachment: scroll;
    }
    h1 { letter-spacing: 2px; }
  }
</style>

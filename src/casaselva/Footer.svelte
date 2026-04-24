<script>
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
</script>

<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <p class="brand">❦ Casa Selva</p>
        <p class="tag">A sanctuary for conscious ways of being human</p>
        <p class="tag">Supporting the rise of a new humanity</p>
      </div>

      <div class="links">
        <h5>Explore</h5>
        <a href="#cs-vision">Vision</a>
        <a href="#cs-essence">Essence</a>
        <a href="#cs-place">The Place</a>
        <a href="#cs-living">Daily Life</a>
        <a href="/quests.html">Quests</a>
        <a href="#cs-visit">Visit</a>
      </div>

      <div class="links">
        <h5>Network</h5>
        <a href="https://liminalvillage.com" target="_blank" rel="noopener">Liminal Village</a>
        <a href="https://regenerativa.earth" target="_blank" rel="noopener">Regenerativa</a>
      </div>

      <div class="links">
        <h5>Contact</h5>
        <a href="mailto:hello@casaselva.earth">hello@casaselva.earth</a>
        <p class="subtle">Ascoli Piceno · Italy</p>
      </div>
    </div>

    <div class="bottom">
      <p>&copy; {new Date().getFullYear()} Casa Selva · casaselva.earth</p>
      <button class="back-to-top" on:click={scrollToTop} aria-label="Back to top">
        <i class="fas fa-arrow-up"></i>
      </button>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: var(--cs-bark);
    color: rgba(246, 241, 231, 0.75);
    padding: 4rem 0 2rem;
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem;
    padding-bottom: 3rem;
    border-bottom: 1px solid rgba(246, 241, 231, 0.12);
  }

  .brand {
    font-family: "Cormorant Garamond", serif;
    color: #fff;
    font-size: 1.5rem;
    letter-spacing: 2px;
    margin-bottom: 0.75rem;
  }

  .tag {
    font-family: "Cormorant Garamond", serif;
    font-style: italic;
    font-size: 1rem;
    color: var(--cs-terracotta-soft);
    line-height: 1.6;
    max-width: 320px;
  }

  .links {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .links h5 {
    font-family: "Open Sans", sans-serif;
    font-size: 0.72rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #fff;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .links a {
    color: rgba(246, 241, 231, 0.75);
    font-size: 0.9rem;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .links a:hover {
    color: var(--cs-terracotta-soft);
  }

  .subtle {
    font-size: 0.85rem;
    color: rgba(246, 241, 231, 0.5);
    margin: 0;
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 2rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .bottom p {
    font-size: 0.82rem;
    color: rgba(246, 241, 231, 0.55);
    letter-spacing: 0.5px;
    margin: 0;
  }

  .back-to-top {
    background: rgba(183, 122, 82, 0.2);
    color: var(--cs-terracotta-soft);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .back-to-top:hover {
    background: var(--cs-terracotta);
    color: #fff;
    transform: translateY(-3px);
  }

  @media (max-width: 768px) {
    .footer-grid {
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
  }

  @media (max-width: 480px) {
    .footer-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<script>
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
</script>

<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <p class="brand">◼ ReFactory</p>
        <p class="tag display">A co-creation space for symbiotic innovation.</p>
      </div>

      <div class="links">
        <h5>Explore</h5>
        <a href="#rf-vision">Vision</a>
        <a href="#rf-spaces">Spaces</a>
        <a href="#rf-place">The Place</a>
        <a href="#rf-community">Community</a>
        <a href="#rf-future">Future</a>
        <a href="/quests.html">Quests</a>
        <a href="#rf-visit">Join</a>
      </div>

      <div class="links">
        <h5>Network</h5>
        <a href="https://regenerativa.earth" target="_blank" rel="noopener">ReGenerativa</a>
        <a href="https://liminalvillage.com" target="_blank" rel="noopener">Liminal Village</a>
        <a href="https://casaselva.earth" target="_blank" rel="noopener">Casa Selva</a>
      </div>

      <div class="links">
        <h5>Contact</h5>
        <a href="mailto:hello@refactory.earth">hello@refactory.earth</a>
        <p class="subtle">Ascoli Piceno · Marche · Italy</p>
      </div>
    </div>

    <div class="bottom">
      <p>&copy; {new Date().getFullYear()} ReFactory · part of the ReGenerativa network</p>
      <button class="back-to-top" on:click={scrollToTop} aria-label="Back to top">
        <i class="fas fa-arrow-up"></i>
      </button>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: #1f1b17;
    color: rgba(245, 239, 230, 0.75);
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
    border-bottom: 1px solid rgba(245, 239, 230, 0.12);
  }

  .brand {
    font-family: "Open Sans", sans-serif;
    color: #fff;
    font-size: 1.1rem;
    letter-spacing: 4px;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }

  .tag {
    font-size: 1rem;
    color: var(--rf-brass-soft);
    font-style: italic;
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
    font-size: 0.7rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #fff;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .links a {
    color: rgba(245, 239, 230, 0.75);
    font-size: 0.9rem;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .links a:hover { color: var(--rf-brass-soft); }

  .subtle {
    font-size: 0.85rem;
    color: rgba(245, 239, 230, 0.5);
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
    color: rgba(245, 239, 230, 0.55);
    margin: 0;
    letter-spacing: 0.5px;
  }

  .back-to-top {
    background: rgba(180, 89, 59, 0.25);
    color: var(--rf-brass-soft);
    border: none;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .back-to-top:hover {
    background: var(--rf-brick);
    color: #fff;
    transform: translateY(-3px);
  }

  @media (max-width: 768px) {
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
  }

  @media (max-width: 480px) {
    .footer-grid { grid-template-columns: 1fr; }
  }
</style>

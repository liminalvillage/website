<script>
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
</script>

<footer class="footer">
  <div class="container">
    <nav class="links" aria-label="More">
      <a href="/frameworks">Frameworks</a>
      <a href="https://regenerativa.earth" target="_blank" rel="noopener">ReGenerativa</a>
      <a href="https://async.hackalong.io/" target="_blank" rel="noopener">Projects</a>
      <a href="https://docs.liminalvillage.com/" target="_blank" rel="noopener">Docs</a>
    </nav>
    <p>&copy; {new Date().getFullYear()} Liminal Village. All Rights Reserved.</p>
    <button class="back-to-top" on:click={scrollToTop} aria-label="Back to top">
      <i class="fas fa-arrow-up"></i>
    </button>
  </div>
</footer>

<style>
  /* A light footer in the page flow, not a dark band */
  .footer {
    background: transparent;
    color: var(--muted);
    padding: 2rem 0;
    text-align: left;
    position: relative;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 2rem 0;
    border-top: 1px solid color-mix(in srgb, var(--ink) 12%, transparent);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--muted);
    letter-spacing: 1px;
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.25rem;
  }

  .links a {
    font-size: 0.8rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--accent);
    text-decoration: none;
  }

  .links a:hover {
    color: var(--ink);
  }

  .back-to-top {
    background: color-mix(in srgb, var(--accent) 15%, transparent);
    color: var(--accent);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
  }

  .back-to-top:hover {
    background: var(--accent);
    color: var(--on-accent);
    transform: translateY(-3px);
    box-shadow: 0 4px 15px color-mix(in srgb, var(--accent) 30%, transparent);
  }

  @media (max-width: 576px) {
    .container {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>

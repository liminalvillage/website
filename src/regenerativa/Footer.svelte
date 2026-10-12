<script>
  const year = new Date().getFullYear();
</script>

<footer class="footer">
  <div class="container">
    <div class="top">
      <div class="brand-block">
        <img src="/images/regenerativa/logo.png" alt="ReGenerativa" class="logo" />
        <span class="brand-name">ReGenerativa</span>
        <p class="mission">
          Building EcoCivilization 2030 through integral regeneration and bioregional networks.
        </p>
      </div>

      <div class="cols">
        <div class="col">
          <h4>Network</h4>
          <ul>
            <li><a href="https://liminalvillage.com" target="_blank" rel="noopener noreferrer">Liminal Village</a></li>
            <li><a href="https://refactory.earth" target="_blank" rel="noopener noreferrer">ReFactory</a></li>
            <li><a href="https://casaselva.earth" target="_blank" rel="noopener noreferrer">Casa Selva</a></li>
          </ul>
        </div>

        <div class="col">
          <h4>Participate</h4>
          <ul>
            <li><a href="/quests.html">Quests</a></li>
            <li><a href="#rg-participate">Bootstrap a Node</a></li>
            <li><a href="mailto:hello@regenerativa.earth">Contact</a></li>
          </ul>
        </div>

        <div class="col">
          <h4>Explore</h4>
          <ul>
            <li><a href="#rg-vision">Vision</a></li>
            <li><a href="#rg-sites">Sites</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bottom">
      <p>&copy; 2025–{year} ReGenerativa APS. Building together.</p>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: var(--rg-bark);
    color: rgba(244, 239, 228, 0.78);
    padding: 4.5rem 0 2rem;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .top {
    display: grid;
    grid-template-columns: 1.4fr 2fr;
    gap: 3rem;
    margin-bottom: 3rem;
  }

  .brand-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .logo {
    width: 44px;
    height: 44px;
    object-fit: contain;
    margin-bottom: 0.6rem;
    filter: brightness(0) invert(1);
    opacity: 0.85;
  }

  .brand-name {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.4rem;
    letter-spacing: 2px;
    color: #fff;
    margin-bottom: 1rem;
  }

  .mission {
    color: rgba(244, 239, 228, 0.7);
    font-size: 0.95rem;
    max-width: 360px;
    line-height: 1.7;
  }

  .cols {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .col h4 {
    color: var(--rg-gold);
    font-family: "Open Sans", sans-serif;
    font-size: 0.7rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 1.2rem;
  }

  .col ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .col li {
    margin-bottom: 0.55rem;
  }

  .col a {
    color: rgba(244, 239, 228, 0.78);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.25s ease;
  }

  .col a:hover {
    color: var(--rg-gold-soft);
  }

  .bottom {
    border-top: 1px solid rgba(244, 239, 228, 0.12);
    padding-top: 1.5rem;
    text-align: center;
    color: rgba(244, 239, 228, 0.55);
    font-size: 0.82rem;
    letter-spacing: 1px;
  }

  @media (max-width: 768px) {
    .top { grid-template-columns: 1fr; gap: 2rem; }
    .cols { grid-template-columns: repeat(2, 1fr); }
  }
</style>

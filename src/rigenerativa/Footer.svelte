<script>
  const year = new Date().getFullYear();

  // Company data required on the website of an Italian S.r.l. (art. 2250 c.c.),
  // from the atto costitutivo and the Registro Imprese receipt.
  const company = {
    name: 'Rigenerativa S.r.l. unipersonale',
    sede: 'Contrada Ferretti 56, 63081 Castorano (AP)',
    piva: '02607380447',
    rea: 'AP-315936',
    capitale: '€ 10.000,00 i.v.',
  };
</script>

<footer class="footer">
  <div class="container">
    <div class="top">
      <div class="brand-block">
        <img src="/images/regenerativa/logo.png" alt="Rigenerativa" class="logo" />
        <span class="brand-name">Rigenerativa</span>
        <p class="mission">
          Rigenerazione di spazi, comunità e territori nelle Marche e oltre.
        </p>
      </div>

      <div class="cols">
        <div class="col">
          <h4>Esplora</h4>
          <ul>
            <li><a href="#ri-chi-siamo">Chi siamo</a></li>
            <li><a href="#ri-attivita">Attività</a></li>
            <li><a href="#ri-contatti">Contatti</a></li>
          </ul>
        </div>

        <div class="col">
          <h4>La rete</h4>
          <ul>
            <li><a href="https://regenerativa.earth" target="_blank" rel="noopener noreferrer">ReGenerativa</a></li>
            <li><a href="https://liminalvillage.com" target="_blank" rel="noopener noreferrer">Liminal Village</a></li>
            <li><a href="https://refactory.earth" target="_blank" rel="noopener noreferrer">ReFactory</a></li>
            <li><a href="https://casaselva.earth" target="_blank" rel="noopener noreferrer">Casa Selva</a></li>
          </ul>
        </div>

        <div class="col">
          <h4>Dati societari</h4>
          <ul class="legal">
            <li>{company.name}</li>
            <li>Sede legale: {company.sede}</li>
            <li>P.IVA e C.F. {company.piva}</li>
            <li>REA {company.rea}</li>
            <li>Capitale sociale {company.capitale}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bottom">
      <p>&copy; 2026–{year} {company.name} · P.IVA {company.piva}</p>
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
    grid-template-columns: 1.2fr 2.2fr;
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
    max-width: 340px;
    line-height: 1.7;
  }

  .cols {
    display: grid;
    grid-template-columns: 1fr 1fr 1.4fr;
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

  .legal li {
    font-size: 0.85rem;
    line-height: 1.55;
    color: rgba(244, 239, 228, 0.7);
  }

  .bottom {
    border-top: 1px solid rgba(244, 239, 228, 0.12);
    padding-top: 1.5rem;
    text-align: center;
    color: rgba(244, 239, 228, 0.55);
    font-size: 0.82rem;
    letter-spacing: 1px;
  }

  @media (max-width: 900px) {
    .top { grid-template-columns: 1fr; gap: 2rem; }
    .cols { grid-template-columns: repeat(2, 1fr); }
    .cols .col:last-child { grid-column: 1 / -1; }
  }
</style>

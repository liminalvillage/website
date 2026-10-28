<section id="ri-chi-siamo" class="chi-siamo">
  <div class="container">
    <div class="section-heading">
      <p class="eyebrow">Chi siamo</p>
      <h2>Un'impresa che si prende la <em>piena responsabilità</em><br />della trasformazione dei luoghi</h2>
    </div>

    <div class="lead">
      <p>
        Rigenerativa S.r.l. è il braccio operativo della rete ReGenerativa nelle Marche. Prendiamo in gestione edifici civili e industriali, aree rurali e strutture dismesse, e li accompagniamo dal cantiere alla vita quotidiana: progettazione bioclimatica, costruzione, programmazione culturale, agricoltura rigenerativa e gestione condivisa con le comunità locali.
      </p>
    </div>

    <div class="pillars">
      <div class="pillar">
        <div class="pillar-icon" aria-hidden="true">🏗️</div>
        <h3>Costruire</h3>
        <p>Bioedilizia, restauro e recupero adattivo con materiali naturali e riciclati, energia off-grid e gestione dell'acqua.</p>
      </div>
      <div class="pillar">
        <div class="pillar-icon" aria-hidden="true">🌾</div>
        <h3>Abitare</h3>
        <p>Ospitalità diffusa, turismo lento, eventi, filiera corta e agricoltura supportata dalla comunità negli spazi rigenerati.</p>
      </div>
      <div class="pillar">
        <div class="pillar-icon" aria-hidden="true">🕸️</div>
        <h3>Custodire</h3>
        <p>Beni comuni, governance distribuita e strumenti digitali aperti per coordinare una rete di nodi locali replicabile.</p>
      </div>
    </div>
  </div>
</section>

<style>
  .chi-siamo {
    padding: 8rem 0 6rem;
    background: var(--rg-cream-soft);
  }

  .container {
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .section-heading {
    text-align: center;
    margin-bottom: 3rem;
  }

  .eyebrow {
    color: var(--rg-gold);
    font-size: 0.75rem;
    letter-spacing: 5px;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .section-heading h2 {
    font-size: clamp(1.8rem, 4vw, 2.7rem);
    font-weight: 400;
    color: var(--rg-bark);
    line-height: 1.25;
  }

  .section-heading h2 em {
    color: var(--rg-forest);
    font-style: italic;
    font-weight: 500;
  }

  .lead {
    max-width: 760px;
    margin: 0 auto 4.5rem;
    text-align: center;
  }

  .lead p {
    font-size: 1.05rem;
    line-height: 1.95;
  }

  .pillars {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .pillar {
    text-align: center;
    padding: 2.5rem 1.75rem;
    background: var(--rg-cream);
    border: 1px solid var(--rg-line);
    border-radius: 8px;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }

  .pillar:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(44, 53, 39, 0.08);
  }

  .pillar-icon {
    font-size: 2.4rem;
    margin-bottom: 0.75rem;
    line-height: 1;
  }

  .pillar h3 {
    font-size: 1.4rem;
    color: var(--rg-forest-dark);
    margin-bottom: 0.6rem;
    letter-spacing: 1.5px;
  }

  .pillar p {
    color: var(--rg-muted);
    font-size: 0.95rem;
    line-height: 1.7;
  }

  @media (max-width: 768px) {
    .chi-siamo { padding: 5rem 0 4rem; }
    .pillars { grid-template-columns: 1fr; gap: 1.25rem; }
  }
</style>

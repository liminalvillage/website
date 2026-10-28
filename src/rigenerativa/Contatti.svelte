<script>
  // TODO: confirm the company mailbox before going live.
  const EMAIL = 'info@rigenerativa.it';

  const asks = [
    { title: 'Hai uno spazio da rigenerare?', text: 'Edifici, terreni o strutture dismesse: valutiamo insieme un progetto di gestione e trasformazione.' },
    { title: 'Sei un ente o un comune?', text: 'Co-progettazione, gare, fondi europei e modelli di gestione condivisa dei beni comuni.' },
    { title: 'Vuoi aprire un nodo?', text: 'Il nostro modello è replicabile: formazione, strumenti digitali e affiliazione alla rete.' },
  ];
</script>

<section id="ri-contatti" class="contatti">
  <div class="container">
    <div class="cta">
      <p class="eyebrow">Contatti</p>
      <h2>Costruiamo insieme</h2>
      <div class="asks">
        {#each asks as a}
          <div class="ask">
            <h3>{a.title}</h3>
            <p>{a.text}</p>
          </div>
        {/each}
      </div>
      <a class="btn" href="mailto:{EMAIL}?subject=Contatto%20dal%20sito">Scrivici · {EMAIL}</a>
    </div>
  </div>
</section>

<style>
  .contatti {
    padding: 2rem 0 7rem;
    background: var(--rg-cream-soft);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .cta {
    text-align: center;
    padding: 4.5rem 2.5rem;
    background: linear-gradient(135deg, var(--rg-forest) 0%, var(--rg-forest-dark) 100%);
    border-radius: 12px;
    color: #fff;
  }

  .eyebrow {
    color: var(--rg-gold-soft);
    font-size: 0.75rem;
    letter-spacing: 5px;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .cta h2 {
    color: #fff;
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-style: italic;
    margin-bottom: 2.5rem;
  }

  .asks {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 2.75rem;
    text-align: left;
  }

  .ask {
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 8px;
  }

  .ask h3 {
    color: var(--rg-gold-soft);
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  .ask p {
    color: rgba(255, 255, 255, 0.88);
    font-size: 0.92rem;
    line-height: 1.65;
  }

  .btn {
    display: inline-block;
    padding: 14px 32px;
    font-size: 0.78rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 600;
    background: var(--rg-gold);
    color: var(--rg-bark);
    border-radius: 4px;
    transition: all 0.3s ease;
    overflow-wrap: anywhere;
  }

  .btn:hover {
    background: var(--rg-gold-soft);
    color: var(--rg-bark);
    transform: translateY(-2px);
  }

  @media (max-width: 900px) {
    .asks { grid-template-columns: 1fr; }
    .cta { padding: 3.5rem 1.5rem; }
    .contatti { padding: 1rem 0 4rem; }
  }
</style>

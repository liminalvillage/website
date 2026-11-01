<script>
  // TODO: confirm the company mailbox before going live.
  const EMAIL = 'info@rigenerativa.it';

  const asks = [
    {
      title: 'Hai uno spazio da rigenerare?',
      text: 'Edifici, terreni o strutture dismesse: valutiamo insieme un progetto di gestione e trasformazione.',
      subject: 'Uno spazio da rigenerare',
      body: "Buongiorno,\n\nvorrei proporvi uno spazio da rigenerare.\n\nDove si trova:\nChe tipo di spazio è (edificio, terreno, struttura dismessa):\nCosa immagino:\n\n",
    },
    {
      title: 'Sei un ente o un comune?',
      text: 'Co-progettazione, gare, fondi europei e modelli di gestione condivisa dei beni comuni.',
      subject: 'Collaborazione con un ente',
      body: "Buongiorno,\n\nscrivo per conto di (ente / comune):\n\nVorremmo approfondire:\n\n",
    },
    {
      title: 'Vuoi aprire un nodo?',
      text: 'Il nostro modello è replicabile: formazione, strumenti digitali e affiliazione alla rete.',
      subject: 'Aprire un nodo della rete',
      body: "Buongiorno,\n\nvorrei aprire un nodo della rete.\n\nDove:\nChi siamo:\n\n",
    },
  ];

  let picked = 0;
  let copied = false;
  let copyTimer;

  $: ask = asks[picked];
  $: href = `mailto:${EMAIL}?subject=${encodeURIComponent(`${ask.subject} · dal sito`)}&body=${encodeURIComponent(ask.body)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      copied = true;
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => (copied = false), 1800);
    } catch {
      // Clipboard unavailable (insecure context or denied): the mailto link still works.
    }
  }
</script>

<section id="ri-contatti" class="contatti rg-section">
  <div class="rg-container">
    <div class="cta" data-reveal>
      <div class="cta-head">
        <p class="rg-eyebrow">Contatti</p>
        <h2 class="rg-h2">Costruiamo <em>insieme</em></h2>
        <p class="lede">Raccontaci da dove parti: prepariamo noi l'email.</p>
      </div>

      <div class="asks" role="radiogroup" aria-label="Il motivo del contatto">
        {#each asks as a, i}
          <button
            class="ask"
            class:on={picked === i}
            role="radio"
            aria-checked={picked === i}
            on:click={() => (picked = i)}
          >
            <span class="check" aria-hidden="true"></span>
            <h3>{a.title}</h3>
            <p>{a.text}</p>
          </button>
        {/each}
      </div>

      <div class="actions">
        <a class="rg-btn rg-btn-gold" {href}>Scrivici: {ask.subject.toLowerCase()} <span class="arrow">→</span></a>
        <button class="copy" on:click={copy} aria-live="polite">
          {copied ? 'Indirizzo copiato ✓' : `Copia ${EMAIL}`}
        </button>
      </div>
    </div>
  </div>
</section>

<style>
  .contatti {
    padding-top: 6rem;
  }

  .cta {
    position: relative;
    padding: 5rem 4rem;
    border-radius: 28px;
    background: var(--rg-forest-dark);
    background-image:
      var(--rg-grain),
      radial-gradient(ellipse at 0% 0%, rgba(111, 140, 90, 0.45), transparent 55%),
      radial-gradient(ellipse at 100% 100%, rgba(201, 163, 91, 0.25), transparent 50%);
    color: var(--rg-cream);
    overflow: hidden;
  }

  .cta-head {
    max-width: 640px;
    margin-bottom: 3rem;
  }

  .cta .rg-eyebrow {
    color: var(--rg-gold-soft);
  }

  .cta .rg-h2 {
    color: #fff;
  }

  .cta .rg-h2 em {
    color: var(--rg-gold-soft);
  }

  .lede {
    color: rgba(244, 239, 228, 0.78);
    margin-top: 1rem;
    font-size: 1.05rem;
  }

  .asks {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2.75rem;
  }

  .ask {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    text-align: left;
    padding: 1.75rem 1.6rem 1.6rem;
    border-radius: 18px;
    border: 1px solid rgba(244, 239, 228, 0.18);
    background: rgba(244, 239, 228, 0.04);
    color: inherit;
    cursor: pointer;
    font: inherit;
    transition: background 0.45s var(--rg-ease), border-color 0.45s var(--rg-ease), transform 0.45s var(--rg-ease);
  }

  .ask:hover {
    background: rgba(244, 239, 228, 0.08);
    transform: translateY(-3px);
  }

  .ask.on {
    background: var(--rg-cream);
    border-color: var(--rg-cream);
  }

  .check {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1.5px solid rgba(244, 239, 228, 0.4);
    transition: all 0.4s var(--rg-ease);
  }

  .ask.on .check {
    border-color: var(--rg-forest);
    background: var(--rg-forest);
    box-shadow: inset 0 0 0 4px var(--rg-cream);
  }

  .ask h3 {
    color: #fff;
    font-size: 1.45rem;
    font-weight: 500;
    margin: 0 2rem 0.6rem 0;
    transition: color 0.4s ease;
  }

  .ask p {
    color: rgba(244, 239, 228, 0.72);
    font-size: 0.9rem;
    line-height: 1.65;
    transition: color 0.4s ease;
  }

  .ask.on h3 {
    color: var(--rg-bark);
  }

  .ask.on p {
    color: var(--rg-muted);
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .copy {
    background: none;
    border: none;
    color: rgba(244, 239, 228, 0.8);
    font: inherit;
    font-size: 0.85rem;
    cursor: pointer;
    border-bottom: 1px solid rgba(244, 239, 228, 0.35);
    padding: 0.2rem 0;
    transition: color 0.3s ease, border-color 0.3s ease;
  }

  .copy:hover {
    color: var(--rg-gold-soft);
    border-color: var(--rg-gold-soft);
  }

  @media (max-width: 900px) {
    .cta {
      padding: 3.5rem 1.5rem;
      border-radius: 22px;
    }

    .asks {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 520px) {
    .actions .rg-btn {
      width: 100%;
      justify-content: center;
      letter-spacing: 2px;
    }
  }
</style>

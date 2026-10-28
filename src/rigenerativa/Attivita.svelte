<script>
  // Condensed from art. 4 (oggetto sociale) of the atto costitutivo, 15 aprile 2026.
  const groups = [
    {
      title: 'Luoghi',
      areas: [
        {
          name: 'Rigenerazione degli spazi fisici',
          text: 'Gestione, costruzione e restauro di edifici e aree dismesse; General Contractor; bioedilizia e architettura bioclimatica; fotovoltaico e accumulo off-grid; biolaghi e fitodepurazione; efficienza energetica (ESCO).',
        },
        {
          name: 'Vita negli spazi rigenerati',
          text: 'Attività outdoor, turismo lento e itinerari culturali e spirituali; ospitalità diffusa e glamping; ristorazione e filiera corta; eventi, festival e residenze artistiche; benessere e yoga.',
        },
        {
          name: "L'acqua come bene comune",
          text: 'Gestione comunitaria di sorgenti, pozzi e bacini; concessioni idriche; infrastrutture idriche locali; modelli di governance ispirati ai principi di Elinor Ostrom.',
        },
        {
          name: 'Stewardship dei beni comuni',
          text: 'Ruolo di custode fiduciario di terre e patrimoni; community land trust, cohousing e diritto di superficie; accompagnamento di comunità e istituzioni verso la gestione condivisa.',
        },
      ],
    },
    {
      title: 'Terra ed economia viva',
      areas: [
        {
          name: 'Economia viva e filiere rigenerative',
          text: 'Botteghe e mercati di prodotti locali; agroecologia e permacultura; food forest e orti collettivi; Community Supported Agriculture; apicoltura; fattorie didattiche; rewilding e pascolo rigenerativo.',
        },
        {
          name: 'Riciclo e tracciamento delle risorse',
          text: 'Recupero di materiali edilizi e industriali; filiere di upcycling; Digital Product Passport e material flow analysis; consulenza su simbiosi industriale, LCA e rendicontazione CSRD.',
        },
        {
          name: 'Macchinari per processi rigenerativi',
          text: 'Produzione e manutenzione di macchine agricole e agroforestali, sistemi di compostaggio, depurazione e riscaldamento a biomassa; logistica sostenibile e mobilità condivisa.',
        },
        {
          name: 'Carbonio, biodiversità e finanza rigenerativa',
          text: 'Crediti di carbonio e di biodiversità da riforestazione e agricoltura rigenerativa; pagamenti per servizi ecosistemici; green bond e capitale paziente per gli ecosistemi.',
        },
      ],
    },
    {
      title: 'Tecnologia e governance',
      areas: [
        {
          name: 'Tecnologia digitale e reti',
          text: 'Software gestionali SaaS; BIM e digital twin di edifici e territori; piattaforme GIS cooperative e osservatori territoriali aperti; software per la federazione di reti multi-nodo.',
        },
        {
          name: 'Intelligenza artificiale',
          text: 'Computer vision per cantieri e riconoscimento di specie; agenti AI per il coordinamento di reti di fornitori; individuazione di scarti riutilizzabili; manutenzione predittiva e pianificazione territoriale.',
        },
        {
          name: 'Governance distribuita',
          text: 'Sociocrazia, S3, olocrazia e decisioni per consenso; piattaforme decisionali digitali; modelli di economia pluricapitale e misurazione dell’impatto; gestione di aree naturali protette.',
        },
        {
          name: 'Reti rigenerative e licenze del modello',
          text: 'Un modello replicabile di rigenerazione territoriale attraverso nodi locali affiliati; licenze del marchio e del metodo; formazione dei gestori; marchio collettivo di qualità rigenerativa.',
        },
      ],
    },
    {
      title: 'Conoscenza e scambio',
      areas: [
        {
          name: 'Formazione e ricerca',
          text: 'Corsi in presenza e online; fablab e maker space; poli di ricerca applicata; supporto all’accesso a fondi europei e nazionali (Horizon Europe, LIFE, PNRR) e alla nascita di startup.',
        },
        {
          name: 'Comunicazione ed editoria',
          text: 'Video, podcast e documentari; marketing territoriale; campagne di crowdfunding; pubblicazioni su rigenerazione, bioedilizia, permacultura ed economia circolare.',
        },
        {
          name: 'Voucher e scambio locale',
          text: 'Voucher fisici e digitali per servizi e spazi della rete; valute complementari, banca del tempo e crediti reciproci; crowdfunding e fondi di co-investimento comunitario.',
        },
      ],
    },
  ];
</script>

<section id="ri-attivita" class="attivita">
  <div class="container">
    <div class="section-heading">
      <p class="eyebrow">Attività</p>
      <h2>Cosa facciamo</h2>
      <p class="sub">Un'offerta integrata e modulare, dal cantiere alla comunità.</p>
    </div>

    {#each groups as g}
      <div class="group">
        <h3 class="group-title">{g.title}</h3>
        <div class="grid">
          {#each g.areas as a}
            <article class="card">
              <h4>{a.name}</h4>
              <p>{a.text}</p>
            </article>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  .attivita {
    padding: 7rem 0 6rem;
    background: var(--rg-cream);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .section-heading {
    text-align: center;
    margin-bottom: 3.5rem;
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
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    color: var(--rg-bark);
    margin-bottom: 0.75rem;
    font-style: italic;
  }

  .sub {
    color: var(--rg-muted);
    font-size: 1rem;
    max-width: 540px;
    margin: 0 auto;
  }

  .group {
    margin-bottom: 3.5rem;
  }

  .group:last-child {
    margin-bottom: 0;
  }

  .group-title {
    font-size: 1.6rem;
    color: var(--rg-forest-dark);
    letter-spacing: 1px;
    padding-bottom: 0.75rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--rg-line);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
  }

  .card {
    padding: 1.6rem 1.5rem;
    background: var(--rg-cream-soft);
    border: 1px solid var(--rg-line);
    border-top: 3px solid var(--rg-gold);
    border-radius: 6px;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }

  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(44, 53, 39, 0.08);
  }

  .card h4 {
    font-size: 1.25rem;
    color: var(--rg-bark);
    margin-bottom: 0.6rem;
    font-weight: 500;
  }

  .card p {
    color: var(--rg-muted);
    font-size: 0.88rem;
    line-height: 1.65;
  }

  @media (max-width: 1024px) {
    .grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 640px) {
    .attivita { padding: 5rem 0 4rem; }
    .grid { grid-template-columns: 1fr; }
  }
</style>

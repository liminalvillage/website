<script>
  import { fly, fade, slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

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

  // Each area's text is a list of offerings separated by semicolons.
  const chips = (text) => text.replace(/\.$/, '').split(/;\s*/).map((c) => c[0].toUpperCase() + c.slice(1));

  let offsets = [];
  let n = 0;
  for (const g of groups) {
    offsets.push(n);
    n += g.areas.length;
  }
  const total = n;

  let group = 0;
  let area = 0;

  $: current = groups[group].areas[area];
  $: number = String(offsets[group] + area + 1).padStart(2, '0');

  function pickGroup(i) {
    group = i;
    area = 0;
  }

  // Arrow keys move between tabs, as in the WAI-ARIA tabs pattern.
  function onTabKey(e, i) {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (i + d + groups.length) % groups.length;
    pickGroup(next);
    document.getElementById(`ri-tab-${next}`)?.focus();
  }
</script>

<section id="ri-attivita" class="attivita rg-section">
  <div class="rg-container">
    <div class="heading" data-reveal>
      <div>
        <p class="rg-eyebrow">Attività</p>
        <h2 class="rg-h2">Cosa facciamo</h2>
        <p class="rg-sub">Un'offerta integrata e modulare, dal cantiere alla comunità: {total} ambiti di attività in quattro campi.</p>
      </div>
    </div>

    <div class="tabs" role="tablist" aria-label="Campi di attività" data-reveal="stagger">
      {#each groups as g, i}
        <button
          id="ri-tab-{i}"
          role="tab"
          class="tab"
          class:on={group === i}
          aria-selected={group === i}
          aria-controls="ri-panel"
          tabindex={group === i ? 0 : -1}
          on:click={() => pickGroup(i)}
          on:keydown={(e) => onTabKey(e, i)}
        >
          <span class="tab-title">{g.title}</span>
          <span class="tab-count">{g.areas.length}</span>
        </button>
      {/each}
    </div>

    <div id="ri-panel" class="explorer" role="tabpanel" aria-labelledby="ri-tab-{group}">
      <ol class="list">
        {#key group}
          {#each groups[group].areas as a, i}
            <li in:fly={{ y: 14, duration: 500, delay: i * 60, easing: cubicOut }}>
              <button
                class="item"
                class:on={area === i}
                aria-expanded={area === i}
                on:click={() => (area = i)}
                on:mouseenter={() => (area = i)}
                on:focus={() => (area = i)}
              >
                <span class="item-num">{String(offsets[group] + i + 1).padStart(2, '0')}</span>
                <span class="item-name">{a.name}</span>
                <span class="item-arrow" aria-hidden="true">→</span>
              </button>
              {#if area === i}
                <div class="inline" transition:slide={{ duration: 350, easing: cubicOut }}>
                  <ul class="chips">
                    {#each chips(a.text) as c}<li>{c}</li>{/each}
                  </ul>
                </div>
              {/if}
            </li>
          {/each}
        {/key}
      </ol>

      <div class="detail" aria-live="polite">
        {#key current}
          <div class="detail-inner" in:fade={{ duration: 400 }}>
            <p class="detail-meta"><span>{number}</span> / {total} · {groups[group].title}</p>
            <h3>{current.name}</h3>
            <ul class="chips">
              {#each chips(current.text) as c, i}
                <li in:fly={{ y: 10, duration: 450, delay: 80 + i * 45, easing: cubicOut }}>{c}</li>
              {/each}
            </ul>
          </div>
        {/key}
        <svg class="sprig" viewBox="0 0 120 120" aria-hidden="true">
          <path d="M60 118V40M60 80c-18 0-28-12-28-28 18 0 28 12 28 28zM60 62c16 0 26-10 26-26-16 0-26 10-26 26zM60 40c0-14 6-24 18-30" />
        </svg>
      </div>
    </div>
  </div>
</section>

<style>
  .heading {
    margin-bottom: 3.5rem;
  }

  .tabs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
    margin-bottom: 2.5rem;
  }

  .tab {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 1.1rem 1.3rem;
    border: 1px solid var(--rg-line);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.4);
    color: var(--rg-bark);
    font-family: "Cormorant Garamond", serif;
    font-size: 1.25rem;
    text-align: left;
    cursor: pointer;
    transition: background 0.4s var(--rg-ease), color 0.4s var(--rg-ease), border-color 0.4s var(--rg-ease), transform 0.4s var(--rg-ease);
  }

  .tab:hover {
    border-color: var(--rg-moss);
    transform: translateY(-2px);
  }

  .tab.on {
    background: var(--rg-forest-dark);
    border-color: var(--rg-forest-dark);
    color: var(--rg-cream);
  }

  .tab-count {
    font-family: "Open Sans", sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    min-width: 1.7rem;
    height: 1.7rem;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--rg-cream);
    color: var(--rg-forest-dark);
  }

  .tab.on .tab-count {
    background: var(--rg-gold);
    color: var(--rg-night);
  }

  .explorer {
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    gap: 3rem;
    align-items: start;
  }

  .list {
    list-style: none;
    border-top: 1px solid var(--rg-line);
  }

  .list > li {
    border-bottom: 1px solid var(--rg-line);
  }

  .item {
    width: 100%;
    display: grid;
    grid-template-columns: 2.5rem 1fr auto;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 0.25rem;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    color: var(--rg-bark);
  }

  .item-num {
    font-size: 0.72rem;
    letter-spacing: 2px;
    color: var(--rg-muted);
  }

  .item-name {
    font-family: "Cormorant Garamond", serif;
    font-size: clamp(1.3rem, 2vw, 1.65rem);
    line-height: 1.2;
    transition: color 0.35s ease, transform 0.5s var(--rg-ease);
  }

  .item-arrow {
    opacity: 0;
    transform: translateX(-8px);
    color: var(--rg-gold);
    transition: opacity 0.35s ease, transform 0.5s var(--rg-ease);
  }

  .item.on .item-name {
    color: var(--rg-forest);
    transform: translateX(6px);
  }

  .item.on .item-arrow {
    opacity: 1;
    transform: translateX(0);
  }

  .inline {
    display: none;
  }

  .detail {
    position: sticky;
    top: 6rem;
    min-height: 360px;
    padding: 2.75rem;
    border-radius: 22px;
    background: var(--rg-forest-dark);
    background-image: var(--rg-grain), radial-gradient(circle at 100% 100%, rgba(201, 163, 91, 0.22), transparent 55%);
    color: var(--rg-cream);
    overflow: hidden;
  }

  .detail-meta {
    font-size: 0.72rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(244, 239, 228, 0.6);
    margin-bottom: 1.25rem;
  }

  .detail-meta span {
    color: var(--rg-gold-soft);
  }

  .detail h3 {
    color: #fff;
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 300;
    margin-bottom: 1.75rem;
    max-width: 90%;
  }

  .chips {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    position: relative;
    z-index: 1;
  }

  .chips li {
    font-size: 0.85rem;
    line-height: 1.45;
    padding: 0.5rem 0.95rem;
    border-radius: 999px;
    background: rgba(244, 239, 228, 0.08);
    border: 1px solid rgba(244, 239, 228, 0.16);
    color: var(--rg-cream);
  }

  .sprig {
    position: absolute;
    right: -10px;
    bottom: -14px;
    width: 150px;
    height: 150px;
    fill: none;
    stroke: rgba(221, 185, 121, 0.28);
    stroke-width: 1.2;
    stroke-linecap: round;
  }

  @media (max-width: 960px) {
    .tabs {
      grid-template-columns: repeat(2, 1fr);
    }

    .explorer {
      grid-template-columns: 1fr;
    }

    .detail {
      display: none;
    }

    .inline {
      display: block;
      padding: 0 0.25rem 1.5rem 3.5rem;
    }

    .inline .chips li {
      background: var(--rg-cream);
      border-color: var(--rg-line);
      color: var(--rg-text);
    }
  }

  @media (max-width: 520px) {
    .tab {
      font-size: 1.05rem;
      padding: 0.9rem 1rem;
    }

    .inline {
      padding-left: 0.25rem;
    }

    .item {
      grid-template-columns: 2rem 1fr auto;
    }
  }
</style>

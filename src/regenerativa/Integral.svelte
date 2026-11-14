<script>
  import User from '@lucide/svelte/icons/user';
  import Users from '@lucide/svelte/icons/users';
  import Leaf from '@lucide/svelte/icons/leaf';
  import Network from '@lucide/svelte/icons/network';
  import { pick } from './i18n.js';

  const t = pick({
    en: {
      eyebrow: 'Integral regeneration',
      title: 'Transforming <em>the whole system</em>',
      sub: 'Lasting change is more than planting trees, adopting new technology or changing economic practice. Regeneration happens at once within people, between them, in organisations and cultures, and in the material and ecological systems life depends on.',
      dims: [
        ['Personal', 'Physical and emotional well-being, self-awareness, creativity and personal development.'],
        ['Relational and cultural', 'Communication, trust, belonging, conflict transformation, education and collective intelligence.'],
        ['Ecological', 'Soil, water, biodiversity, energy, buildings, food systems and living landscapes.'],
        ['Economic and systemic', 'How we organise work, distribute resources, govern shared assets and make room for meaningful contribution.'],
      ],
      centre: 'Each dimension strengthens the others',
      reinforce: 'A farm grows more resilient with healthy relationships and viable economics. A community works better when its members can navigate disagreement. Personal transformation means more when it becomes a real contribution. Our programming deliberately links these dimensions.',
      ethicsTitle: 'Inspired by permaculture ethics',
      ethics: ['Earth Care', 'People Care', 'Fair Share'],
      ethicsSub: 'We also draw on integral frameworks, systems thinking, developmental approaches and participatory governance, without asking anyone to subscribe to a single worldview.',
      diversity: 'Regeneration thrives through diversity. The goal is not to make every initiative the same, but to help different initiatives form <em>productive, mutually supportive relationships</em>.',
    },
    it: {
      eyebrow: 'Rigenerazione integrale',
      title: "Trasformare <em>l'intero sistema</em>",
      sub: "Un cambiamento duraturo è più che piantare alberi, adottare nuove tecnologie o cambiare pratiche economiche. La rigenerazione avviene insieme dentro le persone, tra le persone, nelle organizzazioni e nelle culture, e nei sistemi materiali ed ecologici da cui dipende la vita.",
      dims: [
        ['Personale', 'Benessere fisico ed emotivo, consapevolezza di sé, creatività e crescita personale.'],
        ['Relazionale e culturale', 'Comunicazione, fiducia, appartenenza, trasformazione dei conflitti, educazione e intelligenza collettiva.'],
        ['Ecologica', 'Suolo, acqua, biodiversità, energia, edifici, sistemi alimentari e paesaggi vivi.'],
        ['Economica e sistemica', 'Come organizziamo il lavoro, distribuiamo le risorse, governiamo i beni comuni e diamo spazio a un contributo significativo.'],
      ],
      centre: 'Ogni dimensione rafforza le altre',
      reinforce: "Una fattoria è più resiliente se sostenuta da relazioni sane ed economie sostenibili. Una comunità funziona meglio quando i suoi membri sanno attraversare il disaccordo. La trasformazione personale ha più senso quando diventa un contributo reale. La nostra programmazione collega queste dimensioni di proposito.",
      ethicsTitle: "Ispirati all'etica della permacultura",
      ethics: ['Cura della Terra', 'Cura delle Persone', 'Equa Condivisione'],
      ethicsSub: 'Attingiamo anche a modelli integrali, pensiero sistemico, approcci evolutivi e governance partecipativa, senza chiedere a nessuno di aderire a una sola visione del mondo.',
      diversity: "La rigenerazione prospera nella diversità. L'obiettivo non è rendere ogni iniziativa uguale, ma aiutare iniziative diverse a creare <em>relazioni produttive e di reciproco sostegno</em>.",
    },
  });

  const icons = [User, Users, Leaf, Network];
</script>

<section id="rn-integral" class="rg-section integral">
  <div class="rg-container">
    <div class="heading" data-reveal>
      <p class="rg-eyebrow">{t.eyebrow}</p>
      <h2 class="rg-h2">{@html t.title}</h2>
      <p class="rg-sub">{t.sub}</p>
    </div>

    <div class="quad" data-reveal="stagger">
      {#each t.dims as [name, body], i}
        <div class="dim d{i}">
          <span class="icon"><svelte:component this={icons[i]} size={20} strokeWidth={1.5} /></span>
          <h3>{name}</h3>
          <p>{body}</p>
        </div>
      {/each}
      <div class="hub" aria-hidden="true"><span>{t.centre}</span></div>
    </div>

    <p class="reinforce" data-reveal>{t.reinforce}</p>

    <div class="ethics" data-reveal>
      <div>
        <h3>{t.ethicsTitle}</h3>
        <p>{t.ethicsSub}</p>
      </div>
      <ul>
        {#each t.ethics as e}<li>{e}</li>{/each}
      </ul>
    </div>

    <blockquote class="diversity" data-reveal>{@html t.diversity}</blockquote>
  </div>
</section>

<style>
  .integral { background: var(--rg-cream); }

  .heading { max-width: 760px; margin-bottom: 4rem; }

  .quad {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .dim {
    padding: 2.25rem 2.25rem 2rem;
    background: var(--rg-cream-soft);
    border: 1px solid var(--rg-line);
    border-radius: 18px;
  }

  /* Leave room around the shared centre. */
  .d0, .d2 { padding-right: 5.5rem; }
  .d1, .d3 { padding-left: 5.5rem; }
  .d1 .icon, .d3 .icon { margin-left: 0; }

  .dim h3 { font-size: 1.6rem; margin-bottom: 0.5rem; }
  .dim p { color: var(--rg-muted); font-size: 0.93rem; }

  .icon {
    display: inline-flex;
    width: 42px;
    height: 42px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--rg-cream);
    color: var(--rg-forest);
    margin-bottom: 1rem;
  }

  .hub {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 150px;
    height: 150px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: var(--rg-forest);
    color: var(--rg-cream);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1.25rem;
    font-family: "Cormorant Garamond", serif;
    font-style: italic;
    font-size: 1.1rem;
    line-height: 1.2;
    box-shadow: 0 0 0 10px var(--rg-cream);
  }

  .reinforce {
    max-width: 820px;
    margin: 3rem auto 5rem;
    text-align: center;
    color: var(--rg-muted);
    font-size: 1.02rem;
  }

  .ethics {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 3rem;
    align-items: center;
    padding: 3rem;
    border-radius: 20px;
    background: var(--rg-bark);
  }

  .ethics h3 { color: var(--rg-cream); font-size: 1.8rem; margin-bottom: 0.75rem; }
  .ethics p { color: rgba(244, 239, 228, 0.75); font-size: 0.93rem; }

  .ethics ul {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }

  .ethics li {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 1px solid var(--rg-gold);
    color: var(--rg-gold-soft);
    font-family: "Cormorant Garamond", serif;
    font-size: 1.3rem;
    line-height: 1.15;
    padding: 0.75rem;
  }

  .diversity {
    font-family: "Cormorant Garamond", serif;
    font-size: clamp(1.5rem, 2.8vw, 2.1rem);
    font-weight: 300;
    line-height: 1.3;
    color: var(--rg-bark);
    max-width: 860px;
    margin: 5rem auto 0;
    text-align: center;
  }

  .diversity :global(em) { color: var(--rg-forest); }

  @media (max-width: 860px) {
    .quad { grid-template-columns: 1fr; }
    .d0, .d1, .d2, .d3 { padding: 1.75rem 1.5rem; }
    .hub { display: none; }
    .reinforce { text-align: left; margin: 2rem 0 3.5rem; }
    .ethics { grid-template-columns: 1fr; padding: 2.25rem 1.25rem; gap: 2rem; }
  }

  @media (max-width: 600px) {
    .ethics ul { grid-template-columns: 1fr; }
    .ethics li { aspect-ratio: auto; border-radius: 999px; padding: 0.55rem 1rem; font-size: 1.2rem; }
  }
</style>

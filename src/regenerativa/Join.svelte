<script>
  import User from '@lucide/svelte/icons/user';
  import Presentation from '@lucide/svelte/icons/presentation';
  import House from '@lucide/svelte/icons/house';
  import Handshake from '@lucide/svelte/icons/handshake';
  import Landmark from '@lucide/svelte/icons/landmark';
  import HandHeart from '@lucide/svelte/icons/hand-heart';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import Mail from '@lucide/svelte/icons/mail';
  import { pick } from './i18n.js';
  import { EMAIL, mailto, agreementUrl } from './links.js';

  const t = pick({
    en: {
      eyebrow: 'The invitation',
      title: 'Regeneration no one <em>achieves alone</em>',
      sub: 'Participation can begin with something as simple as attending a community gathering, offering a workshop, sharing a resource or helping an initiative meet a need. From there, relationships deepen naturally into collaboration, shared projects and new enterprises.',
      ways: [
        ['Individuals', 'Accessible pathways from curiosity to meaningful participation: come to an event, lend a hand, become a member.', 'Membership agreement', 'Joining as an individual'],
        ['Practitioners and organisers', 'Connections to people, spaces and complementary services for the experiences you want to create.', 'Mentorship agreement', 'Proposing an experience'],
        ['Landowners and venue stewards', 'Ways to activate under-used land and buildings for regenerative use, while keeping ownership.', 'Ownership agreement', 'Offering a place'],
        ['Associations and community groups', 'Keep your identity and structure; gain collaborators, venues, resources, visibility, knowledge and practical support.', 'Partnership agreement', 'Collaborating as an organisation'],
        ['Municipalities and institutions', 'A framework connecting local initiatives, civic participation and territorial regeneration.', null, 'Institutional collaboration'],
        ['Supporters', 'Give money, tools, land or time as a gift: recognised, accounted for, and never a way to buy influence.', 'Sponsorship agreement', 'Supporting the network'],
      ],
      write: 'Write to us',
      apsTitle: 'Why an APS?',
      aps: 'ReGenerativa is an Associazione di Promozione Sociale and Ente del Terzo Settore, founded in Castorano (AP), Italy, on 21 June 2025. Its purpose is not just to produce a calendar of events, but to give independent people and organisations a shared civic home for initiatives, education, participation, experimentation, resource coordination and common infrastructure, so that the ecosystem becomes more capable than any of its members alone.',
      need: 'We do not need everyone to share the same lifestyle, organisational culture or vision of the future. We need a common willingness to <em>collaborate, learn, respect one another’s autonomy and contribute</em>.',
      why: [
        ['We begin with events', 'because they bring people into relationship.'],
        ['We connect relationships into projects', 'because real change requires sustained action.'],
        ['We coordinate resources', 'because regeneration must also be materially possible.'],
        ['We connect it all into a distributed network', 'because the transformation we seek is larger than any single place.'],
      ],
      vision: 'A world where regeneration is not an occasional event, but <em>a continuous way of participating in life</em>.',
      motto: 'Connect. Contribute. Regenerate.',
      questions: 'A question, an idea, a place to offer?',
    },
    it: {
      eyebrow: "L'invito",
      title: 'Una rigenerazione che nessuno <em>realizza da solo</em>',
      sub: "Si può iniziare con qualcosa di semplice: partecipare a un incontro di comunità, proporre un laboratorio, condividere una risorsa o aiutare un'iniziativa a rispondere a un bisogno. Da lì le relazioni crescono naturalmente in collaborazioni, progetti condivisi e nuove imprese.",
      ways: [
        ['Persone', 'Percorsi accessibili dalla curiosità a una partecipazione significativa: vieni a un evento, dai una mano, diventa socio.', 'Accordo di adesione', 'Partecipare come persona'],
        ['Professionisti e organizzatori', 'Connessioni con persone, spazi e servizi complementari per le esperienze che vuoi creare.', 'Accordo di mentorato', "Proporre un'esperienza"],
        ['Proprietari e custodi di luoghi', 'Modi per attivare terreni ed edifici sottoutilizzati a fini rigenerativi, restandone proprietari.', 'Accordo di proprietà', 'Offrire un luogo'],
        ['Associazioni e gruppi di comunità', 'Mantieni identità e struttura; trova collaboratori, spazi, risorse, visibilità, saperi e supporto pratico.', 'Accordo di partenariato', 'Collaborare come organizzazione'],
        ['Comuni e istituzioni', 'Una cornice che collega iniziative locali, partecipazione civica e rigenerazione territoriale.', null, 'Collaborazione istituzionale'],
        ['Sostenitori', 'Dona denaro, strumenti, terra o tempo: riconosciuto, rendicontato, e mai un modo per comprare influenza.', 'Accordo di sostegno', 'Sostenere la rete'],
      ],
      write: 'Scrivici',
      apsTitle: 'Perché una APS?',
      aps: "ReGenerativa è un'Associazione di Promozione Sociale ed Ente del Terzo Settore, costituita a Castorano (AP) il 21 giugno 2025. Il suo scopo non è solo produrre un calendario di eventi, ma offrire a persone e organizzazioni indipendenti una casa civica comune per iniziative, formazione, partecipazione, sperimentazione, coordinamento delle risorse e infrastrutture condivise, perché l'ecosistema diventi più capace di qualsiasi suo membro da solo.",
      need: "Non serve che tutti condividano lo stesso stile di vita, la stessa cultura organizzativa o la stessa visione del futuro. Serve una volontà comune di <em>collaborare, imparare, rispettare l'autonomia altrui e contribuire</em>.",
      why: [
        ['Partiamo dagli eventi', 'perché mettono le persone in relazione.'],
        ['Trasformiamo le relazioni in progetti', 'perché il cambiamento reale richiede azione continua.'],
        ['Coordiniamo le risorse', 'perché la rigenerazione deve essere anche materialmente possibile.'],
        ['Colleghiamo tutto in una rete distribuita', 'perché la trasformazione che cerchiamo è più grande di qualsiasi singolo luogo.'],
      ],
      vision: 'Un mondo in cui la rigenerazione non è un evento occasionale, ma <em>un modo continuo di partecipare alla vita</em>.',
      motto: 'Connetti. Contribuisci. Rigenera.',
      questions: 'Una domanda, un\'idea, un luogo da offrire?',
    },
  });

  const icons = [User, Presentation, House, Handshake, Landmark, HandHeart];
  const hrefs = [
    agreementUrl(2, 'Membership'),
    agreementUrl(4, 'Mentorship'),
    agreementUrl(1, 'Ownership'),
    agreementUrl(6, 'Partnership'),
    null,
    agreementUrl(5, 'Sponsorship'),
  ];
</script>

<section id="rn-join" class="rg-section join">
  <div class="rg-container">
    <div class="heading" data-reveal>
      <p class="rg-eyebrow">{t.eyebrow}</p>
      <h2 class="rg-h2">{@html t.title}</h2>
      <p class="rg-sub">{t.sub}</p>
    </div>

    <ul class="ways" data-reveal="stagger">
      {#each t.ways as [title, body, cta, subject], i}
        <li>
          <svelte:component this={icons[i]} size={24} strokeWidth={1.4} />
          <h3>{title}</h3>
          <p>{body}</p>
          <div class="links">
            {#if hrefs[i]}
              <a href={hrefs[i]} target="_blank" rel="noopener noreferrer">{cta} <ArrowUpRight size={15} /></a>
            {/if}
            <a class:mail={hrefs[i]} href={mailto(subject)}>{t.write} <ArrowRight size={15} /></a>
          </div>
        </li>
      {/each}
    </ul>

    <div class="aps" data-reveal>
      <h3>{t.apsTitle}</h3>
      <p>{t.aps}</p>
    </div>

    <p class="need" data-reveal>{@html t.need}</p>

    <div class="manifesto" data-reveal>
      <ol>
        {#each t.why as [lead, rest]}
          <li><strong>{lead}</strong> {rest}</li>
        {/each}
      </ol>
      <p class="vision">{@html t.vision}</p>
      <p class="motto">{t.motto}</p>
    </div>

    <div class="contact" data-reveal>
      <p>{t.questions}</p>
      <a class="rg-btn rg-btn-dark" href="mailto:{EMAIL}"><Mail size={16} /> {EMAIL}</a>
    </div>
  </div>
</section>

<style>
  .heading { max-width: 780px; margin-bottom: 4rem; }

  .ways {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }

  .ways li {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem 1.6rem 1.6rem;
    border-radius: 18px;
    background: var(--rg-cream);
    border: 1px solid var(--rg-line);
    transition: transform 0.45s var(--rg-ease), box-shadow 0.45s var(--rg-ease);
  }

  .ways li:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 44px rgba(44, 53, 39, 0.1);
  }

  .ways li > :global(svg) { color: var(--rg-forest); }

  .ways h3 { font-size: 1.5rem; margin: 1rem 0 0.5rem; }

  .ways p {
    color: var(--rg-muted);
    font-size: 0.9rem;
    line-height: 1.7;
    flex: 1;
    margin-bottom: 1.25rem;
  }

  .links { display: flex; flex-wrap: wrap; gap: 0.25rem 1.25rem; }

  .links a {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.72rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    font-weight: 600;
    padding: 0.3rem 0;
  }

  .links a.mail { color: var(--rg-muted); }

  .aps {
    display: grid;
    grid-template-columns: 1fr 2.6fr;
    gap: 3rem;
    margin-top: 5rem;
    padding: 2.5rem 0;
    border-top: 1px solid var(--rg-line);
    border-bottom: 1px solid var(--rg-line);
  }

  .aps h3 { font-size: 1.9rem; }
  .aps p { color: var(--rg-muted); }

  .need {
    max-width: 860px;
    margin: 4.5rem auto;
    text-align: center;
    font-family: "Cormorant Garamond", serif;
    font-size: clamp(1.4rem, 2.5vw, 1.9rem);
    line-height: 1.35;
    color: var(--rg-bark);
  }

  .need :global(em) { color: var(--rg-forest); }

  .manifesto {
    padding: 4rem;
    border-radius: 24px;
    background:
      radial-gradient(ellipse 60% 60% at 80% 0%, rgba(63, 106, 69, 0.35), transparent 70%),
      var(--rg-night);
    color: var(--rg-cream);
  }

  .manifesto ol { list-style: none; display: grid; gap: 1rem; margin-bottom: 3rem; }

  .manifesto li {
    font-size: 1.05rem;
    color: rgba(244, 239, 228, 0.72);
    padding-left: 1.25rem;
    border-left: 1px solid rgba(201, 163, 91, 0.5);
  }

  .manifesto strong { color: var(--rg-cream); font-weight: 600; }

  .vision {
    font-family: "Cormorant Garamond", serif;
    font-size: clamp(1.8rem, 3.6vw, 2.9rem);
    font-weight: 300;
    line-height: 1.15;
    color: var(--rg-cream);
    max-width: 900px;
  }

  .vision :global(em) { color: var(--rg-gold-soft); }

  .motto {
    margin-top: 2rem;
    color: var(--rg-gold);
    font-size: 0.75rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    font-weight: 600;
  }

  .contact {
    margin-top: 4rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;
  }

  .contact p {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.6rem;
    color: var(--rg-bark);
  }

  @media (max-width: 1000px) {
    .ways { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 760px) {
    .aps { grid-template-columns: 1fr; gap: 1rem; }
    .manifesto { padding: 2.5rem 1.25rem; }
  }

  @media (max-width: 600px) {
    .ways { grid-template-columns: 1fr; }
    .contact .rg-btn { letter-spacing: 1px; text-transform: none; font-size: 0.9rem; }
  }
</style>

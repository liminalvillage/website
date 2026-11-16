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
      sub: 'Start small: come to a gathering, offer a skill or share a resource. Pick the door that fits you.',
      ways: [
        ['Individuals', 'Come to a gathering, lend a hand, become a member.', 'Membership agreement', 'Joining as an individual'],
        ['Practitioners and organisers', 'Find venues, people and support for what you want to run.', 'Mentorship agreement', 'Proposing an experience'],
        ['Landowners', 'Open land or a building to regenerative use and keep owning it.', 'Ownership agreement', 'Offering a place'],
        ['Associations', 'Keep your identity; gain collaborators, spaces and resources.', 'Partnership agreement', 'Collaborating as an organisation'],
        ['Municipalities', 'Connect local initiatives with territorial regeneration.', null, 'Institutional collaboration'],
        ['Supporters', 'Give money, tools, land or time, never to buy influence.', 'Sponsorship agreement', 'Supporting the network'],
      ],
      write: 'Write to us',
      questions: 'A question, an idea, a place to offer?',
    },
    it: {
      eyebrow: "L'invito",
      title: 'Una rigenerazione che nessuno <em>realizza da solo</em>',
      sub: "Inizia in piccolo: vieni a un incontro, offri una competenza o condividi una risorsa. Scegli la porta adatta a te.",
      ways: [
        ['Persone', 'Vieni a un incontro, dai una mano, diventa socio.', 'Accordo di adesione', 'Partecipare come persona'],
        ['Professionisti e organizzatori', 'Trova spazi, persone e supporto per ciò che vuoi proporre.', 'Accordo di mentorato', "Proporre un'esperienza"],
        ['Proprietari', 'Apri un terreno o un edificio a un uso rigenerativo, restandone proprietario.', 'Accordo di proprietà', 'Offrire un luogo'],
        ['Associazioni', 'Mantieni la tua identità; trova collaboratori, spazi e risorse.', 'Accordo di partenariato', 'Collaborare come organizzazione'],
        ['Comuni', 'Collega le iniziative locali alla rigenerazione del territorio.', null, 'Collaborazione istituzionale'],
        ['Sostenitori', 'Dona denaro, strumenti, terra o tempo, mai per comprare influenza.', 'Accordo di sostegno', 'Sostenere la rete'],
      ],
      write: 'Scrivici',
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

  @media (max-width: 600px) {
    .ways { grid-template-columns: 1fr; }
    .contact .rg-btn { letter-spacing: 1px; text-transform: none; font-size: 0.9rem; }
  }
</style>

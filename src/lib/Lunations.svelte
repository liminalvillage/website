<script>
  import LunationArc from './LunationArc.svelte';
  import PhotoScroll from './PhotoScroll.svelte';

  const lunationsImages = [
    '/images/UNADJUSTEDNONRAW_thumb_e385-500x99999.jpg',
    '/images/UNADJUSTEDNONRAW_thumb_e685-500x99999.jpg',
    '/images/UNADJUSTEDNONRAW_thumb_e92d-500x99999.jpg',
    '/images/UNADJUSTEDNONRAW_thumb_eddc-500x99999.jpg',
    '/images/UNADJUSTEDNONRAW_thumb_f439-500x99999.jpg',
  ];
</script>

<section id="lunations" class="lunations">
  <div class="container">
    <div class="section-heading">
      <h2>Lunations</h2>
    </div>
    <div class="section-content">
      <p>
        We align our activity to the lunar cycles to synchronize group working patterns around
        the phases of a lunar month. You can imagine the moon as a planet-wide 'progress-bar'
        whereby simply craning our heads to the night sky, we can check-in with the vibes of
        other participants anywhere on planet Earth. This is a way for globally distributed teams
        and projects to synchronize and harmonize their activities.
      </p>

      <LunationArc />

      <p>
        During some lunations, Liminal Village is home to Hackalongs. A Hackalong is best described
        as a holistic continuous co-creation <strong>process</strong> where a group of people comes
        together to share knowledge and passions by giving talks, workshops or by brainstorming on
        specific subjects. The entirety of our perspectives are valued and expression is encouraged.
        We enter a process that synchronizes our activity and provides the infrastructure for us to
        signal, branch, merge and coordinate together to co-create something that resonates with us
        as a collective without any need for coercion, reward, punishment or manipulation.
      </p>

      <div class="access">
        <div>
          <h3>Reserved for members and supporters</h3>
          <p>
            Taking part in a lunation at the village is open to members and supporters of Liminal Village
            and the <a href="https://regenerativa.earth" target="_blank" rel="noopener">ReGenerativa network</a>.
            Become a member by applying to visit and onboarding with the community, or become a supporter
            by contributing to the village on Open Collective.
          </p>
          <div class="access-actions">
            <a class="btn" href="/apply">Apply to visit</a>
            <a class="btn ghost" href="https://opencollective.com/liminal" target="_blank" rel="noopener">Become a supporter</a>
          </div>
        </div>
      </div>

      <p class="calendar-link">
        <a href="/lunations">See this year's lunations — every new and full moon, and what is planned →</a>
      </p>

      <PhotoScroll images={lunationsImages} alt="Lunations" />
    </div>
  </div>
</section>

<section class="newsletter">
  <div class="newsletter-content">
    <h2>Subscribe To Our Newsletter</h2>
    <form
      action="https://liminalvillage.us10.list-manage.com/subscribe/post?u=f34ed3a710cf1faef9f335534&id=4f9e07d0c2"
      method="post"
      target="_blank"
      class="newsletter-form"
    >
      <input
        type="email"
        name="EMAIL"
        placeholder="Enter your email address"
        required
      />
      <button type="submit">Subscribe</button>
    </form>
  </div>
</section>

<style>
  .calendar-link a {
    color: var(--primary-color);
    font-weight: 600;
    text-decoration: none;
    border-bottom: 1px solid currentColor;
  }

  .access {
    --size: min(500px, calc(100vw - 4rem));
    position: relative;
    flex: none;
    width: var(--size);
    aspect-ratio: 1;
    border-radius: 50%;
    padding: 0 calc(var(--size) * 0.13);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 1px solid var(--orb-line);
    -webkit-mask-image: var(--orb-mask);
    mask-image: var(--orb-mask);
    mix-blend-mode: var(--orb-blend);
    animation: orb-drift 9s ease-in-out infinite;
    margin: 0 auto 2.5rem;
    background: var(--tint-1);
  }


  .access h3 {
    font-size: 1.15rem;
    color: var(--ink);
    margin-bottom: 0.6rem;
  }

  .access p {
    max-width: none;
    margin: 0 0 1.25rem;
    font-size: 0.9rem;
    line-height: 1.6;
    text-align: center;
    color: var(--ink-soft);
  }

  .access p a {
    color: var(--primary-color);
    text-decoration: none;
  }

  .access-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }

  .access-actions .btn {
    display: inline-block;
    padding: 10px 22px;
    border: 1px solid var(--primary-color);
    border-radius: 999px;
    background: var(--primary-color);
    color: var(--on-accent);
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .access-actions .btn.ghost {
    background: transparent;
    color: var(--primary-color);
  }

  .access-actions .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px color-mix(in srgb, var(--accent) 25%, transparent);
  }

  .lunations {
    padding: 6rem 0;
    background: transparent;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Editorial section head: a generated number, then a large left-aligned
     title above a hairline-separated section */
  .section-heading {
    display: grid;
    grid-template-columns: 3.5rem 1fr;
    align-items: baseline;
    text-align: left;
    margin-bottom: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid color-mix(in srgb, var(--ink) 12%, transparent);
  }

  .section-heading::before {
    counter-increment: section;
    content: counter(section, decimal-leading-zero);
    grid-row: 1 / span 2;
    font-size: 0.75rem;
    letter-spacing: 2px;
    color: var(--muted);
  }

  .section-heading > :global(*) {
    grid-column: 2;
  }

  .section-heading h2 {
    font-size: clamp(2.4rem, 4.6vw, 4rem);
    font-weight: var(--heading-weight, 300);
    letter-spacing: -0.01em;
    line-height: 1.05;
    color: var(--ink);
    text-transform: none;
  }

  .section-content {
    text-align: left;
  }

  p {
    font-size: 1rem;
    line-height: 1.75;
    color: var(--muted);
    max-width: 62ch;
    /* An offset column: text starts a third of the way in */
    margin: 0 0 2rem max(0px, min(33.333%, calc(100% - 62ch)));
    text-align: left;
  }

  strong {
    color: var(--ink);
    font-size: 100%;
  }

  /* Newsletter */
  .newsletter {
    padding: 0 2rem 6rem;
    background: transparent;
    text-align: center;
  }

  .newsletter-content {
    max-width: 600px;
    margin: 0 auto;
  }

  .newsletter h2 {
    color: var(--ink);
    font-size: 1.4rem;
    font-weight: 300;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 2rem;
  }

  .newsletter-form {
    display: flex;
    gap: 0.75rem;
  }

  .newsletter-form input {
    flex: 1;
    padding: 14px 20px;
    border: 2px solid color-mix(in srgb, var(--accent) 30%, transparent);
    border-radius: 6px;
    font-size: 0.9rem;
    font-family: var(--font-body);
    background: transparent;
    color: var(--ink);
    transition: border-color 0.3s;
  }

  .newsletter-form input::placeholder {
    color: color-mix(in srgb, var(--ink) 40%, transparent);
  }

  .newsletter-form input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .newsletter-form button {
    padding: 14px 32px;
    background: transparent;
    color: var(--accent);
    border: 2px solid var(--accent);
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.85rem;
    font-family: var(--font-body);
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .newsletter-form button:hover {
    background: var(--accent);
    color: var(--on-accent);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px color-mix(in srgb, var(--accent) 25%, transparent);
  }

  @media (max-width: 768px) {
    .lunations {
      padding: 4rem 0;
    }

    .access p {
      font-size: 0.8rem;
      margin-bottom: 0.9rem;
    }

    .access-actions .btn {
      padding: 8px 16px;
      font-size: 0.7rem;
    }

    .section-heading h2 {
      font-size: 2.2rem;
    }

    .newsletter-form {
      flex-direction: column;
    }

    .newsletter-form button {
      width: 100%;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .access {
      animation: none;
    }
  }
</style>

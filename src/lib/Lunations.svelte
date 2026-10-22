<script>
  import LunationArc from './LunationArc.svelte';

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
        <i class="fas fa-lock" aria-hidden="true"></i>
        <div>
          <h3>Reserved for members and supporters</h3>
          <p>
            Taking part in a lunation at the village is open to members and supporters of Liminal Village
            and the <a href="https://regenerativa.earth" target="_blank" rel="noopener">ReGenerativa network</a>.
            Become a member by applying to visit and onboarding with the community, or become a supporter
            by contributing to the village on Open Collective.
          </p>
          <div class="access-actions">
            <a class="btn" href="https://docs.google.com/forms/d/e/1FAIpQLSfpjW-YzSfUMNdsRZ9DlC70JqSYXCu4JZsPs6mHIjktxJ6tYA/viewform?usp=sf_link" target="_blank" rel="noopener">Apply to visit</a>
            <a class="btn ghost" href="https://opencollective.com/liminal" target="_blank" rel="noopener">Become a supporter</a>
          </div>
        </div>
      </div>

      <p class="calendar-link">
        <a href="/lunations">See this year's lunations — every new and full moon, and what is planned →</a>
      </p>

      <div class="gallery">
        {#each lunationsImages as image}
          <div class="gallery-item">
            <img src={image} alt="Lunations" loading="lazy" />
          </div>
        {/each}
      </div>
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
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
    background: #fff;
    border: 1px solid rgba(214, 161, 91, 0.35);
    border-radius: 12px;
    padding: 1.75rem 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
  }

  .access > i {
    color: var(--primary-color);
    font-size: 1.3rem;
    margin-top: 0.2rem;
  }

  .access h3 {
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #222;
    margin-bottom: 0.5rem;
  }

  .access p {
    text-align: left;
    margin-bottom: 1.25rem;
  }

  .access p a {
    color: var(--primary-color);
    text-decoration: none;
  }

  .access-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .access-actions .btn {
    display: inline-block;
    padding: 10px 22px;
    border: 2px solid var(--primary-color);
    border-radius: 6px;
    background: var(--primary-color);
    color: #222;
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
    box-shadow: 0 8px 25px rgba(214, 161, 91, 0.25);
  }

  .lunations {
    padding: 6rem 0;
    background: #faf8f5;
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .section-heading {
    text-align: center;
    margin-bottom: 3rem;
  }

  .section-heading h2 {
    font-size: 1.6rem;
    font-weight: 300;
    letter-spacing: 4px;
    color: #222;
    text-transform: uppercase;
  }

  .section-content {
    max-width: 800px;
    margin: 0 auto;
  }

  p {
    font-size: 0.95rem;
    line-height: 1.9;
    color: #8a8274;
    margin-bottom: 2rem;
    text-align: center;
    letter-spacing: 0.5px;
  }

  strong {
    color: #222;
    font-size: 100%;
  }

  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .gallery-item {
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
    transition: all 0.35s ease;
  }

  .gallery-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.1);
  }

  .gallery-item img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
  }

  /* Newsletter */
  .newsletter {
    padding: 4rem 2rem;
    background: #222;
    text-align: center;
  }

  .newsletter-content {
    max-width: 600px;
    margin: 0 auto;
  }

  .newsletter h2 {
    color: #fff;
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
    border: 2px solid rgba(214,161,91,0.3);
    border-radius: 6px;
    font-size: 0.9rem;
    font-family: "Open Sans", sans-serif;
    background: transparent;
    color: #fff;
    transition: border-color 0.3s;
  }

  .newsletter-form input::placeholder {
    color: rgba(255,255,255,0.4);
  }

  .newsletter-form input:focus {
    outline: none;
    border-color: #D6A15B;
  }

  .newsletter-form button {
    padding: 14px 32px;
    background: transparent;
    color: #D6A15B;
    border: 2px solid #D6A15B;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.85rem;
    font-family: "Open Sans", sans-serif;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .newsletter-form button:hover {
    background: #D6A15B;
    color: #222;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(214,161,91,0.25);
  }

  @media (max-width: 768px) {
    .lunations {
      padding: 4rem 0;
    }

    .section-heading h2 {
      font-size: 1.3rem;
    }

    .gallery {
      grid-template-columns: 1fr;
    }

    .newsletter-form {
      flex-direction: column;
    }

    .newsletter-form button {
      width: 100%;
    }
  }
</style>

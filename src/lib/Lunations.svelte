<script>
  const lunationsImages = [
    '/images/UNADJUSTEDNONRAW_thumb_e385-500x99999.jpg',
    '/images/UNADJUSTEDNONRAW_thumb_e685-500x99999.jpg',
    '/images/UNADJUSTEDNONRAW_thumb_e92d-500x99999.jpg',
    '/images/UNADJUSTEDNONRAW_thumb_eddc-500x99999.jpg',
    '/images/UNADJUSTEDNONRAW_thumb_f439-500x99999.jpg',
    '/images/Phasesmoon-1024x439-1024x439.jpg',
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

      <p>
        During some lunations, Liminal Village is home to Hackalongs. A Hackalong is best described
        as a holistic continuous co-creation <strong>process</strong> where a group of people comes
        together to share knowledge and passions by giving talks, workshops or by brainstorming on
        specific subjects. The entirety of our perspectives are valued and expression is encouraged.
        We enter a process that synchronizes our activity and provides the infrastructure for us to
        signal, branch, merge and coordinate together to co-create something that resonates with us
        as a collective without any need for coercion, reward, punishment or manipulation.
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

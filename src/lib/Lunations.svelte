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
  <div class="container">
    <div class="section-heading">
      <h2>Subscribe To Our Newsletter</h2>
    </div>
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
    background: #fff;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .section-heading {
    text-align: center;
    margin-bottom: 3rem;
  }

  .section-heading h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
    letter-spacing: 2px;
    position: relative;
    display: inline-block;
  }

  .section-heading h2::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: #4a9d5f;
  }

  .section-content {
    max-width: 900px;
    margin: 0 auto;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #555;
    margin-bottom: 2rem;
  }

  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 3rem;
  }

  .gallery-item {
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .gallery-item:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  }

  .gallery-item img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    display: block;
  }

  .newsletter {
    padding: 5rem 0;
    background: linear-gradient(135deg, #4a9d5f 0%, #2d7a3e 100%);
    color: white;
  }

  .newsletter .section-heading h2 {
    color: white;
  }

  .newsletter .section-heading h2::after {
    background: white;
  }

  .newsletter-form {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    gap: 1rem;
  }

  .newsletter-form input {
    flex: 1;
    padding: 1rem 1.5rem;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
  }

  .newsletter-form button {
    padding: 1rem 2.5rem;
    background: white;
    color: #4a9d5f;
    border: none;
    border-radius: 50px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .newsletter-form button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    .lunations {
      padding: 4rem 0;
    }

    .section-heading h2 {
      font-size: 2rem;
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

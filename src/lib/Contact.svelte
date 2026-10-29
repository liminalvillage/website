<section id="contact" class="contact">
  <div class="container">
    <div class="section-heading">
      <h2>Contact</h2>
    </div>
    <div class="contact-grid">
      <div class="contact-info">
        <div class="info-card">
          <h4>Location</h4>
          <p>
            In between Europe and Africa, between northern and southern Italy, between the
            mountains and sea, between the hilltop and the valley, between nature and civilization
          </p>
        </div>

        <div class="info-card">
          <h4>Info / Visits / Stays / Volunteers</h4>
          <p>
            <a
              href="/apply"
            >
              Fill in this form
            </a>
          </p>
        </div>

        <div class="info-card">
          <h4>Follow Us</h4>
          <div class="social-icons">
            <a href="http://twitter.com/LiminalVillage" target="_blank" rel="noopener" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="http://www.facebook.com/emergentcivilization" target="_blank" rel="noopener" aria-label="Facebook">
              <i class="fab fa-facebook"></i>
            </a>
            <a href="https://www.linkedin.com/company/liminalvillage/" target="_blank" rel="noopener" aria-label="LinkedIn">
              <i class="fab fa-linkedin"></i>
            </a>
            <a href="https://www.instagram.com/liminalvillage/" target="_blank" rel="noopener" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      <div class="contact-map">
        <iframe
          src="https://www.google.com/maps?q=Spinetoli,+Ascoli+Piceno,+Italy&z=13&output=embed"
          width="100%"
          height="100%"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          title="Liminal Village Location"
        ></iframe>
      </div>
    </div>
  </div>
</section>

<style>
  .contact {
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

  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }

  .contact-info {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
  }

  .info-card {
    --size: 250px;
    position: relative;
    flex: none;
    width: var(--size);
    aspect-ratio: 1;
    border-radius: 50%;
    padding: 0 calc(var(--size) * 0.14);
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
    margin: -8px -12px;
  }

  .info-card:nth-child(3n + 1) {
    background: var(--tint-1);
    animation-delay: -0s;
  }

  .info-card:nth-child(3n + 2) {
    background: var(--tint-2);
    animation-delay: -2.25s;
  }

  .info-card:nth-child(3n + 3) {
    background: var(--tint-3);
    animation-delay: -4.5s;
  }

  .info-card:hover {
    animation-play-state: paused;
  }



  .info-card h4 {
    font-size: 1.05rem;
    color: var(--ink);
    margin-bottom: 0.5rem;
  }

  .info-card p {
    font-size: 0.8rem;
    line-height: 1.5;
    text-align: center;
    color: var(--ink-soft);
  }

  .info-card a {
    color: var(--accent);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
  }

  .info-card a:hover {
    color: var(--accent-deep);
  }

  .social-icons {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .social-icons a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: color-mix(in srgb, var(--accent) 10%, transparent);
    color: var(--accent);
    border-radius: 50%;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    text-decoration: none;
  }

  .social-icons a:hover {
    background: var(--accent);
    color: var(--on-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px color-mix(in srgb, var(--accent) 30%, transparent);
  }

  /* The map, warmed to sit with the palette instead of a raw embed */
  .contact-map {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
    min-height: 400px;
    filter: saturate(0.7) sepia(0.18);
  }

  @media (max-width: 968px) {
    .contact-grid {
      grid-template-columns: 1fr;
    }

    .contact-map {
      min-height: 350px;
    }
  }

  @media (max-width: 576px) {
    .contact {
      padding: 4rem 0;
    }

    .section-heading h2 {
      font-size: 2.2rem;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .info-card {
      animation: none;
    }
  }
</style>

<section id="contact" class="contact">
  <div class="container">
    <div class="section-heading">
      <h2>Contact</h2>
    </div>
    <div class="contact-grid">
      <div class="contact-info">
        <div class="info-card">
          <div class="card-icon" style="background: rgba(214,161,91,0.1)">
            <i class="fas fa-home" style="color: #D6A15B"></i>
          </div>
          <h4>Location</h4>
          <p>
            In between Europe and Africa, between northern and southern Italy, between the
            mountains and sea, between the hilltop and the valley, between nature and civilization
          </p>
        </div>

        <div class="info-card">
          <div class="card-icon" style="background: rgba(123,158,107,0.1)">
            <i class="fas fa-calendar" style="color: #7B9E6B"></i>
          </div>
          <h4>Info / Visits / Stays / Volunteers</h4>
          <p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfpjW-YzSfUMNdsRZ9DlC70JqSYXCu4JZsPs6mHIjktxJ6tYA/viewform?usp=sf_link"
              target="_blank"
              rel="noopener"
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.8147!2d13.6!3d42.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDU0JzAwLjAiTiAxM8KwMzYnMDAuMCJF!5e0!3m2!1sen!2sit!4v1234567890"
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
    background: #fff;
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

  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }

  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .info-card {
    background: #faf8f5;
    border-radius: 12px;
    padding: 1.5rem 1.75rem;
    transition: all 0.35s ease;
  }

  .info-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.06);
  }

  .card-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .card-icon i {
    font-size: 1.2rem;
  }

  .info-card h4 {
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 1px;
    color: #222;
    margin-bottom: 0.5rem;
  }

  .info-card p {
    font-size: 0.85rem;
    line-height: 1.8;
    color: #8a8274;
    letter-spacing: 0.5px;
  }

  .info-card a {
    color: #D6A15B;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
  }

  .info-card a:hover {
    color: #b8873d;
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
    background: rgba(214,161,91,0.1);
    color: #D6A15B;
    border-radius: 50%;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    text-decoration: none;
  }

  .social-icons a:hover {
    background: #D6A15B;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(214,161,91,0.3);
  }

  .contact-map {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
    min-height: 400px;
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
      font-size: 1.3rem;
    }
  }
</style>

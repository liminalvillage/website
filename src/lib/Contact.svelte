<section id="contact" class="contact">
  <div class="container">
    <div class="section-heading">
      <h2>CONTACT</h2>
    </div>
    <div class="contact-grid">
      <div class="contact-info">
        <div class="info-item">
          <i class="fas fa-home"></i>
          <div class="info-content">
            <h4>Location</h4>
            <p>
              In between Europe and Africa, between northern and southern Italy, between the
              mountains and sea, between the hilltop and the valley, between nature and civilization
            </p>
          </div>
        </div>

        <div class="info-item">
          <i class="fas fa-calendar"></i>
          <div class="info-content">
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
        </div>

        <div class="social-links">
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
    background: #f8f9fa;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .section-heading {
    text-align: center;
    margin-bottom: 4rem;
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

  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }

  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .info-item {
    display: flex;
    gap: 1.5rem;
    padding: 1.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  }

  .info-item i {
    font-size: 2rem;
    color: #4a9d5f;
    flex-shrink: 0;
  }

  .info-content h4 {
    font-size: 1.2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .info-content p {
    font-size: 1rem;
    line-height: 1.7;
    color: #666;
  }

  .info-content a {
    color: #4a9d5f;
    text-decoration: none;
    font-weight: 600;
  }

  .info-content a:hover {
    text-decoration: underline;
  }

  .social-links {
    padding: 1.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  }

  .social-links h4 {
    font-size: 1.2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 1rem;
  }

  .social-icons {
    display: flex;
    gap: 1rem;
  }

  .social-icons a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: #4a9d5f;
    color: white;
    border-radius: 50%;
    font-size: 1.5rem;
    transition: all 0.3s ease;
  }

  .social-icons a:hover {
    background: #2d7a3e;
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(74, 157, 95, 0.4);
  }

  .contact-map {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
      font-size: 2rem;
    }

    .info-item {
      flex-direction: column;
      text-align: center;
    }
  }
</style>

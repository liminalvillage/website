<section class="pillars">
  <div class="pillars-grid">
    <div class="pillar-card">
      <div class="pillar-icon" style="background: rgba(214,161,91,0.1)">
        <i class="fas fa-user-cog" style="color: #D6A15B"></i>
      </div>
      <h2>Personal</h2>
      <p>
        Contribute something to yourself. During your stay at the village, you can set
        your personal goals and directions. Outgrow your old self, find your Ikigai,
        learn something new, write your book or your own TED talk!
      </p>
    </div>
    <div class="pillar-card">
      <div class="pillar-icon" style="background: rgba(74,157,95,0.1)">
        <i class="fas fa-street-view" style="color: #4a9d5f"></i>
      </div>
      <h2>Local</h2>
      <p>
        Do something for the people around you and for your surrounding: Teach something
        you know, build something, create art, regenerate the place around you.
      </p>
    </div>
    <div class="pillar-card">
      <div class="pillar-icon" style="background: rgba(123,158,107,0.1)">
        <i class="fas fa-globe-americas" style="color: #7B9E6B"></i>
      </div>
      <h2>Global</h2>
      <p>
        Do something for the planet and the people living on it: Find a cause that you
        deem important in the world, find out more about it, then find ways to help and improve!
      </p>
    </div>
  </div>
</section>

<section class="cta-dark">
  <div class="cta-content">
    <h2>Would you like to visit us?</h2>
    <a
      href="https://docs.google.com/forms/d/e/1FAIpQLSfpjW-YzSfUMNdsRZ9DlC70JqSYXCu4JZsPs6mHIjktxJ6tYA/viewform?usp=sf_link"
      class="btn"
      target="_blank"
      rel="noopener"
    >
      Apply Here
    </a>
  </div>
</section>

<style>
  .pillars {
    width: 100%;
    padding: 4rem 2rem;
    background: #faf8f5;
  }

  .pillars-grid {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .pillar-card {
    background: #fff;
    border-radius: 12px;
    padding: 2.5rem 2rem;
    text-align: center;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
    transition: all 0.35s ease;
  }

  .pillar-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.1);
  }

  .pillar-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
  }

  .pillar-icon i {
    font-size: 2rem;
  }

  .pillar-card h2 {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #222;
    margin-bottom: 1rem;
  }

  .pillar-card p {
    font-size: 0.9rem;
    color: #8a8274;
    line-height: 1.8;
    letter-spacing: 0.5px;
  }

  /* CTA Section */
  .cta-dark {
    width: 100%;
    background: #222;
    padding: 4rem 2rem;
    text-align: center;
  }

  .cta-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .cta-dark h2 {
    color: #fff;
    font-size: 2rem;
    font-weight: 300;
    letter-spacing: 6px;
    margin-bottom: 2rem;
  }

  .btn {
    display: inline-block;
    padding: 16px 48px;
    border: 2px solid var(--primary-color);
    color: #fff;
    text-decoration: none;
    font-weight: 400;
    font-size: 0.9rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    background: transparent;
    transition: all 0.4s ease;
  }

  .btn:hover {
    background: var(--primary-color);
    color: #222;
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(214,161,91,0.3);
  }

  @media (max-width: 768px) {
    .pillars-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .pillars {
      padding: 3rem 1.5rem;
    }

    .cta-dark h2 {
      font-size: 1.4rem;
      letter-spacing: 4px;
    }

    .btn {
      padding: 12px 36px;
      font-size: 0.8rem;
    }
  }
</style>

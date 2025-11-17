<section class="three-pillars">
  <div class="container">
    <div class="pillars-grid">
      <div class="pillar pillar-1">
        <i class="fas fa-user-cog"></i>
        <h3>Personal</h3>
        <p>
          Contribute something to yourself. During your stay at the village, you can set
          your personal goals and directions. Outgrow your old self, find your Ikigai,
          learn something new, write your book or your own TED talk!
        </p>
      </div>
      <div class="pillar pillar-2">
        <i class="fas fa-street-view"></i>
        <h3>Local</h3>
        <p>
          Do something for the people around you and for your surrounding: Teach something
          you know, build something, create art, regenerate the place around you.
        </p>
      </div>
      <div class="pillar pillar-3">
        <i class="fas fa-globe-americas"></i>
        <h3>Global</h3>
        <p>
          Do something for the planet and the people living on it: Find a cause that you
          deem important in the world, find out more about it, then find ways to help and improve!
        </p>
      </div>
    </div>
  </div>
</section>

<section class="cta-section">
  <div class="container">
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
  .three-pillars {
    padding: 4rem 0;
    background: #f8f9fa;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .pillars-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
  }

  .pillar {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .pillar:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.12);
  }

  .pillar i {
    font-size: 3rem;
    margin-bottom: 1.5rem;
    color: #4a9d5f;
  }

  .pillar h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 1rem;
  }

  .pillar p {
    font-size: 1rem;
    line-height: 1.7;
    color: #666;
  }

  .cta-section {
    padding: 5rem 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    text-align: center;
    color: white;
  }

  .cta-section h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
  }

  .btn {
    display: inline-block;
    padding: 1rem 3rem;
    background: white;
    color: #667eea;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.1rem;
    border-radius: 50px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 968px) {
    .pillars-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .cta-section h2 {
      font-size: 2rem;
    }
  }
</style>

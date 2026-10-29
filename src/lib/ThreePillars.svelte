<section class="pillars">
  <div class="pillars-grid">
    <div class="pillar-card">
      <h2>Personal</h2>
      <p>
        Contribute something to yourself. During your stay at the village, you can set
        your personal goals and directions. Outgrow your old self, find your Ikigai,
        learn something new, write your book or your own TED talk!
      </p>
    </div>
    <div class="pillar-card">
      <h2>Local</h2>
      <p>
        Do something for the people around you and for your surrounding: Teach something
        you know, build something, create art, regenerate the place around you.
      </p>
    </div>
    <div class="pillar-card">
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
      href="/apply"
      class="btn"
    >
      Apply Here
    </a>
  </div>
</section>

<style>
  .pillars {
    width: 100%;
    padding: 1rem 2rem 4rem;
    background: transparent;
  }

  /* Personal, Local and Global as three overlapping circles: the overlaps
     blend like a Venn diagram, and each circle drifts gently on its own. */
  .pillars-grid {
    max-width: 1140px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    padding: 1rem 0 2rem;
  }

  .pillar-card {
    --size: min(380px, 34vw);
    flex: none;
    width: var(--size);
    aspect-ratio: 1;
    border-radius: 50%;
    padding: 0 calc(var(--size) * 0.17);
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
    transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .pillar-card + .pillar-card {
    margin-left: calc(var(--size) * -0.12);
  }

  .pillar-card:nth-child(1) {
    background: var(--tint-1);
  }

  .pillar-card:nth-child(2) {
    background: var(--tint-2);
    animation-delay: -3s;
  }

  .pillar-card:nth-child(3) {
    background: var(--tint-3);
    animation-delay: -6s;
  }

  .pillar-card:hover {
    animation-play-state: paused;
  }

  .pillar-card h2 {
    font-size: 1.35rem;
    color: var(--ink);
    margin-bottom: 0.75rem;
  }

  .pillar-card p {
    font-size: 0.9rem;
    color: var(--ink-soft);
    line-height: 1.6;
  }

  /* CTA Section */
  .cta-dark {
    width: 100%;
    background: transparent;
    padding: 2rem 2rem 6rem;
    text-align: center;
  }

  .cta-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .cta-dark h2 {
    color: var(--ink);
    font-size: 2rem;
    font-weight: 300;
    letter-spacing: 6px;
    margin-bottom: 2rem;
  }

  .btn {
    display: inline-block;
    padding: 16px 48px;
    border: 2px solid var(--primary-color);
    border-radius: 999px;
    color: var(--ink);
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
    color: var(--on-accent);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px color-mix(in srgb, var(--accent) 30%, transparent);
  }

  /* Stacked, the circles overlap top to bottom instead */
  @media (max-width: 860px) {
    .pillars-grid {
      flex-direction: column;
      align-items: center;
    }

    .pillar-card {
      --size: min(340px, 88vw);
      padding: 0 calc(var(--size) * 0.15);
    }

    .pillar-card + .pillar-card {
      margin-left: 0;
      margin-top: calc(var(--size) * -0.1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pillar-card {
      animation: none;
    }
  }

  @media (max-width: 768px) {

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

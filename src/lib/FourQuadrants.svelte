<script>
  // The four quadrants of Integral Theory (AQAL), as used in our DNA:
  // I (inner life), It (behaviour), We (shared culture), Its (systems).
  // Each card: what you practise in that quadrant, and the software that connects it to the others.
  const quadrants = [
    {
      key: 'I', title: 'I · Inner', icon: 'fa-seedling', color: '#D6A15B',
      learn: 'Set your own direction. Find your Ikigai, outgrow an old self, learn something new, write your book or your TED talk.',
      tools: 'Your Network Passport: a record of what you give that follows you, lowers your price in the network and never buys a vote.',
    },
    {
      key: 'It', title: 'It · Doing', icon: 'fa-tools', color: '#4a9d5f',
      learn: 'Build, grow, repair, regenerate. Work on the land, the biolake, the water systems, the food machines — and on real quests the village needs done.',
      tools: 'Quests: needs posted by the village and the network, claimed, completed and validated in the open.',
    },
    {
      key: 'We', title: 'We · Together', icon: 'fa-users', color: '#7B9E6B',
      learn: 'Live a lunar cycle with people you did not choose. Practise NVC, the Four Agreements, soft Holacracy — the social DNA that makes a temporary community work.',
      tools: 'Holons: the coordination software that gives every group its own circle, ledger and decisions, nested inside the next.',
    },
    {
      key: 'Its', title: 'Its · Systems', icon: 'fa-globe-americas', color: '#5B8FB9',
      learn: 'Understand how places, resources, money and governance can run on one shared, readable shape — and carry it to the next place.',
      tools: 'Holosphere and RegenOS: the geo-spatial and operating layers that let hubs see each other\'s needs, resources and surplus across a territory.',
    },
  ];
</script>

<section id="learn" class="pillars">
  <div class="pillars-grid">
    {#each quadrants as q}
      <div class="pillar-card">
        <div class="pillar-icon" style="background: {q.color}1A">
          <i class="fas {q.icon}" style="color: {q.color}"></i>
        </div>
        <h2>{q.title}</h2>
        <p>{q.learn}</p>
        <p class="tools"><span>Software:</span> {q.tools}</p>
      </div>
    {/each}
  </div>
  <p class="frameworks-note">
    The quadrants come from <a href="/frameworks#integral-theory">Integral Theory</a>; the software from the
    <a href="https://regenerativa.earth" target="_blank" rel="noopener">ReGenerativa</a> network, built in the open.
    A learning experience lasts one <a href="/lunations">lunation</a>.
  </p>
</section>

<section class="cta-dark">
  <div class="cta-content">
    <h2>Sign up for a learning experience</h2>
    <a href="/apply" class="btn">Apply Here</a>
  </div>
</section>

<style>
  .pillars { width: 100%; padding: 4rem 2rem; background: #faf8f5; }
  .pillars-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
  .pillar-card { background: #fff; border-radius: 12px; padding: 2.5rem 1.75rem; text-align: center; box-shadow: 0 2px 20px rgba(0,0,0,0.06); transition: all 0.35s ease; display: flex; flex-direction: column; }
  .pillar-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.1); }
  .pillar-icon { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
  .pillar-icon i { font-size: 2rem; }
  .pillar-card h2 { font-size: 1rem; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #222; margin-bottom: 1rem; }
  .pillar-card p { font-size: 0.9rem; color: #8a8274; line-height: 1.8; letter-spacing: 0.5px; }
  .pillar-card .tools { margin-top: auto; padding-top: 1.25rem; border-top: 1px solid #efebe4; font-size: 0.82rem; color: #6f6758; }
  .pillar-card .tools span { display: block; font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: #b1a78f; margin-bottom: 0.35rem; }
  .frameworks-note { max-width: 800px; margin: 2.5rem auto 0; text-align: center; font-size: 0.85rem; color: #8a8274; line-height: 1.8; }
  .frameworks-note a { color: #6f6758; border-bottom: 1px solid #d6c7a8; text-decoration: none; }

  .cta-dark { width: 100%; background: #222; padding: 4rem 2rem; text-align: center; }
  .cta-content { max-width: 800px; margin: 0 auto; }
  .cta-dark h2 { color: #fff; font-size: 2rem; font-weight: 300; letter-spacing: 6px; margin-bottom: 2rem; }
  .btn { display: inline-block; padding: 16px 48px; border: 2px solid var(--primary-color); color: #fff; text-decoration: none; font-weight: 400; font-size: 0.9rem; letter-spacing: 4px; text-transform: uppercase; background: transparent; transition: all 0.4s ease; }
  .btn:hover { background: var(--primary-color); color: #222; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(214,161,91,0.3); }

  @media (max-width: 1024px) { .pillars-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 640px) {
    .pillars-grid { grid-template-columns: 1fr; gap: 1.5rem; }
    .pillars { padding: 3rem 1.5rem; }
    .cta-dark h2 { font-size: 1.4rem; letter-spacing: 4px; }
    .btn { padding: 12px 36px; font-size: 0.8rem; }
  }
</style>
